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
import {host} from '../utils/APIRoutes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {IMAGE} from '../assets';
import {getRoomUsers, leaveRoom} from '../redux/thunk';
import {Root} from 'react-native-popup-confirm-toast';
import UserList from '../components/UserList';

const ChatRoomScreen = ({route, navigation}) => {
  const {roomName} = route.params;
  const [isDoneLoadingSocket, setDoneLoadingSocket] = useState(false);
  const [userList, setUserList] = useState([]);

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
        socket.current.removeAllListeners();
      }
    };
  }, [roomName, userInfo]);
  const dipatch = useDispatch();
  const onLeave = () => {
    dipatch(leaveRoom(roomName))
      .unwrap()
      .then(originalPromiseResult => {
        navigation.goBack();
        socket.current.emit('user-leave', {
          user: userInfo,
          room: roomName,
        });
      })
      .catch(rejectedValueOrSerializedError => {
        console.log(
          '🚀 ~ file: HomeScreen.js ~ line 19 ~ useEffect ~ rejectedValueOrSerializedError',
          rejectedValueOrSerializedError,
        );
      });
  };

  useEffect(() => {
    dipatch(getRoomUsers(roomName))
      .unwrap()
      .then(originalPromiseResult => {
        setUserList(originalPromiseResult.users);
      })
      .catch(rejectedValueOrSerializedError => {
        console.log(
          '🚀 ~ file: HomeScreen.js ~ line 19 ~ useEffect ~ rejectedValueOrSerializedError',
          rejectedValueOrSerializedError,
        );
      });
  }, [dipatch, roomName]);
  return (
    <Root>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerList}>
          <Text style={styles.name}>{roomName}</Text>
          <TouchableOpacity style={styles.logOutButton} onPress={onLeave}>
            <MaterialCommunityIcons
              name="backspace-reverse"
              size={30}
              color="#fff"
            />
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
    justifyContent: 'center',
    paddingRight: 20,
    height: 50,
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
