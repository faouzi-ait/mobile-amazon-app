import * as UI from 'react-native'
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import * as CP from '../../components';

import { selectedTheme, currentUser, loggedInStatus } from '../../redux/slices/selectors';
import { useGetUserPhotoQuery, useGetUserQuery } from '../../redux/apiServices/authApi';

import * as api from '../../redux/apiServices/categoryApi';

// import { displayMessage } from '../../utils'

import { styles } from '../../components/items/categories/styles'

export const Search = ({ navigation, route }) => {
  const param = route?.params;
  // let commentRef = useRef(null);

  console.log(param && param?.parameter);

  // const theme = useSelector(selectedTheme);
  const userId = useSelector(currentUser);
  const { isLoggedIn } = useSelector(loggedInStatus);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState()

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [currentPost, setCurrentPost] = useState(null)
  const postUser = useGetUserQuery(currentPost?.user);

  // const loggedInUserPhoto = useGetUserPhotoQuery(userId);
  // const [createReview, infos] = api.useCreateReviewMutation();
  const { data, error, isLoading, refetch } = api.useGetCategoriesQuery({
    searchTerm,
    pageSize,
    page,
  });

  // const isDark = theme === 'dark'
  // const color = isDark ? '#fff' : '#000'

  // const currentDisplayedPost = data?.items?.filter(item => item?._id === currentPost?._id);

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

  return (
    <>
      <CP.Header navigation={navigation} />
      <CP.ThemeProvider>
        {!isModalVisible ? 
          <>
            <UI.Text>LIST CATEGORIES IN VERTICAL LIST HERE</UI.Text>
          </>
          :
          <CP.Modal isVisible={isModalVisible} setModalVisible={setModalVisible} postID={currentPost?._id}>
          </CP.Modal>
        }
      </CP.ThemeProvider>
    </>
  )
}

const localStyles = UI.StyleSheet.create({
  container: {
    marginBottom: 10,
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