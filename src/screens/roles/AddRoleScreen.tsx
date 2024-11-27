import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Button, Checkbox, TextInput, useTheme} from 'react-native-paper';
import {createGlobalStyles} from '../../utils/styles.ts';
import {Props} from '../../types/index.ts';
import * as AppConstants from '../../constants/constants.ts';
import DetailPageHeader from '../../components/DetailPageHeader.tsx';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Controller, useForm} from 'react-hook-form';
import Toast from 'react-native-toast-message';
import CustomActivityIndicator from '../../components/CustomActivityIndicator.tsx';
import {createRole, getPermissionList} from '../../services/rolesService.ts';
import {ScrollView} from 'react-native-gesture-handler';

const AddRoleScreen = ({navigation}: Props) => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, any>>([]);
  const [checkedItems, setCheckedItems] = useState<{[key: number]: boolean}>(
    {},
  );
  const [checkedAll, setCheckedAll] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    getValues,
  } = useForm<{name: string; permissions: number[]}>({
    defaultValues: {
      name: '',
      permissions: [],
    },
  });

  const onSubmit = async (data: {name: string; permissions: number[]}) => {
    if (loading) {
      return;
    }

    // Check for permissions validation
    if (data.permissions.length === 0) {
      Toast.show({
        type: 'error',
        text1: AppConstants.ERROR_PermissionsRequired, // Add a constant message like "Please select at least one permission"
      });
      return;
    }

    setLoading(true);
    await createRole(data.name, data.permissions)
      .then(response => {
        if (response.success) {
          setValue('name', '');
          setValue('permissions', []);
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
      })
      .finally(() => {
        setLoading(false);
        navigation.goBack();
      });
  };

  useEffect(() => {
    getPermissionList().then(res => {
      const grouped = res.data.permissions.reduce(
        (acc: Record<string, any>, item: Record<string, any>) => {
          const group = item.group;

          if (!acc[group]) {
            acc[group] = [];
          }

          acc[group].push(item);

          return acc;
        },
        {},
      );
      setPermissions(grouped);
    });
  }, []);

  useEffect(() => {
    if (checkedAll) {
      const allIds = Object.values(permissions)
        .flat()
        .map(item => item.id);
      const allChecked = allIds.reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {} as {[key: number]: boolean});

      setCheckedItems(allChecked);
      setValue('permissions', allIds);
    } else {
      setCheckedItems({});
      setValue('permissions', []);
    }
  }, [checkedAll]);

  // Toggle checkbox handler
  const toggleCheckbox = (id: number) => {
    setCheckedItems(prevState => {
      const checked = !prevState[id];

      // Update form permissions based on toggle
      const currentPermissions = getValues('permissions');
      const updatedPermissions = checked
        ? [...currentPermissions, id] // Add if checked
        : currentPermissions.filter(permId => permId !== id); // Remove if unchecked

      setValue('permissions', updatedPermissions);
      return {
        ...prevState,
        [id]: checked,
      };
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <DetailPageHeader
        navigation={navigation}
        title={AppConstants.TITLE_AddNewRole}
      />
      <ScrollView>
        <View style={[globalStyles.container]}>
          <View style={{width: '100%', marginBottom: 20}}>
            <Controller
              control={control}
              rules={{
                required: {
                  message: AppConstants.ERROR_RoleNameIsRequired,
                  value: true,
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={AppConstants.LABEL_RoleName}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  placeholder={AppConstants.LABEL_RoleName}
                  textContentType="name"
                  style={globalStyles.textInput}
                />
              )}
              name="name"
            />
            <Text style={styles.title}>Permissions</Text>
            {errors.permissions && (
              <Text style={{color: 'red'}}>
                {AppConstants.ERROR_PermissionsRequired}
              </Text>
            )}
            {errors.name && (
              <Text style={{color: 'red'}}>{errors.name.message}</Text>
            )}

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Checkbox
                status={checkedAll ? 'checked' : 'unchecked'}
                onPress={() => setCheckedAll(p => !p)}
              />
              <Text>Select/Deslect All</Text>
            </View>
            {Object.entries(permissions).map(([group, items]) => (
              <View key={group} style={styles.groupContainer}>
                <Text style={styles.groupTitle}>{group}</Text>
                {items.map((item: Record<string, any>) => (
                  <View key={item.id} style={styles.itemContainer}>
                    <Checkbox
                      onPress={() => toggleCheckbox(item.id)}
                      status={checkedItems[item.id] ? 'checked' : 'unchecked'}
                    />
                    <Text style={styles.itemText}>{item.name}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          <Button
            mode="contained"
            compact
            style={globalStyles.defaultButton}
            onPress={handleSubmit(onSubmit)}>
            {AppConstants.TITLE_Save}
          </Button>
          <CustomActivityIndicator loading={loading} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  groupContainer: {
    marginVertical: 10,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textTransform: 'uppercase',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemText: {
    fontSize: 16,
    color: '#555',
    textTransform: 'capitalize',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginVertical: 10,
  },
});

export default AddRoleScreen;
