import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREEN_NAME} from './screen';
import {HomeScreen, ChatScreen, MediaScreen, ChatRoomScreen} from '../screen';

const Stack = createNativeStackNavigator();

const SCREEN_LIST = [
  {
    name: SCREEN_NAME.HOME_SCREEN,
    component: HomeScreen,
    title: 'Home',
    headerShow: true,
  },
  {
    name: SCREEN_NAME.CHAT_SCREEN,
    component: ChatScreen,
    title: 'Chat',
    headerShow: true,
  },
  {
    name: SCREEN_NAME.CHAT_ROOM_SCREEN,
    component: ChatRoomScreen,
    title: 'Chat',
    headerShow: true,
  },
  {
    name: SCREEN_NAME.MEDIA_SCREEN,
    component: MediaScreen,
    title: 'Chat',
    headerShow: true,
  },
];

const AppStack = props => {
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

export default AppStack;
