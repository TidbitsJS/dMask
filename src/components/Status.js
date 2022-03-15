import {View, Text} from 'react-native';
import React from 'react';

const Status = ({statusText}) => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 1,
        top: 0,
        left: 0,
        right: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
      <Text style={{color: '#000'}}>{statusText}</Text>
    </View>
  );
};

export default Status;
