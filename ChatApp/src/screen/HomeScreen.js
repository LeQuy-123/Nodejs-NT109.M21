/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {createRoom, getContacts, logout} from '../redux/thunk';
import WelcomeComponent from '../components/WelcomeComponent';
import {SvgXml} from 'react-native-svg';
import base64 from 'react-native-base64';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {SCREEN_NAME} from '../navigation/screen';
const windowWidth = Dimensions.get('window').width;

const getBasse64SvgImg = icon => {
  let finalbase64String = '';
  finalbase64String = 'data:image/svg+xml;base64,' + base64.decode(icon);
  return finalbase64String;
};
const HomeScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [contacs, setContacs] = useState([]);
  useEffect(() => {
    dispatch(getContacts())
      .unwrap()
      .then(originalPromiseResult => {
        setContacs(originalPromiseResult);
      })
      .catch(rejectedValueOrSerializedError => {
        console.log(
          '🚀 ~ file: HomeScreen.js ~ line 19 ~ useEffect ~ rejectedValueOrSerializedError',
          rejectedValueOrSerializedError,
        );
      });
  }, [dispatch]);
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate(SCREEN_NAME.CHAT_SCREEN, {currentUser: item})
        }>
        {item.avatarImage ? (
          <SvgXml
            xml={getBasse64SvgImg(item.avatarImage)}
            width={50}
            height={50}
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.nameAva}>{item.username?.split('')[0]}</Text>
          </View>
        )}
        <Text style={styles.textItem}>{item.username}</Text>
        <MaterialCommunityIcons
          name="chat"
          size={20}
          color="#fff"
          style={{position: 'absolute', right: 10}}
        />
      </TouchableOpacity>
    );
  };
  const [modalVisible, setModalVisible] = useState(false);
  const roomName = useRef();

  const handleCreateRoom = () => {
    dispatch(createRoom({roomName: roomName.current, password: '123456'}))
      .unwrap()
      .then(originalPromiseResult => {
        setModalVisible(false);
        navigation.navigate(SCREEN_NAME.CHAT_ROOM_SCREEN, {
          roomName: roomName.current,
        });
      })
      .catch(rejectedValueOrSerializedError => {
        console.log(
          '🚀 ~ file: HomeScreen.js ~ line 19 ~ useEffect ~ rejectedValueOrSerializedError',
          rejectedValueOrSerializedError,
        );
      });
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerList}>
          <WelcomeComponent />
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={() => dispatch(logout())}>
            <MaterialCommunityIcons name="logout" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            style={styles.list}
            ListHeaderComponent={() => (
              <TouchableOpacity
                style={styles.createRoomButton}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.btnText}>Create chat room</Text>
              </TouchableOpacity>
            )}
            data={contacs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        </View>
      </SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        style={{margin: 0}}
        statusBarTranslucent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Chat room!</Text>
              <TextInput
                onChangeText={text => (roomName.current = text)}
                placeholder="type your chat room name"
                autoFocus
                style={styles.chatRoomInput}
              />
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => handleCreateRoom()}>
                <Text style={styles.textStyle}>Create chat room</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1a1a38',
  },
  createRoomButton: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#3737e1',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerList: {
    width: windowWidth,
    backgroundColor: '#1a1a38',
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameAva: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    width: windowWidth - 40,
    marginHorizontal: 20,
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  textItem: {
    color: 'white',
    fontSize: 18,
    marginLeft: 20,
    marginTop: 20,
  },
  list: {
    backgroundColor: 'rgb(8,8,16)',
    width: windowWidth,
  },
  logOutButton: {},
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  chatRoomInput: {
    padding: 10,
    width: windowWidth - 120,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 3,
    marginBottom: 20,
  },
});

export default HomeScreen;
