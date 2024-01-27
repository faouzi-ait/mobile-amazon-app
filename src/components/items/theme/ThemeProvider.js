import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';

import { selectedTheme } from '../../../redux/slices/selectors';

const ThemeProvider = ({ children }) => {
  const themeType = useSelector(selectedTheme);
  const theme = themeType === 'light' ? { background: '#1B1212' } : { background: '#ffffff' };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme ? 'light' : 'dark'} />
      {children}
    </SafeAreaView>
  )};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ThemeProvider;
