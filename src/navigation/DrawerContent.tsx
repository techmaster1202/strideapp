import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import * as React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Text, Button, Divider, useTheme, Avatar} from 'react-native-paper';
import ThemeToggle from './ThemeToggle';
import {useAppDispatch, useAppSelector} from '../store/hook';
import {selectAuthState, userLoggedOut} from '../store/authSlice';
import Logo from '../components/Logo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEY} from '../utils/constantKey';

const DrawerContent = props => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuthState);

  const firstName = authState?.user?.first_name ?? '';
  const lastName = authState?.user?.last_name ?? '';
  const avatarUrl = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&color=187a74&background=EBF4FF`;

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContainer}>
        <Logo />
        <View style={styles.drawerHeader}>
          <Avatar.Image size={40} source={{uri: avatarUrl}} />
          <Text variant="bodyLarge" style={{color: theme.colors.primary}}>
            Welcome {authState?.user?.first_name ?? ''}{' '}
            {authState?.user?.last_name ?? ''}
          </Text>
        </View>
        <Divider style={{alignSelf: 'stretch'}} />
        <View style={styles.drawerItem}>
          <DrawerItemList {...props} />
        </View>
        <Divider style={{alignSelf: 'stretch'}} />
        <View style={styles.drawerFooter}>
          <View style={styles.drawerItem}>
            <ThemeToggle />
          </View>
          <View style={styles.drawerItem}>
            <Button
              icon="logout"
              mode="contained-tonal"
              onPress={() => {
                AsyncStorage.removeItem(STORAGE_KEY);
                dispatch(userLoggedOut());
              }}>
              Log out
            </Button>
          </View>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

export default DrawerContent;

const {height} = Dimensions.get('screen');
const container_height = height * 0.2;
const header_height = height * 0.04;

const styles = StyleSheet.create({
  drawerContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerHeader: {
    paddingHorizontal: 10,
    height: header_height,
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  drawerFooter: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: container_height,
    width: '100%',
  },
  drawerItem: {
    paddingHorizontal: 1,
    paddingVertical: 10,
    width: '100%',
  },
});
