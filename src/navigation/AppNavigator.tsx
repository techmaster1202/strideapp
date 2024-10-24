import React, {useEffect, useState} from 'react';
import {NavigationContainer, Theme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeStack from './HomeStack.tsx';
import PublicStack from './PublicStack.tsx';
import {selectAuthState} from '../store/authSlice';
import DrawerNavigator from './DrawerNavigator.tsx';
import {STORAGE_KEY} from '../utils/constantKey.ts';
import {useAppSelector, useAppDispatch} from '../store/hook';
import {userLoggedIn} from '../store/authSlice';

const AppNavigator = (theme: Theme) => {
  const dispatch = useAppDispatch();

  const checkUserLoginStatus = async () => {
    const userDataStr = await AsyncStorage.getItem(STORAGE_KEY);
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      console.log('userData: ', userData);
      dispatch(userLoggedIn(userData));
    }
  };

  const authState = useAppSelector(selectAuthState);
  console.log('authState: ' + authState?.isLoggedIn);

  useEffect(() => {
    checkUserLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      {authState?.isLoggedIn ? <DrawerNavigator /> : <PublicStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
