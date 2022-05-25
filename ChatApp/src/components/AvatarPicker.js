/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
const option = {
  width: 400,
  height: 400,
  cropping: true,
  cropperCircleOverlay: true,
};
import {SPSheet} from 'react-native-popup-confirm-toast';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const windowWidth = Dimensions.get('window').width;

const AvatarPicker = props => {
  const {onPickAvatar, avatar} = props;
  const spSheet = SPSheet;

  const openCamera = () => {
    spSheet.hide();
    ImagePicker.openCamera(option)
      .then(res => {
        onPickAvatar && onPickAvatar(res?.path, res);
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
        onPickAvatar && onPickAvatar(res?.path, res);
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
  const openBottomSheet = () => {
    spSheet.show({
      component: () => component({...this.props, spSheet}),
      dragFromTopOnly: true,
      height: 180,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          ...styles.avatarButton,
          backgroundColor:
            avatar?.path && avatar?.isCustom ? '#00000080' : null,
          borderWidth: 2,
          borderColor: '#ffffff60',
        }}
        onPress={openBottomSheet}>
        {avatar?.path && avatar?.isCustom ? (
          <Image source={{uri: avatar?.path}} style={styles.avatarButton} />
        ) : (
          <MaterialCommunityIcons name="upload" size={65} color="#ffffff60" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
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

export default AvatarPicker;
