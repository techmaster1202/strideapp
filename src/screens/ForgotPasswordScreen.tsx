import React, {useState} from 'react';
import {Button, Surface, TextInput, useTheme, Text} from 'react-native-paper';
import {View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import * as Animatable from 'react-native-animatable';
import * as AppConstants from '../constants/constants.ts';
import {useValidation} from '../hooks/useValidation.ts';
import {Background} from '../components/Background.tsx';
import Logo from '../components/Logo.tsx';
import {resetPassword} from '../services/authService.ts';
import {Navigation, Props, ResetPasswordFormData} from '../types/index.ts';
import Toast from 'react-native-toast-message';
import CustomActivityIndicator from '../components/CustomActivityIndicator.tsx';
import {createGlobalStyles} from '../utils/styles.ts';

export default function SignUpScreen({navigation}: Props) {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);

  const [loading, setLoading] = useState(false);
  const {validateEmail} = useValidation();
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm<ResetPasswordFormData>();

  const onSubmit = (data: ResetPasswordFormData) => {
    handleResetPassword(data.emailAddress);
  };

  const handleResetPassword = async (email: string) => {
    setLoading(true);
    await resetPassword(email)
      .then(response => {
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
            {errors.emailAddress && errors.emailAddress.type === 'required' && (
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

          <View style={{gap: 10, marginTop: 20}}>
            <Button
              mode="contained"
              compact
              onPress={handleSubmit(onSubmit)}
              style={globalStyles.defaultButton}>
              {AppConstants.TITLE_SendResetLink}
            </Button>

            <Button
              mode="text"
              compact
              onPress={() => navigation.navigate('SignIn')}
              style={globalStyles.defaultButton}>
              {AppConstants.LABEL_goBackToLogin}
            </Button>
          </View>
        </Surface>
      </Animatable.View>
      <CustomActivityIndicator loading={loading} />
    </Background>
  );
}
