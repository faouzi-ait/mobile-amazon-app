import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { ThemeProvider, ToggleThemeButton, Button } from '../../components'; 

const Album = ({ navigation }) => {
    return (
      <ThemeProvider>
        <Text>Album Page</Text>
        <TouchableOpacity>
          <Button label="Go to Story" style={styles.button} textStyle={styles.text} onPress={() => navigation.navigate('Story')} />
        </TouchableOpacity>
        <ToggleThemeButton />
        </ThemeProvider>
    );
  };

  const styles = StyleSheet.create({
    button: {
      width: 175,
      margin: 10,
      padding: 10,
      borderRadius: 5,
      backgroundColor: '#3498db',
    },
    text: {
      color: '#fff',
      textAlign: 'center',
    },
  });

  
  export default Album;
