import React from 'react'
import { Platform } from 'react-native';
import Button from 'react-native-button';

import { useSelector } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home, Login, Registration, Listing, Album, CameraCmp } from './screens';

import { isUserLoggedIn } from './redux/slices/authSlice'

const Stack = createNativeStackNavigator();

// SCREEN OPTIONS OBJECT
const screenOptions = {
  title: 'My home',
  headerStyle: { backgroundColor: '#f4511e' },
  headerTitleAlign: 'center',
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerLeft: () => (
    <Button
        style={{ fontSize: 20, color: 'white' }}
        styleDisabled={{ color: 'white' }}
        containerStyle={{ padding: 10, height: 45, borderRadius: 4 }}
        disabledContainerStyle={{ backgroundColor: 'pink' }}
        onPress={() => alert('This is a button!')}>
        Press!
    </Button>
  ),
}

const Main = () => {
  const auth = useSelector(isUserLoggedIn);

  return (

    <NavigationContainer>
        <Stack.Navigator initialRouteName={Home} screenOptions={screenOptions}>
            <Stack.Screen name="Home" component={Home} />
            {!auth && <Stack.Screen name="Login" component={Login} options={{ title: 'Login', headerShown: false }} />}
            <Stack.Screen name="Registration" component={Registration} options={{ title: 'Registration', headerShown: true }} />
            {auth && <Stack.Screen name="Listing" component={Listing} options={{ title: 'Listing', headerShown: true }} />}
            {auth && <Stack.Screen name="Album" component={Album} options={{ title: 'Album', headerShown: true }} />}
            {auth && <Stack.Screen name="Camera" component={CameraCmp} options={{ title: 'Camera', headerShown: true }} />}
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Main