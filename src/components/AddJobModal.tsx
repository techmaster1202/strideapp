import React, {useState} from 'react';
import {Button, Portal, TextInput, useTheme} from 'react-native-paper';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';
import {Controller, useForm} from 'react-hook-form';
import {createGlobalStyles} from '../utils/styles';
import {Car, Cleaner, JobDetailedFormData} from '../types';
import * as AppConstants from '../constants/constants';
import CustomActivityIndicator from './CustomActivityIndicator';

interface IProps {
  visible: boolean;
  loading: boolean;
  cars: Car[];
  cleaners: Cleaner[];
  onSubmit: (data: JobDetailedFormData) => Promise<void>;
  onClose: () => void;
}

const AddJobModal = ({
  visible,
  loading,
  cars,
  cleaners,
  onSubmit,
  onClose,
}: IProps) => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    getValues,
  } = useForm<JobDetailedFormData>();

  return (
    <Portal>
      <Modal isVisible={visible} style={[globalStyles.modalContainerBack]}>
        <ScrollView
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 10,
          }}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                flex: 1,
                width: '100%',
              }}>
              <View style={{marginBottom: 10}}>
                <Text style={{fontSize: 20}}>Add New Job</Text>
              </View>
              {cars.length ? (
                <>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: theme.colors.secondary,
                      borderRadius: 4,
                    }}>
                    <Controller
                      control={control}
                      rules={{
                        required: {
                          message: AppConstants.ERROR_CarRequired,
                          value: true,
                        },
                      }}
                      render={({field: {onChange, value}}) => (
                        <Picker
                          onValueChange={onChange}
                          selectedValue={value}
                          placeholder={AppConstants.LABEL_Car}>
                          {cars.map(c => (
                            <Picker.Item
                              value={c.id}
                              label={c.name}
                              key={c.id}
                            />
                          ))}
                        </Picker>
                      )}
                      name="car_id"
                    />
                  </View>
                  <View style={globalStyles.errorField}>
                    {errors.car_id?.message && (
                      <Text style={globalStyles.errorText}>
                        {errors.car_id?.message}
                      </Text>
                    )}
                  </View>
                </>
              ) : null}

              <Controller
                control={control}
                rules={{}}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    label={AppConstants.LABEL_DeliveryLocation}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    mode="outlined"
                    placeholder={AppConstants.LABEL_DeliveryLocation}
                    textContentType="none"
                    style={globalStyles.textInput}
                  />
                )}
                name="delivery_location"
              />
              <View style={{marginBottom: 16}} />
              <Controller
                control={control}
                rules={{}}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    label={AppConstants.LABEL_Returnlocation}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    mode="outlined"
                    placeholder={AppConstants.LABEL_Returnlocation}
                    textContentType="none"
                    style={globalStyles.textInput}
                  />
                )}
                name="return_location"
              />
              <View style={{marginBottom: 16}} />
              <Controller
                control={control}
                rules={{}}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    label={AppConstants.LABEL_Abouttheguest}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    mode="outlined"
                    placeholder={AppConstants.LABEL_Abouttheguest}
                    textContentType="none"
                    style={globalStyles.textInput}
                  />
                )}
                name="about_guest"
              />
              <View style={{marginBottom: 16}} />
              <View
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.secondary,
                  borderRadius: 4,
                }}>
                <Controller
                  control={control}
                  rules={{
                    required: {
                      message: AppConstants.ERROR_ManagerRequired,
                      value: true,
                    },
                  }}
                  render={({field: {onChange, value}}) => (
                    <Picker
                      onValueChange={onChange}
                      selectedValue={value}
                      placeholder={AppConstants.LABEL_AssignManager}>
                      {cleaners.map(c => (
                        <Picker.Item
                          value={c.id}
                          label={`${c.first_name} ${c.last_name}`}
                          key={c.id}
                        />
                      ))}
                    </Picker>
                  )}
                  name="assigned_to"
                />
              </View>
              <View style={globalStyles.errorField}>
                {errors.assigned_to?.message && (
                  <Text style={globalStyles.errorText}>
                    {errors.assigned_to?.message}
                  </Text>
                )}
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.secondary,
                  borderRadius: 4,
                }}>
                <Controller
                  control={control}
                  rules={{}}
                  render={({field: {onChange, value}}) => (
                    <Picker
                      onValueChange={onChange}
                      selectedValue={value}
                      placeholder={AppConstants.LABEL_SecondaryManager}>
                      {cleaners.map(c => (
                        <Picker.Item
                          value={c.id}
                          label={`${c.first_name} ${c.last_name}`}
                          key={c.id}
                        />
                      ))}
                    </Picker>
                  )}
                  name="secondary_assigned_to"
                />
              </View>
              <View style={{marginBottom: 16}} />
              <Controller
                control={control}
                rules={{}}
                render={({field: {onChange, onBlur, value}}) => (
                  <Pressable onPress={() => setOpenStartDatePicker(true)}>
                    <TextInput
                      label={AppConstants.LABEL_TripStartDate}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      placeholder={AppConstants.LABEL_TripStartDate}
                      textContentType="none"
                      style={globalStyles.textInput}
                      readOnly
                      // Make the input read-only to prevent keyboard popup
                    />
                  </Pressable>
                )}
                name="start"
              />
              <View style={{marginBottom: 16}} />
              <Controller
                control={control}
                rules={{}}
                render={({field: {onChange, onBlur, value}}) => (
                  <Pressable onPress={() => setOpenEndDatePicker(true)}>
                    <TextInput
                      label={AppConstants.LABEL_TripEndDate}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      placeholder={AppConstants.LABEL_TripEndDate}
                      textContentType="none"
                      style={globalStyles.textInput}
                      readOnly
                      // Make the input read-only to prevent keyboard popup
                    />
                  </Pressable>
                )}
                name="end"
              />
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  gap: 4,
                  marginTop: 20,
                }}>
                <Button
                  onPress={onClose}
                  mode="contained"
                  style={globalStyles.dangerModalButton}>
                  {AppConstants.TITLE_Cancel}
                </Button>
                <Button
                  onPress={handleSubmit(onSubmit)}
                  mode="contained"
                  style={globalStyles.defaultModalButton}>
                  {AppConstants.TITLE_Save}
                </Button>
              </View>
            </View>
            <CustomActivityIndicator loading={loading} />
          </View>
        </ScrollView>
        <DatePicker
          modal
          open={openStartDatePicker}
          date={getValues('start') ? new Date(getValues('start')) : new Date()}
          onConfirm={date => {
            setValue('start', date.toLocaleString());
            setOpenStartDatePicker(false); // Close the modal after confirmation
          }}
          onCancel={() => {
            setOpenStartDatePicker(false); // Close the modal when cancelled
          }}
        />
        <DatePicker
          modal
          open={openEndDatePicker}
          date={getValues('end') ? new Date(getValues('end')) : new Date()}
          onConfirm={date => {
            setValue('end', date.toLocaleString());
            setOpenEndDatePicker(false); // Close the modal after confirmation
          }}
          onCancel={() => {
            setOpenEndDatePicker(false); // Close the modal when cancelled
          }}
        />
      </Modal>
    </Portal>
  );
};

export default AddJobModal;
