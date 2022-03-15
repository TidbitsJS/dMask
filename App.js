/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
  Text,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Input from './src/components/Input';
import ModalBox from './src/components/ModalBox';
import {StateContextProvider, useStateContext} from './src/context';
import SendEths from './src/SendEths';

const RenderApp = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [modalVisible, setModalVisible] = React.useState(true);
  const {private_address} = useStateContext();

  console.log('Private address in RenderApp', private_address);

  useEffect(() => {
    if (private_address) {
      setModalVisible(false);
    }
  });

  return (
    <View
      style={{
        flex: 1,
        minHeight: Dimensions.get('window').height,
        padding: 20,
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
      }}>
      {modalVisible && !private_address && (
        <ModalBox setModalVisible={setModalVisible} />
      )}
      {!modalVisible && private_address && <SendEths />}
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <StateContextProvider>
      <SafeAreaView style={(backgroundStyle, {flex: 1})}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={isDarkMode ? Colors.darker : Colors.lighter}
        />

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <RenderApp />
        </ScrollView>
      </SafeAreaView>
    </StateContextProvider>
  );
};

export default App;
