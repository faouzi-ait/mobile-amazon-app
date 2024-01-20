import { Image, View, Text, Alert, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeProvider, ToggleThemeButton, Button } from '../../components'; 

import { currentUser } from '../../redux/slices/selectors';
import { useGetUserPhotoQuery, useUpdateUserPhotoMutation, useUpdateUserDetailsMutation } from '../../redux/apiServices/authApi';

import { isUserLoggedIn } from '../../redux/slices/authSlice';
import { setLogout } from '../../redux/slices/authSlice';

import { compressedImage } from '../../utils'

const Update = ({ navigation }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstname: null,
    lastname: null,
    phone: null
  });
  const [selectedImages, setSelectedImages] = useState([]);
  
  const auth = useSelector(isUserLoggedIn);
  const userId = useSelector(currentUser);
  
  const loggedInUserPhoto = useGetUserPhotoQuery(userId);
  const [updateUserPhoto, { data, error, isLoading }] = useUpdateUserPhotoMutation();
  const [updateUserDetails, infos] = useUpdateUserDetailsMutation();

 const update = ['firstname', 'lastname', 'phone'];

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access media library was denied');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: false,
      });

      // const sum = result.assets?.reduce((total, item) => total + item.fileSize, 0);
      // let fileSizeMB = sum / (1024 ** 2);
      // if (fileSizeMB > 5) return alert(`Total image size can not exceed 5MB`);

      if (!result.canceled && result.assets) {
        const selectedImageURIs = result.assets.map((asset) => asset.uri);
        setSelectedImages((prevImages) => [...prevImages, ...selectedImageURIs]);
      }
    } catch (error) {
      console.error('Error picking images:', error.message);
    }
  };

  const onLogout = async () => {
    dispatch(setLogout());
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
  }

  const uploadPhoto = async () => {
    if (!selectedImages.length) {
      alert(`Please specify a caption`);
      return false;
    }

    const file = await compressedImage(selectedImages[0]);

    try {
      const formData = new FormData();
      formData.append(`image`, {
        uri: file.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const { data } = await updateUserPhoto(formData);

      if(data?.success) {
        setSelectedImages([]);
      }

    } catch (error) {
      console.log(error);
  }
  }

  const updateDetails = async () => {
    if (!formData.firstname || !formData.lastname || !formData.phone) {
      alert(`Please fill out the fields`);
      return false;
    }

    const req = await updateUserDetails({
      firstname: formData.firstname,
      lastname: formData.lastname,
      phone: formData.phone,
    });
  }

  const handleChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData, [fieldName]: value,
    }));
  };

  return (
    <ThemeProvider>
      {/* <ToggleThemeButton /> */}

      {auth && (
        <>
          <Image source={{ uri: !selectedImages.length ? loggedInUserPhoto?.currentData?.photo : selectedImages[0] }} resizeMode='cover' style={[styles.postPhoto]} />
          <View style={styles.pictureButton}>
            {!selectedImages.length ? 
              <Ionicons name='ios-camera-outline' size={35} color='#fff' onPress={pickImage} /> 
              : 
              <Ionicons name='md-close-circle' size={35} color='#fff' onPress={() => setSelectedImages([])} />
            }
          </View>
          {!isLoading && 
          <Text style={{ alignSelf: 'center' }}>
            {selectedImages.length && 
              <Button label="Update Photo" style={styles.update} textStyle={'#fff'} onPress={uploadPhoto} disabled={isLoading} />
            }
          </Text>}
          {isLoading && 
          <Text style={styles.uploadMessage}>
            <Text style={{ color: '#fff' }}>Updating Profile Photo...</Text>
          </Text>}
          <View style={styles.container}>
            {update.map((fieldName, i) => (
              <TextInput
                key={i}
                placeholderTextColor={'#fff'}
                style={[styles.input]}
                placeholder={fieldName}
                onChangeText={(text) => handleChange(fieldName, text)}
              />
            ))}
            {infos?.isLoading ?
              <Text style={styles.uploadMessage}>
                <ActivityIndicator />
                <Text style={{ color: '#fff' }}>Updating Profile Details...</Text>
              </Text> 
              : 
              <Button label="Update Your Details" style={styles.update} textStyle={'#fff'} onPress={updateDetails} disabled={infos?.isLoading} />
            }
          </View>
        </>
      )}

      {auth && 
        <View style={styles.logoutButton}>
          <Ionicons name='ios-log-out' size={35} color='#fff' onPress={() => {
            Alert.alert("Want to Log Out?", "Really?",
              [
                  { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
                  { text: "Logout", onPress: () => onLogout()}
              ], { cancelable: true }
            );
          }} />
        </View>
      }
      
      {!auth && <Button label="Go to Login" style={styles.button} textStyle={styles.text} onPress={() => navigation.navigate('Login')} />}
      {!auth && <Button label="Go to Registration" style={styles.button} textStyle={styles.text} onPress={() => navigation.navigate('Registration')} />}
    </ThemeProvider>
  );
}

export default Update;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    width: '75%',
    margin: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#3498db',
  },
  update: { 
    padding: 10, 
    textAlign: 'center', 
    fontWeight: 'bold', 
    borderWidth: 2, 
    borderColor: '#fff', 
    borderRadius: 5 
  },
  input: {
    width: '80%',
    height: 40,
    paddingLeft: 10,
    color: '#fff',
    borderColor: '#fff',
    borderWidth: 2,
    marginBottom: 20,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
  postPhoto: { 
    width: 250, 
    height: 250,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 15,
    borderRadius: '125%',
    borderWidth: '5px',
    borderColor: 'white',
  },
  uploadMessage: { 
    flexDirection: 'row', 
    alignSelf: 'center', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  pictureButton: {
    position: 'absolute',
    top: '29%',
    right: '14%',
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
    height: 55,
    paddingLeft: 3,
    borderRadius: '60%',
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#000',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    right: '4%',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    paddingLeft: 3,
    borderRadius: '60%',
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#000',
  },
});