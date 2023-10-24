// hooks/useMPC.js
import { useState, useEffect } from 'react';
import { initSession, PeerState } from 'react-native-multipeer-connectivity';
import { produce } from 'immer';
import { storage } from '../../App';


export const useMPC = () => {
    const [displayName, setDisplayName] = useState('');
    const [peerID, setPeerID] = useState('');
    const [isBrowsing, setIsBrowsing] = useState(false);
    const [isAdvertizing, setIsAdvertizing] = useState(false);
    const [peers, setPeers] = useState({});
    const [session, setSession] = useState(null);
    const [showInput, setShowInput] = useState(false);

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

    const changeDisplayName = (newDisplayName) => {
        // Disconnect the current session
        disconnect();
        setShowInput(false)

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

    useEffect(() => {
        if (!session) return;
        const r1 = session.onStartAdvertisingError((ev) => {
            setIsAdvertizing(false);
            console.log('onStartAdvertisingError：', ev);
        });
        const r2 = session.onStartBrowsingError((ev) => {
            setIsBrowsing(false);
            console.log('onStartBrowsingError：', ev);
        });
        const r3 = session.onFoundPeer((ev) => {
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
            console.log('onFoundPeer：', ev);
        });
        const r4 = session.onLostPeer((ev) => {
            console.log('onLostPeer：', ev);
            setPeers(
                produce((draft) => {
                    delete draft[ev.peer.id];
                })
            );
        });
        const r5 = session.onPeerStateChanged((ev) => {
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
        const r6 = session.onReceivedPeerInvitation((ev) => {
            console.log('onReceivedPeerInvitation：', ev);
            ev.handler(true);
        });
        const r7 = session.onReceivedText((ev) => {
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
            r1.remove();
            r2.remove();
            r3.remove();
            r4.remove();
            r5.remove();
            r6.remove();
            r7.remove();
        };
    }, [session]);

    return {
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
        showInput,
        setShowInput
    };
};
