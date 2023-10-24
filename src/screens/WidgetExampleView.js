// Import required libraries
import React from 'react';
import { Button, SafeAreaView } from 'react-native';
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import RNFS from 'react-native-fs';

const appGroupIdentifier = 'group.com.kopken';  // Replace with your app group identifier

const shareImage = async () => {
    const key = 'memoryCue';
    const fileName = 'photo1.jpeg';

    // Define the source and destination paths
    const sourcePath = (RNFS.MainBundlePath || RNFS.DocumentDirectoryPath) + '/photos/Iglu/' + fileName;  // Adjust for iOS
    const destinationPath = RNFS.DocumentDirectoryPath + '/photos/Iglu/' + fileName;

    try {
        // Check if file exists at the source path (this is more relevant for Android)
        const fileExists = await RNFS.exists(sourcePath);
        if (fileExists) {
            // Copy the image to the shared location
            await RNFS.copyFile(sourcePath, destinationPath);
            // Share the file path to the widget
            await SharedGroupPreferences.setItem(key, destinationPath, appGroupIdentifier);
            console.log('shared', { key, destinationPath, appGroupIdentifier });
        } else {
            console.error('File does not exist at the source path');
        }
    } catch (error) {
        console.error(error);
    }
};

const WidgetExampleView = () => {
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Share Random Image" onPress={shareImage} />
        </SafeAreaView>
    );
};

export default WidgetExampleView;
