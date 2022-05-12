import React, {useState} from 'react';
import {
  TextInput,
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const windowWidth = Dimensions.get('window').width;

const ChatInput = props => {
  const [msg, setMsg] = useState('');
  const sendChat = () => {
    if (msg.length > 0) {
      props.handleSendMsg(msg);
      setMsg('');
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="type your message here"
        value={msg}
        style={styles.input}
        placeholderTextColor="rgb(169,169,169)"
        onChangeText={text => setMsg(text)}
      />
      <TouchableOpacity onPress={sendChat}>
        <Feather name="send" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  input: {
    fontSize: 16,
    // height: 45,
    width: windowWidth - 80,
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'rgb(59,55,78)',
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
