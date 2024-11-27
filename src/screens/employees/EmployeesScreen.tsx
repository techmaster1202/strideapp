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
import {Props, Cleaner} from '../../types/index.ts';
import * as AppConstants from '../../constants/constants.ts';
import CustomActivityIndicator from '../../components/CustomActivityIndicator.tsx';
import Modal from 'react-native-modal';
import PageTitle from '../../components/PageTitle.tsx';
import Toast from 'react-native-toast-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageHeader from '../../components/PageHeader.tsx';
import {useFocusEffect} from '@react-navigation/native';
import ConfirmModal from '../../components/ConfirmModal.tsx';
import {
  deleteCleaner,
  getCleanerList,
  resetCleanerPassword,
} from '../../services/cleanersService.ts';
import EmployeeCard from '../../components/EmployeeCard.tsx';

const EmployeesScreen = ({navigation}: Props) => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);

  const [keyword, setKeyword] = useState('');
  const [users, setUsers] = useState<Cleaner[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [visible, setVisible] = useState(false);
  const [resetPwdVisible, setResetPwdVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    await getCleanerList(keyword, page)
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
      await deleteCleaner(selectedUserId)
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
      await resetCleanerPassword(selectedUserId)
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
      <PageHeader
        navigation={navigation}
        title={AppConstants.TITLE_Employees}
      />
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
            isCleaner={true}
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

      <ConfirmModal
        visible={visible}
        title="Delete User"
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

export default EmployeesScreen;

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
