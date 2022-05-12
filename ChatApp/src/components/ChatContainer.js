/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, FlatList, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ChatInput from '../components/ChatInput';
import {getChatList} from '../redux/thunk';
import {sendMessageRoute} from '../utils/APIRoutes';

const ChatContainer = props => {
  const {socket, currentChat} = props;
  const refList = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const user = useSelector(state => state.authReducer.userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getChatList(currentChat._id))
      .unwrap()
      .then(originalPromiseResult => {
        setMessages(originalPromiseResult);
        setTimeout(() => {
          refList?.current?.scrollToEnd();
        }, 500);
      })
      .catch(rejectedValueOrSerializedError => {
        console.log(
          '🚀 ~ file: HomeScreen.js ~ line 19 ~ useEffect ~ rejectedValueOrSerializedError',
          rejectedValueOrSerializedError,
        );
      });
  }, [dispatch, currentChat]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-recieve', msg => {
        setArrivalMessage({fromSelf: false, message: msg});
        setTimeout(() => {
          refList?.current?.scrollToEnd();
        }, 500);
      });
    }
  }, [socket]);
  useEffect(() => {
    arrivalMessage && setMessages(prev => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  const handleSendMsg = async msg => {
    socket.current.emit('send-msg', {
      to: currentChat._id,
      from: user._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: user._id,
      to: currentChat._id,
      message: msg,
    });
    const msgs = [...messages];
    msgs.push({fromSelf: true, message: msg});
    setMessages(msgs);
    setTimeout(() => {
      refList?.current?.scrollToEnd();
    }, 500);
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.chatContainer}>
        <Text
          style={{
            ...styles.boubleText,
            alignSelf: !item.fromSelf ? 'flex-start' : 'flex-end',
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
  },
  highlight: {
    fontWeight: '700',
  },
});

export default ChatContainer;
