import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import UsersScreen from '../screens/UsersScreen';
import AddUserScreen from '../screens/AddUserScreen';
import UpdateUserScreen from '../screens/UpdateUserScreen';

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
