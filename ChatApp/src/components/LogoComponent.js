import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {IMAGE} from '../assets';

const LogoComponent = props => {
  return (
    <View style={styles.container}>
      <Image source={IMAGE.logo} style={styles.logo} />
      <Text style={styles.textLogo}>CHAT-APP</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 13,
  },
  logo: {
    width: 70,
    height: 80,
  },
});

export default LogoComponent;
