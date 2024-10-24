import React, {useState} from 'react';
import {
  Button,
  Surface,
  TextInput,
  useTheme,
  Snackbar,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import {StyleSheet, Dimensions, StatusBar, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import * as Animatable from 'react-native-animatable';
import {useAppDispatch} from '../store/hook.ts';
import * as AppConstants from '../constants/constants.ts';
import {ImageOverlay} from '../components/image-overlay.tsx';
import {useAuth} from '../hooks/useAuth.ts';
import {useValidation} from '../hooks/useValidation.ts';
import {Background} from '../components/Background.tsx';
import Logo from '../components/Logo.tsx';
import {signup} from '../services/authService.ts';
import {Navigation} from '../types/index.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userLoggedIn} from '../store/authSlice';
import {IAuthState} from '../interfaces/IAuthentication.ts';
import {STORAGE_KEY} from '../utils/constantKey.ts';

type SignUpFormData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
};

type Props = {
  navigation: Navigation;
};

export default function SignUpScreen({navigation}: Props) {
  const theme = useTheme();
  const [showSnack, setShowSnack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const dispatch = useAppDispatch();
  const {signupUser} = useAuth();
  const {validateEmail} = useValidation();
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm<SignUpFormData>();

  const onSubmit = (data: SignUpFormData) => {
    handleSignUp(
      data.firstName,
      data.lastName,
      data.phoneNumber,
      data.emailAddress,
      data.password,
    );
  };

  const onDismissSnackBar = () => setShowSnack(false);

  const handleSignUp = async (
    fname: string,
    lname: string,
    phone: string,
    email: string,
    password: string,
  ) => {
    setLoading(true);
    await signup(fname, lname, phone, email, password)
      .then(response => {
        if (response.success) {
          const user: IAuthState = {
            user: response.data.user,
            token: response.data.access_token,
            sessionTimedOut: false,
            isLoggedIn: true,
            darkMode: false,
          };
          dispatch(userLoggedIn(user));
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        }
        setSnackMessage(response.message);
        setShowSnack(true);
        setLoading(false);
        return;
      })
      .catch(error => {
        setSnackMessage(
          error.message || 'Something went wrong, please try again.',
        );
        setShowSnack(true);
        setLoading(false);
      });
  };

  return (
    <Background>
      <StatusBar barStyle="light-content" />
      <Animatable.View
        style={[styles.contentContainer]}
        animation="fadeInUpBig">
        <Surface style={styles.surface} elevation={1}>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Logo />
          </View>
          <Controller
            control={control}
            rules={{
              required: {
                message: AppConstants.ERROR_FirstNameIsRequired,
                value: true,
              },
              pattern: {
                value: /^[A-Za-z]+$/i,
                message: AppConstants.ERROR_InvalidName,
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label={AppConstants.LABEL_FirstName}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                mode="outlined"
                placeholder={AppConstants.PLACEHOLDER_FirstName}
                textContentType="name"
                style={styles.textInput}
              />
            )}
            name="firstName"
          />
          <View style={styles.errorField}>
            {errors.firstName?.message && (
              <Text style={{color: theme.colors.error}}>
                {errors.firstName?.message}
              </Text>
            )}
          </View>

          <Controller
            control={control}
            rules={{
              required: {
                message: AppConstants.ERROR_LastNameIsRequired,
                value: true,
              },
              pattern: {
                value: /^[A-Za-z]+$/i,
                message: AppConstants.ERROR_InvalidName,
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label={AppConstants.LABEL_LastName}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                mode="outlined"
                placeholder={AppConstants.PLACEHOLDER_LastName}
                textContentType="name"
                style={styles.textInput}
              />
            )}
            name="lastName"
          />
          <View style={styles.errorField}>
            {errors.lastName?.message && (
              <Text style={{color: theme.colors.error}}>
                {errors.lastName?.message}
              </Text>
            )}
          </View>

          <Controller
            control={control}
            rules={{
              required: {
                message: AppConstants.ERROR_PhoneNumberIsRequired,
                value: true,
              },
              pattern: {
                value: /^[0-9]+$/i,
                message: AppConstants.ERROR_InvalidPhone,
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label={AppConstants.LABEL_MobilePhone}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                mode="outlined"
                placeholder={AppConstants.PLACEHOLDER_Phone}
                textContentType="telephoneNumber"
                style={styles.textInput}
              />
            )}
            name="phoneNumber"
          />
          <View style={styles.errorField}>
            {errors.phoneNumber?.message && (
              <Text style={{color: theme.colors.error}}>
                {errors.phoneNumber?.message}
              </Text>
            )}
          </View>

          <Controller
            control={control}
            rules={{
              required: {
                message: AppConstants.ERROR_EmailIsRequired,
                value: true,
              },
              validate: {
                invalidEmail: value => {
                  return validateEmail(value);
                },
              },
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
                style={styles.textInput}
              />
            )}
            name="emailAddress"
          />
          <View style={styles.errorField}>
            {errors.emailAddress && errors.emailAddress.type === 'required' && (
              <Text style={{color: theme.colors.error}}>
                {AppConstants.ERROR_EmailIsRequired}
              </Text>
            )}
            {errors.emailAddress &&
              errors.emailAddress.type === 'invalidEmail' && (
                <Text style={{color: theme.colors.error}}>
                  {AppConstants.ERROR_InvalidEmail}
                </Text>
              )}
          </View>

          <Controller
            control={control}
            rules={{
              maxLength: 16,
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
                style={styles.textInput}
              />
            )}
            name="password"
          />
          <View style={styles.errorField}>
            {errors.password && (
              <Text style={{color: theme.colors.error}}>
                {AppConstants.ERROR_PasswordIsRequired}
              </Text>
            )}
          </View>

          <Controller
            control={control}
            rules={{
              maxLength: 16,
              required: true,
              validate: val => {
                if (watch('password') != val) {
                  return AppConstants.ERROR_ConfirmPassword;
                }
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label={AppConstants.LABEL_ConfirmPassword}
                mode="outlined"
                placeholder={AppConstants.PLACEHOLDER_ConfirmPassword}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
                textContentType="password"
                style={styles.textInput}
              />
            )}
            name="confirmPassword"
          />
          <View style={styles.errorField}>
            {errors.confirmPassword &&
              errors.confirmPassword.type === 'required' && (
                <Text style={{color: theme.colors.error}}>
                  {AppConstants.ERROR_PasswordIsRequired}
                </Text>
              )}
            {errors.confirmPassword &&
              errors.confirmPassword.type === 'validate' && (
                <Text style={{color: theme.colors.error}}>
                  {AppConstants.ERROR_ConfirmPassword}
                </Text>
              )}
          </View>
          <Button
            mode="contained"
            compact
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
            loading={loading}>
            {AppConstants.TITLE_Register}
          </Button>
          <Button
            mode="text"
            compact
            onPress={() => navigation.navigate('SignIn')}
            style={styles.button}>
            {AppConstants.LABEL_AlreadyAUser}
          </Button>
        </Surface>
      </Animatable.View>
      <Snackbar
        visible={showSnack}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Close',
          onPress: () => {
            onDismissSnackBar();
          },
        }}>
        {snackMessage}
      </Snackbar>
    </Background>
  );
}

const {width, height} = Dimensions.get('screen');
const container_height = height * 0.8;
const container_width = width * 0.85;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  surface: {
    paddingVertical: 20,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    borderRadius: 5,
    width: container_width,
  },
  button: {
    marginVertical: 10,
    width: '100%',
    borderRadius: 5,
  },
  textInput: {
    width: '100%',
  },
  errorField: {
    width: '100%',
    height: 25,
    display: 'flex',
    justifyContent: 'flex-start',
  },
});
