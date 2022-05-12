import React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {store, persistor} from './redux/store';
import {Provider} from 'react-redux';
import MyStackContent from './navigation';
import {PersistGate} from 'redux-persist/integration/react';

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" hidden={false} translucent={true} />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MyStackContent />
        </PersistGate>
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
