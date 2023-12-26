import { StyleSheet ,Text, View, Button, TextInput, Image, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { shareAsync } from 'expo-sharing';
import { Camera } from 'expo-camera';

export const CameraCmp = () => {
    const cameraRef = useRef();
    const [camImage, setCamImage] = useState(null);
    const [comment, setComment] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
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
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ width: "100%" }}>
              <TextInput
                style={styles.commentSection}
                onChangeText={(text) => setComment(text)}
                value={comment}
                placeholder="What's your story?"
              />
          </KeyboardAvoidingView>
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
      marginTop: 'auto',
      padding: 5,
      backgroundColor: '#fff',
    },
    preview: {
      alignSelf: 'stretch',
      flex: 1,
    },
    commentSection: {
      height: 50,
      fontSize: 18,
      borderBottomWidth: .3,
      padding: 5,
    },
});
  