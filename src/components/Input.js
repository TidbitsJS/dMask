import React from 'react';
import {View, TextInput} from 'react-native';

const Input = ({value, onChangeText, numeric, placeHolder}) => {
  return (
    <View style={{width: '100%'}}>
      <TextInput
        placeholder={placeHolder ? placeHolder : '2b57sf714b...'}
        keyboardType={numeric ? 'numeric' : 'default'}
        onChangeText={onChangeText}
        value={value}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 7,
          borderRadius: 5,
          marginVertical: 10,
        }}
      />
    </View>
  );
};

export default Input;
