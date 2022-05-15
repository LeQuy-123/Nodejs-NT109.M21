import React, {useEffect, useState} from 'react';
import {View, Dimensions, Text, StyleSheet, FlatList} from 'react-native';
import {useDispatch} from 'react-redux';
import {getRoomUsers} from '../redux/thunk';
import {getBasse64SvgImg} from '../utils/utils';

const UserList = props => {
  const {roomName, socket} = props;
  const [userList, setUserList] = useState([]);

  const dipatch = useDispatch();

  useEffect(() => {
    dipatch(getRoomUsers(roomName))
      .unwrap()
      .then(originalPromiseResult => {
        setUserList(originalPromiseResult);
      })
      .catch(rejectedValueOrSerializedError => {
        console.log(
          '🚀 ~ file: HomeScreen.js ~ line 19 ~ useEffect ~ rejectedValueOrSerializedError',
          rejectedValueOrSerializedError,
        );
      });
  }, [dipatch, roomName]);
  useEffect(() => {
    if (socket.current) {
      socket.current.on('welcome-message', data => {
        const newList = [...userList, data.userJoin];
        setUserList(newList);
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
        {getBasse64SvgImg(item?.avatarImage)}
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
    marginTop: 5,
  },
  inside: {
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
