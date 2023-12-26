import * as UI from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';

import { ThemeProvider, ToggleThemeButton } from '../../components'; 

import Library from './mode/Library'
import Camera from './mode/Camera'
import CameraRoll from './mode/CameraRoll'


export const NewPost = () => {
  const [mode, setMode] = useState('lib');
// 
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
        {/* {mode === 'lib' ? <Library /> : <Camera />} */}
      <CameraRoll />
      </ThemeProvider>
  )
}

const styles = UI.StyleSheet.create({
  dislpayLayout: { 
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center'
  },
  upload: {
      alignItems: 'center',
      justifyContent: 'center',
      height: '75%'
  },
  deleteText: {
      color: 'white', 
      fontSize: 10, 
      fontWeight: 'bold'
    },
    deleteBtn: { 
      alignItems: 'center', 
      justifyContent: 'center', 
      position: 'absolute', 
      top: 3, 
      right: 3, 
      backgroundColor: 'rgba(0, 0, 0, 0.7)', 
      width: 20, 
      height: 20, 
      borderRadius: '50%' 
  },
    images: { 
      width: 175, 
      height: 175, 
      margin: 5, 
      borderWidth: 3, 
      borderRadius: 5, 
      borderColor: 'rgba(0, 0, 0, .4)' 
  }
});

export default NewPost;