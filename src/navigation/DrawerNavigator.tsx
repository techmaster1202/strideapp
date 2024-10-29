import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Screens from './Screens';
import DrawerContent from './DrawerContent';

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Calendar"
      screenOptions={{
        headerShown: true,
      }}
      drawerContent={props => <DrawerContent {...props} />}>
      {Screens.map(({name, component, icon}) => (
        <Drawer.Screen
          key={name}
          name={name}
          component={component}
          options={{
            drawerIcon: ({color, size}) => (
              <Icon name={icon} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Drawer.Navigator>
  );
}
