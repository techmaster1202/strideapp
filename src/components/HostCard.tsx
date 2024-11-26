import React from 'react';
import {Card, Divider, IconButton, Text, useTheme} from 'react-native-paper';
import {Host, Navigation} from '../types';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

type HostCardProps = {
  item: Host;
  navigation: Navigation;
  handleClickDelete: (id: any) => void;
};

const HostCard = ({item, navigation, handleClickDelete}: HostCardProps) => {
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
                {item.cars_count ? item.cars_count : item.properties_count}
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
          onPress={() => navigation.navigate('UpdateHost', item)}
        />
        <IconButton
          icon="delete"
          mode="contained"
          size={20}
          iconColor={theme.colors.error}
          onPress={() => handleClickDelete(item.id)}
        />
      </Card.Actions>
    </Card>
  );
};

export default HostCard;

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
