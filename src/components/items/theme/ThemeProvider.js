import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';

import { selectedTheme } from '../../../redux/slices/selectors';

const ThemeProvider = ({ children }) => {
  const themeType = useSelector(selectedTheme);
  const theme = themeType === 'light' ? { background: '#1B1212' } : { background: '#ffffff' };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle='dark-content' />
      {children}
    </ScrollView>
  )};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ThemeProvider;
