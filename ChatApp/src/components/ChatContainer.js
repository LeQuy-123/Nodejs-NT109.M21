/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ChatInput from '../components/ChatInput';
import {getChatList} from '../redux/thunk';
import {
  sendMessageRoute,
  getImageRoute,
  uploadMultipeImageRoute,
} from '../utils/APIRoutes';
import RenderAvatar from './RenderAvatar';
const windowWidth = Dimensions.get('window').width;

const ServerImage = props => {
  const {id = ''} = props;
  return (
    <View style={styles.container}>
      <Image
        source={{uri: `${getImageRoute}/${id}`}}
        style={styles.imagesText}
      />
    </View>
  );
};
const ChatContainer = props => {
  const {socket, currentChat} = props;
  const refList = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [userIsTyping, setUserTyping] = useState(false);

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
  }, [dispatch, currentChat, user, socket]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-recieve', data => {
        if (data.from === currentChat._id) {
          setArrivalMessage({
            fromSelf: false,
            message: data.msg,
            images: data.images,
          });
          setTimeout(() => {
            refList?.current?.scrollToEnd();
          }, 100);
        }
      });
      socket.current.on('user_is_typing', msg => {
        if (msg === currentChat._id) {
          setUserTyping(true);
          setTimeout(() => {
            refList?.current?.scrollToEnd();
          }, 100);
        }
      });
      socket.current.on('user_stop_typing', msg => {
        if (msg === currentChat._id) {
          setUserTyping(false);
          setTimeout(() => {
            refList?.current?.scrollToEnd();
          }, 100);
        }
      });
    }
  }, [socket, user, currentChat]);
  useEffect(() => {
    arrivalMessage && setMessages(prev => [...prev, arrivalMessage]);
  }, [arrivalMessage]);
  const handleSendMsg = async (msg, images) => {
    var imagesUpload = [];
    if (images?.length > 0) {
      var formdata = new FormData();
      images.map((image, index) => {
        formdata.append('images', {
          uri: image.uri,
          type: image.type,
          name: image.fileName,
        });
      });
      imagesUpload = await axios({
        method: 'post',
        url: uploadMultipeImageRoute,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formdata,
      });
    }
    const msgImage = imagesUpload.data?.map((image, index) => image.id);
    socket.current.emit('send-msg', {
      to: currentChat._id,
      from: user._id,
      msg,
      images: msgImage,
    });
    await axios.post(sendMessageRoute, {
      from: user._id,
      to: currentChat._id,
      message: msg,
      images: msgImage,
    });
    const msgs = [...messages];
    msgs.push({fromSelf: true, message: msg, images: msgImage});
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
        <RenderAvatar user={item.fromSelf ? user : currentChat} />
        <View
          style={{
            ...styles.boubleText,
            marginHorizontal: 10,
          }}>
          <Text
            style={{
              color: 'white',
            }}>
            {item?.message}
          </Text>
          {item?.images && (
            <FlatList
              data={item?.images}
              renderItem={({item, index}) => {
                return <ServerImage id={item} />;
              }}
            />
          )}
        </View>
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
              <RenderAvatar user={currentChat} />
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
    backgroundColor: 'rgb(28,13,50)',
    maxWidth: windowWidth - 90,
  },
  highlight: {
    fontWeight: '700',
  },
  avaFake: {
    width: 50,
    height: 50,
  },
  imagesText: {
    width: (windowWidth - 90) / 2,
    height: (windowWidth - 90) / 2,
    marginVertical: 5,
  },
});

export default ChatContainer;
