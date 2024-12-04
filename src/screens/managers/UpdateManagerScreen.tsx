import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Button, Text, TextInput, useTheme} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Controller, useForm} from 'react-hook-form';
import {createGlobalStyles} from '../../utils/styles.ts';
import {
  UpdateUserScreenProps,
  CleanerDetailFormData,
} from '../../types/index.ts';
import * as AppConstants from '../../constants/constants.ts';
import DetailPageHeader from '../../components/DetailPageHeader.tsx';
import {useValidation} from '../../hooks/useValidation.ts';
import {
  deleteFile,
  getManager,
  updateManager,
  uploadAttachmentFile,
} from '../../services/managersService.ts';
import CustomActivityIndicator from '../../components/CustomActivityIndicator.tsx';
import FileUploader from '../../components/FileUploader.tsx';
import {getMimeType} from '../../utils/helpers.ts';

const UpdateManagerScreen = ({route, navigation}: UpdateUserScreenProps) => {
  const {id, email, first_name, last_name, phone_number} = route.params;

  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const {validateEmail} = useValidation();
  const [loading, setLoading] = useState(false);
  const [aggreements, setAgreements] = useState<Record<string, any>[]>([]);
  const [insurances, setInsurances] = useState<Record<string, any>[]>([]);
  const [others, setOthers] = useState<Record<string, any>[]>([]);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm<CleanerDetailFormData>();

  const onSubmit = async (data: CleanerDetailFormData) => {
    if (loading) {
      return;
    }

    setLoading(true);
    await updateManager(
      data.id,
      data.firstName,
      data.lastName,
      data.emailAddress,
      data.phoneNumber,
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

  const onDeleteFile = async (fileId: string) => {
    try {
      await deleteFile(fileId);
      await getManager(id).then(res => {
        setAgreements(res.data?.cleaner?.agreements);
        setInsurances(res.data?.cleaner?.insurances);
        setOthers(res.data?.cleaner?.others);
      });
      Toast.show({
        type: 'success',
        text1: 'file successfully deleted',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong, please try again.',
      });
    }
  };

  const uploadFile = async (
    file_name: string,
    file: Record<string, string>,
  ) => {
    try {
      const formData = new FormData();
      console.log(file);
      formData.append(file_name, {
        uri: file.url,
        name: file.file_name,
        type: getMimeType(file.file_name), // Adjust based on file type
      });
      let url = '';
      let res: any = null;
      switch (file_name) {
        case 'pond_agreement':
          url = `/manager/${id}/upload_agreement`;
          res = await uploadAttachmentFile(url, formData);
          setAgreements(p => [...p, res]);
          console.log(res);
          break;
        case 'pond_insurance':
          url = `/manager/${id}/upload_insurance`;
          res = await uploadAttachmentFile(url, formData);
          setInsurances(p => [...p, res]);
          break;
        case 'pond_other':
          url = `/manager/${id}/upload_other`;
          res = await uploadAttachmentFile(url, formData);
          setOthers(p => [...p, res]);
          break;
      }
      Toast.show({
        type: 'success',
        text1: 'file successfully uploaded.',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong, please try again.',
      });
    }
  };

  const loadDefaultValue = useCallback(() => {
    setValue('firstName', first_name);
    setValue('lastName', last_name);
    setValue('emailAddress', email);
    setValue('phoneNumber', phone_number);
    setValue('id', id);
  }, []);

  useEffect(() => {
    getManager(id).then(res => {
      setAgreements(res.data?.cleaner?.agreements);
      setInsurances(res.data?.cleaner?.insurances);
      setOthers(res.data?.cleaner?.others);
    });
    loadDefaultValue();
  }, [loadDefaultValue, id]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <DetailPageHeader
        navigation={navigation}
        title={AppConstants.TITLE_UpdateManager}
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
              {errors.phoneNumber?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.phoneNumber?.message}
                </Text>
              )}
            </View>

            <FileUploader
              label="Company's Agreement"
              existingFiles={aggreements}
              deleteFile={onDeleteFile}
              uploadFile={file => uploadFile('pond_agreement', file)}
            />
            <FileUploader
              label="Insurance"
              deleteFile={onDeleteFile}
              uploadFile={file => uploadFile('pond_insurance', file)}
              existingFiles={insurances}
            />
            <FileUploader
              label="Other Documents"
              deleteFile={onDeleteFile}
              uploadFile={file => uploadFile('pond_other', file)}
              existingFiles={others}
            />
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

export default UpdateManagerScreen;
