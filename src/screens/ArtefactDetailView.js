import React from 'react'
import PropTypes from 'prop-types'
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native'
import { sizes } from '../data/theme'
import Chip from '../components/Chip'

function ArtefactDetailView({ navigation, route }) {
    const { artefact } = route.params

    console.log(artefact.contexts.location.name)
    return (
        <ScrollView style={{ flex: 1 }} contentInsetAdjustmentBehavior='automatic'>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    padding: sizes.padding.md,
                    gap: sizes.gap.lg,
                    paddingBottom: sizes.padding.lg * 2
                }}>
                    <Image
                        source={artefact.content}
                        style={{
                            flex: 1,
                            width: '100%',
                            resizeMode: 'cover'
                        }}
                    />
                    <Chip
                        text={artefact.contexts.location.name}
                        style={{ flex: 0 }}
                    />
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                        {artefact.contexts.people.map(person => (
                            <Chip
                                key={person}
                                text={person}
                                style={{ marginRight: 10 }}
                            />
                        ))}
                    </View>

                </View>
            </SafeAreaView>
        </ScrollView>


    )
}

ArtefactDetailView.propTypes = {}

export default ArtefactDetailView
