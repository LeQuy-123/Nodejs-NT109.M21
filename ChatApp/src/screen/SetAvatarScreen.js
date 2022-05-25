/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
const windowWidth = Dimensions.get('window').width;
import {useDispatch} from 'react-redux';
import axios from 'axios';
const api = 'https://api.multiavatar.com/4645646';
import {Buffer} from 'buffer';
import {SvgXml} from 'react-native-svg';
import base64 from 'react-native-base64';
import {IMAGE} from '../assets';
import {SCREEN_NAME} from '../navigation/screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {setAvatarRoute, uploadImageRoute} from '../utils/APIRoutes';
import {logIn} from '../redux/authSlice';
import AvatarPicker from '../components/AvatarPicker';
import {Root} from 'react-native-popup-confirm-toast';

const SetAvatarScreen = ({route, navigation}) => {
  const userObj = route.params?.user?.user;
  const dispatch = useDispatch();
  const [avatars, setAvatars] = useState([]);
  const [customAvatar, setCustomAvatar] = useState({
    isCustom: false,
    path: null,
    file: {},
  });

  const [isLoading, setLoading] = useState(true);
  const [isLoadingAvaSet, setLoadingAvaSet] = useState(false);

  const submit = async () => {
    if (!customAvatar.path) {
      return;
    } else {
      try {
        setLoadingAvaSet(true);
        var imagesUpload = '';
        if (customAvatar.isCustom) {
          var formdata = new FormData();
          formdata.append('images', {
            uri:
              Platform.OS === 'ios'
                ? customAvatar.path.replace('file://', '')
                : customAvatar.path,
            type: 'image/jpeg',
            name: 'customAvatar.jpg',
          });
          imagesUpload = await axios({
            method: 'post',
            url: uploadImageRoute,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            data: formdata,
          });
        }
        const {data} = await axios.post(`${setAvatarRoute}/${userObj._id}`, {
          avatarImage: imagesUpload?.data || customAvatar.path,
          isCustomAvatar: customAvatar.isCustom,
        });
        setLoadingAvaSet(false);
        if (data.isSet) {
          userObj.isAvatarImageSet = true;
          userObj.avatarImage = data.image;
          userObj.isCustomAvatar = customAvatar.isCustom;
          dispatch(logIn({user: userObj}));
        }
      } catch (error) {
        console.log(
          '🚀 ~ file: SetAvatarScreen.js ~ line 81 ~ submit ~ error',
          error,
        );
        setLoadingAvaSet(false);
      }
    }
  };
  const callData = async () => {
    setLoading(true);
    const data = [];
    try {
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`,
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString('base64'));
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: SetAvatarScreen.js ~ line 44 ~ callData ~ error',
        error,
      );
    }
    setAvatars(data);
    setLoading(false);
  };
  useEffect(() => {
    callData();
  }, []);
  return (
    <Root>
      <View style={styles.container}>
        {isLoading ? (
          <Image source={IMAGE.loader} style={styles.loader} />
        ) : (
          <>
            <Text style={styles.textNavigate}>
              Pick an Avatar as your profile picture
            </Text>
            <View style={styles.listAva}>
              {avatars.map((avatar, index) => {
                const check = customAvatar?.path === avatar;
                return (
                  <TouchableOpacity
                    key={avatar}
                    style={styles.item}
                    onPress={() => {
                      setCustomAvatar({
                        path: avatar,
                        isCustom: false,
                      });
                    }}>
                    <SvgXml
                      xml={getBasse64SvgImg(avatar)}
                      width={check ? 80 : 50}
                      height={check ? 80 : 50}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.textNavigate}>
              Or upload your own avatar from your device
            </Text>
            <AvatarPicker
              avatar={customAvatar}
              onPickAvatar={(path, res) => {
                setCustomAvatar({
                  path,
                  isCustom: true,
                  file: res,
                });
              }}
            />
            <View style={styles.row}>
              <TouchableOpacity
                style={{
                  ...styles.button,
                  width: windowWidth - 160,
                }}
                onPress={submit}>
                {isLoadingAvaSet ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.textButton}>SET AT PROFILE PITCUTRE</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.button,
                  marginLeft: 20,
                  paddingHorizontal: 10,
                  backgroundColor: '#7026d0',
                }}
                onPress={callData}>
                <MaterialCommunityIcons color="white" name="reload" size={30} />
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <Text style={styles.textNavigateB}>
                ALREADY HAVE AN ACCOUNT?{' '}
              </Text>
              <TouchableOpacity
                style={styles.buttonNavigate}
                onPress={() => navigation.navigate(SCREEN_NAME.LOGIN_SCREEN)}>
                <Text style={styles.textNavigateButton}>LOGIN.</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Root>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1a1a38',
    alignItems: 'center',
  },
  listAva: {
    flexDirection: 'row',
    width: windowWidth - 40,
    justifyContent: 'space-between',
    margin: 20,
    alignItems: 'center',
  },

  textButton: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textNavigate: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    width: windowWidth - 80,
    marginTop: 20,
  },
  textNavigateB: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  textNavigateButton: {
    color: '#4e0eff',
    fontSize: 15,
    fontWeight: 'bold',
    margin: 0,
    padding: 0,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgb(78,15,255)',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loader: {
    width: 150,
    height: 200,
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
});

export default SetAvatarScreen;
const getBasse64SvgImg = icon => {
  let finalbase64String = '';
  finalbase64String = 'data:image/svg+xml;base64,' + base64.decode(icon);
  return finalbase64String;
};
