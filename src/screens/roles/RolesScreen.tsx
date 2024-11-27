import {StyleSheet, View, FlatList} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Button, Divider, Text, useTheme} from 'react-native-paper';
import {createGlobalStyles} from '../../utils/styles.ts';
import {Props, Role} from '../../types/index.ts';
import * as AppConstants from '../../constants/constants.ts';
import CustomActivityIndicator from '../../components/CustomActivityIndicator.tsx';
import Modal from 'react-native-modal';
import PageTitle from '../../components/PageTitle.tsx';
import Toast from 'react-native-toast-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageHeader from '../../components/PageHeader.tsx';
import {useFocusEffect} from '@react-navigation/native';
import ConfirmModal from '../../components/ConfirmModal.tsx';
import {deleteRole, getRoleList} from '../../services/rolesService.ts';
import RoleCard from '../../components/RoleCard.tsx';

const RolesScreen = ({navigation}: Props) => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  const loadRoles = useCallback(async () => {
    setLoading(true);
    await getRoleList()
      .then(response => {
        if (response.success) {
          setRoles(response.data.roles);
        }
      })
      .catch(error => {
        console.error('Failed to fetch roles:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleClickDelete = (id: any) => {
    setSelectedRoleId(id);
    showModal();
  };

  const onDeleteRole = async () => {
    if (selectedRoleId) {
      setLoading(true);
      await deleteRole(selectedRoleId)
        .then(response => {
          if (response.success) {
            setSelectedRoleId(null);
            hideModal();
          }
          Toast.show({
            type: response.success ? 'success' : 'error',
            text1: response.message,
          });
          setLoading(false);
          loadRoles();
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
    loadRoles();
  }, [loadRoles]);

  useFocusEffect(
    React.useCallback(() => {
      setRoles([]);
      loadRoles();
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
      <PageHeader navigation={navigation} title={AppConstants.TITLE_Roles} />
      <View style={[styles.headerButtonRow, {gap: 10}]}>
        <Button
          mode="contained"
          style={[globalStyles.defaultModalButton, {width: 'auto'}]}
          onPress={() => navigation.navigate('AddRole')}>
          {AppConstants.TITLE_AddNewRole}
        </Button>
      </View>
      <Divider />
      <FlatList
        data={roles}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <RoleCard
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
              onPress={onDeleteRole}>
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
        title="Delete Role"
        contents="Are you sure want to delete this record?"
        confirmString={AppConstants.TITLE_DeleteRecord}
        cancelString={AppConstants.TITLE_Cancel}
        loading={loading}
        onConfirm={onDeleteRole}
        onCancel={hideModal}
        confirmStyle="warning"
      />

      <CustomActivityIndicator loading={loading} />
    </SafeAreaView>
  );
};

export default RolesScreen;

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
