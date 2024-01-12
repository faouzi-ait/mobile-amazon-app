import { FlatList, View, Text, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ThemeProvider, PostItem } from '../../components';
import { useGetPostsQuery } from '../../redux/apiServices/postsApi';

const Home = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(2);
  const { data, error, isLoading, refetch } = useGetPostsQuery({
    searchTerm: '',
    pageSize: size,
    page: page,
  });

  useEffect(() => {
    setPage(1);
  }, [data?.searchTerm]);

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

  const onEndReached = () => {
    if (!isLoading && data?.pageInfo?.nextPage) {
      setSize(size => size + 2)
      refetch({ page: page + 1 });
    }
  };

  return (
    <ThemeProvider>
        <FlatList
          data={data?.items ?? []}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <PostItem post={item} navigation={navigation} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['lightgrey']}
              tintColor={'lightgrey'}
            />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5} 
        />
    </ThemeProvider>
  );
};

export default Home;

