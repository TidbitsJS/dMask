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
    console.log('Private address', private_address);
  }, []);

  const sendEths = async ({address, amount}) => {
    console.log(
      'Env',
      process.env.REACT_APP_API_KEY,
      process.env.REACT_APP_PRIVATE_KEY,
    );

    console.log('parameters', address, amount);

    // check if amount is less than the account balance
    const walletBalance = await getBalance();
    if (walletBalance < amount) {
      console.log('Insufficient balance');
      return;
    }

    const web3 = await createAlchemyWeb3(process.env.REACT_APP_API_URL);

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
      balance,
    );

    // const transaction = {
    //   to: address,
    //   value: amount,
    //   gas: 30000,
    //   maxPriorityFeePerGas: 1000000108,
    //   nonce: nonce,
    // };

    // const signedTransaction = await web3.eth.accounts.signTransaction(
    //   transaction,
    //   private_address,
    // );

    // const result = await web3.eth.sendSignedTransaction(
    //   signedTransaction.rawTransaction,
    // );

    // return result;
  };

  const getBalance = async () => {
    const web3 = await createAlchemyWeb3(process.env.REACT_APP_API_URL);
    const myAddress = await AsyncStorage.getItem('private_key');
    const balance = await web3.eth.getBalance(myAddress);

    return balance;
  };

  const getPublicAddress = async () => {
    const web3 = await createAlchemyWeb3(process.env.REACT_APP_API_URL);
    const publicAddress = await web3.eth.accounts.privateKeyToAccount(
      private_address,
    ).address;

    return publicAddress;
  };

  const getTransactionList = async () => {
    const web3 = await createAlchemyWeb3(process.env.REACT_APP_API_URL);
    const transactions = await web3.eth.getTransactionHistory(private_address);

    return transactions;
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
        getTransactionList,
        getPrivateKey,
        setPrivateKey,
      }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
