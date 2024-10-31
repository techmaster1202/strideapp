import React from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createGlobalStyles} from '../utils/styles.ts';
import {Props} from '../types/index.ts';
import * as AppConstants from '../constants/constants.ts';
import PageHeader from '../components/PageHeader.tsx';

const NotificationScreen = ({navigation}: Props) => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);

  return (
    <SafeAreaView>
      <PageHeader
        navigation={navigation}
        title={AppConstants.TITLE_Notifications}
      />
      <View style={globalStyles.container}></View>
    </SafeAreaView>
  );
};

export default NotificationScreen;
