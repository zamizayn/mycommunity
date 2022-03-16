/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import RootContainer from './src/RootContainer';
// import Splash from './src/Splash';

AppRegistry.registerComponent(appName, () => RootContainer);
