import { View, Text, Image, ScrollView, StyleSheet } from 'react-native'
import React from 'react'

import { useGetUserPhotoQuery } from '../../../redux/apiServices/authApi';

import { styles } from './styles'

const ReviewList = ({ review, color }) => {
    const reviewPhoto = useGetUserPhotoQuery(review.user);
    
    return (
        <ScrollView>
            <View style={styles.reviewList}>
                <Image source={{ uri: reviewPhoto?.currentData?.photo }} style={styles.reviewImage} />
                <View>
                    <Text style={[styles.postText, { color }]}>@{review.username}</Text>
                    <Text style={[styles.postText, { color }]}>{review.comment}</Text>    
                </View>
            </View>
        </ScrollView>
    )
}



export default ReviewList