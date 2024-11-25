import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PropertiesScreen from '../screens/properties/PropertiesScreen';
import UpdatePropertyScreen from '../screens/properties/UpdatePropertyScreen';
import AddPropertyScreen from '../screens/properties/AddProperty';

const Stack = createNativeStackNavigator();

export default function PropertiesStack() {
  return (
    <Stack.Navigator
      initialRouteName="/"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="/" component={PropertiesScreen} />
      <Stack.Screen name="AddProperty" component={AddPropertyScreen} />
      <Stack.Screen name="UpdateProperty" component={UpdatePropertyScreen} />
    </Stack.Navigator>
  );
}
