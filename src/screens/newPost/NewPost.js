import * as UI from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import * as ImagePicker from 'expo-image-picker';

import Guard from '../route-guard/Guard'

import Camera from './mode/Camera'
import Library from './mode/Library'
import CameraRoll from './mode/CameraRoll'

import { ThemeProvider, ToggleThemeButton, Button } from '../../components';
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
        return <Library navigation={navigation} />
      case 'cam':
        return <Camera navigation={navigation} />
      case 'roll':
        return <CameraRoll navigation={navigation} />
      default:
        return;
    }
  }

  return (
      <ThemeProvider>
        {isLoggedIn ? 
          <>
            <UI.View style={styles.modeContainer}>
              <Button style={[styles.button, styles.modeMargin, { backgroundColor: mode === 'lib' ? '#fff' : '#000' }]} textStyle={ mode === 'lib' ? '#000' : '#fff' } label="Library" onPress={() => setMode('lib')} />
              <Button style={[styles.button, styles.modeMargin, { backgroundColor: mode === 'roll' ? '#fff' : '#000' }]} textStyle={ mode === 'roll' ? '#000' : '#fff' } label="Roll" onPress={() => setMode('roll')} />
              <Button style={[styles.button, styles.modeMargin, { backgroundColor: mode === 'cam' ? '#fff' : '#000' }]} textStyle={ mode === 'cam' ? '#000' : '#fff' } label="Camera" onPress={() => setMode('cam')} />
            </UI.View>
            {switchMode(mode)}
          </>
          : <Guard navigation={navigation} message='New Story Screen' />
        }
      </ThemeProvider>
  )
}

const styles = UI.StyleSheet.create({
  modeContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: '5%' 
  },
  modeMargin: {
    marginLeft: 1,
    marginRight: 1,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    borderWidth: 1, 
    borderColor: '#fff',
  },
  active: {
    color: '#fff',
    backgroundColor: '#000'
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