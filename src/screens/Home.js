import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { Button, Image, ImageBackground, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native'
import Geolocation from '@react-native-community/geolocation';
import { predefinedLocations } from '../data/predefinedLocations';
import { useUserLocation } from '../context/Context';
import { dummyArtefacts } from '../data/dummyArtefacts';
import { sizes, text } from '../data/theme';
import { useMPC } from '../hooks/useMPC';

function Home() {
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
    } = useMPC();

    const userLocation = useUserLocation()

    const extractDisplayNames = (peers) => {
        return Object.values(peers).map(peerInfo => peerInfo.peer.displayName);
    };

    const nearbyPeers = extractDisplayNames(peers);

    const matchingArtifacts = dummyArtefacts.filter(
        artefact =>
            artefact.contexts.location.name === userLocation &&
            (Object.keys(peers).length === 0 ||
                (artefact.contexts.people ?
                    artefact.contexts.people.some(peer => nearbyPeers.includes(peer))
                    : true)
            )
    );

    console.log('peers', nearbyPeers)

    if (!displayName) {
        return (
            <SafeAreaView>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Text
                        style={{ fontSize: 20, marginBottom: 5 }}
                    >
                        Input your display name and enter:
                    </Text>
                    <TextInput
                        style={{
                            fontSize: 30,
                            borderWidth: 1,
                            borderColor: 'black',
                            padding: 10,
                            width: 300,
                        }}
                        placeholder={'display name'}
                        onSubmitEditing={(ev) => initializeSession(ev.nativeEvent.text)}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <ScrollView contentInsetAdjustmentBehavior='automatic'>
            <SafeAreaView>
                <View style={{ padding: sizes.padding.md }}>
                    <View style={{ gap: sizes.padding.lg }} >
                        <View>
                            <Text>Current location: {userLocation}</Text>
                        </View>
                        {isBrowsing ? (
                            <Button
                                title={'stop browse'}
                                onPress={stopBrowsing}
                            />
                        ) : (
                            <Button
                                title={'start browse'}
                                onPress={startBrowsing}
                            />
                        )}
                        {isAdvertizing ? (
                            <Button
                                title={'stop advertize'}
                                onPress={stopAdvertising}
                            />
                        ) : (
                            <Button
                                title={'start advertize'}
                                onPress={startAdvertising}
                            />
                        )}
                        <Button
                            title={'disconnect'}
                            onPress={disconnect}
                        />
                        <View>
                            <Text>Found peers:</Text>
                            {Object.entries(peers).map(([id, info]) => (
                                <View
                                    key={id}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'black',
                                        marginBottom: 10,
                                        padding: 4,
                                    }}
                                >
                                    <Pressable onPress={() => { /* whatever action you want here */ }}>
                                        <Text>
                                            {id} - {info.state}
                                        </Text>
                                        <Text>displayName: {info.peer.displayName}</Text>
                                        <Text>discoveryInfo: {JSON.stringify(info.discoveryInfo)}</Text>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                        {matchingArtifacts.map((artifact, index) => (
                            <View key={index}>
                                {artifact.type === 'photo' && (
                                    <Image source={artifact.content} style={{
                                        // flex: 1,
                                        // width: '100%'
                                        width: 100,
                                        height: 100
                                    }} />
                                )}
                                {artifact.type === 'story' && (
                                    <>
                                        <Text style={text.header2}>{artifact.content.title}</Text>
                                        <Text>{artifact.content.content}</Text>
                                    </>
                                )}
                                {artifact.type === 'keyword' && (
                                    <Text style={{ ...text.header2, fontStyle: 'italic' }}>{artifact.content}</Text>
                                )}
                                <Text>{artifact.contexts.location.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}

Home.propTypes = {}

export default Home
