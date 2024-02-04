import { View, Text, Dimensions, StyleSheet, Image, FlatList } from 'react-native';
import React from 'react';
import Swiper from 'react-native-swiper'

import { ThemeProvider, Header } from '../../components';

import { useGetHomePageProductsQuery } from '../../redux/apiServices/categoryApi';

const { width, height } = Dimensions.get('window');

const Home = ({ navigation }) => {
  const { data, error, isLoading, refetch } = useGetHomePageProductsQuery();
  const Images = {
    image1: require('../../components/images/img1.jpg'),
    image2: require('../../components/images/img2.jpg'),
    image3: require('../../components/images/img3.jpg'),
  }

  const ImageView = ({ index }) => <Image source={Images[`image${index}`]} style={styles.image} />

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.photo }} style={styles.image2} />
        <Text>{item.name.substring(0, 15)}...</Text>
      </View>
    );
  };

  const DisplayHomePoducts = ({ label, titleStyle, data }) => {
    return (
      <>
        <Text style={titleStyle}>{label}</Text>
        <View style={{ alignItems: 'center' }}>
          <FlatList
            horizontal
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.flatListContent, { justifyContent: 'center' }]}
          />
        </View>
      </>
    )
  }

  return (
    <>
      <Header navigation={navigation} />
      <ThemeProvider>
        <View style={styles.carousel}>
          <Swiper
            loop={true}
            height={50} 
            showsButtons={false}
            showsPagination={false}
            nestedScrollEnabled={true}
            autoplayTimeout={3}
            autoplay>
              <ImageView index={1} />
              <ImageView index={2} />
              <ImageView index={3} />
          </Swiper>
        </View>
        <DisplayHomePoducts label='Featured Products' titleStyle={[styles.topRated, { marginTop: 10 }]} data={data?.products?.featured} />
        <DisplayHomePoducts label='Top Rated Products' titleStyle={styles.topRated} data={data?.products?.topRated} />
        <DisplayHomePoducts label='Best Sellers' titleStyle={styles.topRated} data={data?.products?.bestSeller} />
        <DisplayHomePoducts label='Best Deals' titleStyle={styles.topRated} data={data?.products?.deals} />
      </ThemeProvider>
    </>
  );
};

const styles = StyleSheet.create({
  carousel: { 
    height: height / 3, 
    marginBottom: -20 
  },
  image: {
    width,
    height: height / 3.5,
    resizeMode: 'cover',
  },
  flatListContent: {
    paddingHorizontal: 5,
  },
  itemContainer: {
    width: width / 2.3,
    height: height / 4,
    marginHorizontal: 5,
    marginBottom: 10,
    padding: 7,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'space-around'
  },
  image2: {
    height: height / 5.8,
    resizeMode: 'cover',
    marginBottom: 8,
    borderRadius: 4,
  },
  topRated: { 
    margin: 10, 
    marginTop: 0, 
    marginLeft: width / 20, 
    fontWeight: 'bold', 
    fontSize: 17, 
    letterSpacing: .25 
  }
});

export default Home;

