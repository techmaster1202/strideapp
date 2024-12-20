import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Button, Text, TextInput, useTheme} from 'react-native-paper';
import {createGlobalStyles} from '../../utils/styles.ts';
import {CarDetailFormData, UpdateUserScreenProps} from '../../types/index.ts';
import * as AppConstants from '../../constants/constants.ts';
import DetailPageHeader from '../../components/DetailPageHeader.tsx';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Controller, useForm} from 'react-hook-form';
import Toast from 'react-native-toast-message';
import CustomActivityIndicator from '../../components/CustomActivityIndicator.tsx';
import {getCar, getCarFormData, updateCar} from '../../services/carsService.ts';
import {Dropdown} from 'react-native-paper-dropdown';

const UpdateCarScreen = ({route, navigation}: UpdateUserScreenProps) => {
  const {id} = route.params;
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const [loading, setLoading] = useState(false);
  const [hosts, setHosts] = useState<{name: string; id: number}[]>([]);
  const [cleaners, setCleaners] = useState<{name: string; id: number}[]>([]);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm<CarDetailFormData>();

  const onSubmit = async (data: CarDetailFormData) => {
    if (loading) {
      return;
    }

    setLoading(true);
    await updateCar(id, data)
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
      })
      .finally(() => {
        setLoading(false);
        navigation.goBack();
      });
  };

  useEffect(() => {
    getCarFormData().then(res => {
      setHosts(res.data.hosts);
      setCleaners(res.data.cleaners);
      console.log(res.data);
    });
    getCar(id).then(res => {
      setValue('name', res.data.car.name);
      setValue('host_id', res.data.car.host_id);
      setValue('selective_assign', res.data.car.selective_assign);
      setValue('license_plate', res.data.car.license_plate);
      setValue('color', res.data.car.color);
      setValue('turo_id', res.data.car.turo_id);
      setValue('notes', res.data.car.notes);
    });
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <DetailPageHeader
        navigation={navigation}
        title={AppConstants.TITLE_UpdateCar}
      />
      <ScrollView>
        <View style={[globalStyles.container]}>
          <View style={{width: '100%', marginBottom: 20}}>
            <Controller
              control={control}
              rules={{
                required: {
                  message: AppConstants.ERROR_ClientIsRequired,
                  value: true,
                },
              }}
              render={({field: {onChange, value}}) => (
                <Dropdown
                  mode="outlined"
                  label={AppConstants.LABEL_Client}
                  placeholder={AppConstants.LABEL_Client}
                  options={hosts.map(h => ({
                    label: h.name,
                    value: h.id?.toString(),
                  }))}
                  value={value?.toString()}
                  onSelect={onChange}
                />
              )}
              name="host_id"
            />
            <View style={globalStyles.errorField} />
            <Controller
              control={control}
              rules={{
                required: {
                  message: AppConstants.ERROR_NameIsRequired,
                  value: true,
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_Name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_Name}
                  textContentType="name"
                  style={globalStyles.textInput}
                />
              )}
              name="name"
            />
            <View style={globalStyles.errorField}>
              {errors.name?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.name?.message}
                </Text>
              )}
            </View>

            <Controller
              control={control}
              rules={{}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_LicensePlate}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_LicensePlate}
                  textContentType="name"
                  style={globalStyles.textInput}
                />
              )}
              name="license_plate"
            />
            <View style={globalStyles.errorField} />
            <Controller
              control={control}
              rules={{}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_VehicleColor}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_VehicleColor}
                  textContentType="none"
                  style={globalStyles.textInput}
                />
              )}
              name="color"
            />
            <View style={globalStyles.errorField} />
            <Controller
              control={control}
              rules={{}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_TuroId}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_TuroId}
                  textContentType="none"
                  style={globalStyles.textInput}
                />
              )}
              name="turo_id"
            />
            <View style={globalStyles.errorField} />
            <Controller
              control={control}
              rules={{}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_Notes}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_Notes}
                  textContentType="none"
                  style={globalStyles.textInput}
                />
              )}
              name="notes"
            />
            <View style={globalStyles.errorField} />
            <Controller
              control={control}
              rules={{
                required: {
                  message: AppConstants.ERROR_ClientIsRequired,
                  value: true,
                },
              }}
              render={({field: {onChange, value}}) => (
                <Dropdown
                  mode="outlined"
                  label={AppConstants.LABEL_SelectiveManager}
                  placeholder={AppConstants.LABEL_SelectiveManager}
                  options={cleaners.map(h => ({
                    label: h.name,
                    value: h.id?.toString(),
                  }))}
                  value={value?.toString()}
                  onSelect={onChange}
                />
              )}
              name="selective_assign"
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

export default UpdateCarScreen;
