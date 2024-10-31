import {StyleSheet, View} from 'react-native';
import React from 'react';
import {IconButton, Text, useTheme} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import UpdatePasswordForm from '../components/UpdatePasswordForm.tsx';
import UpdateProfileForm from '../components/UpdateProfileForm.tsx';
import {createGlobalStyles} from '../utils/styles.ts';
import {Props} from '../types/index.ts';
import PageTitle from '../components/PageTitle.tsx';
import * as AppConstants from '../constants/constants.ts';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageHeader from '../components/PageHeader.tsx';

const ProfileScreen = ({navigation}: Props) => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);

  return (
    <SafeAreaView>
      <PageHeader navigation={navigation} title={AppConstants.TITLE_Profile} />
      <ScrollView alwaysBounceVertical={true} style={{marginBottom: 20}}>
        <View style={globalStyles.container}>
          <UpdateProfileForm />
          <UpdatePasswordForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
