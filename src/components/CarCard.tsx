import React from 'react';
import {Card, Divider, IconButton, Text, useTheme} from 'react-native-paper';
import {Car, Navigation} from '../types';
import {View, StyleSheet} from 'react-native';

type CarCardProps = {
  item: Car;
  navigation: Navigation;
  handleClickDelete: (id: any) => void;
};

const CarCard = ({item, navigation, handleClickDelete}: CarCardProps) => {
  const theme = useTheme();
  return (
    <Card
      elevation={3}
      style={{
        marginVertical: 10,
      }}>
      <Card.Content style={{paddingVertical: 5}}>
        <View style={[styles.cardHeader, {marginBottom: 5}]}>
          <Text variant="titleMedium" style={{maxWidth: 200}}>
            {item.name}
          </Text>
        </View>

        <Divider />
        <View style={{marginTop: 5}}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text variant="labelLarge" style={{flex: 1}}>
                Client:
              </Text>
              <Text variant="labelLarge" style={{flex: 1}}>
                {`${item.host?.first_name} ${item.host?.last_name}`}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text variant="labelLarge" style={{flex: 1}}>
                Selective Manager:
              </Text>
              <Text variant="labelLarge" style={{flex: 1}}>
                {item.cleaner
                  ? `${item.cleaner?.cleaner_first_name} ${item.cleaner?.cleaner_last_name}`
                  : ''}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text variant="labelLarge" style={{flex: 1}}>
                Vehicle Color:
              </Text>
              <Text variant="labelLarge" style={{flex: 1}}>
                {item.color}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text variant="labelLarge" style={{flex: 1}}>
                Turo Id:
              </Text>
              <Text variant="labelLarge" style={{flex: 1}}>
                {item.turo_id}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text variant="labelLarge" style={{flex: 1}}>
                Notes:
              </Text>
              <Text variant="labelLarge" style={{flex: 1}}>
                {item.notes}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text variant="labelLarge" style={{flex: 1}}>
                License Plate:
              </Text>
              <Text variant="labelLarge" style={{flex: 1}}>
                {item.license_plate}
              </Text>
            </View>
          </View>
        </View>
      </Card.Content>
      <Card.Actions style={{paddingVertical: 3}}>
        <IconButton
          icon="pencil"
          mode="contained"
          size={20}
          onPress={() => navigation.navigate('UpdateCar', item)}
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

export default CarCard;

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
