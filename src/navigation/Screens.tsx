import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RequestScreen from '../screens/RequestScreen';

const Screens = [
  {
    name: 'Calendar',
    component: HomeScreen,
    icon: 'calendar',
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    icon: 'account',
  },
  {
    name: 'Clients',
    component: RequestScreen,
    icon: 'account-group',
  },
  {
    name: 'Properties',
    component: RequestScreen,
    icon: 'home-city',
  },
  {
    name: 'Cars',
    component: RequestScreen,
    icon: 'car',
  },
  {
    name: 'Managers',
    component: RequestScreen,
    icon: 'account-tie',
  },
  {
    name: 'Users',
    component: RequestScreen,
    icon: 'account',
  },
  {
    name: 'Notifications',
    component: RequestScreen,
    icon: 'bell',
  },
  {
    name: 'Roles',
    component: RequestScreen,
    icon: 'account-cog',
  },
];
export default Screens;
