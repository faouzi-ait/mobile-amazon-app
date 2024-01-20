import * as UI from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';

import { ThemeProvider, Button, Loader } from '../../../components'; 

import { useCreatePostMutation } from '../../../redux/apiServices/postsApi';

import { compressedImage } from '../../../utils'

export const Library = ({ navigation }) => {
  const [post, setComment] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const [createPost, { data, error, isLoading }] = useCreatePostMutation();

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

  const uploadImages = async () => {
    if (!selectedImages || !post) {
      alert(`Please specify a caption`);
      return false;
    }

    const file = await compressedImage(selectedImages[0]);

    try {
      const formData = new FormData();
      formData.append(`post`, post);
      formData.append(`image`, {
        uri: file.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const data = await createPost(formData);

      if(data.data.success) {
        setSelectedImages([]);
        setConfirmationMessage(null)
        setComment(null);
        navigation.navigate('Home');
      }
    } catch (error) {
        console.error(error.data);
    }
  };

  const removeImage = (i) => setSelectedImages((img) => img.filter((_, index) => index !== i));

  return (
      <ThemeProvider>
        {selectedImages.length === 0 && (
          <Button style={[styles.button, styles.format]} label="Select your Image" onPress={pickImage} />
        )}

        {!isLoading ? 
          <UI.View style={styles.dislpayLayout}>
              {selectedImages.map((uri, index) => (
                  <UI.TouchableOpacity key={index} onPress={() => removeImage(index)}>
                      <UI.View style={{ position: 'relative' }}>
                          <UI.Image source={{ uri }} style={styles.images} />
                          <UI.TouchableOpacity
                              onPress={() => removeImage(index)}
                              style={styles.deleteBtn}>
                              <UI.Text style={styles.deleteText}>X</UI.Text>
                          </UI.TouchableOpacity>
                      </UI.View>
                  </UI.TouchableOpacity>
              ))}

              {selectedImages.length !== 0 && <UI.KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : 'height'} style={{ width: '100%' }}>
                <UI.TextInput
                  value={post}
                  style={styles.postInput}
                  placeholderTextColor='#fff'
                  placeholder="Add a caption"
                  onChangeText={(text) => setComment(text)}
                />
                <Button label={`${isLoading ? 'Posting...' : 'Create Post'}`} style={[styles.button2]} textStyle='#fff' onPress={uploadImages} disabled={isLoading} />
              </UI.KeyboardAvoidingView>}

              {confirmationMessage && (
                <UI.View style={styles.upload}>
                  <UI.Text style={{ color: 'red' }}>{confirmationMessage}</UI.Text>
                </UI.View>
              )}
            </UI.View>
            :
            <Loader />
          }
      </ThemeProvider>
  )
}

const { width } = UI.Dimensions.get('window');
const itemSize = width - 30;

const styles = UI.StyleSheet.create({
  dislpayLayout: { 
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center'
  },
  upload: {
      alignItems: 'center',
      justifyContent: 'center',
      height: '75%',
      color: 'white'
  },
  deleteText: {
    color: 'white', 
    fontSize: 10, 
    fontWeight: 'bold'
  },
  deleteBtn: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    position: 'absolute', 
    top: '3%', 
    left: '3%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    width: '10%', 
    height: '10%', 
    borderRadius: '50%' 
  },
  button: {
    backgroundColor: 'black',
  },
  button2: {
    height: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  format: { 
    height: '8%', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#fff' 
  },
  postInput: { 
    color: 'white', 
    borderWidth: 1, 
    borderColor: '#fff', 
    padding: 15, 
    margin: 15 
  },
  images: { 
    width: itemSize, 
    height: itemSize, 
    margin: 5,
    marginBottom: 0, 
    borderWidth: 3, 
    borderRadius: 5, 
    borderColor: 'rgba(255, 255, 255, 1)' 
  },
  text: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Library;