import React, {useState} from 'react';
import {Button, Surface, TextInput, useTheme, Text} from 'react-native-paper';
import {Dimensions, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../store/hook.ts';
import * as AppConstants from '../constants/constants.ts';
import {useValidation} from '../hooks/useValidation.ts';
import {Background} from '../components/Background.tsx';
import Logo from '../components/Logo.tsx';
import {signup} from '../services/authService.ts';
import {Props, SignUpFormData} from '../types/index.ts';
import {userLoggedIn} from '../store/authSlice';
import {IAuthState} from '../interfaces/IAuthentication.ts';
import {STORAGE_KEY} from '../utils/constantKey.ts';
import Toast from 'react-native-toast-message';
import CustomActivityIndicator from '../components/CustomActivityIndicator.tsx';
import {createGlobalStyles} from '../utils/styles.ts';
import {ScrollView} from 'react-native-gesture-handler';

export default function SignUpScreen({navigation}: Props) {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);

  const {width, height} = Dimensions.get('screen');

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
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
        <Surface
          style={{
            ...globalStyles.surface,
            height: height * 0.8,
          }}
          elevation={3}>
          <ScrollView alwaysBounceVertical={true}>
            <Logo />
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
                  style={globalStyles.textInput}
                />
              )}
              name="firstName"
            />
            <View style={globalStyles.errorField}>
              {errors.firstName?.message && (
                <Text style={globalStyles.errorText}>
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
                  style={globalStyles.textInput}
                />
              )}
              name="lastName"
            />
            <View style={globalStyles.errorField}>
              {errors.lastName?.message && (
                <Text style={globalStyles.errorText}>
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
                  style={globalStyles.textInput}
                />
              )}
              name="phoneNumber"
            />
            <View style={globalStyles.errorField}>
              {errors.phoneNumber?.message && (
                <Text style={globalStyles.errorText}>
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
                  placeholder={AppConstants.LABEL_EmailAddress}
                  textContentType="emailAddress"
                  style={globalStyles.textInput}
                />
              )}
              name="emailAddress"
            />
            <View style={globalStyles.errorField}>
              {errors.emailAddress &&
                errors.emailAddress.type === 'required' && (
                  <Text style={globalStyles.errorText}>
                    {AppConstants.ERROR_EmailIsRequired}
                  </Text>
                )}
              {errors.emailAddress &&
                errors.emailAddress.type === 'invalidEmail' && (
                  <Text style={globalStyles.errorText}>
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
                  placeholder={AppConstants.LABEL_Password}
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
                  style={globalStyles.textInput}
                />
              )}
              name="confirmPassword"
            />
            <View style={globalStyles.errorField}>
              {errors.confirmPassword &&
                errors.confirmPassword.type === 'required' && (
                  <Text style={globalStyles.errorText}>
                    {AppConstants.ERROR_PasswordIsRequired}
                  </Text>
                )}
              {errors.confirmPassword &&
                errors.confirmPassword.type === 'validate' && (
                  <Text style={globalStyles.errorText}>
                    {AppConstants.ERROR_ConfirmPassword}
                  </Text>
                )}
            </View>
            <Button
              mode="contained"
              compact
              onPress={handleSubmit(onSubmit)}
              style={globalStyles.defaultButton}>
              {AppConstants.TITLE_Register}
            </Button>
            <Button
              mode="text"
              compact
              onPress={() => navigation.navigate('SignIn')}
              style={globalStyles.defaultButton}>
              {AppConstants.LABEL_AlreadyAUser}
            </Button>
          </ScrollView>
        </Surface>
      </Animatable.View>
      <CustomActivityIndicator loading={loading} />
    </Background>
  );
}
