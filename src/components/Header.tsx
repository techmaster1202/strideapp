import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
type Props = {
  children: React.ReactNode;
};

const Header = ({children}: Props) => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    header: {
      fontSize: 26,
      fontWeight: 'bold',
      paddingVertical: 14,
      color: theme.colors.primary,
    },
  });

  return <Text style={styles.header}>{children}</Text>;
};

export default memo(Header);
