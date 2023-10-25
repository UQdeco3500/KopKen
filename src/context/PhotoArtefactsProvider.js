import React, { createContext, useContext, useEffect, useReducer, useState } from 'react'
import PropTypes from 'prop-types'
import { storage } from '../../App'


const PhotoArtefactsContext = createContext(null)

function PhotoArtefactsProvider({ children }) {

    const [photos, dispatchPhotos] = useReducer(photosReducer, [])
    const [currentPhoto, setCurrentPhoto] = useState({})


    useEffect(() => {
        const loadPhotos = () => {
            const strPhotos = storage.getString('photos');
            if (strPhotos) {
                const allPhotos = JSON.parse(strPhotos);
                dispatchPhotos({ type: 'loadPhotos', payload: allPhotos });
            }
        };

        loadPhotos();
    }, []);


    const value = {
        photos,
        currentPhoto,
        dispatchPhotos,
        setCurrentPhoto
    }

    // console.log('allPhotos', photos)

    return (
        <PhotoArtefactsContext.Provider value={value}>
            {children}
        </PhotoArtefactsContext.Provider>
    )
}

PhotoArtefactsProvider.propTypes = {}

export default PhotoArtefactsProvider

function photosReducer(state, action) {
    switch (action.type) {
        case 'loadPhotos': {
            return action.payload;
        }
        case 'getAllPhotos': {
            const strPhotos = storage.getString('photos');

            if (strPhotos) {
                const allPhotos = JSON.parse(strPhotos);
                return allPhotos;
            }
            return [...state];
        }
        case 'addPhoto': {
            const updatedPhotos = [...state, action.payload];
            storage.set('photos', JSON.stringify(updatedPhotos));
            return [...updatedPhotos];
        }
        case 'removePhoto': {
            const updatedPhotos = [...state].filter(photo => photo.id !== action.payload.id);
            storage.set('photos', JSON.stringify(updatedPhotos));
            return [...updatedPhotos];
        }
        default:
            return state;
    }
}

export function usePhotoArtefactsContext() {
    return useContext(PhotoArtefactsContext)
}
