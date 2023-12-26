import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'

import { ThemeProvider, ToggleThemeButton } from '../../components'; 
import { selectedTheme } from '../../redux/slices/selectors';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const PostDetails = ({ navigation }) => {
  const dispatch = useDispatch();

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <Text>Post Details Screen</Text>
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

export default PostDetails;