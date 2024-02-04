import { View, Text, Image, TouchableOpacity, Pressable, Platform } from 'react-native'
import React from 'react';

import { styles } from './styles'

const Category = ({ product, navigation }) => {
    const { url, name, _id } = product;

    return (
        <View style={styles.itemPadding}>
            <Pressable onPress={() => navigation.navigate('Search', { parameter: _id })}>
                <Text>{name}</Text>
            </Pressable>
        </View> 
    );
};

export default Category
