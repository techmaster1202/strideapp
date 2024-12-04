import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ExpandableCalendar,
  TimelineEventProps,
  TimelineList,
  CalendarProvider,
  TimelineProps,
  CalendarUtils,
  DateData,
} from 'react-native-calendars';
import PageHeader from '../components/PageHeader';
import {Car, Cleaner, JobDetailedFormData, Props} from '../types';
import * as AppConstants from '../constants/constants';
import {useFocusEffect} from '@react-navigation/native';
import {Button, Portal, TextInput, useTheme} from 'react-native-paper';
import {addMinutes, endOfMonth, format, parse, startOfMonth} from 'date-fns';
import {
  createNewJob,
  createStripeSubscription,
  getCalendarEvents,
} from '../services/calendarService';
import groupBy from 'lodash/groupBy';
import Toast from 'react-native-toast-message';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {createGlobalStyles} from '../utils/styles.ts';
import CustomActivityIndicator from '../components/CustomActivityIndicator.tsx';
import Modal from 'react-native-modal';
import {Controller, useForm} from 'react-hook-form';
import {getCleanerList} from '../services/cleanersService.ts';
import {getCarList} from '../services/carsService.ts';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import {LogBox} from 'react-native';
import {debounce} from 'lodash';
import {PaymentSheetError, useStripe} from '@stripe/stripe-react-native';
import {useAppDispatch, useAppSelector} from '../store/hook.ts';
import {selectAuthState, userLoggedIn} from '../store/authSlice.ts';
import {STORAGE_KEY} from '../utils/constantKey.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoleAndPermission} from '../context/RoleAndPermissionContext.tsx';

LogBox.ignoreLogs([
  'ReactImageView',
  'A props object containing a "key" prop is being spread into JSX',
]);

export const getDate = (offset = 0) =>
  CalendarUtils.getCalendarDateString(
    new Date().setDate(new Date().getDate() + offset),
  );

