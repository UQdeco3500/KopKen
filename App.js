import React from 'react'
import PropTypes from 'prop-types'
import { SafeAreaView, Text, View } from 'react-native'
import { sizes, text } from './src/data/theme'
import HomeView from './src/screens/HomeView'
import Reminisce from './src/screens/Reminisce'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import StoreProvider from './src/context/Context'
import MPC from './src/screens/MPC'
import { MMKV } from 'react-native-mmkv'
import ArtefactDetailView from './src/screens/ArtefactDetailView'
import CapturePhotoArtefactView from './src/screens/CapturePhotoArtefactView'


const Stack = createNativeStackNavigator();

const nestedHeaderOptions = {
  headerTitle: '', headerTransparent: true, headerBlurEffect: 'systemThickMaterial'
}

export const storage = new MMKV();

function App(props) {
  return (
    <StoreProvider>
      <NavigationContainer>
        {/* <View style={{ flex: 1, backgroundColor: '#0F1720' }}> */}
        <Stack.Navigator screenOptions={{
          headerShown: false,
          // contentStyle: { backgroundColor: 'transparent' } 
          contentStyle: {
            backgroundColor: '#1F1F1F'
          }
        }}>
          {/* <Stack.Screen name='MPC' component={MPC} /> */}
          <Stack.Screen name='Dashboard' component={HomeView} />

          {/* Settings */}
          <Stack.Group screenOptions={{ headerShown: true }}>
            <Stack.Screen name='Reminisce' component={Reminisce} options={{ ...nestedHeaderOptions, headerBackTitle: 'HomeView' }} />
            <Stack.Screen name='Artefact Detail' component={ArtefactDetailView} options={{ ...nestedHeaderOptions, headerBackTitle: 'HomeView' }} />
          </Stack.Group>

          <Stack.Screen name='Capture Photo' component={CapturePhotoArtefactView} options={{ ...nestedHeaderOptions, headerBackTitle: 'HomeView' }} />



        </Stack.Navigator>
        {/* </View> */}
      </NavigationContainer>
    </StoreProvider>
  )
}

App.propTypes = {}

export default App
