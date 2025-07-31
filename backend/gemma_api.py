from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, GenerationConfig
import requests

GEMMA_PATH = os.environ.get("GEMMA_PATH", "google/gemma-3n-e2b-it")
GEMINI_API_URL = os.environ.get("GEMINI_API_URL", "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "gemma3n-e4b-q4")

# Local Gemma model
try:
    tokenizer = AutoTokenizer.from_pretrained(GEMMA_PATH, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(GEMMA_PATH, trust_remote_code=True)
except Exception as e:
    tokenizer = None
    model = None
    print(f"Warning: Could not load local Gemma model: {e}")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/gemma")
async def gemma_infer(request: Request):
    data = await request.json()
    messages = data.get("messages", [])
    provider = data.get("provider", "local")  # 'local', 'gemini', or 'ollama'
    prompt = "\n".join(
        c["text"] for m in messages for c in m.get("content", []) if c["type"] == "text"
    )
    if provider == "gemini":
        # Use Gemini API
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        headers = {"Content-Type": "application/json"}
        url = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
        resp = requests.post(url, json=payload, headers=headers)
        try:
            result = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            result = resp.text
        return {"result": result}
    elif provider == "ollama":
        # Use Ollama local LLM
        payload = {
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False
        }
        try:
            resp = requests.post(OLLAMA_URL, json=payload)
            resp.raise_for_status()
            return {"result": resp.json()["response"]}
        except Exception as e:
            return {"result": f"Ollama error: {str(e)}"}
    else:
        # Use local Gemma
        if not tokenizer or not model:
            return {"result": "Local Gemma model not available."}
        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
        generation_config = GenerationConfig(max_new_tokens=150, do_sample=True, temperature=0.7)
        outputs = model.generate(**inputs, generation_config=generation_config)
        result = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return {"result": result}
