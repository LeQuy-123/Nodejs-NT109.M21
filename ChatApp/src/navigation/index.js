import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppStack from './AppStack';
import {useSelector} from 'react-redux';
import LoginStack from './LoginStack';

const MyStackContent = props => {
  const isLoginRedux = useSelector(state => state?.authReducer?.isLogin);
  useEffect(() => {
    setisLogin(isLoginRedux);
  }, [isLoginRedux]);
  const [isLogin, setisLogin] = useState(isLoginRedux);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isLogin ? <AppStack /> : <LoginStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default MyStackContent;
