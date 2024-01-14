import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';

import { StyleSheet, FlatList, Image, KeyboardAvoidingView, TextInput, View, Text, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from '../../../components'; 

import { useCreatePostMutation } from '../../../redux/apiServices/postsApi';

import * as MediaLibrary from 'expo-media-library';

import { compressedImage } from '../../../utils'

const CameraRollScreen = ({ navigation , color }) => {
  const [photos, setPhotos] = useState([]);
  const [post, setComment] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [createPost, { data, error }] = useCreatePostMutation();

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
      alert(`Please select an image and a caption to upload`);
      return false;
    }
    setIsLoading(true);
    
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
      
      setIsLoading(false)
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false)
    }
};

if(isModalVisible) {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isModalVisible}
      swipeDirection="down"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onRequestClose={() => setModalVisible(false)}
      onSwipeComplete={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={{ uri: selectedImage?.uri }} style={[styles.selectedImage, styles.modalImage ]} />
              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : 'height'}>
                <TextInput
                  value={post}
                  style={[styles.commentSection, styles.commentFormat]}
                  placeholderTextColor='black'
                  placeholder="Add a caption"
                  onChangeText={(text) => setComment(text)}
                />
              </KeyboardAvoidingView>
              <Button label={`${isLoading ? 'Posting...' : 'Send Post'}`} style={styles.button} textStyle={styles.text} onPress={uploadImages} disabled={isLoading} />
          </View>
        </View>
    </Modal>
  )
}

if(isLoading) {
  return (
    <View style={styles.upload}>
      <ActivityIndicator size="large" color="rgba(255, 255, 255, 1)" />
      <Text style={{ color: 'white' }}>Uploading Post...</Text>
    </View>
  )
}

return (
    <>
      <View style={styles.container}>
        <View style={styles.layout}>
            {selectedImage && (
              <View style={styles.selectedImageContainer}>
                  <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
              </View>
            )}
          <View style={styles.modalButton}>
            <Button label="Select this picture" style={styles.button} textStyle={{ color, fontWeight: 'bold' }} onPress={() => setModalVisible(true)} />
          </View>
        </View>
      </View>
      <View style={{ height: '40%' }}>
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedImage(item)}>
              <Image source={{ uri: item.uri }} style={styles.photo} />
            </TouchableOpacity>
          )}
          numColumns={4}
          onEndReached={fetchPhotos}
          onEndReachedThreshold={0.1}
        />
      </View>
    </>
  );
};

const { width } = Dimensions.get('window');
const itemSize = width / 4;

const styles = StyleSheet.create({
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
