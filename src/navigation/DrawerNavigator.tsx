import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Screens from './Screens';
import DrawerContent from './DrawerContent';
import {useTheme} from 'react-native-paper';

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  const theme = useTheme();

  return (
    <Drawer.Navigator
      initialRouteName="Calendar"
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={props => <DrawerContent {...props} />}>
      {Screens.map(({name, component, icon}) => (
        <Drawer.Screen
          key={name}
          name={name}
          component={component}
          options={{
            drawerIcon: ({color, size}) => (
              <Icon name={icon} color={theme.colors.primary} size={size} />
            ),
          }}
        />
      ))}
    </Drawer.Navigator>
  );
}
