import {View} from 'react-native';
import React, {useState} from 'react';
import {useTheme, Text, TextInput, Button} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {useAppSelector} from '../store/hook.ts';
import {selectAuthState} from '../store/authSlice.ts';
import * as AppConstants from '../constants/constants.ts';
import {updatePassword} from '../services/authService.ts';
import CustomActivityIndicator from './CustomActivityIndicator.tsx';
import PageTitle from './PageTitle.tsx';
import {createGlobalStyles} from '../utils/styles.ts';
import {UpdatePasswordFormData} from '../types/index.ts';
import Toast from 'react-native-toast-message';

const UpdatePasswordForm = () => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const authState = useAppSelector(selectAuthState);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
    setValue,
  } = useForm<UpdatePasswordFormData>();

  const onSubmit = (data: UpdatePasswordFormData) => {
    handleUpdatePassword(
      data.oldPassword,
      data.newPassword,
      data.confirmPassword,
    );
  };

  const handleUpdatePassword = async (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    setLoading(true);
    const email = authState.user?.email;
    if (email) {
      console.log('email  ====> ', email);
      await updatePassword(oldPassword, newPassword, confirmPassword, email)
        .then(response => {
          Toast.show({
            type: response.success ? 'success' : 'error',
            text1: response.message,
          });
          setLoading(false);
          setValue('oldPassword', '');
          setValue('newPassword', '');
          setValue('confirmPassword', '');
          return;
        })
        .catch(error => {
          Toast.show({
            type: 'error',
            text1: error.message || 'Something went wrong, please try again.',
          });
          setLoading(false);
        });
    }
  };

  return (
    <View style={globalStyles.formSection}>
      <PageTitle>{'Update Password'}</PageTitle>
      <Controller
        control={control}
        rules={{
          maxLength: 16,
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            label={AppConstants.LABEL_OldPassword}
            mode="outlined"
            placeholder={AppConstants.LABEL_OldPassword}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
            textContentType="password"
            style={globalStyles.textInput}
          />
        )}
        name="oldPassword"
      />
      <View style={globalStyles.errorField}>
        {errors.oldPassword && (
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
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            label={AppConstants.LABEL_NewPassword}
            mode="outlined"
            placeholder={AppConstants.LABEL_NewPassword}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
            textContentType="password"
            style={globalStyles.textInput}
          />
        )}
        name="newPassword"
      />
      <View style={globalStyles.errorField}>
        {errors.newPassword && (
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
            if (watch('newPassword') != val) {
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
        {AppConstants.LABEL_Save}
      </Button>
      <CustomActivityIndicator loading={loading} />
    </View>
  );
};

export default UpdatePasswordForm;
