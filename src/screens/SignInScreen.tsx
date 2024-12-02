import React, {useState} from 'react';
import {Button, Surface, TextInput, useTheme, Text} from 'react-native-paper';
import {View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import * as Animatable from 'react-native-animatable';
import {useAppDispatch} from '../store/hook';
import * as AppConstants from '../constants/constants.ts';
import {login} from '../services/authService.ts';
import {Props, SignInFormData} from '../types/index.ts';
import Logo from '../components/Logo.tsx';
import {Background} from '../components/Background.tsx';
import {userLoggedIn} from '../store/authSlice';
import {IAuthState} from '../interfaces/IAuthentication.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEY} from '../utils/constantKey.ts';
import {createGlobalStyles} from '../utils/styles.ts';
import Toast from 'react-native-toast-message';
import CustomActivityIndicator from '../components/CustomActivityIndicator.tsx';

export default function SignInScreen({navigation}: Props) {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignInFormData>();

  const onSubmit = (data: SignInFormData) => {
    handleSignIn(data.emailAddress, data.password);
  };

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    await login(email, password)
      .then(response => {
        if (response.success) {
          const user: IAuthState = {
            user: response.data.user,
            token: response.data.access_token,
            sessionTimedOut: false,
            isLoggedIn: true,
            darkMode: false,
            shouldSubscribe: response.data?.should_subscribe,
          };
          console.log('after login');
          console.log(response.data);
          dispatch(userLoggedIn(user));
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        }
        Toast.show({
          type: response.success ? 'success' : 'error',
          text1: response.message,
        });
        setLoading(false);
        return;
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: error.message || 'Something went wrong, please try again.',
        });
        setLoading(false);
      });
  };

  return (
    <Background>
      <Animatable.View animation="fadeInUpBig">
        <Surface style={globalStyles.surface} elevation={3}>
          <Logo />
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label={AppConstants.LABEL_EmailAddress}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                mode="outlined"
                placeholder="Email Address"
                textContentType="emailAddress"
                style={globalStyles.textInput}
              />
            )}
            name="emailAddress"
          />
          <View style={globalStyles.errorField}>
            {errors.emailAddress && (
              <Text style={globalStyles.errorText}>
                {AppConstants.ERROR_EmailIsRequired}
              </Text>
            )}
          </View>
          <Controller
            control={control}
            rules={{
              maxLength: 100,
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label={AppConstants.LABEL_Password}
                mode="outlined"
                placeholder="Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
                textContentType="password"
                style={globalStyles.textInput}
              />
            )}
            name="password"
          />
          <View style={globalStyles.errorField}>
            {errors.password && (
              <Text style={globalStyles.errorText}>
                {AppConstants.ERROR_PasswordIsRequired}
              </Text>
            )}
          </View>

          <View style={{gap: 10, marginTop: 20}}>
            <Button
              mode="contained"
              compact
              onPress={handleSubmit(onSubmit)}
              style={[globalStyles.defaultButton]}>
              {AppConstants.TITLE_Login}
            </Button>
            <Button
              mode="text"
              compact
              onPress={() => navigation.navigate('ForgotPassword')}
              style={[globalStyles.defaultButton]}>
              {AppConstants.LABEL_ForgotPassword}
            </Button>
            <Button
              mode="text"
              compact
              onPress={() => navigation.navigate('SignUp')}
              style={[globalStyles.defaultButton]}>
              {AppConstants.LABEL_NotAUser}
            </Button>
          </View>
        </Surface>
      </Animatable.View>
      <CustomActivityIndicator loading={loading} />
    </Background>
  );
}
