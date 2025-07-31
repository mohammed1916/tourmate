import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchForm from '../components/SearchForm';
import Results from '../components/Results';
import Recommendations from '../components/Recommendations';
import MapDisplay from '../components/MapDisplay';
import HotelResults from '../components/HotelResults';
import FlightResults from '../components/FlightResults';
import ActivityResults from '../components/ActivityResults';
import UtilityInfo from '../components/UtilityInfo';
import { RootState } from '../redux/store';
import { fetchHotels, fetchFlights, fetchActivities, fetchWeather, fetchCurrency, fetchEvents, fetchRecommendations } from '../redux/slices/apiThunks';
import styles from '../styles/modern.module.css';

const HomePage = () => {
    const dispatch = useDispatch();
    const { source, destination, results, touristSpots, budget } = useSelector((state: RootState) => state.search);
    const weather = useSelector((state: RootState) => state.search.weather);
    const currency = useSelector((state: RootState) => state.search.currency);
    const events = useSelector((state: RootState) => state.search.events);

    useEffect(() => {
        if (source && destination) {
            dispatch(fetchHotels({ location: destination, checkin: '2025-08-01', checkout: '2025-08-05', guests: 1 }) as any);
            dispatch(fetchFlights({ origin: source, destination, date: '2025-08-01' }) as any);
            dispatch(fetchActivities(destination) as any);
            dispatch(fetchWeather(destination) as any);
            dispatch(fetchCurrency({ base: 'USD', symbols: 'INR,EUR' }) as any);
            dispatch(fetchEvents(destination) as any);
            dispatch(fetchRecommendations() as any);
        }
    }, [source, destination, dispatch]);

    return (
        <div className={styles['main-container']}>
            <h1 className={styles['main-title']}>Welcome to Tour Mate</h1>
            <div className={styles['search-section']}>
                <SearchForm />
            </div>
            <div className={styles['map-section']}>
                {/* Example: Center map on destination, fallback to 0,0 */}
                <MapDisplay lat={0} lng={0} />
            </div>
            <div className={styles['results-section']}>
                <HotelResults hotels={results.hotels || []} />
                <FlightResults flights={results.flights || []} />
                <ActivityResults activities={touristSpots || []} />
            </div>
            <div className={styles['utility-section']}>
                <UtilityInfo weather={weather} currency={currency} events={events} />
            </div>
            <div className={styles['recommendations-section']}>
                <Recommendations />
            </div>
        </div>
    );
};

export default HomePage;