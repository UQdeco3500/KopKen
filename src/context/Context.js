import React, { createContext, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { predefinedLocations } from '../data/predefinedLocations';
import Geolocation from '@react-native-community/geolocation';
import { assignLocationName, isWithinRadius } from '../helpers/locationServices';


const LocationContext = createContext(null)

export function useUserLocation() {
    return useContext(LocationContext);
}


function StoreProvider({ children }) {

    const [userLocation, setUserLocation] = useState('')

    useEffect(() => {
        const watcher = Geolocation.watchPosition(
            position => {
                const { latitude, longitude } = position.coords;
                const name = assignLocationName({ latitude, longitude });
                setUserLocation(name);
            },
            error => console.log(error),
            { enableHighAccuracy: true, distanceFilter: 10, interval: 5000, fastestInterval: 2000 }
        );

        return () => Geolocation.clearWatch(watcher);  // Clean up the watcher on component unmount
    }, []);

    return (
        <LocationContext.Provider value={userLocation}>
            {children}
        </LocationContext.Provider>
    )
}

StoreProvider.propTypes = {}

export default StoreProvider
