import React from 'react'
import PropTypes from 'prop-types'
import { usePhotoArtefactsContext } from '../context/PhotoArtefactsProvider'

function usePhotoArtefacts(props) {

    const {
        photos,
        currentPhoto,
        dispatchPhotos,
        setCurrentPhoto
    } = usePhotoArtefactsContext()

    const getAllPhotos = () => {
        dispatchPhotos({
            type: 'getAllPhotos'
        })
    }

    const addPhoto = (newPhoto, locationData, peopleData) => {
        getAllPhotos();
        dispatchPhotos({
            type: 'addPhoto',
            payload: {
                id: Date.now(),
                dateAdded: Date.now(),
                ...newPhoto,
                contexts: {
                    location: locationData,
                    people: peopleData
                }
            }
        })
    }

    const removePhoto = (photoID) => {
        getAllPhotos();
        dispatchPhotos({
            type: 'removePhoto',
            payload: {
                id: photoID
            }
        })
    }

    const value = {
        photos,
        currentPhoto,
        dispatchPhotos,
        setCurrentPhoto,
        getAllPhotos,
        addPhoto,
        removePhoto
    }

    return { ...value }
}

usePhotoArtefacts.propTypes = {}

export default usePhotoArtefacts
