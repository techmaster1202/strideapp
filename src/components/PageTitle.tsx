import React from 'react';
import {useTheme, Text} from 'react-native-paper';
import {createGlobalStyles} from '../utils/styles';

type Props = {
  children: React.ReactNode;
};

export default function PageTitle({children}: Props) {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);

  return (
    <Text style={globalStyles.primaryTitleText} variant="labelLarge">
      {children}
    </Text>
  );
}
