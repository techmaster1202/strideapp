import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ManagersScreen from '../screens/managers/ManagersScreen';
import AddManagerScreen from '../screens/managers/AddManagerScreen';
import UpdateManagerScreen from '../screens/managers/UpdateManagerScreen';

const Stack = createNativeStackNavigator();

export default function ManagersStack() {
  return (
    <Stack.Navigator
      initialRouteName="/"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="/" component={ManagersScreen} />
      <Stack.Screen name="AddManager" component={AddManagerScreen} />
      <Stack.Screen name="UpdateManager" component={UpdateManagerScreen} />
    </Stack.Navigator>
  );
}
