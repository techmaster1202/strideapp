import React, {useEffect, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PublicStack from './PublicStack';
import DrawerNavigator from './DrawerNavigator';
import {STORAGE_KEY} from '../utils/constantKey';
import {useAppSelector, useAppDispatch} from '../store/hook';
import {selectAuthState, userLoggedIn} from '../store/authSlice';
import {StatusBar} from 'react-native';
import {PreferencesContext} from '../context/PreferencesContext';
import {AppNavigatorProps} from '../types';

const AppNavigator: React.FC<AppNavigatorProps> = ({theme}) => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuthState);

  // Consume the PreferencesContext to get the current theme state
  const {isThemeDark} = useContext(PreferencesContext);

  useEffect(() => {
    const checkUserLoginStatus = async () => {
      const userDataStr = await AsyncStorage.getItem(STORAGE_KEY);
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        dispatch(userLoggedIn(userData));
      }
    };
    checkUserLoginStatus();
  }, [dispatch]);

  return (
    <NavigationContainer theme={theme}>
      <StatusBar
        animated={true}
        backgroundColor={theme.colors.primary}
        barStyle={isThemeDark ? 'dark-content' : 'light-content'} // Use isThemeDark here
      />
      {authState?.isLoggedIn ? <DrawerNavigator /> : <PublicStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
