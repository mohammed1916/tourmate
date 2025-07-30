import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchParams } from '../redux/slices/searchSlice';

const SearchForm: React.FC = () => {
    const dispatch = useDispatch();
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setSearchParams({ source, destination }));
        // Additional logic to fetch results can be added here
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
            <button type="submit">Search</button>
        </form>
    );
};

export default SearchForm;