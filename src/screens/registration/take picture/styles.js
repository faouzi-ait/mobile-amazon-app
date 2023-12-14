import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  input: {
    width: '93%',
    height: 50,
    marginTop: 10,
    padding: 10,
    fontSize: 18,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    zIndex: 99999,
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
  videoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1,
  },
});
