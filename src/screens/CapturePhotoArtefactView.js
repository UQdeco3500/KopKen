import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Button,
    Text,
    Linking,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Pressable,
} from 'react-native';
import { Camera, useCameraDevice, useCameraDevices } from 'react-native-vision-camera';
import { sizes } from '../data/theme';
import usePhotoArtefacts from '../hooks/usePhotoArtefacts';
import { useUserLocation } from '../context/Context';
import { storage } from '../../App';
import { useMPC } from '../hooks/useMPC';
import { extractDisplayNames, useNearbyPeersContext } from '../context/NearbyPeersProvider';

function CapturePhotoArtefactView({ navigation, route }) {


    let toRecreate;
    if (route.params) {
        toRecreate = route.params.toRecreate
    }

    const {
        addPhoto
    } = usePhotoArtefacts()

    const userLocation = useUserLocation()
    const { locationName, locationData } = userLocation

    // console.log('userLocation', locationName)

    const {
        nearbyPeers,
        peers
    } = useNearbyPeersContext()

    // console.log('nearbyPeers', nearbyPeers)
    // console.log('peers', peers)

    const camera = useRef(null);
    const devices = useCameraDevices();
    // const device = devices.back;
    const device = useCameraDevice('back')
    // console.log(device)
    const [showCamera, setShowCamera] = useState(true);
    const [imageSource, setImageSource] = useState('');
    const [imageObject, setImageObject] = useState({})

    // Grant Permission first
    useEffect(() => {
        async function getPermission() {
            const newCameraPermission = await Camera.requestCameraPermission();
            console.log('permission', newCameraPermission);
        }
        getPermission();
    }, []);

    const capturePhoto = async () => {
        if (camera.current !== null) {
            const photo = await camera.current.takePhoto({});
            setImageSource(photo.path);
            setImageObject(photo)
            setShowCamera(false);
            // console.log(photo);
        }
    };

    const savePhoto = (newPhoto, locationData) => {
        if (toRecreate) {
            const groupId = toRecreate.groupId || toRecreate.id;
            addPhoto(newPhoto, locationData, extractDisplayNames(peers), groupId);
        } else {
            addPhoto(newPhoto, locationData, extractDisplayNames(peers));
        }
        setShowCamera(true);
    }

    const handleBackButton = () => {
        setShowCamera(false)
        navigation.navigate('Dashboard')
    }

    if (device == null) {
        return <Text>Camera not available</Text>;
    }

    return (
        <View style={styles.container}>
            {showCamera ? (
                <>
                    <Camera
                        ref={camera}
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={showCamera}
                        photo={true}
                    >
                        {toRecreate && (
                            <Image
                                style={{
                                    backgroundColor: 'rgba(255,0,0,.4)',
                                    position: 'absolute',
                                    flex: 1,
                                    top: 0,
                                    height: '100%',
                                    width: '100%',
                                    opacity: .2,
                                }}
                                source={{
                                    uri: `file://'${toRecreate.path}`,
                                }}
                            />
                        )}
                    </Camera>
                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={styles.camButton}
                            onPress={() => capturePhoto()}
                        />
                    </View>
                    <View style={{
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        top: 0,
                        padding: sizes.padding.lg,
                        paddingTop: sizes.padding.lg * 2
                    }}>
                        <Pressable
                            style={styles.camButton}
                            onPress={handleBackButton}
                        />
                    </View>


                </>
            ) : (
                <>
                    {imageSource !== '' ? (
                        <Image
                            style={styles.image}
                            source={{
                                uri: `file://'${imageSource}`,
                            }}
                        />
                    ) : null}

                    <View style={styles.backButton}>
                        <Pressable
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                padding: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: '#fff',
                                width: 100,
                            }}
                            onPress={() => setShowCamera(true)}>
                            <Text style={{ color: 'white', fontWeight: '500' }}>Back</Text>
                        </Pressable>
                    </View>
                    <View style={styles.buttonContainer}>
                        <View style={styles.buttons}>
                            <Pressable
                                style={{
                                    backgroundColor: '#fff',
                                    padding: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    borderColor: '#77c3ec',
                                }}
                                onPress={() => setShowCamera(true)}>
                                <Text style={{ color: '#77c3ec', fontWeight: '500' }}>
                                    Retake
                                </Text>
                            </Pressable>
                            <Pressable
                                style={{
                                    backgroundColor: '#77c3ec',
                                    padding: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    borderColor: 'white',
                                }}
                                onPress={() => savePhoto(imageObject, userLocation)}>
                                <Text style={{ color: 'white', fontWeight: '500' }}>
                                    Use Photo
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}

function CameraView({ camera, device, showCamera, capturePhoto }) {
    return (
        <SafeAreaView style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={showCamera}
                photo={true}
            />

            <View style={{
                backgroundColor: 'rgba(0,0,0,0.2)',
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                bottom: 0,
                padding: 20,
            }}>
                <Pressable
                    style={styles.camButton}
                    onPress={() => capturePhoto()}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'gray',
    },
    backButton: {
        backgroundColor: 'rgba(0,0,0,0.0)',
        position: 'absolute',
        justifyContent: 'center',
        width: '100%',
        top: 0,
        padding: sizes.padding.lg,
        paddingTop: sizes.padding.lg * 2
    },
    buttonContainer: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        bottom: 0,
        padding: sizes.padding.lg,
        paddingBottom: sizes.padding.lg * 2
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    camButton: {
        height: 80,
        width: 80,
        borderRadius: 40,
        //ADD backgroundColor COLOR GREY
        backgroundColor: '#B2BEB5',

        alignSelf: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },
    image: {
        width: '100%',
        height: '100%',
        aspectRatio: 9 / 16,
    },
});

export default CapturePhotoArtefactView;