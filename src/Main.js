import React from 'react'
import { Text, LogBox } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from "@expo/vector-icons";

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as Page from './screens';

import { isUserLoggedIn } from './redux/slices/authSlice'
import { selectedTheme } from './redux/slices/selectors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

LogBox.ignoreAllLogs();

const Main = () => {
  const auth = useSelector(isUserLoggedIn);
  const theme = useSelector(selectedTheme);

  const BottomTabNavigator = () => {
    return (
      <Tab.Navigator screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#000' : '#fff',
          paddingBottom: 17,
          height: 70,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'ios-search' : 'ios-search-outline';
          } else if (route.name === 'Story') {
            iconName = focused ? 'md-add-circle' : 'md-add';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'ios-albums' : 'ios-albums-outline';
          } else if (route.name === 'User') {
            iconName = focused ? 'md-person' : 'md-person-outline';
          }
          return <Ionicons name={iconName} size={route.name === 'Story' ? 34 : 24} color={color} />;
        },
        tabBarLabel: ({ focused, color }) => {
          return (
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'normal' }}>{route.name}</Text>
          );
        },
      })}>
        <Tab.Screen name="Home" component={Page.Home} options={{}} />
        <Tab.Screen name="Search" component={Page.Search} options={{}} />
        <Tab.Screen name="Story" component={Page.NewPost} options={{}} />
        <Tab.Screen name="Favorites" component={Page.Album} options={{}} />
        <Tab.Screen name="User" component={Page.User} options={{}} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Home'} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={BottomTabNavigator} options={{}} />
        {auth && <Stack.Screen name="Favorites" component={Page.Favorites} options={{}} />}
        {!auth && <Stack.Screen name="Login" component={Page.Login} options={{}} />}
        {!auth && <Stack.Screen name="Registration" component={Page.Registration} options={{}} />}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Main