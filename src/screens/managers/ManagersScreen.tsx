import {StyleSheet, View, FlatList, ScrollView} from 'react-native';
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
import {Props, Cleaner, Car} from '../../types/index.ts';
import * as AppConstants from '../../constants/constants.ts';
import {
  deleteManager,
  getAllCarsByManager,
  getManagerList,
  resetManagerPassword,
} from '../../services/managersService.ts';
import CustomActivityIndicator from '../../components/CustomActivityIndicator.tsx';
import Modal from 'react-native-modal';
import PageTitle from '../../components/PageTitle.tsx';
import Toast from 'react-native-toast-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageHeader from '../../components/PageHeader.tsx';
import {useFocusEffect} from '@react-navigation/native';
import ConfirmModal from '../../components/ConfirmModal.tsx';
import EmployeeCard from '../../components/EmployeeCard.tsx';

const ManagersScreen = ({navigation}: Props) => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);

  const [keyword, setKeyword] = useState('');
  const [users, setUsers] = useState<Cleaner[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [visible, setVisible] = useState(false);
  const [visibleCars, setVisibleCars] = useState(false);
  const [resetPwdVisible, setResetPwdVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedCleaner, setSelectedCleaner] = useState<Cleaner>();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    await getManagerList(keyword, page)
      .then(response => {
        if (response.success) {
          const newUsers = response.data.users;
          if (newUsers.length > 0) {
            setUsers(prevUsers => {
              const uniqueUsers = [
                ...prevUsers,
                ...newUsers.filter(
                  (newUser: Cleaner) =>
                    !prevUsers.some(prevUser => prevUser.id === newUser.id),
                ),
              ];
              return uniqueUsers;
            });
            setPage(prevPage => prevPage + 1);
          } else {
            setHasMore(false);
          }
        }
      })
      .catch(error => {
        console.error('Failed to fetch users:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [keyword, page]);

  const handleChangeSearch = (val: string) => {
    setKeyword(val);
    setPage(1);
    setUsers([]);
    setHasMore(true);
    loadUsers();
  };

  const showModal = () => setVisible(true);
  const showResetPwdModal = () => setResetPwdVisible(true);
  const hideModal = () => setVisible(false);
  const hideResetPwdModal = () => setResetPwdVisible(false);

  const handleClickDelete = (id: any) => {
    setSelectedUserId(id);
    showModal();
  };

  const handleClickResetPwd = (id: any) => {
    setSelectedUserId(id);
    showResetPwdModal();
  };

  const deleteUser = async () => {
    if (selectedUserId) {
      setLoading(true);
      await deleteManager(selectedUserId)
        .then(response => {
          if (response.success) {
            setSelectedUserId(null);
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

  const resetPassword = async () => {
    if (selectedUserId) {
      setLoading(true);
      await resetManagerPassword(selectedUserId)
        .then(response => {
          setSelectedUserId(null);
          hideResetPwdModal();
          Toast.show({
            type: response.success ? 'success' : 'error',
            text1: response.message,
          });
          setLoading(false);
          return;
        })
        .catch(error => {
          setSelectedUserId(null);
          hideResetPwdModal();
          Toast.show({
            type: 'error',
            text1: error.message || 'Something went wrong, please try again.',
          });
          setLoading(false);
        });
    }
  };

  const handleShowProperty = async (cleaner: Cleaner) => {
    try {
      setSelectedCleaner(cleaner);
      setVisibleCars(true);
      setLoading(true);
      const response = await getAllCarsByManager(cleaner.id);
      setCars(response.data.cars);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong, please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useFocusEffect(
    React.useCallback(() => {
      setKeyword('');
      setPage(1);
      setUsers([]);
      setHasMore(true);
      loadUsers();
    }, []),
  );

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        {
          padding: 0,
        },
      ]}>
      <PageHeader navigation={navigation} title={AppConstants.TITLE_Managers} />
      <View style={styles.headerButtonRow}>
        <Button
          mode="contained"
          style={globalStyles.defaultModalButton}
          onPress={() => navigation.navigate('AddManager')}>
          {AppConstants.TITLE_AddNew}
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
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <EmployeeCard
            key={item.id}
            item={item}
            handleClickDelete={handleClickDelete}
            handleClickResetPwd={handleClickResetPwd}
            navigation={navigation}
            handleShowProperty={handleShowProperty}
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
          onPress={loadUsers}
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
              onPress={deleteUser}>
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
      {/* shows all cars by manager  */}
      <Modal isVisible={visibleCars} style={globalStyles.modalContainerBack}>
        <View
          style={{
            width: '100%',
            backgroundColor: theme.colors.background,
            borderRadius: theme.roundness,
            padding: 10,
          }}>
          <View
            style={{
              borderBottomColor: theme.colors.secondary,
              borderBottomWidth: 1,
              marginBottom: 10,
              paddingBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, fontWeight: 500}}>
              {`${selectedCleaner?.first_name} ${selectedCleaner?.last_name}`}
              's Vehicles
            </Text>
            <Button onPress={() => setVisibleCars(false)}>close</Button>
          </View>
          <ScrollView
            style={{
              flexGrow: 0,
            }}>
            <CustomActivityIndicator loading={loading} />
            {cars.map((car, index) => (
              <View
                key={car.id}
                style={[
                  {marginBottom: 10},
                  index !== cars.length - 1
                    ? {
                        borderBottomWidth: 1,
                        borderBottomColor: theme.colors.secondary,
                        paddingVertical: 10,
                      }
                    : {},
                ]}>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                  <Text style={{flex: 1}}>CAR NAME</Text>
                  <Text style={{flex: 1}}>{car.name}</Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                  <Text style={{flex: 1}}>NOTES</Text>
                  <Text
                    style={{
                      flex: 1,
                    }}>
                    {car.notes}
                  </Text>
                </View>

                <View
                  style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <IconButton
                    icon="pencil"
                    mode="contained"
                    size={20}
                    onPress={() => {
                      navigation.navigate('UpdateCar', car);
                    }}
                  />
                </View>
              </View>
            ))}
            {cars.length <= 0 ? (
              <View>
                <Text>No record found!</Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </Modal>

      <ConfirmModal
        visible={visible}
        title="Delete Record"
        contents="Are you sure want to delete this record?"
        confirmString={AppConstants.TITLE_DeleteRecord}
        cancelString={AppConstants.TITLE_Cancel}
        loading={loading}
        onConfirm={deleteUser}
        onCancel={hideModal}
        confirmStyle="warning"
      />

      <ConfirmModal
        visible={resetPwdVisible}
        title="Reset Password"
        contents="Are you sure you want to reset this user's password? This action cannot be undone."
        confirmString={AppConstants.TITLE_DeleteRecord}
        cancelString={AppConstants.TITLE_Cancel}
        loading={loading}
        onConfirm={resetPassword}
        onCancel={hideResetPwdModal}
        confirmStyle="warning"
      />
      <CustomActivityIndicator loading={loading} />
    </SafeAreaView>
  );
};

export default ManagersScreen;

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
  cardHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5,
  },
  cardHeaderAction: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
