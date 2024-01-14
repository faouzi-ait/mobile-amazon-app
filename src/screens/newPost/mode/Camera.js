import { StyleSheet ,Text, View, Button, Pressable, TextInput, Image, SafeAreaView, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { shareAsync } from 'expo-sharing';
import { Camera } from 'expo-camera';

import { Ionicons } from "@expo/vector-icons";
import { useCreatePostMutation } from '../../../redux/apiServices/postsApi';

import { compressedImage } from '../../../utils'

export const CameraCmp = ({ navigation }) => {
    const cameraRef = useRef();
    const [camImage, setCamImage] = useState(null);
    const [comment, setComment] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
    const [createPost, { data, error }] = useCreatePostMutation();

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

  
  let sharePic = async () => {
    const file = await compressedImage(camImage?.uri);
    await shareAsync(file?.uri).then(() => setCamImage(undefined))
  }

  let uploadPost = async () => {
    if (!comment) {
      alert(`Please write a caption`);
      return false;
    }
    const file = await compressedImage(camImage?.uri);
    // MediaLibrary.saveToLibraryAsync(file.uri).then(() => setCamImage(undefined));
    console.log(file)
    try {
      const body = new FormData();
      body.append('post', comment);
      body.append('image', {
        uri:  file.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      // const resp = await createPost(body).unwrap();

      if(resp?.success) {
        setComment(null);
        setCamImage(null);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const Button = ({ label, disabled, onPress, ...rest }) => (
    <Pressable style={[styles.button, styles.modeContainerMargin]} onPress={onPress} disabled={disabled} {...rest}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );

  if (camImage) {
    return (
      <>
        <SafeAreaView style={styles.imageContainer}>
          <Image style={styles.preview} source={{ uri: 'data:image/jpg;base64,' + camImage.base64 }} />
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ width: "100%" }}>
              <TextInput
                value={comment}
                style={styles.commentSection}
                onChangeText={(text) => setComment(text)}
                placeholder="What's your story?"
                placeholderTextColor='#fff'
              />
          </KeyboardAvoidingView>
        </SafeAreaView>
        <View style={styles.modeContainer}>
          <Button label="Share" onPress={sharePic}/>
          {hasMediaLibraryPermission ? <Button label={"Post"} onPress={uploadPost} /> : undefined}
          <Button label="Discard" onPress={() => setCamImage(undefined)} />
        </View>
      </>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <Camera style={{flex: 1, alignItems: 'center' }} ref={cameraRef}>
            <View style={styles.buttonContainer2}>
                <Ionicons name='ios-camera-outline' size={32} color='#fff' onPress={takePicture} />
            </View>
        </Camera>
    </SafeAreaView>
  );
}

export default CameraCmp;

export const styles = StyleSheet.create({
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '3%',
    marginBottom: '3%'
  },
  modeContainerMargin: {
    marginLeft: 1,
    marginRight: 1,
  },
  button: {
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },

    container: {
      flex: 1,
      backgroundColor: '#FFF',
    },
    imageContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainer2: {
      width: 85,
      height: 85,
      marginTop: 'auto',
      marginBottom: '5%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '60%',
      borderWidth: 3,
      borderColor: '#fff',
      boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2)',
      backgroundColor: '#000',
    },
    preview: {
      flex: 1,
      alignSelf: 'stretch',
      margin: 0
    },
    commentSection: {
      height: 50,
      padding: 5,
      textAlign: 'center',
      color: '#fff',
      fontSize: 14,
      borderWidth: 1,
      borderColor: '#fff',
    },
    upload: {
      alignItems: 'center',
      justifyContent: 'center',
      height: '15%',
      color: 'white'
  },
});
