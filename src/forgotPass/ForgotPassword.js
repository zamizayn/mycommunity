import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {Container, Content} from 'native-base';
var {height, width} = Dimensions.get('window');
import Back_button_icon from '../assets/svg/Back_button_icon.svg';
import User_icon from '../assets/svg/User_icon.svg';
import FloatingLabelInput from '../components/FloatingLabelInput';
import DeviceInfo from 'react-native-device-info';
import {ApiHelper} from '../helpers/ApiHelper';
import {API} from '../config/api';
import Loader from '../components/Loader';
import Toast from 'react-native-simple-toast';
import MyCommunitylogo from '../assets/svg/MyCommunitylogo.svg';
export default class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      error: false,
      passSecure: true,
      loader: false,
    };
  }
  componentDidMount() {}

  viewPassword() {
    this.setState({
      passSecure: !this.state.passSecure,
    });
  }

  async resetPassword() {
    this.setState({
      loader: true,
    });
    if (this.state.userName == '') {
      this.setState({
        error: true,
        loader: false,
      });
    } else {
      let formData = {
        username: this.state.userName,
      };
      await ApiHelper.post(API.resetPassword, formData)
        .then(res => {
          this.setState({
            loader: false,
          });
          Toast.showWithGravity(res.data.message, Toast.LONG, Toast.BOTTOM);
          this.props.navigation.navigate('ForgotPassVerifyOtp', {
            userid: res.data.data.id,
            username: this.state.userName,
          });
        })
        .catch(err => {
          this.setState({
            loader: false,
          });
          console.log(err);
        });
    }
  }
  render() {
    return (
      <Container>
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{backgroundColor: '#eae3e5', flex: 1}}>
          <Loader visibility={this.state.loader} />
          <KeyboardAvoidingView
            keyboardShouldPersistTaps="always"
            keyboardVerticalOffset={50}
            behavior={'position'}>
            <View
              style={{
                flexDirection: 'row',
                marginStart: width / 22,
                marginEnd: width / 22,
                marginTop: height / 20,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack(null);
                }}>
                <Back_button_icon height="25" width="25" />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: width / 16,
                  fontWeight: 'bold',
                  //color: '#bd1d53',
                  // marginTop:height/15,
                  position: 'absolute',
                  right: 8,
                }}>
                Forgot Password
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginTop: height / 10,
                paddingLeft: width / 20,
                paddingRight: width / 20,
              }}>
              {/* <MyCommunitylogo height="200" width="200"      style={{
                alignSelf: 'center',
              }} /> */}
              {/* <Image
              source={require('../assets/images/icon.png')}
              style={{
                height: width / 2.3,
                width: width / 2.3,
                alignSelf: 'center',
              }}
            /> */}

              <Image
                source={require('../../src/assets/images/mc_logo.png')}
                style={{height: 170, width: 170, alignSelf: 'center'}}
                resizeMode="contain"
              />

              <Text
                style={{
                  textAlign: 'center',
                  paddingLeft: width / 18,
                  paddingRight: width / 18,
                  fontSize: width / 26.6,
                  marginTop: height / 20,
                }}>
                Please submit your registered user name to reset yout password
              </Text>

              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 25,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingLeft: width / 10,
                  width: width / 1.2,
                  height: height / 16,
                  marginBottom: width / 40,
                  marginTop: height / 25,
                }}>
                <User_icon height="25" width="25" />
                <FloatingLabelInput
                  autoCapitalize="none"
                  width={width / 1.3}
                  mandatory={true}
                  value={this.state.userName}
                  returnKeyType={'done'}
                  ref={ref => (this.customInput1 = ref)}
                  refInner="innerTextInput1"
                  placeholder="Username *"
                  placeholderTextColor={'#808B96'}
                  onChangeText={value => {
                    this.setState({
                      userName: value,
                    });
                  }}
                />
              </View>
              {this.state.userName == '' && this.state.error ? (
                <Text style={styles.errorStyle}>
                  Please enter your username
                </Text>
              ) : null}

              <TouchableOpacity
                onPress={() => {
                  this.resetPassword();
                }}
                style={{
                  width: width / 1.12,
                  borderRadius: 28,
                  marginTop: width / 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#bd1d53',
                  height: width / 8,
                }}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: width / 20,
                    fontWeight: 'bold',
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
          <Text
            style={{
              fontSize: width / 30,
              color: '#909090',
              justifyContent: 'center',
              alignSelf: 'center',
              position: 'absolute',
              bottom: 12,
            }}>
            © My Community.All Rights Reserved
          </Text>
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  errorStyle: {
    color: 'red',
    fontSize: width / 30,
    width: width / 1.1,
    marginBottom: height / 80,
    marginTop: -8,
    textAlign: 'left',
    marginLeft: 8,
  },
});
