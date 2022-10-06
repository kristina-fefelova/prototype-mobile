import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';

enableScreens();

import {AppRegistry, Platform} from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';

import App from './src/App';
import {name as appName} from './app.json';

if (Platform.OS === 'ios') {
  KeyboardManager.setToolbarDoneBarButtonItemText('OK');
}

AppRegistry.registerComponent(appName, () => App);
