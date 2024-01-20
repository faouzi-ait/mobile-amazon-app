import React from 'react'
import { Text, View } from 'react-native'
import { useSelector } from 'react-redux'

import Content from './tabs/content/Content'
import Guard from '../route-guard/Guard'

import { currentUser, loggedInStatus } from '../../redux/slices/selectors'

import { ThemeProvider } from '../../components'

import { useGetUserQuery } from '../../redux/apiServices/authApi';

const Album = ({ navigation }) => {
  const userId = useSelector(currentUser);
  const { isLoggedIn } = useSelector(loggedInStatus);
  const { currentData } = useGetUserQuery(userId);

  return (
    <ThemeProvider>
      {isLoggedIn ? 
        currentData?.user?.favorite?.length ? 
          <Content ids={currentData?.user?.favorite} navigation={navigation} /> 
            : 
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: '15%' }}>No Favorites yet...</Text>
          </View>
      : 
      <Guard navigation={navigation} message='Favorites Screen' />}
    </ThemeProvider>
  );
};

export default Album;
