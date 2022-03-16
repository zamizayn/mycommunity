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
import MyCommunitylogo from './assets/svg/MyCommunitylogo.svg';
import Back_button_icon from './assets/svg/Back_button_icon.svg';
import User_icon from './assets/svg/User_icon.svg';
import Password_icon from './assets/svg/Password_icon.svg';
import FloatingLabelInput from './components/FloatingLabelInput';
import DeviceInfo from 'react-native-device-info';
import {ApiHelper} from './helpers/ApiHelper';
import {API} from './config/api';
import Loader from './components/Loader';
import Toast from 'react-native-simple-toast';
import AsyncStorageHelper from './helpers/AsyncStorageHelper';
import Axios from 'axios';
import theme from './config/styles.js';
import {StackActions, CommonActions} from '@react-navigation/native';
export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      password: '',
      error: false,
      passSecure: true,
      loader: false,
    };
  }
  componentDidMount() {
    this.getDeviceId();
  }
  async getDeviceId() {
    var deviceId = DeviceInfo.getUniqueId();
    this.deviceId = deviceId;
    //  await AsyncStorageHelper.storeItem('deviceId', deviceId);
  }
  viewPassword() {
    this.setState({
      passSecure: !this.state.passSecure,
    });
  }

  async loginUser() {
    if (
      this.state.userName == '' ||
      (this.state.password == '' && this.state.password.length < 6)
    ) {
      this.setState({
        error: true,
        loader: false,
      });
    } else {
      let formData = {
        username: this.state.userName,
        password: this.state.password,
        deviceType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
        deviceToken: 214214324,
      };
      await ApiHelper.post(API.login, formData)
        .then(res => {
          if (res) {
            this.setState({
              loader: false,
            });
            AsyncStorageHelper.storeItem('ISUSER', 'user_exist');
            AsyncStorageHelper.storeItem(
              'USERDATA',
              JSON.stringify(res.data.data),
            );
            AsyncStorageHelper.storeItem('TOKEN', res.data.data.token);
            AsyncStorageHelper.storeItem(
              'USERROLE',
              res.data.data.userRole.toString(),
            );
            Toast.showWithGravity(res.data.message, Toast.LONG, Toast.BOTTOM);
            this.props.navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: 'HomeMenu',
                  },
                ],
              }),
            );
          }
        })
        .catch(err => {
          this.setState({
            loader: false,
          });
          console.log('Login Error ', err.response);
          if (err.response.data.data.otpResend == 1) {
            this.props.navigation.navigate('OtpVerification', {
              user_id: err.response.data.data._id,
              user_name: err.response.data.data.username,
              otp_resend: 1,
            });
          }
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
                style={[
                  theme.fontBold,
                  {
                    fontSize: width / 16,
                    fontWeight: 'bold',
                    //color: '#bd1d53',
                    // marginTop:height/15,
                    position: 'absolute',
                    right: 8,
                  },
                ]}>
                Login
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginTop: height / 10,
                paddingLeft: width / 20,
                paddingRight: width / 20,
              }}>
              {/* <MyCommunitylogo
                height="200"
                width="200"
                style={{
                  alignSelf: 'center',
                }}
              /> */}
              {/* <Image
                source={require('../src/assets/images/icon.png')}
                style={{
                  height: width / 2.3,
                  width: width / 2.3,
                  alignSelf: 'center',
                }}
              /> */}
              <Image
                source={require('../src/assets/images/mc_logo.png')}
                style={{height: 170, width: 170, alignSelf: 'center'}}
                resizeMode="contain"
              />

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
                  returnKeyType={'next'}
                  ref={ref => (this.customInput1 = ref)}
                  onSubmitEditing={() =>
                    this.customInput2.refs.innerTextInput2.focus()
                  }
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
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 25,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingLeft: width / 10,
                  width: width / 1.12,
                  height: height / 16,
                  marginBottom: width / 40,
                }}>
                <Password_icon height="25" width="28" />
                <FloatingLabelInput
                  autoCapitalize="none"
                  width={width / 1.3}
                  mandatory={true}
                  value={this.state.password}
                  returnKeyType={'done'}
                  ref={ref => (this.customInput2 = ref)}
                  // onSubmitEditing={() =>
                  //   this.customInput8.refs.innerTextInput8.focus()
                  // }
                  secureTextEntry={this.state.passSecure}
                  refInner="innerTextInput2"
                  placeholder="Password *"
                  placeholderTextColor={'#808B96'}
                  onChangeText={value => {
                    this.setState({
                      password: value,
                    });
                  }}
                />

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => this.viewPassword()}
                  style={{
                    right: width / 10,
                    alignSelf: 'flex-end',
                    bottom: height / 215,
                  }}>
                  <Image
                    source={
                      this.state.passSecure
                        ? require('./assets/images/eye-closed.png')
                        : require('./assets/images/eye-open.png')
                    }
                    resizeMode={'contain'}
                    style={{
                      height: height / 18,
                      width: width / 13,
                      right: height / 150,
                    }}
                  />
                </TouchableOpacity>
              </View>

              {this.state.password == '' && this.state.error ? (
                <Text style={styles.errorStyle}>
                  Please enter your password
                </Text>
              ) : this.state.password.length < 6 && this.state.error ? (
                <Text style={styles.errorStyle}>
                  Password length must be more than 6 characters
                </Text>
              ) : null}

              <TouchableOpacity
                onPress={() => {
                  this.loginUser();
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
                  style={[
                    theme.fontBold,
                    {
                      color: '#FFFFFF',
                      fontSize: width / 20,
                      fontWeight: 'bold',
                    },
                  ]}>
                  Login
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 50,
                  alignSelf: 'center',
                  marginTop: height / 20,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('ForgotPassword');
                  }}>
                  <Text style={{color: '#bd1d53', fontSize: width / 28}}>
                    Forgot Password
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 50,
                  alignSelf: 'center',
                }}>
                <Text style={{color: '#262626', fontSize: width / 28}}>
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('SignUp');
                  }}>
                  <Text
                    style={[
                      theme.fontBold,
                      {
                        color: '#bd1d53',
                        fontWeight: 'bold',
                        fontSize: width / 28,
                      },
                    ]}>
                    Register
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: height / 50,
                  alignSelf: 'center',
                }}>
                <Text style={{color: '#262626', fontSize: width / 28}}>
                  Continue as a{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.dispatch(
                      StackActions.replace('HomeMenu'),
                    );
                  }}>
                  <Text
                    style={[
                      theme.fontBold,
                      {
                        color: '#bd1d53',
                        fontWeight: 'bold',
                        fontSize: width / 28,
                      },
                    ]}>
                    Guest User
                  </Text>
                </TouchableOpacity>
              </View>
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
