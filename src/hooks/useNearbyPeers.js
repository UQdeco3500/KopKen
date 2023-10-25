import React from 'react'
import PropTypes from 'prop-types'
import { useNearbyPeersContext } from '../context/NearbyPeersProvider'

function useNearbyPeers(props) {

    const {
        displayName,
        setDisplayName,
        initializeSession,
        isBrowsing,
        startBrowsing,
        stopBrowsing,
        isAdvertizing,
        startAdvertising,
        stopAdvertising,
        disconnect,
        peers,
        changeDisplayName,
        nearbyPeers
    } = useNearbyPeersContext()


    const value = {
        displayName,
        setDisplayName,
        initializeSession,
        isBrowsing,
        startBrowsing,
        stopBrowsing,
        isAdvertizing,
        startAdvertising,
        stopAdvertising,
        disconnect,
        peers,
        changeDisplayName,
        nearbyPeers
    }

    return { ...value }
}

useNearbyPeers.propTypes = {}

export default useNearbyPeers
