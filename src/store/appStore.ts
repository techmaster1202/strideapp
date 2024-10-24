import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import authReducer from './authSlice.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEY} from '../utils/constantKey.ts';

let localState: string | undefined;

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    if (value !== null) {
      localState = value;
    }
  } catch (e) {
    console.log('appStore-getData error: ', e);
  }
  return '';
};

getData();
let localStateJSON = {};
if (localState !== undefined) {
  localStateJSON = JSON.parse(localState);
}

export const appStore = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: localStateJSON || {},
});

export type AppDispatch = typeof appStore.dispatch;
export type RootState = ReturnType<typeof appStore.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
