import * as UI from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import * as ImagePicker from 'expo-image-picker';

import Guard from '../route-guard/Guard'

import Camera from './mode/Camera'
import Library from './mode/Library'
import CameraRoll from './mode/CameraRoll'

import { ThemeProvider, Button } from '../../components';
import { loggedInStatus } from '../../redux/slices/selectors';

export const NewPost = ({ navigation }) => {
  const [mode, setMode] = useState('lib');
  const { isLoggedIn } = useSelector(loggedInStatus);

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

  const getButtonStyles = (currentMode) => ({
    button: [styles.button, styles.modeMargin, { backgroundColor: mode === currentMode ? '#fff' : '#000' }],
    textStyle: mode === currentMode ? '#000' : '#fff',
  });

  const buttonLabels = [
    { mode: 'lib', label: 'Library' },
    { mode: 'roll', label: 'Roll' },
    { mode: 'cam', label: 'Camera' },
  ]

  return (
      <ThemeProvider>
        {isLoggedIn ? 
          <>
            <UI.View style={styles.modeContainer}>
              {buttonLabels.map(item => 
                <Button style={getButtonStyles(item.mode).button} textStyle={getButtonStyles(item.mode).textStyle} label={item.label} onPress={() => setMode(item.mode)} />
              )}
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