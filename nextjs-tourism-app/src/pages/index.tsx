import React from 'react';
import SearchForm from '../components/SearchForm';
import Results from '../components/Results';
import Recommendations from '../components/Recommendations';

const HomePage = () => {
    return (
        <div>
            <h1>Welcome to the Tourism App</h1>
            <SearchForm />
            <Results />
            <Recommendations />
        </div>
    );
};

export default HomePage;