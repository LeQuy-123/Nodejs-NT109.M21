import React, {useEffect, useState} from 'react';
import {View, Dimensions, Text, StyleSheet, FlatList} from 'react-native';
import {getRoomUsersRoute} from '../utils/APIRoutes';
import {getBasse64SvgImg} from '../utils/utils';
import axios from 'axios';
import RenderAvatar from './RenderAvatar';

const UserList = props => {
  const {roomName, socket} = props;
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(getRoomUsersRoute, {roomName});
        setUserList(response.data);
      } catch (error) {
        console.log(
          '🚀 ~ file: UserList.js ~ line 21 ~ fetchData ~ error',
          error,
        );
      }
    };
    fetchData();
  }, [roomName]);
  useEffect(() => {
    if (socket.current) {
      socket.current.on('welcome-message', data => {
        const check = userList.some(ch => ch._id === data?.userJoin?._id);
        if (!check) {
          const newList = [...userList, data.userJoin];
          setUserList(newList);
        }
      });
      socket.current.on('user-leave', data => {
        const newList = userList.filter(user => user._id !== data.userLeft._id);
        setUserList(newList);
      });
    }
  }, [socket, userList]);
  const renderItem = ({item}) => {
    return (
      <View style={styles.item}>
        <RenderAvatar user={item} />
        <Text style={styles.name}>{item.username}</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.inside}
        horizontal
        data={userList}
        renderItem={renderItem}
      />
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    width: windowWidth,
  },
  inside: {
    paddingTop: 5,
    paddingHorizontal: 20,
  },
  name: {
    marginVertical: 5,
    color: 'white',
    fontSize: 12,
  },
  item: {
    alignItems: 'center',
    marginHorizontal: 5,
    maxWidth: 60,
  },
});
export default UserList;
