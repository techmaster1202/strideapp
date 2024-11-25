import ProfileScreen from '../screens/ProfileScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ClientScreen from '../screens/ClientScreen';
import CarScreen from '../screens/CarScreen';
import UsersStack from './UsersStack';
import ManagersStack from './ManagersStack';
import NotificationScreen from '../screens/NotificationScreen';
import RoleScreen from '../screens/RoleScreen';
import EmployeesStack from './EmployeesStack';
import PropertiesStack from './PropertiesStack';

const Screens = [
  {
    name: 'Calendar',
    component: CalendarScreen,
    icon: 'calendar',
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    icon: 'account',
  },
  {
    name: 'Clients',
    component: ClientScreen,
    icon: 'account-group',
  },
  {
    name: 'Properties',
    component: PropertiesStack,
    icon: 'home-city',
  },
  {
    name: 'Cars',
    component: CarScreen,
    icon: 'car',
  },
  {
    name: 'Managers',
    component: ManagersStack,
    icon: 'account-tie',
  },
  {
    name: 'Employees',
    component: EmployeesStack,
    icon: 'account-tie',
  },
  {
    name: 'Users',
    component: UsersStack,
    icon: 'account',
  },
  {
    name: 'Notifications',
    component: NotificationScreen,
    icon: 'bell',
  },
  {
    name: 'Roles',
    component: RoleScreen,
    icon: 'account-cog',
  },
];
export default Screens;
