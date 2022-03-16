import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  StyleSheet
} from 'react-native';
var {height, width} = Dimensions.get('window');
export default class Splash extends Component {
    constructor() {
      super();
    }
    componentDidMount() {
      var that = this;
      setTimeout(function () {
        that.Hide_Splash_Screen();
      }, 2000);
    }
    async Hide_Splash_Screen() {
        this.props.navigation.navigate('WelcomePage');   
    }
    render() {
        return ( 
            <ImageBackground
              source={require('../src/assets/iconsandsplash/splash.png')}
              style={styles.containerStyle}>
              </ImageBackground>
          );
        }
    }
const styles = StyleSheet.create({
  containerStyle: {
    resizeMode: 'contain',
    height: height,
    width: width,
  },
});
