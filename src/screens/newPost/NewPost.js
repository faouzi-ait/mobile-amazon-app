import * as UI from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import * as ImagePicker from 'expo-image-picker';

import { ThemeProvider, ToggleThemeButton } from '../../components'; 

import Library from './mode/Library'
import Camera from './mode/Camera'
import CameraRoll from './mode/CameraRoll'

import { selectedTheme, currentUser, loggedInStatus } from '../../redux/slices/selectors';


export const NewPost = ({ navigation }) => {
  const [mode, setMode] = useState('lib');
  const theme = useSelector(selectedTheme);

  const isDark = theme === 'dark'
  const color = isDark ? '#fff' : '#000'

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access media library was denied');
      }
    }
  };

  return (
      <ThemeProvider>
        {/* {mode === 'lib' ? <Library color={color} /> : <Camera color={color} />} */}
      {/* <CameraRoll color={color} /> */}
      <CameraRoll color={color} navigation={navigation} />
      </ThemeProvider>
  )
}

export default NewPost;