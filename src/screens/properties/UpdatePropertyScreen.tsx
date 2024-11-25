import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Button, Checkbox, Text, TextInput, useTheme} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Controller, useForm} from 'react-hook-form';
import {createGlobalStyles} from '../../utils/styles.ts';
import {
  UpdateUserScreenProps,
  PropertyDetailFormData,
} from '../../types/index.ts';
import * as AppConstants from '../../constants/constants.ts';
import DetailPageHeader from '../../components/DetailPageHeader.tsx';
import {
  deleteFile,
  uploadAttachmentFile,
} from '../../services/managersService.ts';
import CustomActivityIndicator from '../../components/CustomActivityIndicator.tsx';
import FileUploader from '../../components/FileUploader.tsx';
import {getMimeType} from '../../utils/helpers.ts';
import {getProperty, updateProperty} from '../../services/propertiesService.ts';
import {Dropdown} from 'react-native-paper-dropdown';
import {LogBox} from 'react-native';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested', // Suppress this specific warning
]);

const beds = Array.from({length: 11}, (_, i) => ({
  label: i.toString(),
  value: i.toString(),
}));
const bathrooms = Array.from({length: 19.5}, (_, i) => ({
  label: (1 + i * 0.5).toString(),
  value: (1 + i * 0.5).toString(),
}));

