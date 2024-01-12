import { View, Alert } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";

import { isLiked, hasReview, isFavorites, showIcon } from '../../../utils'

import * as api from '../../../redux/apiServices/postsApi';

import { styles } from '../postItems/styles'

const PostActions = ({ data, userId, color, isLoggedIn, navigation, setModalVisible }) => {
    const [likePost] = api.useLikePostMutation();
    const [favoritePost] = api.useFavoritePostMutation();
    const [userFavoritePost] = api.useUserFavoritePostMutation();

    const _userLoggeInAlert = () =>
        Alert.alert("Oops...", "You must first log in",
        [
            { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
            { text: "Login", onPress: () => navigation.navigate("Login") }
        ], { cancelable: true }
    );

  return (
    <View style={styles.postInfo}>
        <Ionicons name={showIcon('md-heart', isLiked(data, userId))} size={26} color={color} onPress={() => isLoggedIn ? likePost(data?._id) : _userLoggeInAlert()} />
        <Ionicons name={showIcon('ios-chatbubbles', hasReview(data, userId))} size={26} color={color} style={styles.reviews} onPress={() => setModalVisible(true)} />
        <Ionicons name={showIcon('ios-share', false)} size={26} color={color} />
        <Ionicons name={showIcon('ios-bookmark', isFavorites(data, userId))} size={26} color={color} style={styles.favorites} onPress={() => {
                if(isLoggedIn) {
                    favoritePost(data?._id);
                    userFavoritePost(data?._id);
                } else {
                    _userLoggeInAlert();
                }
            }}
        />
    </View>
  )
}

export default PostActions