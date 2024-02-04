// import { StyleSheet, FlatList, Image, KeyboardAvoidingView, TextInput, View, Dimensions, TouchableOpacity } from 'react-native';
import * as UI from 'react-native';
import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';

import { Button, Loader } from '../../../components'; 

import { useCreatePostMutation } from '../../../redux/apiServices/categoryApi';

import * as MediaLibrary from 'expo-media-library';

import { compressedImage } from '../../../utils'

const CameraRollScreen = ({ navigation, mode }) => {
  const [photos, setPhotos] = useState([]);
  const [post, setComment] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [createPost, { data, error, isLoading }] = useCreatePostMutation();

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== 'granted') {
        console.error('Permission denied to access media library');
        return;
      }

      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        include: ['filename', 'uri'],
        first: 30,
        after: hasNextPage ? photos[photos.length - 1]?.id : undefined,
      });

      setHasNextPage(media.hasNextPage);
      setPhotos((prevPhotos) => (hasNextPage ? [...prevPhotos, ...media.assets] : prevPhotos));

      if (!selectedImage && media.assets.length > 0) {
        setSelectedImage(media.assets[0]);
      }
      
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const uploadImages = async () => {
    if (!selectedImage || !post) {
      alert(`Please specify a caption`);
      return false;
    }
    
    const asset = await MediaLibrary.getAssetInfoAsync(selectedImage?.id, {})
    const file = await compressedImage(asset.localUri);
    
    try {
      const body = new FormData();
      body.append('post', post);
      body.append('image', {
        uri:  file.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const resp = await createPost(body).unwrap();

      if(resp?.success) {
        setComment(null);
        setModalVisible(false)
        navigation.navigate('Home');
      }
      
    } catch (error) {
      console.error(error);
    }
};

if(isModalVisible) {
  return (
    <>
      {!isLoading ? 
        <Modal
          transparent={true}
          animationType="slide"
          visible={isModalVisible}
          swipeDirection="down"
          animationIn="slideInUp"
          animationOut="slideOutDown"
          onRequestClose={() => setModalVisible(false)}
          onSwipeComplete={() => setModalVisible(false)}>
            <UI.View style={styles.modalContainer}>
              <UI.View style={styles.modalContent}>
                <UI.Image source={{ uri: selectedImage?.uri }} style={[styles.selectedImage, styles.modalImage ]} />
                  <UI.KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : 'height'}>
                    <UI.TextInput
                      value={post}
                      style={[styles.commentSection, styles.commentFormat]}
                      placeholderTextColor='black'
                      placeholder="Add a caption"
                      onChangeText={(text) => setComment(text)}
                    />
                  </UI.KeyboardAvoidingView>
                  <Button label={`${isLoading ? 'Posting...' : 'Send Post'}`} style={[styles.button, { alignItems: 'center' }]} textStyle='#fff' onPress={uploadImages} disabled={isLoading} />
              </UI.View>
            </UI.View>
        </Modal> : <Loader />}
    </>
)}

return (
    <>
      <UI.View style={styles.container}>
        <UI.View style={styles.layout}>
            {selectedImage && (
              <UI.View style={styles.selectedImageContainer}>
                  <UI.Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
              </UI.View>
            )}
          <UI.View style={styles.modalButton}>
            <Button label="Select this picture" style={styles.button} onPress={() => setModalVisible(true)} />
          </UI.View>
        </UI.View>
      </UI.View>
      <UI.View style={{ height: '40%' }}>
        <UI.FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UI.TouchableOpacity onPress={() => setSelectedImage(item)}>
              <UI.Image source={{ uri: item.uri }} style={styles.photo} />
            </UI.TouchableOpacity>
          )}
          numColumns={4}
          onEndReached={fetchPhotos}
          onEndReachedThreshold={0.1}
        />
      </UI.View>
    </>
  );
};

const { width } = UI.Dimensions.get('window');
const itemSize = width / 4;

const styles = UI.StyleSheet.create({
  modalContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    marginTop: '10%',
  },
  modalContent: {
    width: '95%',
    height: '50%',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  modalImage: { 
    borderTopLeftRadius: 10, 
    borderTopRightRadius: 10 
  },
  modalButton: { 
    flexDirection: 'row', 
    marginTop: 'auto', 
    marginBottom: 10,  
    justifyContent: 'center' 
  },
  container: {
    flex: 1,
    position: 'relative',
    paddingTop: 20,
  },
  layout: { 
    position: 'relative', 
    height: '100%', 
    alignItems: 'center', 
    padding: 9 
  },
  photo: {
    width: itemSize,
    height: itemSize,
    marginBottom: 1,
  },
  selectedImageContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  commentSection: {
    width: '100%',
    fontSize: 14,
    color: '#fff',
    backgroundColor: 'white'
  },
  commentFormat: { 
    padding: '4%', 
    color: 'black' 
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    fontWeight: 'bold',
    marginTop: '3%',
    padding: '3%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'black',
  },
  upload: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '75%',
    color: 'white'
},
});

export default CameraRollScreen;
