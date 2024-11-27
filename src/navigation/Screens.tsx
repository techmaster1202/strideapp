import ProfileScreen from '../screens/ProfileScreen';
import CalendarScreen from '../screens/CalendarScreen';
import UsersStack from './UsersStack';
import ManagersStack from './ManagersStack';
import NotificationScreen from '../screens/NotificationScreen';
import EmployeesStack from './EmployeesStack';
import PropertiesStack from './PropertiesStack';
import HostsStack from './HostsStack';
import RolesStack from './RolesStack';
import CarsStack from './CarsStack';

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
    component: HostsStack,
    icon: 'account-group',
  },
  {
    name: 'Properties',
    component: PropertiesStack,
    icon: 'home-city',
  },
  {
    name: 'Cars',
    component: CarsStack,
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
    component: RolesStack,
    icon: 'account-cog',
  },
];
export default Screens;
