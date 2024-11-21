import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import UsersScreen from '../screens/users/UsersScreen';
import AddUserScreen from '../screens/users/AddUserScreen';
import UpdateUserScreen from '../screens/users/UpdateUserScreen';

const Stack = createNativeStackNavigator();

export default function UsersStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={UsersScreen} />
      <Stack.Screen name="AddUser" component={AddUserScreen} />
      <Stack.Screen name="UpdateUser" component={UpdateUserScreen} />
    </Stack.Navigator>
  );
}
