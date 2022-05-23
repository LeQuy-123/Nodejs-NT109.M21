import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
  Text,
  FlatList,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {getImagesInChatRoute} from '../utils/APIRoutes';
import {useSelector} from 'react-redux';
import {ServerImage} from '../components/RenderAvatar';

const MediaScreen = ({route, navigation}) => {
  const {currentUser} = route.params;
  const [listImages, setListImages] = useState([]);
  console.log(
    '🚀 ~ file: MediaScreen.js ~ line 18 ~ MediaScreen ~ listImages',
    listImages,
  );
  const userInfo = useSelector(state => state.authReducer.userInfo);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(getImagesInChatRoute, {
          from: userInfo._id,
          to: currentUser._id,
        });
        setListImages(res.data);
      } catch (error) {
        console.log(
          '🚀 ~ file: MediaScreen.js ~ line 29 ~ fetchData ~ error',
          error,
        );
      }
    };
    fetchData();
  }, [currentUser, userInfo]);
  const renderItem = ({item}) => {
    return <ServerImage style={styles.image} id={item} />;
  };
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerList}>
          <Text style={styles.name}>{currentUser?.username}</Text>
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="backspace-reverse-outline"
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        <FlatList numColumns={3} data={listImages} renderItem={renderItem} />
      </SafeAreaView>
    </>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a38',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  headerList: {
    width: windowWidth,
    backgroundColor: '#1a1a38',
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20,
    height: 50,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  logOutButton: {
    position: 'absolute',
    right: 15,
  },
  image: {
    width: (windowWidth - 30) / 3,
    borderRadius: 0,
    height: (windowWidth - 30) / 3,
    margin: 3,
  },
});

export default MediaScreen;
