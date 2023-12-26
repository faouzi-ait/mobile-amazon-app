import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { ThemeProvider, ToggleThemeButton, Button } from '../../components'; 

import { useGetMemosQuery } from '../../redux/apiServices/memoApi'

const Album = ({ navigation }) => {
  const { data, error, isLoading } = useGetMemosQuery();

  if(isLoading) {
    <ThemeProvider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Content is loading...</Text>
      </View>
    </ThemeProvider>
  }

    return (
      <ThemeProvider>
        <Text>Login</Text>
        {data?.map(item => 
          <View key={item.title}>
            <Text>{item.title}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
        <TouchableOpacity>
          <Button label="Go to NewPost" style={styles.button} textStyle={styles.text} onPress={() => navigation.navigate('NewPost')} />
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
