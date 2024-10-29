import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme, Text, TextInput, Button} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import {useAppSelector} from '../store/hook.ts';
import {selectAuthState} from '../store/authSlice.ts';
import * as AppConstants from '../constants/constants.ts';
import {useValidation} from '../hooks/useValidation.ts';
import {updateProfile, deleteUserProfile} from '../services/authService.ts';
import {useAppDispatch} from '../store/hook.ts';
import {userProfileUpdated, userLoggedOut} from '../store/authSlice.ts';
import {IAuthState} from '../interfaces/IAuthentication.ts';
import {STORAGE_KEY} from '../utils/constantKey.ts';
import CustomActivityIndicator from './CustomActivityIndicator.tsx';
import Toast from 'react-native-toast-message';
import {UpdateProfileFormData} from '../types/index.ts';
import {createGlobalStyles} from '../utils/styles.ts';
import PageTitle from './PageTitle.tsx';

const UpdateProfileForm = () => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const authState = useAppSelector(selectAuthState);

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = React.useState(false);

  const dispatch = useAppDispatch();
  const {validateEmail} = useValidation();

  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
    setValue,
  } = useForm<UpdateProfileFormData>();

  const onSubmit = (data: UpdateProfileFormData) => {
    handleUpdateProfile(data.firstName, data.lastName, data.emailAddress);
  };

  const handleUpdateProfile = async (
    fname: string,
    lname: string,
    email: string,
  ) => {
    setLoading(true);
    await updateProfile(fname, lname, email)
      .then(response => {
        if (response.success) {
          const user: IAuthState = {
            ...authState,
            user: response.data.user,
          };
          dispatch(userProfileUpdated(user));
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

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const deleteUser = async () => {
    const id = authState.user?.id;
    if (id) {
      await deleteUserProfile(id)
        .then(response => {
          if (response.success) {
            AsyncStorage.removeItem(STORAGE_KEY);
            dispatch(userLoggedOut());
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
    }
  };

  const loadUserProfile = () => {
    const {first_name, last_name, email} = authState.user || {};
    setValue('firstName', first_name || '');
    setValue('lastName', last_name || '');
    setValue('emailAddress', email || '');
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  return (
    <View style={globalStyles.formSection}>
      <PageTitle>{'Update Profile'}</PageTitle>
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
          <Text style={globalStyles.errorText}>{errors.lastName?.message}</Text>
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
            disabled
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
        {errors.emailAddress && errors.emailAddress.type === 'invalidEmail' && (
          <Text style={globalStyles.errorText}>
            {AppConstants.ERROR_InvalidEmail}
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
      <Button
        mode="contained"
        compact
        onPress={showModal}
        style={[globalStyles.dangerButton, {marginTop: 15}]}>
        {AppConstants.LABEL_DeleteAccount}
      </Button>

      <Modal isVisible={visible} style={globalStyles.modalContainerBack}>
        <View style={globalStyles.modalContainer}>
          <View style={{alignItems: 'center', gap: 20}}>
            <Text style={globalStyles.errorText} variant="titleLarge">
              Delete User
            </Text>
            <PageTitle>Are you sure want to delete this record?</PageTitle>
          </View>
          <View style={globalStyles.modalButtonGroup}>
            <Button
              onPress={deleteUser}
              mode="contained"
              style={globalStyles.dangerModalButton}>
              {AppConstants.LABEL_DeleteRecord}
            </Button>
            <Button
              onPress={hideModal}
              mode="contained"
              style={globalStyles.defaultModalButton}>
              {AppConstants.LABEL_Cancel}
            </Button>
          </View>
        </View>
      </Modal>
      <CustomActivityIndicator loading={loading} />
    </View>
  );
};

export default UpdateProfileForm;
