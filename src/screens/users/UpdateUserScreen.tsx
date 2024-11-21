import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Button, Text, TextInput, useTheme} from 'react-native-paper';
import {Dropdown} from 'react-native-paper-dropdown';
import Toast from 'react-native-toast-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Controller, useForm} from 'react-hook-form';
import {createGlobalStyles} from '../../utils/styles.ts';
import {
  RoleOption,
  UpdateUserScreenProps,
  UserDetailFormData,
} from '../../types/index.ts';
import * as AppConstants from '../../constants/constants.ts';
import DetailPageHeader from '../../components/DetailPageHeader.tsx';
import {useValidation} from '../../hooks/useValidation.ts';
import {getAllRoles, updateUser} from '../../services/usersService.ts';
import CustomActivityIndicator from '../../components/CustomActivityIndicator.tsx';

const UpdateUserScreen = ({route, navigation}: UpdateUserScreenProps) => {
  const {id, email, name, roles} = route.params;

  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const {validateEmail} = useValidation();
  const [userRoles, setUserRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
    setValue,
  } = useForm<UserDetailFormData>();

  const onSubmit = async (data: UserDetailFormData) => {
    if (loading) return;

    setLoading(true);
    await updateUser(
      data.id,
      data.firstName,
      data.lastName,
      data.emailAddress,
      data.role,
    )
      .then(response => {
        if (response.success) {
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

  const loadRoles = async () => {
    await getAllRoles()
      .then(response => {
        if (response.success) {
          setUserRoles(response.data.roles);
        }
      })
      .catch(error => {
        console.error('Failed to fetch users:', error);
      });
  };

  const loadDefaultValue = () => {
    setValue('firstName', name.split(' ')[0]);
    setValue('lastName', name.split(' ')[1]);
    setValue('emailAddress', email);
    setValue('role', roles[0].id);
    setValue('id', id);
  };

  useEffect(() => {
    loadRoles();
    loadDefaultValue();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <DetailPageHeader
        navigation={navigation}
        title={AppConstants.TITLE_UpdateUser}
      />
      <View style={[globalStyles.container]}>
        <View style={{width: '100%', marginBottom: 20}}>
          <Controller
            control={control}
            rules={{
              required: {
                message: AppConstants.ERROR_RoleIsRequired,
                value: true,
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Dropdown
                mode="outlined"
                label={AppConstants.LABEL_Role}
                placeholder={AppConstants.LABEL_Role}
                options={userRoles}
                value={value}
                onSelect={onChange}
              />
            )}
            name="role"
          />
          <View style={globalStyles.errorField}>
            {errors.role?.message && (
              <Text style={globalStyles.errorText}>{errors.role?.message}</Text>
            )}
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
                placeholder={AppConstants.PLACEHOLDER_Email}
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
        </View>

        <Button
          mode="contained"
          compact
          style={globalStyles.defaultButton}
          onPress={handleSubmit(onSubmit)}>
          {AppConstants.TITLE_Save}
        </Button>
        <CustomActivityIndicator loading={loading} />
      </View>
    </SafeAreaView>
  );
};

export default UpdateUserScreen;
