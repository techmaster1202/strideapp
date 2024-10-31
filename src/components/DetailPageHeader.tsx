import React from 'react';
import {View} from 'react-native';
import {IconButton, Text, useTheme} from 'react-native-paper';
import {createGlobalStyles} from '../utils/styles';
import {Navigation} from '../types';

type PageHeaderProps = {
  navigation: Navigation;
  title: string;
};

const DetailPageHeader = ({navigation, title}: PageHeaderProps) => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: theme.colors.secondaryContainer,
        elevation: 1,
      }}>
      <IconButton
        icon="arrow-left"
        mode="contained"
        size={25}
        style={{position: 'absolute', left: 10}}
        onPress={() => navigation.goBack()}
      />
      <Text style={globalStyles.primaryTitleText} variant="titleMedium">
        {title}
      </Text>
    </View>
  );
};

export default DetailPageHeader;
