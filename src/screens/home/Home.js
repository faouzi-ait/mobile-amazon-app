import { FlatList, Text, RefreshControl } from 'react-native';
import React, { useState } from 'react'

import { ThemeProvider, PostItem } from '../../components'; 
// import { Ionicons } from "@expo/vector-icons";

import { useGetPostsQuery } from '../../redux/apiServices/postsApi'

export const Home = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);
    const { data, error, isLoading, refetch } = useGetPostsQuery();

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

    console.log('POSTS: ', data);

    return (
        <ThemeProvider>
            {data?.length ? (
                <Text>No posts available</Text>
                ) : (
                <FlatList
                    data={data?.items}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <PostItem post={item} navigation={navigation} />}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl 
                            refreshing={refreshing} 
                            onRefresh={onRefresh} 
                            colors={['lightgrey']}
                            tintColor={'lightgrey'}
                        />
                    }
                />
            )}
        </ThemeProvider>
    );
}

export default Home;
