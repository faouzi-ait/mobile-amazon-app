import { View, Text, Image, Alert, StyleSheet, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import React, { useState } from 'react'
import { Modal } from '../../components'; 

import { selectedTheme, currentUser, loggedInStatus } from '../../redux/slices/selectors';
import { Ionicons } from "@expo/vector-icons";

import * as api from '../../redux/apiServices/postsApi'

const PostItem = ({ post, navigation }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const theme = useSelector(selectedTheme);
    const userId = useSelector(currentUser);

    const { isLoggedIn } = useSelector(loggedInStatus);
    
    const { data, error, isLoading } = api.useGetSinglePostQuery(post._id);
    const [likePost] = api.useLikePostMutation();
    const [favoritePost] = api.useFavoritePostMutation();
    const [userFavoritePost] = api.useUserFavoritePostMutation();

    const isDark = theme === 'dark'
    const colors = isDark ? '#fff' : '#000'

    const isLiked = (userId) => data?.post?.likes.includes(userId);
    const isFavorites = (userId) => data?.post?.favorites.includes(userId);
    
    const _showLikeIcon = () => {
        if(userId) {
            return `md-heart${isLiked(userId) ? '' : '-outline'}`
        } else {
            return 'md-heart-outline'
        }
    }

    const _showFavoritesIcon = () => {
        if(userId) {
            return `ios-bookmark${isFavorites(userId) ? '' : '-outline'}`
        } else {
            return 'md-bookmark-outline'
        }
    }

    const _likedPostString = (likes) => {
        if(isLiked(userId) && likes?.length > 1) {
            return `You and ${likes?.length - 1} other${likes?.length > 2 ? 's' : ''} liked this post.`
        } else if(isLiked(userId) && likes?.length === 1) {
            return 'You liked this post.'
        } else if(!isLiked(userId) && likes?.length > 0) {
            return `${likes?.length} person${likes?.length > 1 ? 's' : ''} liked this post`
        }
    }

    const testAlert = () =>
        Alert.alert("", "You must be logged in",
        [
            { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
            { text: "Login", onPress: () => navigation.navigate("Login") }
        ], { cancelable: true }
    );

    return (
        <View style={styles.postContainer}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image source={{ uri: data?.post.photo }} style={styles.postImage} />
            </TouchableOpacity>

            <View style={styles.postInfo}>
                <Ionicons name={_showLikeIcon()} size={26} color={colors} onPress={() => isLoggedIn ? likePost(data.post._id) : testAlert()} />
                <Ionicons name='ios-chatbubbles-outline' size={26} color={colors} style={styles.reviews} onPress={() => setModalVisible(true)} />
                <Ionicons name='ios-share-outline' size={26} color={colors} />
                <Ionicons name={_showFavoritesIcon()} size={26} color={colors} style={styles.favorites} onPress={() => {
                        if(isLoggedIn) {
                            favoritePost(data.post._id);
                            userFavoritePost(data.post._id)
                        } else {
                            testAlert()
                        }
                    }} 
                />
            </View>

            <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.postText, { color: colors, marginBottom: 2 }]}>
                    {data?.post.likes?.length === 0 ? 'No likes yet' : _likedPostString(data?.post?.likes)}
                </Text>
                <Text style={[styles.postText,  { color: colors, marginLeft: 'auto' }]}>{data?.post.totalViews} views</Text>
            </View>

            <Text style={[styles.postText,  { color: colors, marginBottom: 3 }]}>{data?.post.post}</Text>

            <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.postText, { color: colors }]}>Posted on {new Date(data?.post.createdAt)?.toUTCString().substring(0, 16)}</Text>
                <Text style={[styles.postText,  { color: colors, marginLeft: 'auto' }]}>{data?.post.totalReviews === 0 ? 'No' : data?.post.totalReviews} reviews</Text>
            </View>

            {isModalVisible && (
                <Modal isModalVisible={isModalVisible} setModalVisible={setModalVisible} post={post}>
                    <Text>{data?.post.post}</Text>
                </Modal>
            )}
        </View>
  );
};

const styles = StyleSheet.create({
    postContainer: {
        marginBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
      },
      postImage: {
        width: '100%',
        height: 300,
        borderRadius: 10,
      },
      postInfo: {
       flexDirection: 'row',
       marginTop: 9,
       marginBottom: 5,
    },
    postText: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold',
    },
    favorites: { 
        marginLeft: 'auto', 
        padding: 5, 
        paddingTop: 0 
    },
    reviews: { 
        marginLeft: 15, 
        marginRight: 15 
    }
});

export default PostItem
