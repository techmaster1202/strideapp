import React from 'react';
import {Card, Divider, IconButton, Text, useTheme} from 'react-native-paper';
import {Cleaner, Navigation} from '../types';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

type UserCardProps = {
  item: Cleaner;
  navigation: Navigation;
  handleClickResetPwd: (id: any) => void;
  handleClickDelete: (id: any) => void;
  isCleaner?: boolean;
};

const EmployeeCard = ({
  item,
  navigation,
  isCleaner = false,
  handleClickResetPwd,
  handleClickDelete,
}: UserCardProps) => {
  const theme = useTheme();
  return (
    <Card
      elevation={3}
      style={{
        marginVertical: 10,
      }}>
      <Card.Content style={{paddingVertical: 5}}>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium" style={{maxWidth: 200}}>
            {item.first_name} {item.last_name}
          </Text>

          <View style={styles.cardHeaderAction}>
            <TouchableOpacity>
              <Text
                variant="labelLarge"
                style={{
                  color: theme.colors.onTertiary,
                  backgroundColor: theme.colors.tertiary,
                  paddingHorizontal: 10,
                  borderRadius: 30,
                }}>
                {isCleaner ? item.property_number : item.car_count}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Divider />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <Text variant="labelLarge" style={{flex: 1}}>
              {item.email}
            </Text>
            <Text variant="labelLarge" style={{flex: 1}}>
              {item.phone_number}
            </Text>
          </View>
        </View>
      </Card.Content>
      <Card.Actions style={{paddingVertical: 3}}>
        <IconButton
          icon="pencil"
          mode="contained"
          size={20}
          onPress={() => navigation.navigate('UpdateManager', item)}
        />
        <IconButton
          icon="delete"
          mode="contained"
          size={20}
          iconColor={theme.colors.error}
          onPress={() => handleClickDelete(item.id)}
        />
        <IconButton
          icon="lock-reset"
          mode="contained"
          size={20}
          iconColor={theme.colors.error}
          onPress={() => handleClickResetPwd(item.id)}
        />
      </Card.Actions>
    </Card>
  );
};

export default EmployeeCard;

const styles = StyleSheet.create({
  headerButtonRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 5,
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
});
