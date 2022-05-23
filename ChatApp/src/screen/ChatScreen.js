/* eslint-disable react-native/no-inline-styles */
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
import Modal from 'react-native-modal';
import {SCREEN_NAME} from '../navigation/screen';
const ChatScreen = ({route, navigation}) => {
  const {currentUser} = route.params;
  const [isDoneLoadingSocket, setDoneLoadingSocket] = useState(false);
  const [menuVisble, setMenuVisble] = useState(false);

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
            onPress={() => setMenuVisble(true)}>
            <MaterialCommunityIcons
              name={!menuVisble ? 'menu-up' : 'menu-down'}
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
        <Modal
          backdropOpacity={0}
          onBackdropPress={() => setMenuVisble(false)}
          animationIn="slideInDown"
          animationOut="slideOutUp"
          isVisible={menuVisble}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => {
                setMenuVisble(false);
                navigation.navigate(SCREEN_NAME.MEDIA_SCREEN, {currentUser});
              }}
              style={{
                ...styles.modalBtn,
                borderBottomWidth: 1,
                borderBottomColor: '#ffffff90',
              }}>
              <Text style={styles.textBtn}>Media</Text>
              <MaterialCommunityIcons name="image" size={17} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => navigation.goBack()}>
              <Text style={styles.textBtn}>Go Back</Text>
              <MaterialCommunityIcons
                name="backspace-reverse-outline"
                size={17}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </Modal>
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
  modalContainer: {
    backgroundColor: '#292525',
    position: 'absolute',
    top: 75,
    right: -20,
    borderRadius: 7,
  },
  modalBtn: {
    width: 160,
    height: 45,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  textBtn: {
    color: 'white',
  },
});

export default ChatScreen;
