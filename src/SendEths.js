import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import {useStateContext} from './context';
import Input from './components/Input';

const SendEths = () => {
  const [ethAddress, setEthAddress] = React.useState('');
  const [ethAmount, setEthAmount] = React.useState();
  const {sendEths} = useStateContext();

  const handleSubmit = () => {
    // check if ethAddress is valid
    if (
      ethAddress.trim().length === 42 ||
      ethAddress.indexOf('0x') !== 0 ||
      ethAmount === undefined ||
      ethAmount === 0
    ) {
      return;
    }

    // send eth
    console.log('Sending eth to', ethAddress, 'with amount', ethAmount);
    sendEths(ethAddress, ethAmount);
  };

  return (
    <View
      style={{
        width: '100%',
      }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#1a1a1a',
        }}>
        dMask
      </Text>

      <View style={{marginVertical: 20}}>
        <View>
          <Text>Accound Address</Text>
          <Input
            value={ethAddress}
            onChangeText={text => setEthAddress(text)}
          />
        </View>

        <View style={{marginTop: 20}}>
          <Text>Amount (ETH)</Text>
          <Input
            value={ethAmount}
            onChangeText={text => setEthAmount(text)}
            numeric
            placeHolder="0.0125"
          />
        </View>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: '#2b57f7',
          padding: 10,
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: '#fff',
            fontSize: 18,
          }}>
          Send
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SendEths;
