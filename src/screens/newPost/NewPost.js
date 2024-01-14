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
  const { isLoggedIn } = useSelector(loggedInStatus);

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

  const switchMode = (mode) => {
    switch(mode) {
      case 'lib':
        return <Library navigation={navigation} color={color} />
      case 'cam':
        return <Camera navigation={navigation} color={color} />
      case 'roll':
        return <CameraRoll navigation={navigation} color={color} />
      default:
        return;
    }
  }

  const Button = ({ mode, label }) => (
    <UI.Pressable style={[styles.button, styles.modeContainerMargin]} onPress={() => setMode(mode)}>
      <UI.Text style={styles.text}>{label}</UI.Text>
    </UI.Pressable>
  );

  return (
      <ThemeProvider>
        <UI.View style={styles.modeContainer}>
          <Button mode='lib' label="library" />
          <Button mode='roll' label="roll" />
          <Button mode='cam' label="camera" />
        </UI.View>
        {switchMode(mode)}
      </ThemeProvider>
  )
}

const styles = UI.StyleSheet.create({
  modeContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: '5%' 
  },
  modeContainerMargin: {
    marginLeft: 1,
    marginRight: 1,
    borderWidth: 1, 
    borderColor: '#fff',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default NewPost;