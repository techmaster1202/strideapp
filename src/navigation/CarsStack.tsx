import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CarsScreen from '../screens/cars/CarsScreen';
import AddCarScreen from '../screens/cars/AddCarScreen';
import UpdateCarScreen from '../screens/cars/UpdateCarScreen';

const Stack = createNativeStackNavigator();

export default function CarsStack() {
  return (
    <Stack.Navigator
      initialRouteName="/"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="/" component={CarsScreen} />
      <Stack.Screen name="AddCar" component={AddCarScreen} />
      <Stack.Screen name="UpdateCar" component={UpdateCarScreen} />
    </Stack.Navigator>
  );
}
