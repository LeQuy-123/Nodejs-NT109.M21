import React, {useState} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import {ErrorMessage} from 'formik';
const windowWidth = Dimensions.get('window').width;
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const FiledInputPassword = props => {
  const [isHidePassword, setIsHidePassword] = useState(true);
  return (
    <View style={styles.container}>
      <TextInput
        secureTextEntry={isHidePassword}
        style={styles.inputText}
        placeholderTextColor={'#c2c2c2'}
        {...props}
      />
      <TouchableOpacity
        style={styles.rightIcon}
        onPress={() => setIsHidePassword(prev => !prev)}>
        <MaterialCommunityIcons
          name={isHidePassword ? 'eye' : 'eye-off'}
          size={24}
          color="#4e8dea"
        />
      </TouchableOpacity>
      <ErrorMessage
        name={props.name}
        render={msg => {
          return (
            <View style={styles.error}>
              <Text style={styles.errorMessage}>{msg}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    height: 60,
  },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 10,
  },
  errorMessage: {
    fontSize: 12,
    fontStyle: 'italic',
    color: 'red',
  },
  inputText: {
    borderWidth: 1,
    borderColor: '#4e0eff',
    borderRadius: 7,
    overflow: 'hidden',
    width: windowWidth - 80,
    height: 45,
    padding: 10,
    color: 'white',
  },
  rightIcon: {
    position: 'absolute',
    right: 15,
    top: 10,
  },
});

export default FiledInputPassword;
