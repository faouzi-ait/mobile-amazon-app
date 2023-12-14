import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '20%'
    },
    input: {
      width: '80%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
      paddingLeft: 10,
    },
    btnContainer: {
      flexDirection: 'row'
    },
    img: {
      width: 150,
      height: 150
    },
    upload: {
      width: '88%',
      // marginRight: 15,
      marginLeft: 0,
      marginTop: 10,
      padding: 20,
      paddingBottom: 20,
      backgroundColor: '#68a0cf',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#fff',
    },
    label: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 20,
    },
    buttonContainer: {
      backgroundColor: '#fff',
      alignSelf: 'flex-end',
    },
    imageContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    preview: {
      alignSelf: 'stretch',
      flex: 1,
    },
  });