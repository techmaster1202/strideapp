import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Car} from '../types';
import {format} from 'date-fns';
import {IconButton} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';

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
    <View style={styles.container}>
      <View style={styles.controls}>
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

      <View style={styles.tableContainer}>
        <ScrollView style={styles.contentContainer}>
          <View style={styles.contentRow}>
            <View>
              {carData.map((car, index) => (
                <View
                  style={[
                    styles.box,
                    styles.nameBox,
                    index === cars.length - 1 ? styles.lastBox : {},
                    {borderRightWidth: 1},
                  ]}
                  key={car.id}>
                  <Text style={[index !== 0 ? {fontSize: 12} : {}]}>
                    {car.name}
                  </Text>
                </View>
              ))}
            </View>

            <ScrollView horizontal>
              <View>
                <View style={[styles.headerRow]}>
                  {dateData.map((date, dateIndex) => (
                    <View
                      style={[
                        styles.box,
                        styles.headerBox,
                        dateIndex === 0 ? {borderLeftWidth: 0} : {},
                      ]}
                      key={dateIndex}>
                      <Text>{formatDate(date)}</Text>
                      <Text>{formatDay(date)}</Text>
                    </View>
                  ))}
                </View>
                {carData.slice(1).map((car, carIndex) => (
                  <View style={styles.row} key={car.id}>
                    {dateData.map((date, dateIndex) => (
                      <View
                        style={[
                          styles.box,
                          carIndex === cars.length - 1 ? styles.lastBox : {},
                          carIndex % 2 !== 0 ? styles.odd : {},
                          dateIndex === 0 ? {borderLeftWidth: 0} : {},
                        ]}
                        key={dateIndex}>
                        {isCarRented(car.id, date) ? (
                          <View style={styles.rentedIndicator} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 5,
  },
  tableContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    zIndex: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  headerRow: {
    flexDirection: 'row',
  },
  contentContainer: {
    flex: 1,
  },
  contentRow: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
  box: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    width: 57,
  },
  headerBox: {
    backgroundColor: 'white',
  },
  nameBox: {
    width: 80,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    backgroundColor: 'white',
  },
  odd: {
    backgroundColor: '#F3F4F6',
  },
  lastBox: {
    borderBottomWidth: 1,
  },
  rentedIndicator: {
    width: 80,
    height: 2,
    backgroundColor: '#3b82f6',
  },
});

export default CarAvailabilityTable;
