// components/ToggleThemeButton.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { toggleTheme } from '../../../redux/slices/themeSlice';

const ToggleThemeButton = () => {
  const dispatch = useDispatch();

  const handleToggleTheme = () => dispatch(toggleTheme())
  
  return (
    <TouchableOpacity style={styles.button} onPress={handleToggleTheme}>
      <Text style={styles.text}>Toggle Theme</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
    margin: 10,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default ToggleThemeButton;
