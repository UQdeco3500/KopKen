import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { Image, ImageBackground, SafeAreaView, ScrollView, Text, View } from 'react-native'
import Geolocation from '@react-native-community/geolocation';
import { predefinedLocations } from '../data/predefinedLocations';
import { useUserLocation } from '../context/Context';
import { dummyArtefacts } from '../data/dummyArtefacts';
import { sizes, text } from '../data/theme';

function Home() {

    const userLocation = useUserLocation()

    const matchingArtifacts = dummyArtefacts.filter(
        artefact => artefact.contexts.location.name === userLocation
    );

    console.log('render')

    return (
        <ScrollView contentInsetAdjustmentBehavior='automatic'>
            <SafeAreaView>
                <View style={{ padding: sizes.padding.md }}>
                    <View style={{ gap: sizes.padding.lg }} >
                        <View>
                            <Text>Current location: {userLocation}</Text>
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
