/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useEffect, useCallback, useRef, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector} from 'react-redux';
import ChatInput from '../components/ChatInput';
import {store} from '../redux/store';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  sendMessageRoute,
  getImageRoute,
  uploadMultipeImageRoute,
  recieveMessageRoute,
  deleteMessageRoute,
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
  const inputRef = useRef();
  const pageRef = useRef({
    page: 0,
    numberOfNewMessager: 0,
  });

  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [userIsTyping, setUserTyping] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [messageDeleteId, setMessageDeleteId] = useState();

  const [messages, setMessages] = useState([]);
  const user = useSelector(state => state.authReducer.userInfo);

  const fetchData = useCallback(
    async page => {
      try {
        const id = store.getState().authReducer.userInfo?._id;
        const response = await axios.post(
          `${recieveMessageRoute}?size=10&page=${page}&numberOfNewMessager=${pageRef.current.numberOfNewMessager}`,
          {
            from: id,
            to: currentChat._id,
          },
        );
        if (response.data.length > 0) {
          pageRef.current.page = page + 1;
          setMessages(prev => [...prev, ...response.data]);
        }
      } catch (error) {
        console.log(
          '🚀 ~ file: ChatContainer.js ~ line 59 ~ fetchData ~ error',
          error,
        );
      }
    },
    [currentChat],
  );

  useEffect(() => {
    fetchData(pageRef.current.page);
  }, [fetchData]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-recieve', data => {
        if (data.from === currentChat._id) {
          setArrivalMessage({
            fromSelf: false,
            message: data.msg,
            images: data.images,
            id: data.id,
          });
        }
      });
      socket.current.on('user_is_typing', msg => {
        if (msg === currentChat._id) {
          setUserTyping(true);
        }
      });
      socket.current.on('user_stop_typing', msg => {
        if (msg === currentChat._id) {
          setUserTyping(false);
        }
      });
      socket.current.on('message-delete', data => {
        setMessageDeleteId(data.msgId);
      });
    }
  }, [socket, user, currentChat]);
  useEffect(() => {
    arrivalMessage && setMessages(prev => [arrivalMessage, ...prev]);
    pageRef.current.numberOfNewMessager++;
  }, [arrivalMessage]);
  useEffect(() => {
    messageDeleteId &&
      setMessages(prev =>
        prev.map(msg => {
          // eslint-disable-next-line eqeqeq
          if (msg.id == messageDeleteId) {
            return {
              ...msg,
              images: [],
              message: '',
            };
          }
          return msg;
        }),
      );
  }, [messageDeleteId]);
  const handleSendMsg = async (msg, images) => {
    var imagesUpload = [];
    inputRef.current.setLoading(true);
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
    const res = await axios.post(sendMessageRoute, {
      from: user._id,
      to: currentChat._id,
      message: msg,
      images: msgImage,
    });
    const msgImage = imagesUpload.data?.map((image, index) => image.id);
    socket.current.emit('send-msg', {
      to: currentChat._id,
      from: user._id,
      msg,
      images: msgImage,
      id: res.data._id,
    });
    setMessages(prev => [
      {
        fromSelf: true,
        message: msg,
        images: msgImage || [],
        id: res.data._id,
      },
      ...prev,
    ]);
    pageRef.current.numberOfNewMessager++;
    inputRef.current.setLoading(false);
  };
  const handleDeleteMsg = async id => {
    try {
      const newList = messages?.map((obj, index) => {
        return obj.id === id
          ? {
              from: obj.from,
              fromSelf: obj.fromSelf,
              id: obj.id,
              images: [],
              message: '',
            }
          : obj;
      });
      socket.current.emit('delete-message', {
        msgId: id,
        to: currentChat._id,
      });
      await axios.delete(`${deleteMessageRoute}/${id}`);
      setMessages(newList);
      setShowDelete(false);
    } catch (error) {
      console.log('🚀 ~ file: ChatRoomContainer.js ~ line 147 ~ id', error);
    }
  };
  const renderItem = ({item, index}) => {
    return (
      <TouchableWithoutFeedback onLongPress={() => setShowDelete(!showDelete)}>
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
            {!item?.message && item?.images?.length === 0 ? (
              <Text
                style={{
                  color: '#ffffff60',
                }}>
                (Message has been deleted)
              </Text>
            ) : (
              <>
                <Text
                  style={{
                    color: 'white',
                  }}>
                  {item?.message}
                </Text>
                {item?.images && (
                  <FlatList
                    data={item?.images}
                    // eslint-disable-next-line no-shadow
                    renderItem={({item, index}) => {
                      return <ServerImage id={item} />;
                    }}
                  />
                )}
                {showDelete && item.fromSelf && (
                  <TouchableOpacity
                    onPress={() => handleDeleteMsg(item.id)}
                    style={styles.deleteBtn}>
                    <MaterialCommunityIcons
                      name="delete-circle"
                      color="#ffffff60"
                      size={25}
                    />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={refList}
        data={messages}
        inverted
        onEndReached={({distanceFromEnd}) => {
          fetchData(pageRef.current.page);
        }}
        onEndReachedThreshold={0}
        renderItem={renderItem}
        ListHeaderComponent={() => {
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
      <ChatInput ref={inputRef} handleSendMsg={handleSendMsg} />
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
  deleteBtn: {
    position: 'absolute',
    bottom: -10,
    left: -15,
    zIndex: 9,
    width: 25,
  },
});

export default ChatContainer;
