import {StyleSheet, View, FlatList} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Button,
  Divider,
  Text,
  TextInput,
  useTheme,
  IconButton,
} from 'react-native-paper';
import {createGlobalStyles} from '../../utils/styles.ts';
import {Props, Car} from '../../types/index.ts';
import * as AppConstants from '../../constants/constants.ts';
import CustomActivityIndicator from '../../components/CustomActivityIndicator.tsx';
import Modal from 'react-native-modal';
import PageTitle from '../../components/PageTitle.tsx';
import Toast from 'react-native-toast-message';
import PageHeader from '../../components/PageHeader.tsx';
import {useFocusEffect} from '@react-navigation/native';
import ConfirmModal from '../../components/ConfirmModal.tsx';
import CarCard from '../../components/CarCard.tsx';
import {deleteCar, getCarList, getEvents} from '../../services/carsService.ts';
import CarAvailabilityTable from '../../components/CarAvailabilityTable.tsx';
import {TabView} from 'react-native-tab-view';
import {addDays, format, parseISO, isWithinInterval} from 'date-fns';

interface IProps {
  handleChangeSearch: (v: string) => void;
  loadCars: () => Promise<void>;
  hideModal: () => void;
  onDeleteCar: () => Promise<void>;
  handleClickDelete: (id: number) => void;
  visible: boolean;
  navigation: any;
  cars: Car[];
  loading: boolean;
  hasMore: boolean;
}
const CarsView = ({
  cars,
  navigation,
  hasMore,
  loading,
  visible,
  handleChangeSearch,
  handleClickDelete,
  hideModal,
  onDeleteCar,
  loadCars,
}: IProps) => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  return (
    <View style={[globalStyles.container, {padding: 0}]}>
      <View style={[styles.headerButtonRow, {gap: 10}]}>
        <Button
          mode="contained"
          style={[globalStyles.defaultModalButton, {width: 'auto'}]}
          onPress={() => navigation.navigate('AddCar')}>
          {AppConstants.TITLE_AddNewCar}
        </Button>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          label={AppConstants.LABEL_Search}
          placeholder={AppConstants.LABEL_Search}
          mode="outlined"
          left={<TextInput.Icon icon="magnify" />}
          style={globalStyles.textInput}
          onChangeText={handleChangeSearch}
        />
      </View>
      <Divider />
      <FlatList
        data={cars}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <CarCard
            key={item.id}
            item={item}
            handleClickDelete={handleClickDelete}
            navigation={navigation}
          />
        )}
        style={{
          width: '100%',
          paddingHorizontal: 20,
          marginVertical: 10,
        }}
      />
      {hasMore && !loading && (
        <IconButton
          icon="refresh"
          mode="contained"
          size={30}
          onPress={loadCars}
          style={{
            position: 'absolute',
            backgroundColor: theme.colors.onPrimary,
            bottom: 20,
          }}
        />
      )}

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
              mode="contained"
              style={globalStyles.dangerModalButton}
              onPress={onDeleteCar}>
              {AppConstants.TITLE_DeleteRecord}
            </Button>
            <Button
              onPress={hideModal}
              mode="contained"
              style={globalStyles.defaultModalButton}>
              {AppConstants.TITLE_Cancel}
            </Button>
          </View>
          <CustomActivityIndicator loading={loading} />
        </View>
      </Modal>

      <ConfirmModal
        visible={visible}
        title="Delete Car"
        contents="Are you sure want to delete this record?"
        confirmString={AppConstants.TITLE_DeleteRecord}
        cancelString={AppConstants.TITLE_Cancel}
        loading={loading}
        onConfirm={onDeleteCar}
        onCancel={hideModal}
        confirmStyle="warning"
      />
      <CustomActivityIndicator loading={loading} />
    </View>
  );
};

