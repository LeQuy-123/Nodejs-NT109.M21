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
import ChatContainer from '../components/ChatContainer';
import {io} from 'socket.io-client';
import {host} from '../utils/APIRoutes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {IMAGE} from '../assets';

const ChatRoomScreen = ({route, navigation}) => {
  const {roomName} = route.params;
  console.log("🚀 ~ file: ChatRoomScreen.js ~ line 22 ~ ChatRoomScreen ~ roomName", roomName)
  const [isDoneLoadingSocket, setDoneLoadingSocket] = useState(false);
  const userInfo = useSelector(state => state.authReducer.userInfo);
  const socket = useRef();

  // useEffect(() => {
  //   if (!socket.current) {
  //     socket.current = io(host);
  //     socket.current.emit('add-user', userInfo._id);
  //     setTimeout(() => {
  //       setDoneLoadingSocket(true);
  //     }, 1000);
  //   }
  //   return () => {
  //     if (socket.current) {
  //       socket.current.removeAllListeners();
  //     }
  //   };
  // }, [userInfo, currentUser]);
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerList}>
          <Text style={styles.name}>{roomName}</Text>
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="backspace-reverse"
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          enabled
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={styles.container}>
          {/* {isDoneLoadingSocket && socket.current ? (
            <ChatContainer currentChat={currentUser} socket={socket} />
          ) : (
            <Image source={IMAGE.loader} style={styles.loader} />
          )} */}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
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
