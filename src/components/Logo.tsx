import React, {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';

const Logo = () => (
  <View style={styles.logoContainer}>
    <Image
      source={require('../../assets/images/logo.png')}
      style={styles.image}
      resizeMode="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 70,
  },
});

export default memo(Logo);
