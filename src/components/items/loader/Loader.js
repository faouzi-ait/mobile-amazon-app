import * as UI from 'react-native'
import React from 'react'

const Loader = () => {
  return (
    <UI.View style={styles.upload}>
        <UI.ActivityIndicator size="large" color="rgba(255, 255, 255, 1)" />
        <UI.Text style={styles.label}>Uploading</UI.Text>
    </UI.View>
  )
}

const styles = UI.StyleSheet.create({
  upload: {
      alignItems: 'center',
      justifyContent: 'center',
      height: '75%',
      color: 'white'
  },
  label: {
      color: 'white', 
      marginTop: 2,
  }
});

export default Loader;