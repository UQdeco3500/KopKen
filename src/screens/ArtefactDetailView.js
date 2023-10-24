import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Dimensions, Image, SafeAreaView, ScrollView, Text, View } from 'react-native'
import { colors, sizes } from '../data/theme'
import Chip from '../components/Chip'
import usePhotoArtefacts from '../hooks/usePhotoArtefacts'

const screen_width = Dimensions.get('screen').width - 32;
function ArtefactDetailView({ navigation, route }) {
    const { photo } = route.params
    const { getGroupPhotos } = usePhotoArtefacts();
    const [groupPhotos, setGroupPhotos] = useState([]);

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
                    paddingBottom: sizes.padding.lg * 2
                }}>
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
                    <Chip
                        text={photo.contexts.location.locationName}
                        style={{ flex: 0 }}
                    />
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                        {photo.contexts.people.map(person => (
                            <Chip
                                key={person}
                                text={person}
                                style={{ marginRight: 10 }}
                            />
                        ))}
                    </View>

                    <Button
                        title='Recreate'
                        onPress={() => navigation.navigate('Capture Photo', { toRecreate: photo })}
                    />

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
                        {groupPhotos.map(groupPhoto => (
                            <View key={groupPhoto.id} style={{ margin: 10 }}>
                                <Image
                                    source={{ uri: `file://${groupPhoto.path}` }}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        resizeMode: 'contain',
                                    }}
                                />
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
