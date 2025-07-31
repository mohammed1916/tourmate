import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchParams } from '../redux/slices/searchSlice';

const PROVIDERS = [
  { value: 'gemini', label: 'Google Gemini API' },
  { value: 'ollama', label: 'Ollama' },
];

const SearchForm: React.FC = () => {
    const dispatch = useDispatch();
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [provider, setProvider] = useState('gemini');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setSearchParams({ source, destination }));
        localStorage.setItem('llm_provider', provider);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="source">Source:</label>
                <input
                    type="text"
                    id="source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="destination">Destination:</label>
                <input
                    type="text"
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="provider">LLM Provider:</label>
                <select
                    id="provider"
                    value={provider}
                    onChange={e => setProvider(e.target.value)}
                >
                    {PROVIDERS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
            <button type="submit">Search</button>
        </form>
    );
};

export default SearchForm;