const CarsScreen = ({navigation}: Props) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'cars', title: 'Cars'},
    {key: 'car-availability', title: 'Cars Availability'},
  ]);

  const [keyword, setKeyword] = useState('');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [dates, setDates] = useState<Date[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const shiftUnit = 7;

  const getDates = useCallback(() => {
    const daysToAdd = shiftUnit;
    setDates(Array.from({length: daysToAdd}, (_, i) => addDays(startDate, i)));
  }, [startDate]);

  const onGetEvents = useCallback(async () => {
    const daysToAdd = shiftUnit;
    const endDate = addDays(startDate, daysToAdd);

    try {
      const data = await getEvents(
        startDate.toISOString(),
        endDate.toISOString(),
      );
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, [startDate]);

  const shiftWeek = useCallback(
    (direction: number) => {
      const newStartDate = addDays(startDate, direction * shiftUnit);
      setStartDate(newStartDate);
    },
    [startDate],
  );

  const isDateInRange = (
    dateString: string,
    dateRanges: {start?: string; end?: string}[][],
  ) => {
    const dateToCheck = parseISO(dateString);

    return dateRanges.some(rangePair => {
      const startDate = rangePair.find(range => range.start)?.start;
      const endDate = rangePair.find(range => range.end)?.end;
      const start = startDate ? parseISO(startDate) : null;
      const end = endDate ? parseISO(endDate) : null;

      if (start && end) {
        return isWithinInterval(dateToCheck, {start, end});
      } else if (start && !end) {
        return dateToCheck >= start;
      } else if (!start && end) {
        return dateToCheck <= end;
      }
      return false;
    });
  };

  const isCarRented = (carId: number, date: Date) => {
    const inputDateStr = format(date, 'yyyy-MM-dd');
    const filteredCarEvents = events.filter(event => event.car.id === carId);

    const dateRange: {start?: string; end?: string}[][] = [];

    filteredCarEvents.forEach(event => {
      let startEvent: {start?: string} = {};
      let endEvent: {end?: string} = {};
      let pairId: any = null;
      let pairEvent = null;

      if (event.start_time) {
        startEvent = {
          start: format(parseISO(event.start_time), 'yyyy-MM-dd'),
        };
        pairId = event.id + 1;
        pairEvent = filteredCarEvents.find(e => e.id === pairId);
      }

      if (event.end_time) {
        endEvent = {
          end: format(parseISO(event.end_time), 'yyyy-MM-dd'),
        };
        pairId = event.id - 1;
        pairEvent = filteredCarEvents.find(e => e.id === pairId);
      }

      if (pairEvent) {
        if (pairEvent.start_time) {
          startEvent = {
            start: format(parseISO(pairEvent.start_time), 'yyyy-MM-dd'),
          };
        }
        if (pairEvent.end_time) {
          endEvent = {
            end: format(parseISO(pairEvent.end_time), 'yyyy-MM-dd'),
          };
        }
      }
      dateRange.push([startEvent, endEvent]);
    });

    return isDateInRange(inputDateStr, dateRange);
  };

  const loadCars = useCallback(async () => {
    setLoading(true);
    await getCarList(keyword)
      .then(response => {
        if (response.success) {
          setCars(response.data.cars);
          setHasMore(false);
        }
      })
      .catch(error => {
        console.error('Failed to fetch users:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [keyword]);

  const handleChangeSearch = (val: string) => {
    setKeyword(val);
    setCars([]);
    setHasMore(true);
    loadCars();
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleClickDelete = (id: any) => {
    setSelectedCarId(id);
    showModal();
  };

  const onDeleteCar = async () => {
    if (selectedCarId) {
      setLoading(true);
      await deleteCar(selectedCarId)
        .then(response => {
          if (response.success) {
            setSelectedCarId(null);
            hideModal();
            handleChangeSearch('');
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

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  useEffect(() => {
    getDates();
  }, [getDates]);

  useEffect(() => {
    onGetEvents();
  }, [onGetEvents]);

  useFocusEffect(
    React.useCallback(() => {
      setKeyword('');
      setCars([]);
      setHasMore(true);
      loadCars();
    }, []),
  );

  const renderScene = ({
    route,
  }: {
    route: {
      key: string;
      title: string;
    };
  }) => {
    switch (route.key) {
      case 'cars':
        return (
          <CarsView
            cars={cars}
            loadCars={loadCars}
            loading={loading}
            hasMore={hasMore}
            navigation={navigation}
            hideModal={hideModal}
            handleChangeSearch={handleChangeSearch}
            handleClickDelete={handleClickDelete}
            onDeleteCar={onDeleteCar}
            visible={visible}
          />
        );
      case 'car-availability':
        return (
          <CarAvailabilityTable
            dates={dates}
            cars={cars}
            isCarRented={isCarRented}
            shiftWeek={shiftWeek}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <PageHeader navigation={navigation} title={AppConstants.TITLE_Cars} />
      <TabView
        navigationState={{index, routes}}
        onIndexChange={setIndex}
        renderScene={renderScene}
        swipeEnabled={false}
      />
    </>
  );
};

export default CarsScreen;

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
