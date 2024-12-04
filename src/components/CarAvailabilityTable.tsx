import React, {useEffect, useState, useRef} from 'react';
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
  const horizontalScrollRef = useRef<ScrollView>(null);
  const contentScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setCarData([{id: 0, name: 'Car Name'} as any, ...cars]);
    setDateData([...dates]);
  }, [cars, dates]);

  const handleHorizontalScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    if (horizontalScrollRef.current && contentScrollRef.current) {
      horizontalScrollRef.current.scrollTo({x: offsetX, animated: false});
      contentScrollRef.current.scrollTo({x: offsetX, animated: false});
    }
  };

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
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.nameBox}>
            <Text>{carData[0]?.name}</Text>
          </View>
          <ScrollView
            ref={horizontalScrollRef}
            horizontal
            scrollEventThrottle={16}
            onScroll={handleHorizontalScroll}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.headerRow}>
              {dateData.map((date, dateIndex) => (
                <View style={[styles.box, styles.headerBox]} key={dateIndex}>
                  <Text>{formatDate(date)}</Text>
                  <Text>{formatDay(date)}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Content */}
        <ScrollView style={styles.contentContainer}>
          <View style={styles.contentRow}>
            <View>
              {carData.slice(1).map((car, index) => (
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

            <ScrollView
              ref={contentScrollRef}
              horizontal
              scrollEventThrottle={16}
              onScroll={handleHorizontalScroll}
              showsHorizontalScrollIndicator={false}>
              <View>
                {carData.slice(1).map((car, carIndex) => (
                  <View style={styles.row} key={car.id}>
                    {dateData.map((date, dateIndex) => (
                      <View
                        style={[
                          styles.box,
                          carIndex === cars.length - 1 ? styles.lastBox : {},
                          carIndex % 2 !== 0 ? styles.odd : {},
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
