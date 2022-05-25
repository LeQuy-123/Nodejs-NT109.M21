/* eslint-disable react-native/no-inline-styles */
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {
  TextInput,
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Text,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import {SPSheet, Root} from 'react-native-popup-confirm-toast';
const spSheet = SPSheet;

const windowWidth = Dimensions.get('window').width;
const option = {
  multiple: true,
};
const ChatInput = (props, ref) => {
  const [msg, setMsg] = useState('');
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendChat = () => {
    if (msg.length > 0 || images.length > 0) {
      props.handleSendMsg(msg, images);
      setMsg('');
      setImages([]);
    }
  };
  const removeImage = item => {
    const newImages = images.filter(image => image.path !== item.path);
    setImages(newImages);
  };
  const renderImage = ({item}) => {
    return (
      <>
        <Image style={styles.images} source={{uri: item?.path}} />
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => removeImage(item)}>
          <Feather name="x-circle" size={20} color="white" />
        </TouchableOpacity>
      </>
    );
  };
  useImperativeHandle(ref, () => ({
    setLoading: x => setIsLoading(x),
  }));
  const openBottomSheet = () => {
    spSheet.show({
      component: () => component({spSheet}),
      dragFromTopOnly: true,
    });
  };
  const openCamera = () => {
    spSheet.hide();
    ImagePicker.openCamera(option)
      .then(res => {
        console.log(res);
        setImages(prevState => [...prevState, res]);
      })
      .catch(err => {
        console.log(
          '🚀 ~ file: AvatarPicker.js ~ line 25 ~ ImagePicker.openCamera ~ err',
          err,
        );
      });
  };
  const openGallery = () => {
    spSheet.hide();
    ImagePicker.openPicker(option)
      .then(res => {
        setImages(prevState => [...prevState, ...res]);
      })
      .catch(err => {
        console.log(
          '🚀 ~ file: AvatarPicker.js ~ line 25 ~ ImagePicker.openGallery ~ err',
          err,
        );
      });
  };
  const component = () => {
    return (
      <View style={styles.bottomSheet}>
        <TouchableOpacity
          onPress={openGallery}
          style={{
            ...styles.buttonOption,
            borderColor: '#00000080',
            borderBottomWidth: 1,
          }}>
          <Text style={styles.btnText}>Gallery</Text>
          <MaterialCommunityIcons name="library-shelves" size={27} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={openCamera}
          style={{
            ...styles.buttonOption,
            borderBottomColor: '#00000080',
            borderBottomWidth: 1,
          }}>
          <Text style={styles.btnText}>Camera</Text>
          <MaterialCommunityIcons name="camera-outline" size={27} />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <Root>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="type your message here"
            value={msg}
            style={styles.input}
            placeholderTextColor="rgb(169,169,169)"
            onChangeText={text => setMsg(text)}
          />
          {images && images?.length > 0 && (
            <FlatList
              style={styles.list}
              horizontal
              data={images}
              renderItem={renderImage}
            />
          )}
        </View>
        {isLoading ? (
          <ActivityIndicator color="#ffffff80" />
        ) : (
          <TouchableOpacity onPress={sendChat}>
            <Feather name="send" size={30} color="white" />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={openBottomSheet}>
          <Feather name="image" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </Root>
  );
};

const styles = StyleSheet.create({
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: -2,
  },
  container: {
    width: windowWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'rgb(8,4,32)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  list: {
    marginTop: 10,
  },
  images: {
    width: 65,
    height: 65,
    marginHorizontal: 4,
  },
  inputContainer: {
    width: windowWidth - 120,
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'rgb(59,55,78)',
  },
  input: {
    fontSize: 16,
    color: 'white',
    margin: 0,
    padding: 0,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  bottomSheet: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  btnText: {
    fontSize: 17,
  },
  buttonOption: {
    width: windowWidth - 40,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  avatarButton: {
    width: 100,
    height: 100,
    borderRadius: 75,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default forwardRef(ChatInput);
