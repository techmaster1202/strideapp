import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Car} from '../types';
import {format} from 'date-fns';
import {IconButton} from 'react-native-paper';

interface IProps {
  cars: Car[];
  dates: Date[];
  isCarRented: (carId: number, date: Date) => boolean;
  shiftWeek: (direction: number) => void;
}
const CarAvailabilityTable = ({
  cars,
  dates,
  isCarRented,
  shiftWeek,
}: IProps) => {
  const formatDate = (date: Date) => format(date, 'MM/dd');
  const formatDay = (date: Date) => format(date, 'EEE');
  const [carData, setCarData] = useState<Car[]>([]);
  const [dateData, setDateData] = useState<Date[]>([]);

  useEffect(() => {
    setCarData([{id: 0, name: 'Car Name'} as any, ...cars]);
    setDateData([...dates]);
  }, [cars, dates]);

  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end', gap: 5}}>
        <IconButton
          icon="chevron-left"
          size={24}
          onPress={() => shiftWeek(-1)}
          mode="contained"
        />
        <IconButton
          icon="chevron-right"
          size={24}
          onPress={() => shiftWeek(1)}
          mode="contained"
        />
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View>
            {carData.map((car, index) => (
              <View
                style={[
                  styles.box,
                  styles.nameBox,
                  index === cars.length - 1 ? styles.lastBox : {},
                ]}
                key={car.id}>
                <Text>{car.name}</Text>
              </View>
            ))}
          </View>
          {/* Right Column for Dates */}
          <ScrollView horizontal>
            <View>
              {carData.map((car, carIndex) => (
                <View style={{flexDirection: 'row'}} key={car.id}>
                  {dateData.map((date, dateIndex) => (
                    <View
                      style={[
                        styles.box,
                        carIndex === cars.length - 1 ? styles.lastBox : {},
                        carIndex % 2 !== 0 ? styles.odd : {},
                      ]}
                      key={dateIndex}>
                      {carIndex === 0 ? (
                        <>
                          <Text>{formatDate(date)}</Text>
                          <Text>{formatDay(date)}</Text>
                        </> // Show dates only for the first row
                      ) : isCarRented(car.id, date) ? (
                        <View
                          style={{
                            width: 80,
                            height: 2,
                            backgroundColor: '#3b82f6',
                          }}
                        />
                      ) : null}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  carNameHeader: {
    width: 120,
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  dateHeader: {
    width: 100,
    padding: 10,
    borderLeftWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
  },
  carNameCell: {
    width: 120,
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  availabilityCell: {
    width: 100,
    padding: 10,
    borderLeftWidth: 1,
    borderColor: '#ccc',
  },
  availableCell: {
    backgroundColor: 'blue',
  },
  unavailableCell: {
    backgroundColor: 'transparent',
  },
  box: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    width: 80,
  },
  odd: {
    backgroundColor: '#F3F4F6',
  },
  lastBox: {
    borderBottomWidth: 1,
  },
  nameBox: {
    width: 160,
  },
});

export default CarAvailabilityTable;
