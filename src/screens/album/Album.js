import React from 'react'
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
      {isLoggedIn ? <Content ids={currentData?.user?.favorite} navigation={navigation} /> : <Guard navigation={navigation} message='Favorites Screen' />}
    </ThemeProvider>
  );
};

export default Album;
