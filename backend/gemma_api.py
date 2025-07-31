from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import requests

GEMINI_API_URL = os.environ.get("GEMINI_API_URL", "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "gemma3n-e4b-q4")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini API endpoint
@app.post("/api/gemini")
async def gemini_infer(request: Request):
    data = await request.json()
    messages = data.get("messages", [])
    prompt = "\n".join(
        c["text"] for m in messages for c in m.get("content", []) if c["type"] == "text"
    )
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

# Ollama API endpoint
@app.post("/api/ollama")
async def ollama_infer(request: Request):
    data = await request.json()
    messages = data.get("messages", [])
    prompt = "\n".join(
        c["text"] for m in messages for c in m.get("content", []) if c["type"] == "text"
    )
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

# --- External API Endpoints ---

@app.get("/api/hotels")
async def get_hotels(location: str, checkin: str, checkout: str, guests: int = 1):
    # Example: Booking.com API via RapidAPI
    api_key = os.environ.get("BOOKING_API_KEY", "")
    url = "https://booking-com.p.rapidapi.com/v1/hotels/search"
    headers = {
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": "booking-com.p.rapidapi.com"
    }
    params = {
        "dest_id": location,
        "dest_type": "city",
        "checkin_date": checkin,
        "checkout_date": checkout,
        "adults_number": guests,
        "order_by": "popularity"
    }
    try:
        resp = requests.get(url, headers=headers, params=params)
        return JSONResponse(content=resp.json())
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/flights")
async def get_flights(origin: str, destination: str, date: str):
    # Example: Skyscanner API via RapidAPI
    api_key = os.environ.get("SKYSCANNER_API_KEY", "")
    url = "https://skyscanner44.p.rapidapi.com/search"
    headers = {
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": "skyscanner44.p.rapidapi.com"
    }
    params = {
        "origin": origin,
        "destination": destination,
        "date": date
    }
    try:
        resp = requests.get(url, headers=headers, params=params)
        return JSONResponse(content=resp.json())
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/weather")
async def get_weather(city: str):
    api_key = os.environ.get("OPENWEATHERMAP_API_KEY", "")
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    try:
        resp = requests.get(url)
        return JSONResponse(content=resp.json())
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/currency")
async def get_currency(base: str = "USD", symbols: str = "INR"):  # e.g. base=USD&symbols=INR,EUR
    url = f"https://api.exchangerate.host/latest?base={base}&symbols={symbols}"
    try:
        resp = requests.get(url)
        return JSONResponse(content=resp.json())
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/events")
async def get_events(city: str):
    api_key = os.environ.get("EVENTBRITE_API_KEY", "")
    url = f"https://www.eventbriteapi.com/v3/events/search/?location.address={city}"
    headers = {"Authorization": f"Bearer {api_key}"}
    try:
        resp = requests.get(url, headers=headers)
        return JSONResponse(content=resp.json())
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/attractions")
async def get_attractions(location: str):
    api_key = os.environ.get("TRIPADVISOR_API_KEY", "")
    url = "https://tripadvisor16.p.rapidapi.com/api/v1/attractions/searchAttractions"
    headers = {
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": "tripadvisor16.p.rapidapi.com"
    }
    params = {"query": location}
    try:
        resp = requests.get(url, headers=headers, params=params)
        return JSONResponse(content=resp.json())
    except Exception as e:
        return {"error": str(e)}
