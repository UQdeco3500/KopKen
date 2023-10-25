import { useState, useEffect, createContext, useContext } from 'react';
import { initSession, PeerState } from 'react-native-multipeer-connectivity';
import { produce } from 'immer';
import { storage } from '../../App';

const NearbyPeersContext = createContext(null)

function NearbyPeersProvider({ children }) {
    const [displayName, setDisplayName] = useState('');
    const [peerID, setPeerID] = useState('');
    const [isBrowsing, setIsBrowsing] = useState(false);
    const [isAdvertizing, setIsAdvertizing] = useState(false);
    const [peers, setPeers] = useState({});
    const [session, setSession] = useState(null);
    const [nearbyPeers, setNearbyPeers] = useState([]);
    const [showInput, setShowInput] = useState(false)


    useEffect(() => {
        const loadDisplayName = () => {
            const storedName = storage.getString('currentUser');
            if (storedName) {
                initializeSession(storedName);
            }
        };

        loadDisplayName();
    }, []);

    const initializeSession = (name) => {
        setDisplayName(name);

        const session = initSession({
            displayName: name,
            serviceType: 'kenangan',
            discoveryInfo: {
                myName: name,
                joinAt: Date.now().toString(),
            },
        });

        setSession(session);
        setPeerID(session.peerID);

        storage.set("currentUser", name);
    };

    useEffect(() => {
        if (!session) return;
        const sessionAdvertiseError = session.onStartAdvertisingError((ev) => {
            setIsAdvertizing(false);
            console.log('onStartAdvertisingError：', ev);
        });
        const sessionBrowseError = session.onStartBrowsingError((ev) => {
            setIsBrowsing(false);
            console.log('onStartBrowsingError：', ev);
        });
        const sessionFoundPeer = session.onFoundPeer((ev) => {
            setPeers(
                produce((draft) => {
                    // onFoundPeer will be called even if the peer found before when you re-advertize
                    if (!draft[ev.peer.id]) {
                        draft[ev.peer.id] = {
                            peer: ev.peer,
                            state: PeerState.notConnected,
                            discoveryInfo: ev.discoveryInfo,
                        };
                    }
                })
            );
            updateNearbyPeers();  // update nearbyPeers whenever a peer is found
            console.log('onFoundPeer：', ev);
        });
        const sessionLostPeer = session.onLostPeer((ev) => {
            console.log('onLostPeer：', ev);
            setPeers(
                produce((draft) => {
                    delete draft[ev.peer.id];
                })
            );
            updateNearbyPeers();
        });
        const sessionPeerStateChanged = session.onPeerStateChanged((ev) => {
            console.log('onPeerStateChanged：', ev);
            setPeers(
                produce((draft) => {
                    if (draft[ev.peer.id]) draft[ev.peer.id].state = ev.state;
                    else {
                        draft[ev.peer.id] = {
                            state: ev.state,
                            peer: ev.peer,
                        };
                    }
                })
            );
        });
        const sessionReceivePeerInvitation = session.onReceivedPeerInvitation((ev) => {
            console.log('onReceivedPeerInvitation：', ev);
            ev.handler(true);
        });
        const sessionReceiveText = session.onReceivedText((ev) => {
            console.log('onReceivedText：', ev);
            setReceivedMessages(
                produce((draft) => {
                    if (draft[ev.peer.id]) draft[ev.peer.id].push(ev.text);
                    else draft[ev.peer.id] = [ev.text];
                })
            );
        });

        return () => {
            session.stopAdvertizing();
            session.stopBrowsing();
            sessionAdvertiseError.remove();
            sessionBrowseError.remove();
            sessionFoundPeer.remove();
            sessionLostPeer.remove();
            sessionPeerStateChanged.remove();
            sessionReceivePeerInvitation.remove();
            sessionReceiveText.remove();
        };
    }, [session]);

    const updateNearbyPeers = () => {
        const newNearbyPeers = extractDisplayNames(peers);
        setNearbyPeers(newNearbyPeers);
    };


    const changeDisplayName = (newDisplayName) => {
        // Disconnect the current session
        disconnect();
        setShowInput(false);

        // Wait a moment to ensure disconnection
        setTimeout(() => {
            // Re-initialize session with the new displayName
            initializeSession(newDisplayName);

            // Optionally restart advertising and/or browsing
            if (isAdvertizing) {
                startAdvertising();
            }
            if (isBrowsing) {
                startBrowsing();
            }
        }, 1000);  // 1 second delay, adjust as needed
    };

    const startAdvertising = () => {
        session?.advertize();
        setIsAdvertizing(true);
    };

    const stopAdvertising = () => {
        session?.stopAdvertizing();
        setIsAdvertizing(false);
    };

    const startBrowsing = () => {
        session?.browse();
        setIsBrowsing(true);
    };

    const stopBrowsing = () => {
        session?.stopBrowsing();
        setIsBrowsing(false);
    };

    const disconnect = () => {
        session?.disconnect();
        stopAdvertising();
        stopBrowsing();
        setPeers({});
    }


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
        nearbyPeers,
        showInput,
        setShowInput
    }

    return (
        <NearbyPeersContext.Provider value={value}>
            {children}
        </NearbyPeersContext.Provider>
    )
}

NearbyPeersProvider.propTypes = {}

export default NearbyPeersProvider

export function useNearbyPeersContext() {
    return useContext(NearbyPeersContext)
}

export const extractDisplayNames = (peers) => {
    return Object.values(peers).map(peerInfo => peerInfo.peer.displayName);
};
