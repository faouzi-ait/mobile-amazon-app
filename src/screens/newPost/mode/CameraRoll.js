import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, FlatList, Image, KeyboardAvoidingView, TextInput, View, Dimensions, TouchableOpacity } from 'react-native';
import { ThemeProvider, ToggleThemeButton, Button } from '../../../components'; 

import * as MediaLibrary from 'expo-media-library';

const CameraRollScreen = () => {
  const [photos, setPhotos] = useState([]);
  const [comment, setComment] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const pageSize = 30; // Number of photos to fetch per page

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
        first: pageSize,
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

return (
    <View style={styles.container}>
        <View style={{ position: 'relative', height: '51%', alignItems: 'center', padding: 9 }}>
            {selectedImage && (
                <>
                    <View style={styles.selectedImageContainer}>
                        <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ width: "100%" }}>
                            <TextInput
                                style={styles.commentSection}
                                onChangeText={(text) => setComment(text)}
                                value={comment}
                                placeholder="What are you up to?"
                            />
                        </KeyboardAvoidingView>
                    </View>
                    <Button label="SEND POST" style={styles.button} textStyle={styles.text} onPress={() => alert(comment)} />
                </>
            )}
        </View>
        <Text />
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
  );
};

const { width } = Dimensions.get('window');
const itemSize = width / 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
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
    backgroundColor: 'white',
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: 295,
  },
  commentSection: {
    width: '75%',
    fontSize: 18,
    padding: 8,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 2,
    right: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#3498db',
  },
});

export default CameraRollScreen;
