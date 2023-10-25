import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import PrimaryButton from '../components/PrimaryButton'
import { useUserLocation } from '../context/Context';
import { Dimensions, Image, SafeAreaView, ScrollView, Text, View } from 'react-native'
import { colors, sizes, styles } from '../data/theme'
import Chip from '../components/Chip'
import usePhotoArtefacts from '../hooks/usePhotoArtefacts'
import { formatDate } from '../helpers/helpers'

const screen_width = Dimensions.get('screen').width - 32;
function ArtefactDetailView({ navigation, route }) {
    const { photo } = route.params
    const { getGroupPhotos } = usePhotoArtefacts();
    const [groupPhotos, setGroupPhotos] = useState([]);

    const userLocation = useUserLocation()

    useEffect(() => {
        const photosInGroup = getGroupPhotos(photo.groupId);
        setGroupPhotos(photosInGroup);
    }, [photo.groupId]);

    const isPortrait = photo.height > photo.width;
    const imgWidth = isPortrait ? screen_width / (photo.height / photo.width) : screen_width;
    const imgHeight = isPortrait ? screen_width : screen_width * (photo.height / photo.width);


    // For future development
    const setImageOrientation = (orientation) => {
        switch (orientation) {
            case 'landscape-right':
                return [{ rotate: '-90deg' }]
            case 'landscape-left':
                return [{ rotate: '90deg' }]
            case 'portrait':
                return;
            case 'portrait-upside-down':
                return [{ rotate: '180deg' }]
            default:
                break;
        }
    }

    // console.log('currentPhotoDetail', photo.contexts)
    console.log('photo', photo)
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
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: screen_width,
                                aspectRatio: 1,
                                borderWidth: 1,
                                borderColor: colors.white,
                                borderRadius: sizes.radius.lg,
                                padding: sizes.padding.lg,
                                backgroundColor: colors.white
                            }}
                        >
                            <Image
                                source={{ uri: `file://${photo.path}` }}
                                style={{
                                    // transform: setImageOrientation(photo.orientation),
                                    width: screen_width - sizes.padding.lg,
                                    height: screen_width - sizes.padding.lg,
                                    resizeMode: 'contain',  // 'contain' will ensure the image is scaled to fit within the bounding box while maintaining the aspect ratio
                                }}
                            />
                        </View>
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
                    {/* <Text style={styles.text.body3}>This artefact was created on {formattedDate}</Text> */}
                    <Text style={styles.text.body2}>{formatDate(photo.dateAdded).dayString}</Text>
                    <Text style={styles.text.body2}>{formatDate(photo.dateAdded).timeString}</Text>
                    <Text style={styles.text.header3}>Where this photo is taken</Text>
                    <Chip
                        text={photo.contexts.location.locationName}
                        style={{ flex: 0 }}
                    />
                    <Text style={styles.text.semi2}>Location:</Text>
                    <Text style={{
                        ...styles.text.header3,
                        // fontStyle: 'italic',
                        // fontFamily: 'Times New Roman',
                        // fontWeight: '100',
                    }}>{artefact.contexts.location.name}</Text>
                    {/* <Text style={styles.text.semi2}>People In This Photo:</Text> */}
                    <Text style={styles.text.header3}>People in this photo</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                        {photo.contexts.people.length > 0 ? photo.contexts.people.map(person => (
                            <Chip
                                key={person}
                                text={person}
                                style={{ marginRight: 10 }}
                                variant='outlined'
                                color='white'
                            />
                        )) : (
                            <Text style={styles.text.body3} >No one else in this photo</Text>
                        )}
                    </View>
                    {artefact.type === 'photo' && (
                        <PrimaryButton
                            text={'Recreate'}
                            color={colors.purple}
                            onPress={() => navigation.navigate('Capture Photo', { toRecreate: photo })}
                        />
                        // <Button
                        // title='Recreate'
                        // onPress={() => navigation.navigate('Capture Photo', { toRecreate: photo })}/>
                    )}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
                        {groupPhotos.map(groupPhoto => (
                            <View key={groupPhoto.id} style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: sizes.gap.xs
                            }}>
                                <Image
                                    source={{ uri: `file://${groupPhoto.path}` }}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        resizeMode: 'contain',
                                    }}
                                />
                                <Text style={styles.text.body3}>{formatDate(groupPhoto.dateAdded).compactDateString}</Text>
                                <Text style={styles.text.body3}>{formatDate(groupPhoto.dateAdded).timeString}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>


    )
}

ArtefactDetailView.propTypes = {}

export default ArtefactDetailView
