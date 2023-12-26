import React from 'react';
import { View, Text, StyleSheet } from 'react-native'


import { ThemeProvider, ToggleThemeButton } from '../../components'; 

export const Login = ({ navigation }) => {
  return (
    <ThemeProvider>
      <View style={styles.container}>
        <Text>Search Page</Text>
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
  }
});

export default Login;