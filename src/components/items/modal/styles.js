import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    modal: {
      margin: 0,
    },
    container: {
      flex: 1,
  
      backgroundColor: 'white',
  
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 0,
    },
    dragIndicator: {
      width: 70,
      height: 5,
      backgroundColor: '#000',
      borderRadius: 5,
      alignSelf: 'center',
      marginTop: 10,
    },
  });