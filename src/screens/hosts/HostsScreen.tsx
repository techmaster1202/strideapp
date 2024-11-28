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
import {Props, Host, Property} from '../../types/index.ts';
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
  deleteHost,
  getHostList,
  getHostProperty,
} from '../../services/hostsService.ts';
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
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [selectedHostId, setSelectedHostId] = useState(null);
  const [selectedHost, setSelectedHost] = useState<Host>();
  const [hostProperties, setHostProperties] = useState<Property[]>([]);

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

  const handleViewDetail = async (host: Host) => {
    setLoading(true);
    setSelectedHostId(host.id as any);
    setSelectedHost(host);
    setVisibleDetail(true);
    await getHostProperty(host.id)
      .then(response => {
        if (response.success) {
          console.log(response.data.properties);
          setHostProperties(response.data.properties);
        }
      })
      .catch(error => {
        console.error('Failed to fetch users:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadHosts();
  }, []);

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
            handleViewDetail={handleViewDetail}
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
        title="Delete Record"
        contents="Are you sure want to delete this record?"
        confirmString={AppConstants.TITLE_DeleteRecord}
        cancelString={AppConstants.TITLE_Cancel}
        loading={loading}
        onConfirm={deleteUser}
        onCancel={hideModal}
        confirmStyle="warning"
      />
      {/* property details */}
      <Modal isVisible={visibleDetail} style={globalStyles.modalContainerBack}>
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
              {`${selectedHost?.first_name} ${selectedHost?.last_name}`}
              's Properties
            </Text>
            <Button onPress={() => setVisibleDetail(false)}>close</Button>
          </View>
          <ScrollView
            style={{
              flexGrow: 0,
            }}>
            <CustomActivityIndicator loading={loading} />
            {hostProperties.map((hp, index) => (
              <View
                key={hp.id}
                style={[
                  {marginBottom: 10},
                  index !== hostProperties.length - 1
                    ? {
                        borderBottomWidth: 1,
                        borderBottomColor: theme.colors.secondary,
                        paddingVertical: 10,
                      }
                    : {},
                ]}>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                  <Text style={{flex: 1}}>Account Number</Text>
                  <Text style={{flex: 1}}>{hp.property_number}</Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                  <Text style={{flex: 1}}>Host</Text>
                  <Text
                    style={{
                      flex: 1,
                    }}>{`${hp.host?.first_name} ${hp.host?.last_name}`}</Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                  <Text style={{flex: 1}}>Office</Text>
                  <Text style={{flex: 1}}>{hp.office?.name}</Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                  <Text style={{flex: 1}}>Name</Text>
                  <Text style={{flex: 1}}>{hp.name}</Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                  <Text style={{flex: 1}}>Address</Text>
                  <Text
                    style={{
                      flex: 1,
                    }}>{`${hp.address},${hp.zip_code}, ${hp.city}, ${hp.state}, ${hp.country}`}</Text>
                </View>
                <View
                  style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <IconButton
                    icon="pencil"
                    mode="contained"
                    size={20}
                    onPress={() => {
                      navigation.navigate('UpdateProperty', hp);
                    }}
                  />
                </View>
              </View>
            ))}
            {!hostProperties.length ? (
              <View>
                <Text>No record found!</Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </Modal>

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
