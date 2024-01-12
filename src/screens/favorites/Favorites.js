import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'

import { ThemeProvider, ToggleThemeButton } from '../../components'; 
import { selectedTheme } from '../../redux/slices/selectors';
import { lightStyles, darkStyles } from '../../utils'

export const Favorites = ({ navigation }) => {
  const dispatch = useDispatch();

  const theme = useSelector(selectedTheme);

  const color = theme === 'dark' ? '#fff' : '#000'

  return (
    <ThemeProvider>
      <View style={styles.container}>

        <Text style={{ color }}>Favorites Page</Text>

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

export default Favorites;