// components/ThemeProvider.js
import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, SafeAreaView } from 'react-native';

const ThemeProvider = ({ children }) => {
  const themeType = useSelector((state) => state.theme.type);
  const theme = themeType === 'dark' ? darkTheme : lightTheme;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {children}
    </SafeAreaView>
  )};

const lightTheme = { background: '#ffffff' };
const darkTheme = { background: '#333333' };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ThemeProvider;
