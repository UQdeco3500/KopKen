import React from 'react'
import PropTypes from 'prop-types'
import { Button, Image, SafeAreaView, ScrollView, Text, View } from 'react-native'
import { sizes, styles, colors } from '../data/theme'
import Chip from '../components/Chip'
import PrimaryButton from '../components/PrimaryButton'
import { useUserLocation } from '../context/Context';

function ArtefactDetailView({ navigation, route }) {
    const { artefact } = route.params

    const userLocation = useUserLocation()

    function epochToDate(epoch) {
        const date = new Date(epoch * 1000);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }

    const formattedDate = epochToDate(artefact.dateAdded);

    console.log(artefact.contexts.location.name)
    return (
        <ScrollView style={{ flex: 1 }} contentInsetAdjustmentBehavior='automatic'>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    padding: sizes.padding.md,
                    gap: sizes.gap.lg,
                    paddingBottom: sizes.padding.lg * 1,
                    paddingTop: 30
                }}>
                    <View>
                        <Text style={{ ...styles.text.body1 }}>Current location:</Text>
                        <Text style={{ ...styles.text.header2 }}>{userLocation}</Text>
                    </View>
                    {artefact.type === 'photo' && (
                        <Image
                            source={artefact.content}
                            style={{
                                // flex: 1,
                                width: '100%',
                                // height: '110%',
                                // resizeMode: 'contain',
                                // aspectRatio: 1,
                                borderRadius: 25,
                                borderWidth: 5,
                                borderColor: 'white'
                            }}
                        />
                    )}
                    {artefact.type === 'story' && (
                        <>
                            <Text style={styles.text.header2}>{artefact.content.title}</Text>
                            <Text style={styles.text.body1} numberOfLines={3}
                                ellipsizeMode='tail'>{artefact.content.content}</Text>
                        </>
                    )}
                    {artefact.type === 'keyword' && (
                        <View style={{
                            padding: 20,
                            borderWidth: 2,
                            borderRadius: 25,
                            borderColor: 'white',
                            backgroundColor: colors.purple,
                            width: '100%',
                            aspectRatio: 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                ...styles.text.header2,
                                textAlign: 'center',
                                fontStyle: 'italic',
                                fontFamily: 'Times New Roman',
                                fontWeight: '100',
                            }}>{artefact.content}</Text>
                        </View>
                    )}
                    <Text style={styles.text.body3}>This artefact was created on {formattedDate}</Text>
                    <Text style={styles.text.semi2}>Location:</Text>
                    <Text style={{
                        ...styles.text.header3,
                        // fontStyle: 'italic',
                        // fontFamily: 'Times New Roman',
                        // fontWeight: '100',
                    }}>{artefact.contexts.location.name}</Text>
                    <Text style={styles.text.semi2}>People In This Photo:</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                        {artefact.contexts.people.map(person => (
                            <Chip
                                key={person}
                                text={person}
                                style={{ marginRight: 10 }}
                                variant='outlined'
                                color='white'
                            />
                        ))}
                    </View>
                    {artefact.type === 'photo' && (
                        <PrimaryButton
                            text={'Recreate'}
                            color={colors.purple}
                        // onPress={handleButtonPress}
                        />
                    )}
                </View>
            </SafeAreaView>
        </ScrollView>


    )
}

ArtefactDetailView.propTypes = {}

export default ArtefactDetailView
