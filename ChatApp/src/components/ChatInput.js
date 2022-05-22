import React, {useState} from 'react';
import {
  TextInput,
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import ImagePickerModal from 'react-native-image-picker-modal';

const windowWidth = Dimensions.get('window').width;

const ChatInput = props => {
  const [msg, setMsg] = useState('');
  const [images, setImages] = useState([]);
  const [isVisible, setVisible] = useState(false);

  const sendChat = () => {
    if (msg.length > 0 || images.length > 0) {
      props.handleSendMsg(msg, images);
      setMsg('');
      setImages([]);
    }
  };
  const removeImage = item => {
    const newImages = images.filter(image => image.id !== item.id);
    setImages(newImages);
  };
  const openPicker = () => {
    setVisible(true);
  };
  const renderImage = ({item}) => {
    return (
      <>
        <Image style={styles.images} source={{uri: item?.uri}} />
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => removeImage(item)}>
          <Feather name="x-circle" size={20} color="white" />
        </TouchableOpacity>
      </>
    );
  };
  return (
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
      <TouchableOpacity onPress={sendChat}>
        <Feather name="send" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={openPicker}>
        <Feather name="image" size={30} color="white" />
      </TouchableOpacity>
      <ImagePickerModal
        title="You can either take a picture or select one from your album."
        data={['Take a photo', 'Select from the library']}
        isVisible={isVisible}
        onCancelPress={() => {
          setVisible(false);
        }}
        onBackdropPress={() => {
          setVisible(false);
        }}
        onPress={item => {
          setVisible(false);
          setImages(prevState => [...prevState, ...item?.assets]);
        }}
      />
    </View>
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
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default ChatInput;
