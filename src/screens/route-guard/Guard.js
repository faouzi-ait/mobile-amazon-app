import * as UI from 'react-native'
import React from 'react';

import { Button } from '../../components'

const Guard = ({ navigation, message }) => {
  return (
    <UI.View style={styles.container}>
      <UI.Text style={styles.label}>{message}</UI.Text>
      <UI.View style={styles.buttons}>
        <Button style={[styles.button, styles.modeContainerMargin]} label="Login" onPress={() => navigation.navigate('Login')} />
        <Button style={[styles.button, styles.modeContainerMargin]} label="Register" onPress={() => navigation.navigate('Registration')} />
      </UI.View>
    </UI.View>
  )
}

const styles = UI.StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  label: { 
    color: '#fff', 
    fontSize: '18%', 
    marginBottom: '5%' 
  },
  buttons: { 
    flexDirection: 'row', 
    gap: '10%' 
  },
  modeContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: '5%' 
  },
  modeContainerMargin: {
    marginLeft: 1,
    marginRight: 1,
    borderWidth: 1, 
    borderColor: '#fff',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default Guard;