/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {IMAGE} from '../assets';

const WelcomeComponent = props => {
  const userName = useSelector(state => state?.authReducer?.userInfo?.username);
  return (
    <View style={styles.container}>
      <Image source={IMAGE.welcome} style={styles.logo} />
      <View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.textLogo}>Welcome, </Text>
          <Text style={{...styles.textLogo, color: '#4e0eff'}}>
            {userName}!
          </Text>
        </View>
        <Text style={styles.textLogo}>
          Please select a chat {'\n'} to Start messaging.
        </Text>
      </View>
    </View>
  );
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
    width: 100,
    height: 100,
  },
});

export default WelcomeComponent;
