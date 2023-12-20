import { StyleSheet ,Text, View, Button, Image, SafeAreaView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { shareAsync } from 'expo-sharing';
import { Camera } from 'expo-camera';

export const CameraCmp = () => {
    const cameraRef = useRef();
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camImage, setCamImage] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const mediaLibrary = await MediaLibrary.requestPermissionsAsync();

      setHasMediaLibraryPermission(mediaLibrary.status === 'granted');
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  if (hasCameraPermission === false) return <Text>No access to camera</Text>

  const takePicture = async () => {
    let newPhoto = await cameraRef.current.takePictureAsync({
      quality: 1,
      base64: true,
      exif: false,
    });
    setCamImage(newPhoto);
  };

  let sharePic = () => shareAsync(camImage.uri).then(() => setCamImage(undefined));
  let savePhoto = () =>  MediaLibrary.saveToLibraryAsync(camImage.uri).then(() => setCamImage(undefined));

  if (camImage) {
    return (
      <SafeAreaView style={styles.imageContainer}>
        <Image style={styles.preview} source={{ uri: 'data:image/jpg;base64,' + camImage.base64 }} />
        
        <Button title="Share" onPress={sharePic} />
        {hasMediaLibraryPermission ? ( <Button title="Save" onPress={savePhoto} /> ) : undefined}
        <Button title="Discard" onPress={() => setCamImage(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <Camera style={{flex: 1 }} ref={cameraRef}>
            <View style={styles.buttonContainer}>
                <Button title="Take Pic" onPress={takePicture} />
            </View>
        </Camera>
    </SafeAreaView>
  );
}

export default CameraCmp;

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF',
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
  