/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Dimensions, FlatList, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ChatInput from '../components/ChatInput';
import {getChatList} from '../redux/thunk';
import {sendMessageRoute} from '../utils/APIRoutes';
import {SvgXml} from 'react-native-svg';
import base64 from 'react-native-base64';
const windowWidth = Dimensions.get('window').width;

const getBasse64SvgImg = icon => {
  let finalbase64String = '';
  finalbase64String = 'data:image/svg+xml;base64,' + base64.decode(icon);
  return finalbase64String;
};
const ChatContainer = props => {
  const {socket, currentChat} = props;
  const refList = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [userIsTyping, setUserTyping] = useState(false);
  console.log(
    '🚀 ~ file: ChatContainer.js ~ line 23 ~ userIsTyping',
    userIsTyping,
  );

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
        }, 100);
      });
      socket.current.on('user_is_typing', msg => {
        setUserTyping(true);
        setTimeout(() => {
          refList?.current?.scrollToEnd();
        }, 100);
      });
      socket.current.on('user_stop_typing', msg => {
        setUserTyping(false);
        setTimeout(() => {
          refList?.current?.scrollToEnd();
        }, 100);
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

  const renderAvatar = (item, index) => {
    if (
      messages[index + 1] &&
      messages[index].fromSelf === messages[index + 1].fromSelf
    ) {
      return <View style={styles.avaFake} />;
    }
    if (currentChat.avatarImage && !item?.fromSelf) {
      return (
        <SvgXml
          xml={getBasse64SvgImg(currentChat.avatarImage)}
          width={50}
          height={50}
        />
      );
    } else if (user?.avatarImage && item?.fromSelf) {
      return (
        <SvgXml
          xml={getBasse64SvgImg(user.avatarImage)}
          width={50}
          height={50}
        />
      );
    } else {
      return null;
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          ...styles.chatContainer,
          flexDirection: !item.fromSelf ? 'row' : 'row-reverse',
        }}>
        {renderAvatar(item, index)}
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
      <FlatList
        ref={refList}
        data={messages}
        renderItem={renderItem}
        ListFooterComponent={() => {
          if (!userIsTyping) {
            return null;
          }
          return (
            <View
              style={{
                ...styles.chatContainer,
                flexDirection: 'row',
              }}>
              <SvgXml
                xml={getBasse64SvgImg(currentChat.avatarImage)}
                width={50}
                height={50}
              />
              <Text
                style={{
                  ...styles.boubleText,
                  marginHorizontal: 10,
                  color: '#ffffff80',
                }}>
                {currentChat.username} is typing...
              </Text>
            </View>
          );
        }}
      />
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

export default ChatContainer;
