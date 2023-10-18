import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { Button, Image, ImageBackground, Pressable, SafeAreaView, ScrollView, Switch, Text, TextInput, View } from 'react-native'
import Geolocation from '@react-native-community/geolocation';
import { predefinedLocations } from '../data/predefinedLocations';
import { useUserLocation } from '../context/Context';
import { dummyArtefacts } from '../data/dummyArtefacts';
import { sizes, text } from '../data/theme';
import { useMPC } from '../hooks/useMPC';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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
        changeDisplayName
    } = useMPC();

    const [newDisplayName, setNewDisplayName] = useState('');

    const userLocation = useUserLocation()

    const extractDisplayNames = (peers) => {
        return Object.values(peers).map(peerInfo => peerInfo.peer.displayName);
    };

    const nearbyPeers = extractDisplayNames(peers);

    const matchingartefacts = dummyArtefacts.filter(
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
            <KeyboardAwareScrollView
                extraScrollHeight={64}
                keyboardOpeningTime={10}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <SafeAreaView style={{ flex: 1 }}>

                    <View style={{
                        padding: sizes.padding.md,
                        flex: 1,
                        // backgroundColor: 'red',
                        // alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <View style={{
                            gap: sizes.padding.sm,
                            // backgroundColor: 'blue'
                        }}>
                            <Text style={{ ...text.header2 }}>Display Name</Text>
                            <View style={{ padding: sizes.padding.md, backgroundColor: 'grey', borderRadius: sizes.padding.sm }} >
                                <TextInput
                                    placeholder={'Input your display name...'}
                                    onSubmitEditing={(ev) => initializeSession(ev.nativeEvent.text)}
                                />
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </KeyboardAwareScrollView>
        );
    }

    return (
        <ScrollView contentInsetAdjustmentBehavior='automatic'>
            <SafeAreaView>
                <View style={{ padding: sizes.padding.md }}>
                    <View style={{ gap: sizes.padding.lg }} >
                        <Text style={{ ...text.header2 }}>Hey, {displayName}</Text>
                        <View style={{ padding: sizes.padding.md, backgroundColor: 'grey', borderRadius: sizes.padding.sm }} >
                            <TextInput
                                value={newDisplayName}
                                onChangeText={setNewDisplayName}
                                placeholder={'New Display Name'}
                            />
                        </View>
                        <Button
                            title={'Change Display Name'}
                            onPress={() => changeDisplayName(newDisplayName)}
                        />
                        <View>
                            <Text>Current location: {userLocation}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ gap: sizes.padding.xs }}>
                                <Text style={{ ...text.body1 }} >Browse Mode</Text>
                                <Text>Turn on if you want to find others.</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={isBrowsing ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={isBrowsing ? stopBrowsing : startBrowsing}
                                value={isBrowsing}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ gap: sizes.padding.xs }}>
                                <Text style={{ ...text.body1 }} >Ghost Mode</Text>
                                <Text>In Ghost Mode, others won't find you.</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={isAdvertizing ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={isAdvertizing ? stopAdvertising : startAdvertising}
                                value={!isAdvertizing}
                            />
                        </View>
                        <Button
                            title={'disconnect'}
                            onPress={disconnect}
                        />
                        <View style={{ gap: sizes.padding.md }}>
                            <Text style={{ ...text.header2 }}>Found peers:</Text>
                            <View style={{ flexDirection: 'row', gap: sizes.padding.md }}>
                                {Object.entries(peers).map(([id, info]) => (
                                    <View key={id} style={{ alignItems: 'center' }}>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 50, backgroundColor: 'grey', width: 50, height: 50 }}>
                                            <Text style={{ ...text.header1 }}>{info.peer.displayName[0]}</Text>
                                        </View>
                                        <Text style={{ ...text.body1 }}>{info.peer.displayName}</Text>
                                    </View>


                                    // For Debug only
                                    // <View
                                    //     key={id}
                                    //     style={{
                                    //         borderWidth: 1,
                                    //         borderColor: 'black',
                                    //         marginBottom: 10,
                                    //         padding: 4,
                                    //     }}
                                    // >
                                    //     <Pressable onPress={() => { /* whatever action you want here */ }}>
                                    //         <Text>
                                    //             {id} - {info.state}
                                    //         </Text>
                                    //         <Text>displayName: {info.peer.displayName}</Text>
                                    //         <Text>discoveryInfo: {JSON.stringify(info.discoveryInfo)}</Text>
                                    //     </Pressable>
                                    // </View>
                                ))}
                            </View>
                        </View>
                        <View style={{ gap: sizes.padding.md }}>
                            <Text style={{ ...text.header2 }}>Artefacts</Text>
                            <View style={{ flexDirection: 'row', gap: sizes.padding.md, flexWrap: 'wrap' }}>
                                {matchingartefacts.map((artefact, index) => (
                                    <View key={index}>
                                        {artefact.type === 'photo' && (
                                            <Image source={artefact.content} style={{
                                                // flex: 1,
                                                // width: '100%'
                                                width: 100,
                                                height: 100
                                            }} />
                                        )}
                                        {artefact.type === 'story' && (
                                            <>
                                                <Text style={text.header2}>{artefact.content.title}</Text>
                                                <Text>{artefact.content.content}</Text>
                                            </>
                                        )}
                                        {artefact.type === 'keyword' && (
                                            <Text style={{ ...text.header2, fontStyle: 'italic' }}>{artefact.content}</Text>
                                        )}
                                        <Text>{artefact.contexts.location.name}</Text>
                                        <View>
                                            {artefact.contexts.people?.map((person, index) => {
                                                return (
                                                    <Text key={`${person}-${index}`}>{person}</Text>
                                                )
                                            })}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}

Home.propTypes = {}

export default Home
