/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Dimensions, FlatList, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ChatInput from './ChatInput';
import {addRoomMessageRoute, getAllRoomMessageRoute} from '../utils/APIRoutes';
import {SvgXml} from 'react-native-svg';
import base64 from 'react-native-base64';
const windowWidth = Dimensions.get('window').width;
import {Toast} from 'react-native-popup-confirm-toast';
import {store} from '../redux/store';
import RenderAvatar from './RenderAvatar';

const getBasse64SvgImg = icon => {
  let finalbase64String = '';
  finalbase64String = 'data:image/svg+xml;base64,' + base64.decode(icon);
  return finalbase64String;
};
const ChatRoomContainer = props => {
  const {socket, currentChat, roomName} = props;
  const refList = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const user = useSelector(state => state.authReducer.userInfo);
  useEffect(() => {
    if (socket.current) {
      socket.current.on('welcome-message', data => {
        Toast.show({
          backgroundColor: '#4e0eff',
          title: data?.text,
          color: '#702c91',
          timeColor: '#440f5f',
          timing: 2000,
          position: 'top',
        });
      });
      socket.current.on('user-leave', data => {
        Toast.show({
          backgroundColor: '#4e0eff',
          title: data?.text,
          color: '#702c91',
          timeColor: '#440f5f',
          timing: 2000,
          position: 'top',
        });
      });
      socket.current.on('message-room-recieve', ({from, to, msg}) => {
        setArrivalMessage({fromSelf: false, message: msg, from, to});
        setTimeout(() => {
          refList?.current?.scrollToEnd();
        }, 100);
      });
    }
  }, [socket, user, currentChat]);
  useEffect(() => {
    arrivalMessage && setMessages(prev => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = store.getState().authReducer.userInfo?._id;
        const response = await axios.post(getAllRoomMessageRoute, {
          roomName,
          userId: id,
        });
        setMessages(response.data);
        setTimeout(() => {
          refList?.current?.scrollToEnd();
        }, 500);
      } catch (error) {}
    };
    fetchData();
  }, [roomName]);
  const handleSendMsg = async msg => {
    socket.current.emit('send-message-room', {
      to: roomName,
      from: user,
      msg,
    });
    const userData = user;
    delete userData.password;
    delete userData.isAvatarImageSet;
    delete userData.email;
    await axios.post(addRoomMessageRoute, {
      from: userData,
      to: roomName,
      message: msg,
    });
    const msgs = [...messages];
    msgs.push({
      fromSelf: true,
      message: msg,
      to: roomName,
      from: user,
    });
    setMessages(msgs);
    setTimeout(() => {
      refList?.current?.scrollToEnd();
    }, 500);
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          ...styles.chatContainer,
          flexDirection: !item.fromSelf ? 'row' : 'row-reverse',
        }}>
        <RenderAvatar user={item.from} />
        <Text
          style={{
            ...styles.boubleText,
            marginHorizontal: 10,
          }}>
          {item?.message}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList ref={refList} data={messages} renderItem={renderItem} />
      <ChatInput handleSendMsg={handleSendMsg} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(10,10,20)',
  },
  chatContainer: {
    padding: 10,
    marginVertical: 5,
    alignItems: 'flex-end',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  boubleText: {
    padding: 10,
    borderRadius: 7,
    overflow: 'hidden',
    backgroundColor: 'rgb(28,13,50)',
    color: 'white',
    maxWidth: windowWidth - 90,
  },
  highlight: {
    fontWeight: '700',
  },
  avaFake: {
    width: 50,
    height: 50,
  },
});

export default ChatRoomContainer;
