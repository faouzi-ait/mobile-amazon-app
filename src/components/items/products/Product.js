import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import Modal from '../modal/Modal';

import { selectedTheme, currentUser, loggedInStatus } from '../../../redux/slices/selectors';

import { useGetUserPhotoQuery, useGetUserQuery } from '../../../redux/apiServices/authApi';

import * as api from '../../../redux/apiServices/postsApi';

import { styles } from './styles'

const Product = ({ post, navigation }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const theme = useSelector(selectedTheme);
    const userId = useSelector(currentUser);
    const { isLoggedIn } = useSelector(loggedInStatus);
    
    const postUser = useGetUserQuery(post.user);
    const loggedInUserPhoto = useGetUserPhotoQuery(userId);
    const { data, error, isLoading } = api.useGetSinglePostQuery(post._id);
    const [createReview, infos] = api.useCreateReviewMutation();
    
    const isDark = theme === 'dark'
    const color = isDark ? '#fff' : '#000'

    return (
        <>
            {!isModalVisible ? (
                <View style={styles.postContainer}>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={{ position: 'relative' }}>
                        <Image source={{ uri: data?.post.photo }} style={[styles.postImage, { borderRadius: 10, }]} />
                    </TouchableOpacity>
                </View>) 
                :
                <Modal isVisible={isModalVisible} setModalVisible={setModalVisible} postID={data?.post?._id}></Modal>
            }
        </>
    );
};

export default Product
