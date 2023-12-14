import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, SafeAreaView, TextInput, Button, StyleSheet } from 'react-native'

import { setCredentials } from '../../redux/slices/authSlice';
import { useLoginMutation } from '../../redux/apiServices/authApi'

import AsyncStorage from '@react-native-async-storage/async-storage';

export const Login = ({ navigation }) => {
  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const formattedUsername = username.toLowerCase();
      const { token, refreshToken, user } = await login({ username: formattedUsername, password }).unwrap();
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('refreshToken', refreshToken);

      dispatch(setCredentials({ user, accessToken: { token, refreshToken }}));
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  };

  return (
      <SafeAreaView style={styles.container}>

        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(text) => setUsername(text)}
          />
        <TextInput
          style={styles.input} 
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          />
        <Button title="Login" onPress={handleLogin} />

        <View style={styles.btnContainer}>
          <Button title="Register" onPress={() => navigation.navigate('Registration')} />
          <Button title="Home Page" onPress={() => navigation.navigate('Home')} />
        </View>

      </SafeAreaView>
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
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  btnContainer: {
    flexDirection: 'row'
  }
});

export default Login;