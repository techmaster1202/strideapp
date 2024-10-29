import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import React from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {Text, Button, Divider, useTheme, Avatar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemeToggle from './ThemeToggle';
import {useAppDispatch, useAppSelector} from '../store/hook';
import {selectAuthState, userLoggedOut} from '../store/authSlice';
import Logo from '../components/Logo';
import {STORAGE_KEY} from '../utils/constantKey';
import {Props} from '../types';
import {createGlobalStyles} from '../utils/styles';

const DrawerContent = (props: Props) => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuthState);

  const firstName = authState?.user?.first_name ?? '';
  const lastName = authState?.user?.last_name ?? '';
  const avatarUrl = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&color=187a74&background=EBF4FF`;

  const drawerItems = [
    {label: 'Calendar', icon: 'calendar', screen: 'Calendar'},
    {label: 'Clients', icon: 'account-group', screen: 'Clients'},
    {label: 'Properties', icon: 'home-city', screen: 'Properties'},
    {label: 'Cars', icon: 'car', screen: 'Cars'},
    {label: 'Managers', icon: 'account-tie', screen: 'Managers'},
    {label: 'Users', icon: 'account', screen: 'Users'},
    {label: 'Notifications', icon: 'bell', screen: 'Notifications'},
    {label: 'Roles', icon: 'account-cog', screen: 'Roles'},
  ];

  const handleLogout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    dispatch(userLoggedOut());
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContainer}>
        <View
          style={{
            ...styles.drawerHeader,
            backgroundColor: theme.colors.primaryContainer,
          }}>
          <Logo />
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Profile')}>
            <View style={styles.profileNavigator}>
              <Avatar.Image size={40} source={{uri: avatarUrl}} />
              <Text variant="bodyLarge" style={{color: theme.colors.primary}}>
                Welcome {firstName} {lastName}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.drawerItemContainer}>
          {drawerItems.map(({label, icon, screen}) => (
            <DrawerItem
              key={label}
              label={label}
              icon={({color, size}) => (
                <Icon name={icon} color={color} size={size} />
              )}
              onPress={() => props.navigation.navigate(screen)}
            />
          ))}
        </View>

        <Divider style={styles.divider} />

        <View style={styles.drawerFooter}>
          <View style={styles.drawerItem}>
            <ThemeToggle />
          </View>
          <View style={styles.drawerItem}>
            <Button
              icon="logout"
              mode="contained"
              onPress={handleLogout}
              compact
              style={globalStyles.dangerButton}>
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
const containerHeight = height * 0.2;

const styles = StyleSheet.create({
  drawerHeader: {
    paddingVertical: 15,
    width: '100%',
  },
  drawerContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileNavigator: {
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  drawerFooter: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: containerHeight,
    gap: 5,
    width: '100%',
  },
  drawerItemContainer: {
    width: '100%',
  },
  divider: {
    alignSelf: 'stretch',
  },
  drawerItem: {
    width: '100%',
  },
});
