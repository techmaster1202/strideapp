import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import EmployeesScreen from '../screens/employees/EmployeesScreen';
import AddEmployeeScreen from '../screens/employees/AddEmployeeScreen';
import UpdateEmployeeScreen from '../screens/employees/UpdateEmployeeScreen';

const Stack = createNativeStackNavigator();

export default function EmployeesStack() {
  return (
    <Stack.Navigator
      initialRouteName="/"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="/" component={EmployeesScreen} />
      <Stack.Screen name="AddManager" component={AddEmployeeScreen} />
      <Stack.Screen name="UpdateManager" component={UpdateEmployeeScreen} />
    </Stack.Navigator>
  );
}
