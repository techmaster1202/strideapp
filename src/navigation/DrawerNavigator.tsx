import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import RequestScreen from '../screens/RequestScreen';
import DrawerContent from './DrawerContent.tsx';

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Calendar"
      screenOptions={{
        headerShown: true,
      }}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="Calendar"
        component={HomeScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Clients"
        component={RequestScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="account-group" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Properties"
        component={RequestScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="home-city" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Cars"
        component={RequestScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="car" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Managers"
        component={RequestScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="account-tie" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Users"
        component={RequestScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={RequestScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="bell" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Roles"
        component={RequestScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="account-cog" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
