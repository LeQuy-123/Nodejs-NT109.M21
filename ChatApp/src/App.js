import React from 'react';
import {StatusBar} from 'react-native';
import {store, persistor} from './redux/store';
import {Provider} from 'react-redux';
import MyStackContent from './navigation';
import {PersistGate} from 'redux-persist/integration/react';

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" hidden={false} />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MyStackContent />
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
