import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import LogoComponent from '../components/LogoComponent';
import {Formik} from 'formik';
import {SCREEN_NAME} from '../navigation/screen';
import {useDispatch} from 'react-redux';
import {login} from '../redux/thunk';
import {Root, Toast} from 'react-native-popup-confirm-toast';
const windowWidth = Dimensions.get('window').width;

import * as Yup from 'yup';
import FiledInput from '../components/FiledInput';
import FiledInputPassword from '../components/FiledInputPassword';

const SignupSchema = Yup.object().shape({
  userName: Yup.string().required('User name is required'),
  password: Yup.string().required('Password is required'),
});

const LoginScreen = ({route, navigation}) => {
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const submit = values => {
    setLoading(true);
    dispatch(login(values))
      .unwrap()
      .then(originalPromiseResult => {
        // setLoading(false);
      })
      .catch(rejectedValueOrSerializedError => {
        setLoading(false);
        Toast.show({
          backgroundColor: '#4e0eff',
          title: rejectedValueOrSerializedError?.error,
          color: '#702c91',
          timeColor: '#440f5f',
          timing: 2000,
          position: 'top',
        });
      });
  };
  return (
    <Root>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            enabled
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={styles.container}>
            <View style={styles.loginForm}>
              <LogoComponent />
              <Formik
                validationSchema={SignupSchema}
                initialValues={{userName: '', password: ''}}
                onSubmit={submit}>
                {({handleChange, handleBlur, handleSubmit, values, errors}) => (
                  <View>
                    <FiledInput
                      placeholder="User name"
                      onChangeText={handleChange('userName')}
                      value={values.userName}
                      name="userName"
                    />
                    <FiledInputPassword
                      placeholder="Password"
                      onChangeText={handleChange('password')}
                      value={values.password}
                      name="password"
                    />
                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={styles.button}>
                      {isLoading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text style={styles.textButton}>LOG IN</Text>
                      )}
                    </TouchableOpacity>
                    <View style={styles.row}>
                      <Text style={styles.textNavigate}>
                        DON'T HAVE AN ACCOUNT?{' '}
                      </Text>
                      <TouchableOpacity
                        style={styles.buttonNavigate}
                        onPress={() =>
                          navigation.navigate(SCREEN_NAME.REGISTER_SCREEN)
                        }>
                        <Text style={styles.textNavigateButton}>
                          CREATE ONE.
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Formik>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Root>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1a1a38',
  },
  background: {
    flex: 0,
    backgroundColor: '#131324',
  },
  loginForm: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#00000076',
    paddingVertical: 20,
  },
  inputText: {
    borderWidth: 1,
    borderColor: '#4e0eff',
    borderRadius: 7,
    overflow: 'hidden',
    width: windowWidth - 80,
    height: 45,
    padding: 10,
    marginBottom: 20,
    color: 'white',
  },
  button: {
    width: windowWidth - 80,
    backgroundColor: '#4e0eff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 7,
  },
  textButton: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textNavigate: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    // marginTop: 10,
  },
  textNavigateButton: {
    color: '#4e0eff',
    fontSize: 15,
    fontWeight: 'bold',
    margin: 0,
    padding: 0,
  },
  buttonNavigate: {
    justifyContent: 'flex-end',
    // backgroundColor: 'red',
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
});

export default LoginScreen;
