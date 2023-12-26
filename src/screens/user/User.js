import { StyleSheet } from 'react-native';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeProvider, ToggleThemeButton, Button } from '../../components'; 

import { isUserLoggedIn } from '../../redux/slices/authSlice';
import { setLogout } from '../../redux/slices/authSlice';

export const User = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector(isUserLoggedIn);

  const onLogout = async () => {
    dispatch(setLogout());
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
  }

  return (
    <ThemeProvider>
      <ToggleThemeButton />
        {auth && <Button label="Logout" style={styles.button} textStyle={styles.text} onPress={onLogout} />}
        {auth  && <Button label="Go to Listing" style={styles.button} textStyle={styles.text} onPress={() => navigation.navigate('Listing')} />}
        <Button label="Go to Post Details" style={styles.button} textStyle={styles.text} onPress={() => navigation.navigate('PostDetails')} />
        {auth  && <Button label="Go to Album" style={styles.button} textStyle={styles.text} onPress={() => navigation.navigate('Album')} />}
        {auth  && <Button label="Go to Camera" style={styles.button} textStyle={styles.text} onPress={() => navigation.navigate('Camera')} />}
        {!auth && <Button label="Go to Login" style={styles.button} textStyle={styles.text} onPress={() => navigation.navigate('Login')} />}
        {!auth && <Button label="Go to Registration" style={styles.button} textStyle={styles.text} onPress={() => navigation.navigate('Registration')} />}
        {auth && <Button label="Logout" onPress={onLogout} />}
    </ThemeProvider>
  );
}

export default User;

const styles = StyleSheet.create({
  button: {
    width: '75%',
    margin: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#3498db',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
  postContainer: {
      marginBottom: 20,
      paddingLeft: 10,
      paddingRight: 10,
    },
    postImage: {
      width: '100%',
      height: 300,
      borderRadius: 10,
    },
    postInfo: {
     flexDirection: 'row',
     marginTop: 9,
     marginBottom: 5,
  },
  postText: {
      fontSize: 12,
      fontWeight: 'bold',
    },
});
  