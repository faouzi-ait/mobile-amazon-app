import { View, TextInput, Button, Image, ScrollView, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';

import { useCreateUserMutation } from '../../redux/apiServices/authApi'

import { styles } from './styles'

export const register = ['firstname', 'lastname', 'phone', 'username', 'password'];

export const Registration = ({ navigation }) => {
  const [createUser] = useCreateUserMutation();

  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({});

  const handleChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData, [fieldName]: value,
    }));
  };

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      allowsMultipleSelection: false,
      selectionLimit: 4,
      aspect: [4, 3],
      base64: true,
      quality: 1,
      nodata: true,
      compressImageQuality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleRegistration = async () => {
    const body = new FormData();
    const { firstname, lastname, phone, username, password } = formData;

    if(!username || !password) return false; // Quick validation to avoid app

    try {
      body.append('firstname', firstname);
      body.append('lastname', lastname);
      body.append('phone', phone);
      body.append('username', username);
      body.append('password', password);
      body.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      await createUser(body).unwrap();
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {register.map((fieldName, i) => (
          <TextInput
            key={i}
            style={styles.input}
            placeholder={fieldName}
            onChangeText={(text) => handleChange(fieldName, text)}
          />
        ))}

        <Button title={`${image ? 'Add a different Image' : 'Add your profile image'}`} onPress={handleChoosePhoto} />
        
        {image && 
          <View>
            <Button title="Remove Image" onPress={() => setImage(null)} />
            <Image
              source={{ uri: image }}
              style={{ width: 250, height: 225, marginTop: 5 }}
              onPress={Keyboard.dismiss}
            />
          </View>
        }

        <Button title="Register" onPress={handleRegistration} />

        <View style={styles.btnContainer}>
          <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
          <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
        </View>
      </View>
    </ScrollView>
  )
}

export default Registration;