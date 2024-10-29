import React from 'react';
import {ActivityIndicator} from 'react-native-paper';

type props = {
  loading: boolean;
};
const CustomActivityIndicator = ({loading}: props) => {
  return (
    <ActivityIndicator
      size={'large'}
      animating={loading}
      style={{
        position: 'absolute',
        top: '50%',
      }}
    />
  );
};

export default CustomActivityIndicator;
