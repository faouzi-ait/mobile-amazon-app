import * as UI from 'react-native'
import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

import * as CP from '../../components';

import { selectedTheme, currentUser, loggedInStatus } from '../../redux/slices/selectors';
import { useGetUserPhotoQuery, useGetUserQuery } from '../../redux/apiServices/authApi';

import * as api from '../../redux/apiServices/postsApi';

import { displayMessage } from '../../utils'

import { styles } from '../../components/items/postItems/styles'

export const Search = ({ navigation }) => {
  let commentRef = useRef(null);

  const theme = useSelector(selectedTheme);
  const userId = useSelector(currentUser);
  const { isLoggedIn } = useSelector(loggedInStatus);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState()

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [currentPost, setCurrentPost] = useState(null)
  const postUser = useGetUserQuery(currentPost?.user);

  const loggedInUserPhoto = useGetUserPhotoQuery(userId);
  const [createReview, infos] = api.useCreateReviewMutation();
  const { data, error, isLoading, refetch } = api.useGetPostsQuery({
    searchTerm,
    pageSize,
    page,
  });

  const isDark = theme === 'dark'
  const color = isDark ? '#fff' : '#000'

  const currentDisplayedPost = data?.items?.filter(item => item?._id === currentPost?._id);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error while refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const sendComment = async () => {
    if(!commentRef.current.value) {
        alert('Please write a comment to post');
        return;
    }

    await createReview({
        rating: 0,
        postID: currentPost._id,
        comment: commentRef.current.value
    });
    commentRef.current.value = null;
  }


  return (
    <CP.ThemeProvider>
      {/* <ToggleThemeButton /> */}
      {!isModalVisible ? 
        <>
          <UI.View style={localStyles.container}>
              <CP.Debounce
                onChange={(text) => setSearchTerm(text.trim())}
                placeholderTextColor={color}
                style={[localStyles.debounceStyle, { color, borderColor: color }]}
                placeholder="Search any posts here..."
                delay={1250}
              />
          </UI.View>

          {!searchTerm && <UI.View style={localStyles.searchLabel}>
            <UI.Text style={[localStyles.searchLabelFont, { color }]}>{displayMessage(searchTerm, data)}</UI.Text>
          </UI.View>}

          <UI.FlatList
            numColumns={3}
            data={data?.items}
            refreshControl={
              <UI.RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['lightgrey']}
                  tintColor={'lightgrey'}
              />
            }
            renderItem={({ item }) => (
              <UI.TouchableOpacity
                key={item._id}
                style={localStyles.listStyle}
                contentContainerStyle={{ padding: 5 }}
                keyExtractor={(item) => item._id.toString()}
                onPress={() => {
                  setModalVisible(true);
                  setCurrentPost(item);
                }}>
                <UI.Image style={localStyles.imageList} source={{ uri: item.photo }} />
              </UI.TouchableOpacity>
            )}

          />
        </>
        :
        <CP.Modal isVisible={isModalVisible} setModalVisible={setModalVisible} postID={currentPost?._id}>
          <UI.View style={{ position: 'relative' }}>
            <UI.View style={styles.postImageLayout}>
                <UI.Image source={{ uri: postUser?.currentData?.user?.photo }} style={styles.modalImageSize} />
                <UI.View style={{ justifyContent: 'center' }}>
                    <UI.Text style={styles.userPostName}>{`${postUser?.currentData?.user?.firstname} ${postUser?.currentData?.user?.lastname}`}</UI.Text>
                </UI.View>
            </UI.View>
            <UI.Image source={{ uri: currentPost?.photo }} style={[styles.postImage, styles.userPhoto]} />
          </UI.View>

          <UI.View style={localStyles.postDetail}>
            <CP.PostActions data={currentDisplayedPost[0]} userId={userId} color={color} isLoggedIn={isLoggedIn} navigation={navigation} setModalVisible={setModalVisible} />
            <CP.PostDetails data={currentDisplayedPost[0]} userId={userId} color={color} />
          </UI.View>
          
          <UI.View style={styles.reviewsSectionLayout}>
            <UI.View style={[styles.reviewsTitle, { backgroundColor: color }]} />
              <UI.Text style={[styles.reviewsSection, { color }]}>Reviews</UI.Text>
            <UI.View style={[styles.separation, { backgroundColor: color }]} />
          </UI.View>

          <UI.View style={styles.commentSection}>
            <CP.PostComments isLoggedIn={isLoggedIn} loggedInUserPhoto={loggedInUserPhoto} commentRef={commentRef} color={color} infos={infos} sendComment={sendComment} />
          </UI.View>

          <UI.View style={{ marginTop: 10 }}>
            {currentPost?.reviews?.map((review, i) => 
              <CP.ReviewList review={review} key={i} color={color} />
            )}
          </UI.View>

        </CP.Modal>
      }
    </CP.ThemeProvider>
  )
}

const localStyles = UI.StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  debounceStyle: {
    borderWidth: 1, 
    padding: 10, 
    width: '85%',
    fontSize: 15
  },
  listStyle: { 
    flex: 1, 
    aspectRatio: 1, 
    margin: 5 
  },
  imageList: { 
    flex: 1, 
    borderRadius: 8 
  },
  postDetail: { 
    padding: 10, 
    paddingTop: 0 
  },
  searchLabel: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  searchLabelFont: { 
    fontSize: 15
  }
});

export default Search;