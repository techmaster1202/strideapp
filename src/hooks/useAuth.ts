import authService from '../services/authService.ts';

export const useAuth = () => {
  const firebaseConfig = {
    apiKey: 'REPLACE-ME',
    authDomain: 'REPLACE-ME.firebaseapp.com',
    databaseURL: 'https://REPLACE-ME.firebaseio.com',
    projectId: 'REPLACE-ME',
    storageBucket: 'REPLACE-ME.appspot.com',
    messagingSenderId: 'REPLACE-ME',
    appId: 'REPLACE-ME',
  };

  // Sign out user
  const signoutUser = async () => {
    console.log('BEGIN SignOut');

    console.log('END SignOut');
  };

  // Register user
  const signupUser = async (
    userFullName: string,
    userEmail: string,
    userPassword: string,
  ) => {
    console.log('BEGIN SignUp');

    console.log('END SignUp');
    return null;
  };

  // Login user
  const signinUser = async (email: string, password: string) => {
    console.log('BEGIN SignIn');
    const result = await authService.login(email, password);
    console.log('END SignIn');
    return null;
  };

  return {
    signupUser,
    signinUser,
    signoutUser,
  };
};
