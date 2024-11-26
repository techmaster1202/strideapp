import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RolesScreen from '../screens/roles/RolesScreen';
import AddRoleScreen from '../screens/roles/AddRoleScreen';
import UpdateRoleScreen from '../screens/roles/UpdateRoleScreen';

const Stack = createNativeStackNavigator();

export default function RolesStack() {
  return (
    <Stack.Navigator
      initialRouteName="/"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="/" component={RolesScreen} />
      <Stack.Screen name="AddRole" component={AddRoleScreen} />
      <Stack.Screen name="UpdateRole" component={UpdateRoleScreen} />
    </Stack.Navigator>
  );
}