const UpdatePropertyScreen = ({route, navigation}: UpdateUserScreenProps) => {
  const {id} = route.params;

  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<Record<string, any>[]>([]);
  const [hosts, setHosts] = useState<Record<string, any>[]>([]);
  const [countries, setCountries] = useState<Record<string, any>[]>([]);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<PropertyDetailFormData>();

  const onSubmit = async (data: PropertyDetailFormData) => {
    if (loading) {
      return;
    }

    setLoading(true);
    data.name = data.name || 'need';
    data.price = (data.price || 0).toString();
    data.beds = Number(data.beds) || 1;
    data.baths = Number(data.baths) || 1;
    data.accommodation_size = Number(data.accommodation_size) || 0;
    data.entrance_code = (data.entrance_code || 0).toString();
    data.address_line_1 = data.address_line_1 || 'need';
    data.zip_code = data.zip_code || 'need';
    data.city = data.city || 'need';
    data.state = data.state || 'need';
    data.ical_url = data.ical_url || 'need';
    data.host_id = data.host_id ? Number(data.host_id) : null;

    await updateProperty(data)
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
        console.log(error);
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
      await getProperty(id).then(res => {
        setAttachments(res.data.property.attachments);
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
      url = `/property/${id}/upload_image`;
      res = await uploadAttachmentFile(url, formData);
      setAttachments(p => [...p, res]);
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

  useEffect(() => {
    getProperty(id).then(res => {
      reset(res.data.property);
      setAttachments(res.data.property?.attachments ?? []);
      setHosts(res.data.hosts);
      setCountries(res.data.countries);
    });
  }, [id]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <DetailPageHeader
        navigation={navigation}
        title={AppConstants.TITLE_UpdateProperty}
      />
      <ScrollView nestedScrollEnabled={true}>
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
            <View style={globalStyles.errorField}>
              {errors.host_id?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.host_id?.message}
                </Text>
              )}
            </View>

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
              rules={{
                pattern: {
                  value: /^-?\d+(\.\d+)?$/i,
                  message: AppConstants.ERROR_InvalidPrice,
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_Price}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_Price}
                  textContentType="none"
                  style={globalStyles.textInput}
                />
              )}
              name="price"
            />
            <View style={globalStyles.errorField}>
              {errors.price?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.price?.message}
                </Text>
              )}
            </View>

            <Controller
              control={control}
              rules={{}}
              render={({field: {onChange, value}}) => (
                <Dropdown
                  mode="outlined"
                  label={AppConstants.LABEL_Beds}
                  placeholder={AppConstants.LABEL_Beds}
                  options={beds}
                  value={value?.toString()}
                  onSelect={onChange}
                />
              )}
              name="beds"
            />
            <View style={globalStyles.errorField}>
              {errors.beds?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.beds?.message}
                </Text>
              )}
            </View>
            <Controller
              control={control}
              rules={{}}
              render={({field: {onChange, value}}) => (
                <Dropdown
                  mode="outlined"
                  label={AppConstants.LABEL_Bathrooms}
                  placeholder={AppConstants.LABEL_Bathrooms}
                  options={bathrooms}
                  value={value?.toString()}
                  onSelect={onChange}
                />
              )}
              name="baths"
            />
            <View style={globalStyles.errorField}>
              {errors.baths?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.baths?.message}
                </Text>
              )}
            </View>

            <Controller
              control={control}
              rules={{
                pattern: {
                  value: /^-?\d+(\.\d+)?$/i,
                  message: AppConstants.ERROR_InvalidNumber,
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_AccommodationSize}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value?.toString()}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_AccommodationSize}
                  textContentType="none"
                  style={globalStyles.textInput}
                />
              )}
              name="accommodation_size"
            />
            <View style={globalStyles.errorField}>
              {errors.accommodation_size?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.accommodation_size?.message}
                </Text>
              )}
            </View>
            <Controller
              control={control}
              rules={{
                pattern: {
                  value: /^-?\d+(\.\d+)?$/i,
                  message: AppConstants.ERROR_InvalidNumber,
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_EntranceCode}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value?.toString()}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_EntranceCode}
                  textContentType="none"
                  style={globalStyles.textInput}
                />
              )}
              name="entrance_code"
            />
            <View style={globalStyles.errorField}>
              {errors.entrance_code?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.entrance_code?.message}
                </Text>
              )}
            </View>

            <Controller
              control={control}
              rules={{}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_SupplyClosetLocation}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_SupplyClosetLocation}
                  textContentType="none"
                  style={globalStyles.textInput}
                />
              )}
              name="supply_closet_location"
            />
            <View style={globalStyles.errorField}>
              {errors.supply_closet_location?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.supply_closet_location?.message}
                </Text>
              )}
            </View>

            <Controller
              control={control}
              rules={{}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_SupplyClosetKey}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_SupplyClosetKey}
                  textContentType="none"
                  style={globalStyles.textInput}
                />
              )}
              name="supply_closet_code"
            />
            <View style={globalStyles.errorField}>
              {errors.supply_closet_code?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.supply_closet_code?.message}
                </Text>
              )}
            </View>

            <Controller
              control={control}
              rules={{}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_CheckInTime}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_CheckInTime}
                  textContentType="none"
                  style={globalStyles.textInput}
                />
              )}
              name="check_in_time"
            />
            <View style={globalStyles.errorField}>
              {errors.check_in_time?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.check_in_time?.message}
                </Text>
              )}
            </View>

            <Controller
              control={control}
              rules={{}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_CheckOutTime}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_CheckOutTime}
                  textContentType="none"
                  style={globalStyles.textInput}
                />
              )}
              name="check_out_time"
            />
            <View style={globalStyles.errorField}>
              {errors.check_out_time?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.check_out_time?.message}
                </Text>
              )}
            </View>

            <Controller
              control={control}
              rules={{}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_AddressLine1}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_AddressLine1}
                  textContentType="streetAddressLine1"
                  style={globalStyles.textInput}
                />
              )}
              name="address_line_1"
            />
            <View style={globalStyles.errorField}>
              {errors.address_line_1?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.address_line_1?.message}
                </Text>
              )}
            </View>

            <Controller
              control={control}
              rules={{}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_AddressLine2}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_AddressLine2}
                  textContentType="streetAddressLine2"
                  style={globalStyles.textInput}
                />
              )}
              name="address_line_2"
            />
            <View style={globalStyles.errorField}>
              {errors.address_line_2?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.address_line_2?.message}
                </Text>
              )}
            </View>

            <Controller
              control={control}
              rules={{}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_ZipCode}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_ZipCode}
                  textContentType="none"
                  style={globalStyles.textInput}
                />
              )}
              name="zip_code"
            />
            <View style={globalStyles.errorField}>
              {errors.zip_code?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.zip_code?.message}
                </Text>
              )}
            </View>

            <Controller
              control={control}
              rules={{}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_City}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_City}
                  textContentType="addressCity"
                  style={globalStyles.textInput}
                />
              )}
              name="city"
            />
            <View style={globalStyles.errorField}>
              {errors.city?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.city?.message}
                </Text>
              )}
            </View>

            <Controller
              control={control}
              rules={{}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_State}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_State}
                  textContentType="addressCity"
                  style={globalStyles.textInput}
                />
              )}
              name="state"
            />

            <View style={globalStyles.errorField}>
              {errors.state?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.state?.message}
                </Text>
              )}
            </View>

            <Controller
              control={control}
              rules={{}}
              render={({field: {onChange, value}}) => (
                <Dropdown
                  mode="outlined"
                  label={AppConstants.LABEL_Country}
                  placeholder={AppConstants.LABEL_Country}
                  options={countries.map(c => ({
                    label: c.country_name,
                    value: c.country_name,
                  }))}
                  value={value}
                  onSelect={onChange}
                />
              )}
              name="country"
            />
            <View style={globalStyles.errorField}>
              {errors.country?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.country?.message}
                </Text>
              )}
            </View>
            <Text>More Detail</Text>
            <View style={{flexDirection: 'row', marginBottom: 5, gap: 4}}>
              <Controller
                control={control}
                rules={{}}
                render={({field: {onChange, value}}) => (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Checkbox
                      status={value === true ? 'checked' : 'unchecked'}
                      onPress={() => onChange(!value)}
                    />
                    <Text>Pets Allowed</Text>
                  </View>
                )}
                name="pets_allowed"
              />
              <Controller
                control={control}
                rules={{}}
                render={({field: {onChange, value}}) => (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Checkbox
                      status={value === true ? 'checked' : 'unchecked'}
                      onPress={() => onChange(!value)}
                    />
                    <Text>Laundry Needed</Text>
                  </View>
                )}
                name="laundry_needed"
              />
              <Controller
                control={control}
                rules={{}}
                render={({field: {onChange, value}}) => (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Checkbox
                      status={value === true ? 'checked' : 'unchecked'}
                      onPress={() => onChange(!value)}
                    />
                    <Text>Washer Dryer On Site</Text>
                  </View>
                )}
                name="washer_dryer_on_site"
              />
            </View>
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

            <View style={globalStyles.errorField}>
              {errors.notes?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.notes?.message}
                </Text>
              )}
            </View>

            <FileUploader
              label="Reference Photos"
              existingFiles={attachments}
              deleteFile={onDeleteFile}
              uploadFile={file => uploadFile('image', file)}
            />

            <Controller
              control={control}
              rules={{}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_ICalLink}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_ICalLink}
                  textContentType="URL"
                  style={globalStyles.textInput}
                />
              )}
              name="ical_url"
            />
            <View style={globalStyles.errorField}>
              {errors.ical_url?.message && (
                <Text style={globalStyles.errorText}>
                  {errors.ical_url?.message}
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

export default UpdatePropertyScreen;
