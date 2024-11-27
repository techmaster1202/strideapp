import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HostsScreen from '../screens/hosts/HostsScreen';
import AddHostScreen from '../screens/hosts/AddHostScreen';
import UpdateHostScreen from '../screens/hosts/UpdateHostScreen';

const Stack = createNativeStackNavigator();

export default function HostsStack() {
  return (
    <Stack.Navigator
      initialRouteName="/"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="/" component={HostsScreen} />
      <Stack.Screen name="AddHost" component={AddHostScreen} />
      <Stack.Screen name="UpdateHost" component={UpdateHostScreen} />
    </Stack.Navigator>
  );
}
