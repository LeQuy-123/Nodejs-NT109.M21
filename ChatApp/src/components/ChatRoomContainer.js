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
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import ChatInput from './ChatInput';
import {
  addRoomMessageRoute,
  uploadMultipeImageRoute,
  getAllRoomMessageRoute,
  getImageRoute,
  deleteRoomMessageRoute,
} from '../utils/APIRoutes';
const windowWidth = Dimensions.get('window').width;
import {Toast} from 'react-native-popup-confirm-toast';
import {store} from '../redux/store';
import RenderAvatar from './RenderAvatar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
const ChatRoomContainer = props => {
  const {socket, currentChat, roomName} = props;
  const refList = useRef();
  const inputRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [messageDeleteId, setMessageDeleteId] = useState();
  const [showDelete, setShowDelete] = useState(false);
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
      socket.current.on(
        'message-room-recieve',
        ({from, to, msg, images, id}) => {
          setArrivalMessage({
            fromSelf: from._id === user._id,
            message: msg,
            from,
            to,
            images,
            id: id,
          });
          setTimeout(() => {
            refList?.current?.scrollToEnd();
          }, 100);
        },
      );
      socket.current.on('message-room-delete', ({msgId}) => {
        setMessageDeleteId(msgId);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, user, currentChat]);
  useEffect(() => {
    arrivalMessage && setMessages(prev => [...prev, arrivalMessage]);
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
  const handleSendMsg = async (msg, images) => {
    inputRef.current.setLoading(true);
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
    const userData = user;
    delete userData.password;
    delete userData.isAvatarImageSet;
    delete userData.email;
    const res = await axios.post(addRoomMessageRoute, {
      from: userData,
      to: roomName,
      message: msg,
      images: msgImage || [],
    });
    socket.current.emit('send-message-room', {
      to: roomName,
      from: user,
      msg,
      images: msgImage,
      id: res?.data._id,
    });
    inputRef.current.setLoading(false);
    setTimeout(() => {
      refList?.current?.scrollToEnd();
    }, 500);
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
      socket.current.emit('delete-message-room', {
        msgId: id,
        to: roomName,
      });
      await axios.delete(`${deleteRoomMessageRoute}/${id}`);
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
          <RenderAvatar user={item.from} />

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
                  <View style={{}}>
                    {item?.images?.map(image => {
                      return <ServerImage key={image} id={image} />;
                    })}
                  </View>
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
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          return item.id;
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

export default ChatRoomContainer;
