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
  Keyboard,
} from 'react-native';
import ChatContainer from '../components/ChatContainer';
import {io} from 'socket.io-client';
import {host} from '../utils/APIRoutes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {IMAGE} from '../assets';

const ChatScreen = ({route, navigation}) => {
  const {currentUser} = route.params;
  const [isDoneLoadingSocket, setDoneLoadingSocket] = useState(false);
  const userInfo = useSelector(state => state.authReducer.userInfo);
  const socket = useRef();

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(host);
      socket.current.emit('add-user', userInfo._id);
      setTimeout(() => {
        setDoneLoadingSocket(true);
      }, 1000);
    }
  }, [userInfo, currentUser]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (socket.current) {
          socket.current.emit('user_is_typing', {
            from: userInfo._id,
            to: currentUser._id,
          });
        } // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (socket.current) {
          socket.current.emit('user_stop_typing', {
            from: userInfo._id,
            to: currentUser._id,
          });
        }
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [currentUser, userInfo]);
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerList}>
          <Text style={styles.name}>{currentUser?.username}</Text>
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
          {isDoneLoadingSocket && socket.current ? (
            <ChatContainer currentChat={currentUser} socket={socket} />
          ) : (
            <Image source={IMAGE.loader} style={styles.loader} />
          )}
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

export default ChatScreen;
