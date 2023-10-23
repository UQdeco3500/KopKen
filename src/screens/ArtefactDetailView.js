import React from 'react'
import PropTypes from 'prop-types'
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native'
import { sizes } from '../data/theme'
import Chip from '../components/Chip'

function ArtefactDetailView({ navigation, route }) {
    const { artefact } = route.params

    console.log(artefact.contexts.location.name)
    return (
        <ScrollView style={{
            flex: 1,
            // backgroundColor: colors.darkTurquoise
        }}
            contentInsetAdjustmentBehavior='automatic'
        >
            <SafeAreaView>
                <View style={{
                    padding: sizes.padding.md,
                    gap: sizes.gap.lg,
                    paddingBottom: sizes.padding.lg * 2
                }}>
                    <Image
                        source={artefact.content}
                        style={{
                            width: 100,
                            height: 100
                        }}
                    />
                    <Chip
                        text={artefact.contexts.location.name}
                    />
                    {artefact.contexts.people.map(person => {
                        return (
                            <Chip
                                key={person}
                                text={person}
                            />
                        )
                    })}
                </View>
            </SafeAreaView>
        </ScrollView>

    )
}

ArtefactDetailView.propTypes = {}

export default ArtefactDetailView
