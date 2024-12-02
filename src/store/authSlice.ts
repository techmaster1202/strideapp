/* eslint-disable no-param-reassign */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './appStore';
import {IAuthState} from '../interfaces/IAuthentication.ts';

const initialState: IAuthState = {
  user: null,
  token: '',
  sessionTimedOut: false,
  isLoggedIn: false,
  darkMode: false,
  shouldSubscribe: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoggedIn: (state, action: PayloadAction<IAuthState>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.sessionTimedOut = action.payload.sessionTimedOut;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.shouldSubscribe = action.payload.shouldSubscribe;
    },
    userLoggedOut: state => {
      state.user = null;
      state.token = '';
      state.sessionTimedOut = false;
      state.darkMode = false;
      state.isLoggedIn = false;
      state.shouldSubscribe = false;
    },
    userProfileUpdated: (state, action: PayloadAction<IAuthState>) => {
      if (action.payload.user) {
        state.user = {
          ...state.user,
          ...action.payload.user,
        };
      }
    },
  },
});

export const {userLoggedIn, userLoggedOut, userProfileUpdated} =
  authSlice.actions;

export const selectAuthState = (state: RootState): IAuthState => state.auth;

export default authSlice.reducer;
