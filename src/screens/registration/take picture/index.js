import React, { useState, useEffect, useRef } from 'react';
import jwt_decode from 'jwt-decode';

import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Button,
  Image,
  ScrollView,
  SafeAreaView,
  Keyboard,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { Camera, CameraType } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { styles } from './styles';

export default function Upload({ navigation }) {
  const [commentInput, setCommentInput] = useState('');
  const [image, setImage] = useState(null);

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [uploadResponse, setUploadResponse] = useState();

  const [camera, setCamera] = useState(true);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(false);

  const cameraRef = useRef();
  const [camImage, setCamImage] = useState(null);
  // const [type, setType] = useState(CameraType.back);

  const [hasPermission, setHasPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(null);

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      quality: 1,
      nodata: true,
      compressImageQuality: 0.5,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token && token !== 'undefined' && token !== '') {
        const decoded = jwt_decode(token);
        setToken(decoded);
      }
    } catch (e) {
      console.log(e, 'Error when trying to retrieve the JWT');
    }
  };

  useEffect(() => {
    retrieveToken();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const mediaLibrary = await MediaLibrary.requestPermissionsAsync();

      setHasPermission(status === 'granted');
      setHasMediaLibraryPermission(mediaLibrary.status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const SwitchDevice = () => {
    return (
      <View onPress={() => setCamera(!camera)}>
        <Button
          title={`Switch to ${!camera ? 'Photo Library' : 'Camera'}`}
          onPress={() => setCamera(!camera)}></Button>
      </View>
    );
  };

  const uploads = async () => {
    const body = new FormData();
    
    if (commentInput === '' || image === null) {
      Alert.alert(
        'Review form incorrect',
        'Please type in a comment and select your picture',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
      return false;
    }

    body.append('user', token.id);
    body.append('description', commentInput);
    body.append('assignment', {
      uri: image,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    sendNewPost(body);
  };

  const sendNewPost = async (body) => {
    setLoadingUpload(true);

    return await fetch('http://192.168.0.169:4000/api/v1/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body,
    })
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data);
        if (data.success) {
          navigation.navigate('Home');
          setUploadResponse(data);
          setUploadError(null);
          setLoadingUpload(false);
        } else {
          setUploadResponse(null);
          setUploadError(data.message);
        }
      })
      .then((_) => setLoadingUpload(false));
  };

  const takePicture = async () => {
    let newPhoto = await cameraRef.current.takePictureAsync({
      quality: 1,
      base64: true,
      exif: false,
    });
    setCamImage(newPhoto);
  };

  if (camImage) {
    let sharePic = () => {
      shareAsync(camImage.uri).then(() => setImage(undefined));
    };

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(camImage.uri).then(() => {
        setImage(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.imageContainer}>
        <Image
          style={styles.preview}
          source={{ uri: 'data:image/jpg;base64,' + camImage.base64 }}></Image>
        <Button title="Share" onPress={sharePic} />
        {hasMediaLibraryPermission ? (
          <Button title="Save" onPress={savePhoto} />
        ) : undefined}
        <Button title="Discard" onPress={() => setCamImage(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <>
      {camera ? (
        <ScrollView>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <SwitchDevice />
            <Button title="Select your Image" onPress={handleChoosePhoto} />

            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 250, height: 225, marginTop: 5 }}
                onPress={Keyboard.dismiss}
              />
            )}
            <TouchableOpacity
              disabled={loading}
              style={styles.upload}
              onPress={uploads}
              underlayColor="#fff">
              <Text style={styles.label}>
                {loading ? 'Uploading...' : 'Upload'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          <Camera style={{ borderWidth: 1, flex: 1 }} ref={cameraRef}>
            <View style={styles.buttonContainer}>
              <Button title="Take Pic" onPress={takePicture} />
            </View>
            <StatusBar style="auto" />
            <SwitchDevice />
          </Camera>
        </View>
      )}
    </>
  );
}
