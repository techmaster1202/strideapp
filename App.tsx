import 'react-native-gesture-handler';
import React, {useState, useMemo, useEffect} from 'react';
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
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PreferencesContext} from './src/context/PreferencesContext';
import {appStore} from './src/store/appStore';
import AppNavigator from './src/navigation/AppNavigator';
import {THEME_STORAGE_KEY} from './src/utils/constantKey';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const {LightTheme, DarkTheme} = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

export default function App() {
  const [isThemeDark, setIsThemeDark] = useState(false);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme !== null) {
          setIsThemeDark(JSON.parse(storedTheme));
        }
      } catch (e) {
        console.error('Failed to load theme from storage:', e);
      }
    };
    loadThemePreference();
  }, []);

  // Toggle theme and save to storage
  const toggleTheme = async () => {
    try {
      const newTheme = !isThemeDark;
      setIsThemeDark(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newTheme));
    } catch (e) {
      console.error('Failed to save theme to storage:', e);
    }
  };

  const preferences = useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [isThemeDark],
  );

  const appTheme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <GestureHandlerRootView>
      <Provider store={appStore}>
        <PreferencesContext.Provider value={preferences}>
          <PaperProvider theme={appTheme}>
            <AppNavigator theme={appTheme} />
            <Toast />
          </PaperProvider>
        </PreferencesContext.Provider>
      </Provider>
    </GestureHandlerRootView>
  );
}
