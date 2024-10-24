import React, {memo} from 'react';
import {Image, StyleSheet} from 'react-native';

const Logo = () => (
  <Image
    source={require('../../assets/images/logo.png')}
    style={styles.image}
    resizeMode="contain"
  />
);

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 70,
  },
});

export default memo(Logo);
