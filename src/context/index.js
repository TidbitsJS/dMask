import React, {createContext, useContext, useState, useEffect} from 'react';
import {createAlchemyWeb3} from '@alch/alchemy-web3';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StateContext = createContext();

export const StateContextProvider = ({children}) => {
  const [private_address, setPrivateAddress] = useState();

  useEffect(() => {
    const loadPrivateAddress = async () => {
      const isAddress = await getPrivateKey();
      if (isAddress) {
        setPrivateAddress(isAddress);
      } else {
        setPrivateAddress(null);
      }
    };

    loadPrivateAddress();
  }, []);

  const web3 = createAlchemyWeb3(
    'https://eth-ropsten.alchemyapi.io/v2/zn5_NFHt5lS36lvktLmVOIC_gJxL-h-l',
  );

  const sendEths = async (address, amount) => {
    console.log(
      'parameters',
      address,
      amount,
      'with private ke',
      private_address,
    );

    const modifiedAmount = web3.utils.toWei(amount.toString(), 'ether');
    // check if amount is less than the account balance
    const walletBalance = await getBalance();
    if (walletBalance < modifiedAmount) {
      console.log('Insufficient balance');
      return;
    }

    // get address through private key
    const myAddress =
      web3.eth.accounts.privateKeyToAccount(private_address).address;

    const nonce = await web3.eth.getTransactionCount(myAddress);

    console.log(
      'Wallet address is',
      myAddress,
      'nonce is',
      nonce,
      'balance is',
      walletBalance,
    );

    console.log(web3.utils.toWei(amount, 'ether'));

    const transaction = {
      to: address,
      value: modifiedAmount,
      gas: 30000,
      maxPriorityFeePerGas: 1000000108,
      nonce: nonce,
    };

    const signedTransaction = await web3.eth.accounts.signTransaction(
      transaction,
      private_address,
    );

    const result = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction,
    );

    return result;
  };

  const getBalance = async () => {
    const myAddress =
      web3.eth.accounts.privateKeyToAccount(private_address).address;

    const balance = await web3.eth.getBalance(myAddress);

    return balance;
  };

  const getPublicAddress = async () => {
    const publicAddress = await web3.eth.accounts.privateKeyToAccount(
      private_address,
    ).address;

    return publicAddress;
  };

  const getTransactionLogs = async () => {
    const myAddress = await getPublicAddress();
    const result = await web3.eth.getPastLogs(myAddress);
    return result;
  };

  const getPrivateKey = async () => {
    try {
      const privateKey = await AsyncStorage.getItem('private_key');
      if (privateKey) {
        return privateKey;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setPrivateKey = async privateKey => {
    try {
      await AsyncStorage.setItem('private_key', privateKey);
      setPrivateAddress(privateKey);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StateContext.Provider
      value={{
        private_address,
        setPrivateAddress,
        sendEths,
        getBalance,
        getPublicAddress,
        getTransactionLogs,
        getPrivateKey,
        setPrivateKey,
      }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
