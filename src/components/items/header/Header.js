import { FlatList, View, Text, Platform, Dimensions, StyleSheet, TextInput, Pressable } from 'react-native';
import React, { useRef } from 'react';
import { Ionicons } from "@expo/vector-icons";

import { Category } from '../../../components';

import { useGetCategoriesQuery } from '../../../redux/apiServices/categoryApi';

const { height, width } = Dimensions.get('window');

const Header = ({ navigation }) => {
    const textRef = useRef(null);
    const { data, error, isLoading, refetch } = useGetCategoriesQuery();
    
    const handleSearch = () => {
      console.log('Input value:', textRef.current.value);
      navigation.navigate('Search')
    };

    return (
        <View style={{ backgroundColor: '#96E096' }}>
            <View style={{ position: 'relative', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TextInput
                    ref={textRef}
                    onChangeText={(text) => textRef.current.value = text}
                    style={[styles.input]}
                    placeholderTextColor='#000'
                    placeholder="Search any products..."
                />
                <Pressable style={{ padding: 7, marginTop: 'auto', position: 'absolute', right: width / 10, bottom: 0 }} onPress={handleSearch}>
                    <Ionicons name='ios-search' size={24} color='#000' />
                </Pressable>
            </View>
            <FlatList
                horizontal
                keyExtractor={(item) => item._id}
                data={data?.items?.filter(item => item?.showOnNav) ?? []}
                renderItem={({ item }) => <Category product={item} navigation={navigation} />}
                contentContainerStyle={styles.listStyle}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    listStyle: { 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingTop: height * .02,
        paddingBottom: height * .02 
    },
    input: {
        width: '80%',
        marginTop: height * .065, 
        padding: 10,
        borderColor: 'lightgrey',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',

        shadowOpacity: 0.15,
        shadowRadius: 5,
        shadowOffset: {
          height: 2,
          width: 0,
        },
    },
});