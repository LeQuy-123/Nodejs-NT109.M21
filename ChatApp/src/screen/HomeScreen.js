/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {getContacts, logout} from '../redux/thunk';
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
  return (
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
          // ListHeaderComponent={headerComponent}
          data={contacs}
          // stickyHeaderIndices={[0]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1a1a38',
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
  },
  logOutButton: {},
});

export default HomeScreen;
