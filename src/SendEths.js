import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import {useStateContext} from './context';
import Input from './components/Input';

const SendEths = () => {
  const [ethAddress, setEthAddress] = React.useState('');
  const [ethAmount, setEthAmount] = React.useState();
  const [transactions, setTransactions] = React.useState([]);
  const {sendEths, getTransactionLogs} = useStateContext();

  useEffect(() => {
    const loadTransactions = async () => {
      const txLogs = await getTransactionLogs();
      setTransactions(txLogs);
    };

    loadTransactions();
  }, []);

  const handleSubmit = async () => {
    // check if ethAddress is valid
    if (
      ethAddress.trim().length !== 42 ||
      ethAddress.indexOf('0x') !== 0 ||
      ethAmount === undefined ||
      ethAmount === 0
    ) {
      return;
    }

    // send eth
    console.log('Sending eth to', ethAddress, 'with amount', ethAmount);
    const result = await sendEths(ethAddress, ethAmount);
    console.log('Transaction result', result);
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
          <Text>Account Address</Text>
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
        }}
        onPress={handleSubmit}>
        <Text
          style={{
            color: '#fff',
            fontSize: 18,
          }}>
          Send
        </Text>
      </TouchableOpacity>

      {transactions.length > 0 && (
        <View style={{marginTop: 30}}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#000',
              marginBottom: 5,
            }}>
            Transactions
          </Text>
          {transactions.map(transaction => (
            <View key={transaction.id} style={{marginVertical: 5}}>
              <Text style={{color: '#1b1b1b'}}>
                <Text style={{color: '#000', fontWeight: 'bold'}}>To:</Text>{' '}
                {transaction.address}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default SendEths;
