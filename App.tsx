import 'react-native-gesture-handler';
import * as React from 'react';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from 'react-native-paper';
import merge from 'deepmerge';
import {Provider} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PreferencesContext} from './src/context/PreferencesContext';
import {appStore} from './src/store/appStore';
import AppNavigator from './src/navigation/AppNavigator';
import {STORAGE_KEY} from './src/utils/constantKey';

const {LightTheme, DarkTheme} = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

export default function App() {
  const [isThemeDark, setIsThemeDark] = React.useState(false);
  let appTheme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;
  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark],
  );

  return (
    <Provider store={appStore}>
      <PreferencesContext.Provider value={preferences}>
        <PaperProvider theme={appTheme}>
          <AppNavigator theme={appTheme} />
        </PaperProvider>
      </PreferencesContext.Provider>
    </Provider>
  );
}
