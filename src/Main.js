import React from 'react'
import { Text } from 'react-native';

import { useSelector } from 'react-redux';
import { Ionicons } from "@expo/vector-icons";

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home, Login, Search, Registration, NewPost, PostDetails, Album, User } from './screens';

import { isUserLoggedIn } from './redux/slices/authSlice'
import { selectedTheme } from './redux/slices/selectors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Main = () => {
  const auth = useSelector(isUserLoggedIn);
  const theme = useSelector(selectedTheme);

  const tabNavColor = theme === 'dark' ? '#000' : '#fff';

  const BottomTabNavigator = () => {
    return (
      <Tab.Navigator screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabNavColor,
          paddingBottom: 17,
          height: 70,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'ios-search' : 'ios-search-outline';
          } else if (route.name === 'NewPost') {
            iconName = focused ? 'md-add-circle' : 'md-add';
          } else if (route.name === 'Album') {
            iconName = focused ? 'ios-albums' : 'ios-albums-outline';
          } else if (route.name === 'User') {
            iconName = focused ? 'md-person' : 'md-person-outline';
          }
          return <Ionicons name={iconName} size={route.name === 'NewPost' ? 40 : 24} color={color} />;
        },
        tabBarLabel: ({ focused, color }) => {
          return (
            <></>
            // <Text style={{ color }}>{route.name}</Text>
          );
        },
      })}>
          <Tab.Screen name="Home" component={Home} options={{}} />
          <Tab.Screen name="Search" component={Search} options={{}} />
          <Tab.Screen name="NewPost" component={NewPost} options={{}} />
          <Tab.Screen name="Album" component={Album} options={{}} />
          <Tab.Screen name="User" component={User} options={{}} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName={'Home'} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={BottomTabNavigator} options={{}} />
            <Stack.Screen name="PostDetails" component={PostDetails} options={{}} />
            {!auth && <Stack.Screen name="Login" component={Login} options={{}} />}
            {!auth && <Stack.Screen name="Registration" component={Registration} options={{}} />}
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Main