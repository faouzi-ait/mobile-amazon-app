import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'

import { setCredentials } from '../../redux/slices/authSlice';
import { useLoginMutation } from '../../redux/apiServices/authApi';

import { ThemeProvider, ToggleThemeButton } from '../../components'; 
import { selectedTheme } from '../../redux/slices/selectors';
import { lightStyles, darkStyles } from '../../utils'

import AsyncStorage from '@react-native-async-storage/async-storage';

import AnimatedLoader from 'react-native-animated-loader';

export const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [login, { data, error, isLoading }] = useLoginMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const theme = useSelector(selectedTheme);

  const inputStyle = theme === 'dark' ? darkStyles : lightStyles;
  const placeholderStyle = theme === 'dark' ? '#fff' : '#000';

  const handleLogin = async () => {
    try {
      const formattedUsername = username.toLowerCase();
      const { token, refreshToken, user } = await login({ username: formattedUsername, password }).unwrap();
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('refreshToken', refreshToken);

      dispatch(setCredentials({ user, accessToken: { token, refreshToken }}));
      navigation.navigate('Home');
    } catch (error) {
      console.log(error)
    }
  };
    
  if(isLoading) {
    return (
      <View style={styles.container}>
        <AnimatedLoader
          visible={true}
          overlayColor="rgba(255,255,255,0.75)"
          animationStyle={styles.lottie}
          speed={1}>
            {/* <Text style={{ margin: 5 }}>Logging you in....</Text> */}
        </AnimatedLoader>
      </View>
    )
  }

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <TextInput
          placeholderTextColor={placeholderStyle}
          style={[styles.input, inputStyle]}
          placeholder="Username"
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          placeholderTextColor={placeholderStyle}
          style={[styles.input, inputStyle]}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          />
        {error && <Text>{error?.data?.error}</Text>}
        <Button title="Login" onPress={handleLogin} />

        <View style={styles.btnContainer}>
          <Button title="Register" onPress={() => navigation.navigate('Registration')} />
          <Button title="Home Page" onPress={() => navigation.navigate('Home')} />
        </View>
        <ToggleThemeButton />
      </View>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  btnContainer: {
    flexDirection: 'row'
  },
  lottie: {
    width: 100,
    height: 100,
  },
});

export default Login;