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
import {useSelector} from 'react-redux';
import ChatInput from './ChatInput';
import {
  addRoomMessageRoute,
  uploadMultipeImageRoute,
  getAllRoomMessageRoute,
  getImageRoute,
} from '../utils/APIRoutes';
const windowWidth = Dimensions.get('window').width;
import {Toast} from 'react-native-popup-confirm-toast';
import {store} from '../redux/store';
import RenderAvatar from './RenderAvatar';
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
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  console.log("🚀 ~ file: ChatRoomContainer.js ~ line 40 ~ messages", messages)
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
    socket.current.emit('send-message-room', {
      to: roomName,
      from: user,
      msg,
      images: msgImage,
    });
    const userData = user;
    delete userData.password;
    delete userData.isAvatarImageSet;
    delete userData.email;
    await axios.post(addRoomMessageRoute, {
      from: userData,
      to: roomName,
      message: msg,
      images: msgImage,
    });
    const msgs = [...messages];
    msgs.push({
      fromSelf: true,
      message: msg,
      to: roomName,
      from: user,
      images: msgImage,
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
              // eslint-disable-next-line no-shadow
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

export default ChatRoomContainer;
