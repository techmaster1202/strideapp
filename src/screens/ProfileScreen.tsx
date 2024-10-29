import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import UpdatePasswordForm from '../components/UpdatePasswordForm.tsx';
import UpdateProfileForm from '../components/UpdateProfileForm.tsx';
import {createGlobalStyles} from '../utils/styles.ts';

const ProfileScreen = () => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);

  return (
    <ScrollView alwaysBounceVertical={true}>
      <View style={globalStyles.container}>
        <UpdateProfileForm />
        <UpdatePasswordForm />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
