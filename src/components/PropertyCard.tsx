import React from 'react';
import {Card, Divider, IconButton, Text, useTheme} from 'react-native-paper';
import {Navigation, Property} from '../types';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

type PropertyCardProps = {
  property: Property;
  navigation: Navigation;
  handleClickDelete: (id: any) => void;
};

const PropertyCard = ({
  property,
  navigation,
  handleClickDelete,
}: PropertyCardProps) => {
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
            {property.name}
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
                {property.property_number}
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
              {property.host
                ? `${property.host.first_name} ${property.host.last_name}`
                : ''}
            </Text>
            <Text variant="labelLarge" style={{flex: 1}}>
              {`${property.address},${property.zip_code},${property.state} ${property.country}`}
            </Text>
          </View>
        </View>
      </Card.Content>
      <Card.Actions style={{paddingVertical: 3}}>
        <IconButton
          icon="pencil"
          mode="contained"
          size={20}
          onPress={() => navigation.navigate('UpdateProperty', property)}
        />
        <IconButton
          icon="delete"
          mode="contained"
          size={20}
          iconColor={theme.colors.error}
          onPress={() => handleClickDelete(property.id)}
        />
      </Card.Actions>
    </Card>
  );
};

export default PropertyCard;

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
