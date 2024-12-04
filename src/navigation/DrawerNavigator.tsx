import React, {useMemo, useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Screens from './Screens';
import DrawerContent from './DrawerContent';
import {useTheme} from 'react-native-paper';
import {useRoleAndPermission} from '../context/RoleAndPermissionContext';
import {ActivityIndicator, View} from 'react-native';

const Drawer = createDrawerNavigator();
const INITIAL_ROUTE_NAME = 'Calendar';

export default function AppDrawer() {
  const theme = useTheme();
  const {hasAnyPermission, hasAnyRole} = useRoleAndPermission();
  const [isReady, setIsReady] = useState(false);

  // Memoize the filtered screens based on permissions
  const authorizedScreens = useMemo(() => {
    if (!hasAnyPermission || !hasAnyRole) {
      return [];
    }

    if (hasAnyRole(['Administrator'])) {
      return Screens;
    }

    return Screens.filter(screen => {
      return (
        !screen.permissions ||
        screen.permissions.length === 0 ||
        hasAnyPermission(screen.permissions)
      );
    });
  }, [hasAnyPermission, hasAnyRole]);

  // Memoize drawer items
  const drawerItems = useMemo(
    () =>
      authorizedScreens.map(item => ({
        label: item.name,
        screen: item.name,
        icon: item.icon,
      })),
    [authorizedScreens],
  );

  // Handle initialization
  useEffect(() => {
    if (authorizedScreens.length > 0) {
      setIsReady(true);
    }
  }, [authorizedScreens]);

  if (!hasAnyPermission || !hasAnyRole || !isReady) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Drawer.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        swipeEnabled: true,
        // Ensure initial state is correct
        lazy: false,
      }}
      drawerContent={props => (
        <DrawerContent
          {...props}
          drawerItems={drawerItems}
          initialRouteName={INITIAL_ROUTE_NAME}
        />
      )}>
      {authorizedScreens.map(({name, component, icon}) => (
        <Drawer.Screen
          key={name}
          name={name}
          component={component}
          options={{
            drawerIcon: ({size}) => (
              <Icon name={icon} color={theme.colors.primary} size={size} />
            ),
          }}
        />
      ))}
    </Drawer.Navigator>
  );
}
