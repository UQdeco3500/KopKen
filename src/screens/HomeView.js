import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { Button, Image, ImageBackground, Pressable, SafeAreaView, ScrollView, Switch, Text, TextInput, View } from 'react-native'
import Geolocation from '@react-native-community/geolocation';
import { predefinedLocations } from '../data/predefinedLocations';
import { useUserLocation } from '../context/Context';
import { dummyArtefacts } from '../data/dummyArtefacts';
import { sizes, styles, colors } from '../data/theme';
import { useMPC } from '../hooks/useMPC';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import usePhotoArtefacts from '../hooks/usePhotoArtefacts';
import { storage } from '../../App';
import Chip from '../components/Chip';

function HomeView({ navigation }) {
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

    const {
        photos
    } = usePhotoArtefacts()

    const [newDisplayName, setNewDisplayName] = useState('');

    const {
        locationName,
        locationCoords
    } = useUserLocation()

    const extractDisplayNames = (peers) => {
        return Object.values(peers).map(peerInfo => peerInfo.peer.displayName);
    };

    const nearbyPeers = extractDisplayNames(peers);

    const matchingartefacts = dummyArtefacts.filter(
        artefact =>
            artefact.contexts.location.name === locationName &&
            (Object.keys(peers).length === 0 ||
                (artefact.contexts.people ?
                    artefact.contexts.people.some(peer => nearbyPeers.includes(peer))
                    : true)
            )
    );

    // console.log('peers', nearbyPeers)
    // console.log('photos', photos)
    // storage.clearAll()


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
                            <Text style={{ ...styles.text.header2 }}>Display Name</Text>
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
                        <Text style={{ ...styles.text.header2 }}>Hey, {displayName}</Text>
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
                            <Text style={{ ...styles.text.body1 }}>Current location:</Text>
                            <Text style={{ ...styles.text.header2 }}>{locationName}</Text>
                        </View>
                        <View style={styles.borderedButton}>
                            <View style={{ gap: sizes.padding.xs }}>
                                <Text style={{ ...styles.text.body1 }} >Browse Mode</Text>
                                <Text style={styles.text.body3} >Turn on if you want to find others.</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#767577', true: '#23AE00' }}
                                thumbColor={isBrowsing ? '#ffff' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={isBrowsing ? stopBrowsing : startBrowsing}
                                value={isBrowsing}
                            />
                        </View>
                        <View style={styles.borderedButton}>
                            <View style={{ gap: sizes.padding.xs }}>
                                <Text style={{ ...styles.text.body1 }} >Ghost Mode</Text>
                                <Text style={styles.text.body3} >In Ghost Mode, others won't find you.</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#767577', true: '#23AE00' }}
                                thumbColor={isAdvertizing ? '#ffff' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={isAdvertizing ? stopAdvertising : startAdvertising}
                                value={!isAdvertizing}
                            />
                        </View>
                        <Button
                            title={'disconnect'}
                            onPress={disconnect}
                        />
                        <Button
                            title='Capture Photo'
                            onPress={() => navigation.navigate('Capture Photo')}
                        />
                        <View style={{ gap: sizes.padding.md }}>
                            <Text style={{ ...styles.text.header2 }}>Found peers:</Text>
                            <View style={{ flexDirection: 'row', gap: sizes.padding.md }}>
                                {Object.entries(peers).map(([id, info]) => (
                                    <View key={id} style={{ alignItems: 'center' }}>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 50, backgroundColor: 'grey', width: 50, height: 50 }}>
                                            <Text style={{ ...styles.text.header1 }}>{info.peer.displayName[0]}</Text>
                                        </View>
                                        <Text style={{ ...styles.text.body1 }}>{info.peer.displayName}</Text>
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
                        <View style={{ borderWidth: 2, borderColor: colors.darkGrey, borderRadius: 25, padding: 10, backgroundColor: colors.darkGreyTransparent }}>
                            <Text style={{ ...styles.text.header2, paddingBottom: 10, paddingTop: 10 }}>Artefacts</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {/* {matchingartefacts.map((artefact, index) => (
                                    <Pressable
                                        key={index}
                                        onPress={() => navigation.navigate('Artefact Detail', { artefact })}
                                        style={{ width: '44%', margin: '3%' }}
                                    >
                                        <View>
                                            {artefact.type === 'photo' && (
                                                <Image source={artefact.content} style={{
                                                    // flex: 1,
                                                    // width: '100%'
                                                    width: '100%',
                                                    height: 150,
                                                    borderRadius: 25
                                                    // aspectRatio: 1
                                                }} />
                                            )}
                                            {artefact.type === 'story' && (
                                                <>
                                                    <Text style={styles.text.header2}>{artefact.content.title}</Text>
                                                    <Text style={styles.text.body3}>{artefact.content.content}</Text>
                                                </>
                                            )}
                                            {artefact.type === 'keyword' && (
                                                <Text style={{ ...styles.text.header2, fontStyle: 'italic' }}>{artefact.content}</Text>
                                            )}
                                            <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                                                    {artefact.contexts.people?.map((person, index) => {
                                                        return (
                                                            <Text style={[styles.text.body3, { marginRight: 5, fontWeight: "bold" }]} key={`${person}-${index}`}>{person}</Text>
                                                        )
                                                    })}
                                                </View>
                                                <Text
                                                    style={[styles.text.body3, { flexShrink: 1 }]}
                                                // numberOfLines={1}
                                                // ellipsizeMode='tail'
                                                >
                                                    {artefact.contexts.location.name}
                                                </Text>
                                            </View>
                                        </View>
                                    </Pressable>
                                ))} */}
                                {photos.map(photo => {
                                    return (
                                        <Pressable
                                            key={photo.id}
                                            onPress={() => navigation.navigate('Artefact Detail', { photo })}
                                        >
                                            <Image
                                                style={{
                                                    width: 100,
                                                    height: 100
                                                }}
                                                source={{
                                                    uri: `file://${photo.path}`,  // Ensure the file path is correct
                                                }}
                                            />
                                        </Pressable>
                                    )
                                })}
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}

HomeView.propTypes = {}

export default HomeView
