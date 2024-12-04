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
import {Props, Property} from '../../types/index.ts';
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
  deleteProperty,
  getPropertyList,
} from '../../services/propertiesService.ts';
import PropertyCard from '../../components/PropertyCard.tsx';

const PropertiesScreen = ({navigation}: Props) => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);

  const [keyword, setKeyword] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    await getPropertyList(keyword, page)
      .then(response => {
        if (response.success) {
          const newProperties = response.data.properties;
          setProperties(newProperties ?? []);
        }
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: error.message,
        });
      })
      .finally(() => {
        setLoading(false);
        setHasMore(false);
      });
  }, [keyword, page]);

  const handleChangeSearch = (val: string) => {
    setKeyword(val);
    setPage(1);
    setProperties([]);
    setHasMore(true);
    loadProperties();
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleClickDelete = (id: any) => {
    setSelectedPropertyId(id);
    showModal();
  };

  const onDeleteProperty = async () => {
    if (selectedPropertyId) {
      setLoading(true);
      await deleteProperty(selectedPropertyId)
        .then(response => {
          if (response.success) {
            setSelectedPropertyId(null);
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
    loadProperties();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setKeyword('');
      setPage(1);
      setProperties([]);
      setHasMore(true);
      loadProperties();
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
        title={AppConstants.TITLE_Properties}
      />
      <View style={styles.headerButtonRow}>
        <Button
          mode="contained"
          style={globalStyles.defaultModalButton}
          onPress={() => navigation.navigate('AddProperty')}>
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
        data={properties}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <PropertyCard
            key={item.id}
            property={item}
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
          onPress={loadProperties}
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
              onPress={onDeleteProperty}>
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
        onConfirm={onDeleteProperty}
        onCancel={hideModal}
        confirmStyle="warning"
      />
      <CustomActivityIndicator loading={loading} />
    </SafeAreaView>
  );
};

export default PropertiesScreen;

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
