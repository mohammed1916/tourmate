import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchParams } from '../redux/slices/searchSlice';
// @ts-ignore
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';

const PROVIDERS = [
  { value: 'gemini', label: 'Google Gemini API' },
  { value: 'ollama', label: 'Ollama' },
];

const libraries = ['places'];

const SearchForm: React.FC = () => {
    const dispatch = useDispatch();
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [provider, setProvider] = useState('gemini');
    const sourceRef = useRef<google.maps.places.Autocomplete | null>(null);
    const destRef = useRef<google.maps.places.Autocomplete | null>(null);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries
    });

    const handleSourceLoad = (autocomplete: google.maps.places.Autocomplete) => {
        sourceRef.current = autocomplete;
    };
    const handleDestLoad = (autocomplete: google.maps.places.Autocomplete) => {
        destRef.current = autocomplete;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setSearchParams({ source, destination }));
        localStorage.setItem('llm_provider', provider);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="source">Source:</label>
                {isLoaded ? (
                  <Autocomplete onLoad={handleSourceLoad} onPlaceChanged={() => {
                    const place = sourceRef.current?.getPlace();
                    setSource(place?.formatted_address || '');
                  }}>
                    <input
                      type="text"
                      id="source"
                      placeholder="Enter source location"
                      required
                    />
                  </Autocomplete>
                ) : (
                  <input
                    type="text"
                    id="source"
                    value={source}
                    onChange={e => setSource(e.target.value)}
                    required
                  />
                )}
            </div>
            <div>
                <label htmlFor="destination">Destination:</label>
                {isLoaded ? (
                  <Autocomplete onLoad={handleDestLoad} onPlaceChanged={() => {
                    const place = destRef.current?.getPlace();
                    setDestination(place?.formatted_address || '');
                  }}>
                    <input
                      type="text"
                      id="destination"
                      placeholder="Enter destination"
                      required
                    />
                  </Autocomplete>
                ) : (
                  <input
                    type="text"
                    id="destination"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    required
                  />
                )}
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