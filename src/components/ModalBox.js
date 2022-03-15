import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import {useStateContext} from '../context';
import Input from './Input';

const ModalBox = () => {
  const [value, setValue] = React.useState('');
  const {setPrivateKey} = useStateContext();

  const handleSubmit = () => {
    if (value.trim() === '' || value.length !== 64) {
      alert('Please enter a valid private key');
      return;
    } else {
      setPrivateKey(value);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#00000080',
        zIndex: 1,
      }}>
      <View
        style={{
          width: '80%',
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 5,
        }}>
        <View style={{width: '100%'}}>
          <Text>Private Key</Text>
          <Input value={value} onChangeText={text => setValue(text)} />
        </View>

        <TouchableOpacity
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00a8ff',
            padding: 10,
            marginTop: 10,
            borderRadius: 5,
          }}
          onPress={handleSubmit}>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ModalBox;
