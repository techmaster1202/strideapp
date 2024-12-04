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
    permissions: [
      'view-appointments',
      'create-appointments',
      'update-appointments',
      'delete-appointments',
    ],
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
    permissions: ['view-hosts', 'create-hosts', 'update-hosts', 'delete-hosts'],
  },
  {
    name: 'Properties',
    component: PropertiesStack,
    icon: 'home-city',
    permissions: [
      'view-properties',
      'create-properties',
      'update-properties',
      'delete-properties',
    ],
  },
  {
    name: 'Cars',
    component: CarsStack,
    icon: 'car',
    permissions: ['view-cars', 'create-cars', 'update-cars', 'delete-cars'],
  },
  {
    name: 'Managers',
    component: ManagersStack,
    icon: 'account-tie',
    permissions: [
      'view-managers',
      'create-managers',
      'update-managers',
      'delete-managers',
    ],
  },
  {
    name: 'Employees',
    component: EmployeesStack,
    icon: 'account-tie',
    permissions: [
      'view-cleaners',
      'create-cleaners',
      'update-cleaners',
      'delete-cleaners',
    ],
  },
  {
    name: 'Users',
    component: UsersStack,
    icon: 'account',
    permissions: ['view-users', 'create-users', 'update-users', 'delete-users'],
  },
  {
    name: 'Notifications',
    component: NotificationScreen,
    icon: 'bell',
    permissions: ['view-notifications'],
  },
  {
    name: 'Roles',
    component: RolesStack,
    icon: 'account-cog',
    permissions: ['view-roles', 'create-roles', 'update-roles', 'delete-roles'],
  },
];
export default Screens;
