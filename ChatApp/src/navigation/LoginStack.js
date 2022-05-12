import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREEN_NAME} from './screen';
import {LoginScreen, RegisterScreen} from '../screen';
import SetAvatarScreen from '../screen/SetAvatarScreen';

const Stack = createNativeStackNavigator();

const SCREEN_LIST = [
  {
    name: SCREEN_NAME.LOGIN_SCREEN,
    component: LoginScreen,
    title: 'Login',
    headerShow: false,
  },
  {
    name: SCREEN_NAME.REGISTER_SCREEN,
    component: RegisterScreen,
    title: 'Chat',
    headerShow: true,
  },
  {
    name: SCREEN_NAME.SET_AVA_SCREEN,
    component: SetAvatarScreen,
    title: 'setAva',
    headerShow: true,
  },
];

const LoginStack = props => {
  return (
    <Stack.Navigator
      initialRouteName={SCREEN_NAME.LOGIN_SCREEN}
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerShown: false,
      }}
      headerMode={'none'}>
      {SCREEN_LIST.map(screen => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            headerShow: false,
          }}
        />
      ))}
    </Stack.Navigator>
  );
};

export default LoginStack;
