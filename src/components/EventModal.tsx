import React, {useEffect, useState} from 'react';
import {
  Button,
  IconButton,
  Portal,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';
import {Controller, useForm} from 'react-hook-form';
import {createGlobalStyles} from '../utils/styles';
import {Car, Cleaner, JobDetailedFormData} from '../types';
import * as AppConstants from '../constants/constants';
import CustomActivityIndicator from './CustomActivityIndicator';
import {useAppSelector} from '../store/hook';
import {selectAuthState} from '../store/authSlice';
import {useRoleAndPermission} from '../context/RoleAndPermissionContext';
import {
  deleteEvent,
  deleteEventFile,
  finishEvent,
  startEvent,
  updateEvent,
} from '../services/calendarService';
import Toast from 'react-native-toast-message';
import ConfirmModal from './ConfirmModal';
import {format, isValid, parse} from 'date-fns';
import FileUploader from './FileUploader';
import {getMimeType} from '../utils/helpers';
import {uploadAttachmentFile} from '../services/cleanersService';

interface IProps {
  visible: boolean;
  cars: Car[];
  cleaners: Cleaner[];
  event?: Record<string, any>;
  onClose: () => void;
  onRefresh?: () => Promise<void>;
}

function parseAndFormatDate(dateString: string) {
  // List of possible date formats to try
  const formats = [
    'yyyy-MM-dd HH:mm:ss', // Format 1: 2024-12-12 14:15:00
    'EEE MMM dd HH:mm:ss yyyy', // Format 2: Fri Dec 13 17:24:00 2024
  ];

  // Try parsing with each format
  for (const formatString of formats) {
    const parsedDate = parse(dateString, formatString, new Date());

    // Check if the parsed date is valid
    if (isValid(parsedDate)) {
      return format(parsedDate, 'yyyy-MM-dd HH:mm');
    }
  }

  // If no format works, throw an error
  throw new Error('Invalid date format');
}

const EventModal = ({
  visible,
  cars,
  cleaners,
  event,
  onClose,
  onRefresh,
}: IProps) => {
  const authState = useAppSelector(selectAuthState);
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car>();
  const [localLoading, setLocalLoading] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [photos, setPhotos] = useState<Record<string, any>[]>([]);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    watch,
  } = useForm<JobDetailedFormData>();
  const {hasAnyPermission} = useRoleAndPermission();
  const carId = watch('car_id');
  const startD = watch('start');
  const endD = watch('end');

  useEffect(() => {
    if (event) {
      setValue('id', event.id);
      setValue('property_id', event.property?.id);
      setValue('description', event.description);
      setValue(
        'start',
        event.start_time ? event.start_time : event.start ? event.start : '',
      );
      setValue(
        'end',
        event.end_time ? event.end_time : event.end ? event.end : '',
      );
      setValue('summary', event.summary ? event.summary : '');
      setValue('car_id', event.car ? event.car.id : '');
      setValue('car_name', event.car_name ? event.car_name : '');
      setValue(
        'delivery_location',
        event.delivery_location ? event.delivery_location : '',
      );
      setValue(
        'return_location',
        event.return_location ? event.return_location : '',
      );
      setValue('about_guest', event.about_guest ? event.about_guest : '');
      setValue('assigned_to', event.assigned_to ? event.assigned_to : '');
      setValue(
        'secondary_assigned_to',
        event.secondary_assigned_to ? event.secondary_assigned_to : '',
      );
      setValue('first_name', authState.user?.first_name);
      setValue('first_name', authState.user?.last_name);
      setPhotos(event?.photos?.length ? event?.photos : []);
      console.log(event?.photos);
    }
  }, [event]);

  useEffect(() => {
    if (cars && carId) {
      setSelectedCar(cars.find(car => car.id === carId));
    }
  }, [carId, cars]);

  const start = async () => {
    try {
      setLocalLoading(true);
      const res = await startEvent(event?.id);
      Toast.show({
        type: 'success',
        text1: res.data.message,
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong, please try again.',
      });
    } finally {
      await onRefresh?.();
      setLocalLoading(false);
      onClose();
    }
  };

  const finish = async () => {
    try {
      setLocalLoading(true);
      const res = await finishEvent(event?.id);
      console.log(res.data);
      if (res.data.error) {
        Toast.show({
          type: 'error',
          text1: res.data.error,
        });
      } else if (res.data.warning) {
        Toast.show({
          type: 'warning',
          text1: res.data.warning,
        });
      } else {
        Toast.show({
          type: 'success',
          text1: res.data.message,
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong, please try again.',
      });
    } finally {
      await onRefresh?.();
      setLocalLoading(false);
      setShowFinishConfirm(false);
      onClose();
    }
  };

  const deleteAppointment = async () => {
    try {
      setLocalLoading(true);
      const res = await deleteEvent(event?.id);
      console.log(res);
      Toast.show({
        type: 'success',
        text1: res.data.message,
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong, please try again.',
      });
    } finally {
      await onRefresh?.();
      setLocalLoading(false);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const onSubmit = async (formData: Record<string, any>) => {
    try {
      console.log('calling Submit function');
      setLocalLoading(false);
      const payload = {...formData};
      payload.assigned_to = formData.cleaner_id;
      payload.secondary_assigned_to = formData.secondary_cleaner_id;
      payload.start = parseAndFormatDate(startD);
      console.log(payload.start);
      payload.end = parseAndFormatDate(endD);
      console.log(`end ${payload.end}`);

      if (formData.start_datepicker) {
        payload.start = `${format(
          new Date(formData.start_datepicker),
          'yyyy-MM-dd',
        )} ${format(new Date(formData.start_time), 'HH:mm')}`;
        payload.end = null;
      }
      if (formData.end_datepicker) {
        payload.start = null;
        payload.end = `${format(
          new Date(formData.end_datepicker),
          'yyyy-MM-dd',
        )} ${format(new Date(formData.end_time), 'HH:mm')}`;
      }

      const res = await updateEvent(event?.id, payload);
      Toast.show({
        type: 'success',
        text1: res.data.message,
      });
    } catch (error: any) {
      console.log('calling Submit function err');
      console.log(error);
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong, please try again.',
      });
    } finally {
      await onRefresh?.();
      setLocalLoading(false);
      onClose();
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
      url = `/calendar/appointments/${event?.id}/upload`;
      res = await uploadAttachmentFile(url, formData);
      console.log('file uploaded. ', res);
      setPhotos(p => [...p, res]);
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

  const onDeleteFile = async (fileId: string) => {
    try {
      await deleteEventFile(fileId);
      Toast.show({
        type: 'success',
        text1: 'file successfully deleted',
      });
      setPhotos(p => [...p.filter(f => f.id !== fileId)]);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong, please try again.',
      });
    } finally {
      await onRefresh?.();
    }
  };

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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 20}}>Appointment Detail</Text>
                <IconButton icon={'close'} onPress={onClose} />
              </View>

              <Text style={[styles.label]}>Assigned Manager:</Text>

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
              <Text style={styles.label}>Secondary Manager:</Text>
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
              <View style={{marginBottom: 15}} />
              <Text style={styles.label}>Car:</Text>
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
              <View style={{marginBottom: 15}}>
                <Text style={styles.label}>
                  License Plate: {selectedCar?.license_plate}
                </Text>
                <Text style={styles.label}>
                  Vehicle Color: {selectedCar?.color}
                </Text>
              </View>
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
              <View style={{marginVertical: 10}}>
                <FileUploader
                  label="Photos"
                  existingFiles={photos}
                  deleteFile={onDeleteFile}
                  uploadFile={file => uploadFile('image', file)}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  gap: 4,
                  marginTop: 10,
                  paddingBottom: 30,
                }}>
                {hasAnyPermission?.('delete-appointments') ? (
                  <Button
                    onPress={() => setShowDeleteConfirm(true)}
                    mode="contained"
                    style={globalStyles.dangerModalButton}>
                    Delete
                  </Button>
                ) : null}
                {!event?.started_at &&
                hasAnyPermission?.('start-appointments') ? (
                  <Button
                    onPress={start}
                    mode="contained"
                    style={globalStyles.defaultModalButton}>
                    START
                  </Button>
                ) : null}
                {event?.started_at !== null &&
                event?.completed_at === null &&
                hasAnyPermission?.('finish-appointments') ? (
                  <Button
                    onPress={() => setShowFinishConfirm(true)}
                    mode="contained"
                    style={globalStyles.defaultModalButton}>
                    FINISH
                  </Button>
                ) : null}
                {hasAnyPermission?.('create-appointments') ||
                hasAnyPermission?.('create-car-appointments') ? (
                  <Button
                    onPress={handleSubmit(onSubmit)}
                    mode="contained"
                    style={globalStyles.defaultModalButton}>
                    {AppConstants.TITLE_Save}
                  </Button>
                ) : null}
              </View>
            </View>
            <CustomActivityIndicator loading={localLoading} />
          </View>
        </ScrollView>
        <DatePicker
          modal
          open={openStartDatePicker}
          date={new Date()}
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
          date={new Date()}
          onConfirm={date => {
            setValue('end', date.toLocaleString());
            setOpenEndDatePicker(false); // Close the modal after confirmation
          }}
          onCancel={() => {
            setOpenEndDatePicker(false); // Close the modal when cancelled
          }}
        />
        <ConfirmModal
          visible={showFinishConfirm}
          title="Appointment Finish"
          contents="Are you sure you want to finish?"
          confirmString={AppConstants.TITLE_DeleteRecord}
          cancelString={AppConstants.TITLE_Cancel}
          loading={localLoading}
          onConfirm={finish}
          onCancel={() => setShowFinishConfirm(false)}
          confirmStyle="default"
        />
        <ConfirmModal
          visible={showDeleteConfirm}
          title="Delete Appointment"
          contents="Are you sure want to delete this record?"
          confirmString={AppConstants.TITLE_DeleteRecord}
          cancelString={AppConstants.TITLE_Cancel}
          loading={localLoading}
          onConfirm={deleteAppointment}
          onCancel={() => setShowDeleteConfirm(false)}
          confirmStyle="warning"
        />
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
});

export default EventModal;
