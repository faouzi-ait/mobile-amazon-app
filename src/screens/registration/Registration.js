import { View, TextInput, Button, Image, Text, ScrollView, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { useCreateUserMutation } from '../../redux/apiServices/authApi'

import { ThemeProvider, ToggleThemeButton } from '../../components'; 
import { selectedTheme } from '../../redux/slices/selectors';
import { lightStyles, darkStyles } from '../../utils'

import AnimatedLoader from 'react-native-animated-loader';

import { styles } from './styles'

export const register = ['firstname', 'lastname', 'phone', 'username', 'password'];

export const Registration = ({ navigation }) => {
  const [createUser, { data, error, isLoading }] = useCreateUserMutation();
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const theme = useSelector(selectedTheme);

  const inputStyle = theme === 'dark' ? darkStyles : lightStyles;
  const placeholderStyle = theme === 'dark' ? '#fff' : '#000';

  const handleChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData, [fieldName]: value,
    }));
  };

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
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
    
    // if(!username || !password) return false; // Quick validation to avoid app
    
    try {
      body.append('firstname', firstname);
      body.append('lastname', lastname);
      body.append('phone', phone);
      body.append('username', username);
      body.append('password', password);
      
      if(image) {
        body.append('image', {
          uri: image,
          type: 'image/jpeg',
          name: 'photo.jpg',
        });
      }
      
      await createUser(body).unwrap();
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  };
  
  if(isLoading) {
    return (
      <View style={styles.container}>
        <AnimatedLoader
          visible={true}
          overlayColor="rgba(255,255,255,0.75)"
          animationStyle={styles.lottie}
          speed={1}>
            {/* <Text style={{ margin: 5 }}>Logging you in....</Text> */}
        </AnimatedLoader>
      </View>
    )}

  return (
    <ThemeProvider>
      <ScrollView>
        <View style={styles.container}>
          {register.map((fieldName, i) => (
            <TextInput
              key={i}
              placeholderTextColor={placeholderStyle}
              style={[styles.input, inputStyle]}
              placeholder={fieldName}
              onChangeText={(text) => handleChange(fieldName, text)}
            />
          ))}

          <Text style={{ textAlign: 'center' }}>{error?.data?.error}</Text>
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
        <ToggleThemeButton />
        </View>
      </ScrollView>
    </ThemeProvider>
  )
}

export default Registration;