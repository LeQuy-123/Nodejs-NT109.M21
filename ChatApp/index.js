/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {LogBox} from 'react-native';

Feather.loadFont();
MaterialCommunityIcons.loadFont();
LogBox.ignoreLogs(['ViewPropTypes']);
AppRegistry.registerComponent(appName, () => App);
