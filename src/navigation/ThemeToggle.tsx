import * as React from 'react';
import {Button, IconButton, Tooltip, useTheme, Icon} from 'react-native-paper';
import {PreferencesContext} from '../context/PreferencesContext';
import {createGlobalStyles} from '../utils/styles';

const ThemeToggle = (): React.ReactNode => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const {toggleTheme, isThemeDark} = React.useContext(PreferencesContext);
  return (
    <Button
      icon="theme-light-dark"
      mode="contained-tonal"
      onPress={toggleTheme}
      style={globalStyles.defaultButton}
      compact>
      {isThemeDark ? 'Light Mode' : 'Dark Mode'}
    </Button>
  );
};

export default ThemeToggle;
