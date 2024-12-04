import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Button, Text, TextInput, useTheme} from 'react-native-paper';
import {createGlobalStyles} from '../../utils/styles.ts';
import {ManagerDetailFormData, Props} from '../../types/index.ts';
import * as AppConstants from '../../constants/constants.ts';
import DetailPageHeader from '../../components/DetailPageHeader.tsx';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Controller, useForm} from 'react-hook-form';
import {useValidation} from '../../hooks/useValidation.ts';
import Toast from 'react-native-toast-message';
import CustomActivityIndicator from '../../components/CustomActivityIndicator.tsx';
import {createManager} from '../../services/managersService.ts';

const AddManagerScreen = ({navigation}: Props) => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const {validateEmail} = useValidation();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm<ManagerDetailFormData>();

  const onSubmit = async (data: ManagerDetailFormData) => {
    if (loading) {
      return;
    }

    setLoading(true);
    await createManager(
      data.firstName,
      data.lastName,
      data.emailAddress,
      data.phoneNumber,
    )
      .then(response => {
        if (response.success) {
          setValue('firstName', '');
          setValue('lastName', '');
          setValue('emailAddress', '');
          setValue('phoneNumber', '');
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <DetailPageHeader
        navigation={navigation}
        title={AppConstants.TITLE_AddManager}
      />
      <ScrollView>
        <View style={[globalStyles.container]}>
          <View style={{width: '100%', marginBottom: 20}}>
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
                required: {
                  message: AppConstants.ERROR_PhoneNumberIsRequired,
                  value: true,
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
                  textContentType="none"
                  style={globalStyles.textInput}
                />
              )}
              name="phoneNumber"
            />
            <View style={globalStyles.errorField}>
              {errors.phoneNumber && errors.phoneNumber.type === 'required' && (
                <Text style={globalStyles.errorText}>
                  {AppConstants.ERROR_PhoneNumberIsRequired}
                </Text>
              )}
              {errors.phoneNumber &&
                errors.phoneNumber.type === 'invalidPhone' && (
                  <Text style={globalStyles.errorText}>
                    {AppConstants.ERROR_InvalidPhone}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddManagerScreen;
