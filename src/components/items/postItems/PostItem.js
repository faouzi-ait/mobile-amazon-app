import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux'

import Modal from '../modal/Modal';
import ReviewList from '../reviewList/ReviewList'; 
import PostActions from '../postActions/PostActions';
import PostDetails from '../postDetails/PostDetails';
import PostComments from '../postComment/PostComment';

import { selectedTheme, currentUser, loggedInStatus } from '../../../redux/slices/selectors';

import { useGetUserPhotoQuery, useGetUserQuery } from '../../../redux/apiServices/authApi';

import * as api from '../../../redux/apiServices/postsApi';

import { styles } from './styles'

const PostItem = ({ post, navigation }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    let commentRef = useRef(null);

    const theme = useSelector(selectedTheme);
    const userId = useSelector(currentUser);
    const { isLoggedIn } = useSelector(loggedInStatus);
    
    const postUser = useGetUserQuery(post.user);
    const loggedInUserPhoto = useGetUserPhotoQuery(userId);
    const { data, error, isLoading } = api.useGetSinglePostQuery(post._id);
    const [createReview, infos] = api.useCreateReviewMutation();
    
    const isDark = theme === 'dark'
    const color = isDark ? '#fff' : '#000'

    const sendComment = () => {
        if(!commentRef.current.value) {
            alert('Please write a comment to post');
            return;
        }
        createReview({
            rating: 0,
            postID: data.post._id,
            comment: commentRef.current.value
        });
        commentRef.current.value = null
    }

    return (
        <>
            {!isModalVisible ? (
                <View style={styles.postContainer}>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={{ position: 'relative' }}>
                        <View style={styles.postLayout}>
                            <Image source={{ uri: postUser?.data?.user?.photo }} style={styles.postPhoto} />
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={styles.postUser}>{`${postUser?.data?.user?.firstname} ${postUser?.data?.user?.lastname}`}</Text>
                            </View>
                        </View>
                        <Image source={{ uri: data?.post.photo }} style={[styles.postImage, { borderRadius: 10, }]} />
                    </TouchableOpacity>

                    <PostActions data={data?.post} userId={userId} color={color} isLoggedIn={isLoggedIn} navigation={navigation} setModalVisible={setModalVisible} />
                    <PostDetails data={data?.post} userId={userId} color={color} />
                    <PostComments isLoggedIn={isLoggedIn} loggedInUserPhoto={loggedInUserPhoto} commentRef={commentRef} color={color} infos={infos} sendComment={sendComment} />
                </View>) 
                :
                <Modal isVisible={isModalVisible} setModalVisible={setModalVisible} postID={data?.post?._id}>
                    <View style={{ position: 'relative' }}>
                        <View style={styles.postImageLayout}>
                            <Image source={{ uri: postUser?.data?.user?.photo }} style={styles.modalImageSize} />
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={styles.userPostName}>{`${postUser?.data?.user?.firstname} ${postUser?.data?.user?.lastname}`}</Text>
                            </View>
                        </View>
                        <Image source={{ uri: data?.post?.photo }} style={[styles.postImage, styles.userPhoto]} />
                    </View>

                    <View style={{ padding: 10, paddingTop: 0 }}>
                        <PostActions data={data} userId={userId} color={color} isLoggedIn={isLoggedIn} navigation={navigation} setModalVisible={setModalVisible} />
                        <PostDetails data={data?.post} userId={userId} color={color} />
                    </View>
                    
                    <View style={styles.reviewsSectionLayout}>
                        <View style={[styles.reviewsTitle, { backgroundColor: color }]} />
                            <Text style={[styles.reviewsSection, { color }]}>Reviews</Text>
                        <View style={[styles.separation, { backgroundColor: color }]} />
                    </View>

                    <View style={styles.commentSection}>
                        <PostComments isLoggedIn={isLoggedIn} loggedInUserPhoto={loggedInUserPhoto} commentRef={commentRef} color={color} infos={infos} sendComment={sendComment} />
                    </View>

                    <View style={{ marginTop: 10 }}>
                        {data?.post?.reviews?.map((review, i) => 
                            <ReviewList review={review} key={i} color={color} />
                        )}
                    </View>
                </Modal>
            }
        </>
    );
};

export default PostItem
