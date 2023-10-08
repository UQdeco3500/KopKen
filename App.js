import React from 'react'
import PropTypes from 'prop-types'
import { SafeAreaView, Text, View } from 'react-native'
import { sizes, text } from './src/data/theme'
import Home from './src/screens/Home'
import Reminisce from './src/screens/Reminisce'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import StoreProvider from './src/context/Context'


const Stack = createNativeStackNavigator();

const nestedHeaderOptions = {
  headerTitle: '', headerTransparent: true, headerBlurEffect: 'systemThickMaterial'
}

function App(props) {
  return (
    <StoreProvider>
      <NavigationContainer >
        {/* <View style={{ flex: 1, backgroundColor: '#0F1720' }}> */}
        <Stack.Navigator screenOptions={{
          headerShown: false,
          // contentStyle: { backgroundColor: 'transparent' } 
        }}>
          <Stack.Screen name='Home' component={Home} />

          {/* Settings */}
          <Stack.Group screenOptions={{ headerShown: true }}>
            <Stack.Screen name='Reminisce' component={Reminisce} options={{ ...nestedHeaderOptions, headerBackTitle: 'Home' }} />
          </Stack.Group>



        </Stack.Navigator>
        {/* </View> */}
      </NavigationContainer>
    </StoreProvider>
  )
}

App.propTypes = {}

export default App
