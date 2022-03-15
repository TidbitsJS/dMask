import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';

import {useStateContext} from './context';
import {Input, Status} from './components';

const SendEths = () => {
  const [ethAddress, setEthAddress] = React.useState('');
  const [ethAmount, setEthAmount] = React.useState();
  const [transactions, setTransactions] = React.useState([]);
  const [transactionLoading, setTransactionLoading] = React.useState(false);
  const [ethLoading, setEthLoading] = React.useState(false);
  const [showStatus, setShowStatus] = React.useState({
    status: false,
    statusText: '',
  });
  const {sendEths, getTransactionLogs, removePrivateKey} = useStateContext();

  useEffect(() => {
    const loadTransactions = async () => {
      setTransactionLoading(true);
      const txLogs = await getTransactionLogs();
      setTransactions(txLogs);
      setTransactionLoading(false);
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
    setEthLoading(true);
    console.log('Sending eth to', ethAddress, 'with amount', ethAmount);
    const result = await sendEths(ethAddress, ethAmount);
    console.log('Transaction result', result);
    setEthLoading(false);

    // check if transaction was successful, pending or failed
    if (result.status === true) {
      setShowStatus({
        status: true,
        statusText: 'Transaction successful',
      });
    } else if (!result.blockNumber) {
      setShowStatus({
        status: true,
        statusText: 'Transaction pending',
      });
    } else {
      setShowStatus({
        status: true,
        statusText: 'Transaction failed',
      });
    }

    // hide status after 5 seconds
    setTimeout(() => {
      setShowStatus({
        status: false,
        statusText: '',
      });
    }, 5000);

    // reset form
    setEthAddress('');
    setEthAmount();
  };

  return (
    <View
      style={{
        width: '100%',
      }}>
      {showStatus.status && <Status statusText={showStatus.statusText} />}

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
        onPress={() => {
          if (!ethLoading) {
            handleSubmit();
          }
        }}>
        {ethLoading ? (
          <View style={{flexDirection: 'row'}}>
            <ActivityIndicator size="small" color="#fff" />
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                marginLeft: 10,
              }}>
              Sending...
            </Text>
          </View>
        ) : (
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
            }}>
            Send
          </Text>
        )}
      </TouchableOpacity>

      {!ethLoading && (
        <TouchableOpacity
          style={{
            backgroundColor: 'red',
            padding: 10,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}
          onPress={removePrivateKey}>
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
            }}>
            Reset Wallet
          </Text>
        </TouchableOpacity>
      )}

      {transactionLoading && (
        <View style={{marginVertical: 20}}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}

      {!transactionLoading && transactions.length === 0 && (
        <Text style={{textAlign: 'center', marginTop: 20}}>
          No transactions yet
        </Text>
      )}

      {!transactionLoading && transactions.length > 0 && (
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
