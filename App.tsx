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
import {lightTheme, darkTheme} from './src/utils/customTheme';
import {StripeProvider} from '@stripe/stripe-react-native';
import {name as appName} from './app.json';
import RolePermissionProvider from './src/context/RoleAndPermissionContext';

const {LightTheme, DarkTheme} = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

const customLightTheme = merge(CombinedDefaultTheme, lightTheme);
const customDarkTheme = merge(CombinedDarkTheme, darkTheme);

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

  const appTheme = isThemeDark ? customDarkTheme : customLightTheme;

  // (as public key not harmful but it's best practice) remove this after testing and fetch it from backend
  const publicKey =
    'pk_test_51PAjXfP98CkfUrpB5ED2Z87uwygNr3NEvrkjA3uCibHoJygq0LLD3bpfvJVWjenZOMoYF6OAAdctOZXyi4qW7A6t00tmppIwe5';

  return (
    <GestureHandlerRootView>
      <StripeProvider
        publishableKey={publicKey}
        merchantIdentifier={`merchant.com.${appName}`}
        urlScheme={`${appName}`}>
        <Provider store={appStore}>
          <RolePermissionProvider>
            <PreferencesContext.Provider value={preferences}>
              <PaperProvider theme={appTheme}>
                <AppNavigator theme={appTheme as any} />
                <Toast />
              </PaperProvider>
            </PreferencesContext.Provider>
          </RolePermissionProvider>
        </Provider>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}
