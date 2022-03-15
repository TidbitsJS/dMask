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
      }
    };

    loadPrivateAddress();
  }, []);

  const web3 = createAlchemyWeb3(
    'https://eth-ropsten.alchemyapi.io/v2/zn5_NFHt5lS36lvktLmVOIC_gJxL-h-l',
  );

  const getPublicAddress = () => {
    const publicAddress =
      web3.eth.accounts.privateKeyToAccount(private_address).address;

    return publicAddress;
  };

  const sendEths = async (address, amount) => {
    try {
      const modifiedAmount = web3.utils.toWei(amount.toString(), 'ether');

      // check if amount is less than the account balance
      const walletBalance = await getBalance();
      if (walletBalance < modifiedAmount) {
        console.log('Insufficient balance');
        return;
      }

      const myAddress = getPublicAddress();

      const nonce = await web3.eth.getTransactionCount(myAddress);

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
    } catch (error) {
      console.error(error);
    }
  };

  const getBalance = async () => {
    try {
      const myAddress = getPublicAddress();
      const balance = await web3.eth.getBalance(myAddress);
      return balance;
    } catch (error) {
      console.error(error);
    }
  };

  const getTransactionLogs = async () => {
    try {
      const myAddress = getPublicAddress();
      const result = await web3.eth.getPastLogs(myAddress);
      return result;
    } catch (error) {
      console.error(error);
    }
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

  const removePrivateKey = async () => {
    try {
      await AsyncStorage.removeItem('private_key');
      setPrivateAddress(null);
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
        removePrivateKey,
      }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
