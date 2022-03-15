/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
  LogBox,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {StateContextProvider, useStateContext} from './src/context';
import {ModalBox} from './src/components';
import {SendEths} from './src';

// ignore require cycles are allowed warning
LogBox.ignoreLogs(['Require cycle:']);

const RenderApp = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {private_address} = useStateContext();

  return (
    <View
      style={{
        flex: 1,
        minHeight: Dimensions.get('window').height,
        padding: 20,
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
      }}>
      {!private_address && <ModalBox />}
      {private_address && <SendEths />}
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
