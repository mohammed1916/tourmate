import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchParams } from '../redux/slices/searchSlice';
import PlaceAutocompleteInput from './PlaceAutocompleteInput';
import { useJsApiLoader } from '@react-google-maps/api';
import styles from '../styles/acrylicForm.module.css';

const PROVIDERS = [
  { value: 'gemini', label: 'Google Gemini API' },
  { value: 'ollama', label: 'Ollama' },
];

const libraries: Array<'places' | 'geometry' | 'drawing' | 'visualization'> = ['places'];

const SearchForm: React.FC = () => {
    const dispatch = useDispatch();
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [provider, setProvider] = useState('gemini');
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: libraries
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setSearchParams({ source, destination }));
        localStorage.setItem('llm_provider', provider);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.acrylicForm}>
            <div>
                <label htmlFor="source">Source:</label>
                {isLoaded ? (
                  <PlaceAutocompleteInput
                    value={source}
                    onChange={setSource}
                    placeholder="Enter source location"
                    id="source"
                  />
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
                  <PlaceAutocompleteInput
                    value={destination}
                    onChange={setDestination}
                    placeholder="Enter destination"
                    id="destination"
                  />
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
            <div className={styles.providerSection}>
                <label htmlFor="provider" className={styles.providerLabel}>LLM Provider:</label>
                <select
                    id="provider"
                    value={provider}
                    onChange={e => setProvider(e.target.value)}
                    className={styles.providerSelect}
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