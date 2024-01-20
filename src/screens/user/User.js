import React from 'react';
import { useSelector } from 'react-redux';

import { ThemeProvider, ToggleThemeButton } from '../../components';
import Guard from '../route-guard/Guard'
import Update from './Update'

import { isUserLoggedIn } from '../../redux/slices/authSlice';

const User = ({ navigation }) => {  
  const auth = useSelector(isUserLoggedIn);

  return (
    <ThemeProvider>
      {/* <ToggleThemeButton /> */}
      {auth ? <Update /> : <Guard navigation={navigation} message='User Profile Screen' />}
    </ThemeProvider>
  );
}

export default User;
