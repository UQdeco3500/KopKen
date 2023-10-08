import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { SafeAreaView, Text, View } from 'react-native'
import Geolocation from '@react-native-community/geolocation';
import { predefinedLocations } from '../data/predefinedLocations';
import { useUserLocation } from '../context/Context';

function Home() {

    const userLocation = useUserLocation()

    return (
        <SafeAreaView>
            <View>
                <Text>Current location: {userLocation}</Text>
            </View>
        </SafeAreaView>
    );
}

Home.propTypes = {}

export default Home
