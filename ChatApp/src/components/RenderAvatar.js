import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {getImageRoute} from '../utils/APIRoutes';
import {SvgXml} from 'react-native-svg';
import base64 from 'react-native-base64';

export const ServerImage = props => {
  const {id = ''} = props;
  return (
    <View style={styles.container}>
      <Image source={{uri: `${getImageRoute}/${id}`}} style={styles.logo} />
    </View>
  );
};
const getBasse64SvgImg = icon => {
  let finalbase64String = '';
  finalbase64String = 'data:image/svg+xml;base64,' + base64.decode(icon);
  return finalbase64String;
};
const RenderAvatar = props => {
  const {user = ''} = props;
  if (!user.avatarImage) {
    return (
      <View style={styles.avatar}>
        <Text style={styles.nameAva}>{user.username?.split('')[0]}</Text>
      </View>
    );
  }
  if (user.isCustomAvatar) {
    return <ServerImage id={user.avatarImage} />;
  } else {
    return (
      <SvgXml xml={getBasse64SvgImg(user.avatarImage)} width={50} height={50} />
    );
  }
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  textLogo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 40,
  },
});

export default RenderAvatar;
