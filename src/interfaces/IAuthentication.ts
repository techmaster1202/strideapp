import {UserProfile} from '../types/index.ts';

export interface IAuthState {
  user: UserProfile | null;
  token: string | null;
  sessionTimedOut: boolean;
  isLoggedIn: boolean;
  darkMode: boolean;
  shouldSubscribe: boolean;
}
