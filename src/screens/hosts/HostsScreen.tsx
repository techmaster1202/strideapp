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
import {Props, Host} from '../../types/index.ts';
import * as AppConstants from '../../constants/constants.ts';
import CustomActivityIndicator from '../../components/CustomActivityIndicator.tsx';
import Modal from 'react-native-modal';
import PageTitle from '../../components/PageTitle.tsx';
import Toast from 'react-native-toast-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageHeader from '../../components/PageHeader.tsx';
import {useFocusEffect} from '@react-navigation/native';
import ConfirmModal from '../../components/ConfirmModal.tsx';
import {deleteHost, getHostList} from '../../services/hostsService.ts';
import HostCard from '../../components/HostCard.tsx';

const HostsScreen = ({navigation}: Props) => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);

  const [keyword, setKeyword] = useState('');
  const [hosts, setHosts] = useState<Host[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedHostId, setSelectedHostId] = useState(null);

  const loadHosts = useCallback(async () => {
    setLoading(true);
    await getHostList(keyword, page)
      .then(response => {
        if (response.success) {
          setHosts(response.data.hosts);
          setHasMore(false);
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
    setHosts([]);
    setHasMore(true);
    loadHosts();
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleClickDelete = (id: any) => {
    setSelectedHostId(id);
    showModal();
  };

  const deleteUser = async () => {
    if (selectedHostId) {
      setLoading(true);
      await deleteHost(selectedHostId)
        .then(response => {
          if (response.success) {
            setSelectedHostId(null);
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
    loadHosts();
  }, [loadHosts]);

  useFocusEffect(
    React.useCallback(() => {
      setKeyword('');
      setPage(1);
      setHosts([]);
      setHasMore(true);
      loadHosts();
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
      <PageHeader navigation={navigation} title={AppConstants.TITLE_HOSTS} />
      <View style={[styles.headerButtonRow, {gap: 10}]}>
        <Button
          mode="contained"
          style={[globalStyles.defaultModalButton, {width: 'auto'}]}
          onPress={() => navigation.navigate('AddHost')}>
          {AppConstants.TITLE_AddClient}
        </Button>
        <Button
          mode="contained"
          style={[globalStyles.defaultModalButton, {width: 'auto'}]}
          onPress={() => navigation.navigate('AddProperty')}>
          {AppConstants.TITLE_AddProperty}
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
        data={hosts}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <HostCard
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
          onPress={loadHosts}
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

      <CustomActivityIndicator loading={loading} />
    </SafeAreaView>
  );
};

export default HostsScreen;

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
