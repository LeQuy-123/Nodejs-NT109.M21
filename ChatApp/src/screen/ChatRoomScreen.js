import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
} from 'react-native';
import ChatRoomContainer from '../components/ChatRoomContainer';
import {io} from 'socket.io-client';
import {host, leaveRoute} from '../utils/APIRoutes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {IMAGE} from '../assets';
import {Root, Popup} from 'react-native-popup-confirm-toast';
import UserList from '../components/UserList';
import axios from 'axios';
import {SCREEN_NAME} from '../navigation/screen';

const ChatRoomScreen = ({route, navigation}) => {
  const {roomName} = route.params;
  const [isDoneLoadingSocket, setDoneLoadingSocket] = useState(false);

  const userInfo = useSelector(state => state.authReducer.userInfo);
  const socket = useRef();

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(host);
      socket.current.emit('join-room', {
        user: userInfo,
        room: roomName,
      });
      setTimeout(() => {
        setDoneLoadingSocket(true);
      }, 1000);
    }
    return () => {
      if (socket.current) {
        socket.current.emit('user-leave', {
          user: userInfo,
          room: roomName,
        });
        socket.current.removeAllListeners();
      }
    };
  }, [roomName, userInfo]);
  const leaveRoomRequest = async () => {
    try {
      await axios.post(leaveRoute, {
        roomName: roomName,
        hostUser: userInfo._id,
      });
      Popup.hide();
      navigation.goBack();
    } catch (error) {
      console.log(
        '🚀 ~ file: ChatRoomScreen.js ~ line 58 ~ leaveRoom ~ error',
        error,
      );
    }
  };
  const onLeave = () => {
    const popup = Popup;
    popup.show({
      type: 'confirm',
      textBody:
        'Leave this room? You will be removed from the room and all messages will be deleted when all user left the room.',
      buttonText: 'I will be back later',
      confirmText: 'Leave Room',
      callback: () => {
        navigation.goBack();
        Popup.hide();
      },
      cancelCallback: () => leaveRoomRequest(),
    });
  };
  return (
    <Root>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerList}>
          <TouchableOpacity style={styles.modalBtn} onPress={onLeave}>
            <MaterialCommunityIcons
              name="backspace-outline"
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
          <Text style={styles.name}>{roomName}</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(SCREEN_NAME.MEDIA_SCREEN, {roomName});
            }}
            style={{
              ...styles.modalBtn,
            }}>
            <MaterialCommunityIcons name="image" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        <UserList socket={socket} roomName={roomName} />
        <KeyboardAvoidingView
          enabled
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={styles.container}>
          {isDoneLoadingSocket && socket.current ? (
            <ChatRoomContainer
              roomName={roomName}
              currentChat={{}}
              socket={socket}
            />
          ) : (
            <Image source={IMAGE.loader} style={styles.loader} />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Root>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a38',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatView: {
    flex: 1,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  headerList: {
    width: windowWidth,
    backgroundColor: '#1a1a38',
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    paddingHorizontal: 10,
  },
  logOutButton: {
    position: 'absolute',
    right: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  loader: {
    width: 120,
    height: 140,
  },
});

export default ChatRoomScreen;