const TimelineCalendarScreen = ({navigation}: Props) => {
  const authState = useAppSelector(selectAuthState);
  const {hasAnyPermission} = useRoleAndPermission();
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const [currentDate, setCurrentDate] = useState(getDate());
  const [eventsByDate, setEventsByDate] = useState<Record<string, any>>({});
  const [marked, setMarked] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  // const [selectEvent, setSelectedEvent] = useState<Record<string, any>>();
  const [visible, setVisible] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  // const [properties, setProperties] = useState<Property[]>([]);
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [currentMonth, setCurrentMonth] = useState(
    format(new Date(), 'yyyy-MM'),
  );
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    getValues,
  } = useForm<JobDetailedFormData>();

  const onSubmit = async (data: JobDetailedFormData) => {
    if (loading) {
      return;
    }

    setLoading(true);
    if (!data.start) {
      Toast.show({
        type: 'error',
        text1: 'Trip start date time is required',
      });
      return;
    }
    if (!data.end) {
      Toast.show({
        type: 'error',
        text1: 'Trip end date time is required',
      });
      return;
    }

    data.start = format(new Date(data.start), 'yyyy-MM-dd HH:mm');
    data.end = format(new Date(data.end), 'yyyy-MM-dd HH:mm');

    await createNewJob(data)
      .then(response => {
        Toast.show({
          type: 'success',
          text1: response.message,
        });
        setLoading(false);
        setVisible(false);
        return;
      })
      .catch((error: any) => {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: error.message || 'Something went wrong, please try again.',
        });
      })
      .finally(() => {
        setLoading(false);
      });

    await fetchFilteredEvents(currentDate, '', true);
  };

  const fetchFilteredEvents = useCallback(
    async (date: string, q = '', ignore = false) => {
      setLoading(true);
      try {
        const start = startOfMonth(new Date(date)).toISOString();
        const end = endOfMonth(new Date(date)).toISOString();

        const monthStr = format(new Date(date), 'yyyy-MM');
        // Skip if we're still in the same month
        console.log(`monthStr: ${monthStr}, currentMonth: ${currentMonth}`);
        if (
          monthStr === currentMonth &&
          Object.keys(eventsByDate).length &&
          !ignore
        ) {
          return;
        }

        setCurrentMonth(monthStr);
        console.log(
          `monthStr: ${monthStr}, currentMonth: ${currentMonth} fetching new data`,
        );
        const respData = await getCalendarEvents({start, end, q});
        const data = respData.map((ev: Record<string, any>) => {
          let color = '#4a6bdc';
          if (ev.appointment_type === 1) {
            if (ev.start_time) {
              color = 'green';
            }
            if (ev.end_time) {
              color = 'red';
            }
          }
          if (ev.completed_at) {
            color = 'black';
          }
          if (!ev.end) {
            ev.end = ev.start;
          }
          if (!ev.start) {
            ev.start = ev.end;
          }

          if (ev.start === ev.end) {
            const parsedDate = parse(ev.end, 'yyyy-MM-dd HH:mm:ss', new Date());
            const newEndDate = addMinutes(parsedDate, Math.random() + 35);
            ev.end = format(newEndDate, 'yyyy-MM-dd HH:mm:ss');
          }

          return {
            ...ev,
            color: color,
          };
        });
        setEventsByDate(
          groupBy(data, e => CalendarUtils.getCalendarDateString(e.start)),
        );

        const marks: Record<string, {marked: boolean}> = {};
        data.forEach((ev: Record<string, any>) => {
          const dateKey = CalendarUtils.getCalendarDateString(ev.start);
          marks[dateKey] = {marked: true};
        });
        setMarked(marks);
      } catch (error: any) {
        console.log('Error fetching events:', error);
        Toast.show({
          type: 'error',
          text1: error.message || 'Something went wrong, please try again.',
        });
      } finally {
        setLoading(false);
      }
    },
    [currentMonth, eventsByDate],
  );

  const onDateChanged = (date: string) => {
    setCurrentDate(date);
  };

  const onMonthChange = (month: DateData) => {
    setCurrentDate(month.dateString);
    fetchFilteredEvents(month.dateString);
  };

  const onEventPress = (event: TimelineEventProps) => {
    // setSelectedEvent(event);
    console.log(event);
  };

  const handleChangeSearch = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedKeyword(val);
      }, 300),
    [],
  );

  const initializePaymentSheet = async () => {
    try {
      //caling our backend api to get clientSecret
      const res = await createStripeSubscription();
      const {error} = await initPaymentSheet({
        merchantDisplayName: 'Stride',
        paymentIntentClientSecret: res.clientSecret,
        returnURL: 'strideapp://payment-sheet',

        // Set `allowsDelayedPaymentMethods` to true if your business handles
        // delayed notification payment methods like US bank accounts.
        allowsDelayedPaymentMethods: true,
      });
      if (error) {
        Toast.show({
          type: 'error',
          text1: error.message || 'Something went wrong, please try again.',
        });
        return false;
      }
      return true;
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong, please try again.',
      });
    }
  };

  const triggerPaymentSheet = async () => {
    const init = await initializePaymentSheet();
    if (!init) {
      return;
    }
    const {error} = await presentPaymentSheet();
    if (error) {
      if (error.code === PaymentSheetError.Failed) {
        Toast.show({
          type: 'error',
          text1: error.message || 'Payment failed.',
        });
        // Handle failed
      } else if (error.code === PaymentSheetError.Canceled) {
        // Handle canceled
        Toast.show({
          type: 'error',
          text1: error.message || 'Payment Canceled.',
        });
      }
    } else {
      // Payment succeeded
      Toast.show({
        type: 'success',
        text1: 'subscription completed',
      });
      const userDataStr = await AsyncStorage.getItem(STORAGE_KEY);
      if (userDataStr) {
        const userData = {...JSON.parse(userDataStr), shouldSubscribe: false};
        dispatch(userLoggedIn({...userData}));
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({...userData}));
      }
    }
  };

  useEffect(() => {
    if (authState.shouldSubscribe) {
      triggerPaymentSheet();
    }
  }, [authState]);

  useEffect(() => {
    fetchFilteredEvents(currentDate, debouncedKeyword, true);
  }, [debouncedKeyword]);

  useFocusEffect(
    useCallback(() => {
      if (authState.shouldSubscribe) {
        // triggerPaymentSheet();
      }
    }, [authState.shouldSubscribe]),
  );

  useFocusEffect(
    useCallback(() => {
      const newCurrentDate = getDate();
      fetchFilteredEvents(newCurrentDate);
      setCurrentDate(newCurrentDate);
      setSearchInput('');
      setDebouncedKeyword('');
    }, []),
  );

  useEffect(() => {
    getCleanerList('', 1)
      .then(res => {
        setCleaners(res.data.users);
      })
      .catch(console.log);
    getCarList('')
      .then(res => {
        setCars(res.data.cars);
      })
      .catch(console.log);
    // getPropertyList('', 1).then(res => {
    //   // setProperties(res.data.properties);
    //   console.log(res.data);
    // });
  }, []);

  const timelineProps: Partial<TimelineProps> = {
    format24h: true,
    overlapEventsSpacing: 8,
    rightEdgeSpacing: 24,
    onEventPress: onEventPress,
    styles: {
      event: {
        borderRadius: 4,
      },

      eventTitle: {
        color: '#fff',
      },
      eventSummary: {
        color: '#fff',
      },
      eventTimes: {
        color: 'transparent',
      },
    },
  };

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        {
          padding: 0,
        },
      ]}>
      <PageHeader navigation={navigation} title={AppConstants.TITLE_Calendar} />
      <View style={[styles.headerButtonRow, {gap: 10, marginBottom: 10}]}>
        <Button
          mode="contained"
          style={[globalStyles.defaultModalButton, {width: 'auto'}]}
          disabled={
            !hasAnyPermission?.([
              'create-appointments',
              'create-car-appointments',
            ])
          }
          onPress={() => setVisible(true)}>
          {AppConstants.TITLE_Add}
        </Button>
      </View>
      <View style={styles.searchBar}>
        <TextInput
          label={AppConstants.LABEL_Search}
          placeholder={AppConstants.LABEL_Search}
          mode="outlined"
          left={<TextInput.Icon icon="magnify" />}
          style={globalStyles.textInput}
          onChangeText={text => {
            setSearchInput(text);
            handleChangeSearch(text);
          }}
          value={searchInput}
        />
      </View>
      <CalendarProvider
        date={currentDate}
        onDateChanged={onDateChanged}
        onMonthChange={onMonthChange}
        showTodayButton
        disabledOpacity={0.6}
        style={{flex: 1}}>
        <ExpandableCalendar
          firstDay={1}
          markedDates={marked}
          theme={{
            dotColor: theme.colors.primary,
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDotColor: theme.colors.secondaryContainer,
            arrowColor: theme.colors.primary,
          }}
          refreshing={loading}
        />
        <TimelineList
          events={eventsByDate}
          timelineProps={timelineProps}
          showNowIndicator
          scrollToFirst
        />
      </CalendarProvider>
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
                    onPress={() => setVisible(false)}
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
            date={
              getValues('start') ? new Date(getValues('start')) : new Date()
            }
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

      <CustomActivityIndicator loading={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerButtonRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 5,
  },
  searchBar: {
    width: '100%',
    paddingHorizontal: 20,
  },
  contentsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  fieldName: {
    width: 120,
  },
});

export default TimelineCalendarScreen;
