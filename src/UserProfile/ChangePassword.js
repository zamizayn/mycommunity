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
import Password_icon from '../assets/svg/Password_icon.svg';
import Toast from 'react-native-simple-toast';
import AsyncStorageHelper from '../helpers/AsyncStorageHelper';
export default class ChangePassword extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      old_password: '',
      password: '',
      confirm_password: '',
      error: false,
      passSecure: true,
      old_passSecure: true,
      confirm_passSecure: true,
      loader: false,
      userdata: {},
    };
  }
  componentDidMount() {
    this.getDeviceId();
    this.getUserData();
  }
  async getDeviceId() {
    var deviceId = DeviceInfo.getUniqueId();
    this.deviceId = deviceId;
  }
  viewPassword() {
    this.setState({
      passSecure: !this.state.passSecure,
    });
  }
  oldviewPassword() {
    this.setState({
      old_passSecure: !this.state.old_passSecure,
    });
  }
  confirmViewPassword() {
    this.setState({
      confirm_passSecure: !this.state.confirm_passSecure,
    });
  }
  async getUserData() {
    await ApiHelper.get(API.userData)
      .then(res => {
        var dataLen = res.data.data;
        this.setState(
          {
            userdata: dataLen,
          },
          () => {
            // console.log('user arr', this.state.userdata);
          },
        );
      })
      .catch(err => {
        console.log(err);
      });
  }

  async submitChangePassword() {
    this.setState({
      loader: true,
    });
    if (
      this.state.old_password == '' ||
      (this.state.password == '' && this.state.password.length < 6)
    ) {
      this.setState({
        error: true,
        loader: false,
      });
    } else if (this.state.password !== this.state.confirm_password) {
      Toast.showWithGravity('Password mismatch', Toast.LONG, Toast.BOTTOM);
      this.setState({
        loader: false,
      });
    } else {
      let formData = {
        old_password: this.state.old_password,
        new_password: this.state.password,
      };
      await ApiHelper.put(API.userChangePassword, formData)
        .then(res => {
          this.setState({
            loader: false,
          });
          Toast.showWithGravity(res.data.message, Toast.LONG, Toast.BOTTOM);
          this.loginUser();
        })
        .catch(err => {
          this.setState({
            loader: false,
          });
          console.log(err);
        });
    }
  }
  async loginUser() {
    let formData = {
      username: this.state.userdata.username,
      password: this.state.password,
      deviceType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
      deviceToken: this.deviceId,
    };
    await ApiHelper.post(API.login, formData, false)
      .then(res => {
        AsyncStorageHelper.storeItem('TOKEN', res.data.data.token);
        AsyncStorageHelper.storeItem('USERDATA', JSON.stringify(res.data.data));
      })
      .catch(err => {
        this.setState({
          loader: false,
        });
        console.log(err);
      });
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
                Change Password
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginTop: height / 10,
                paddingLeft: width / 20,
                paddingRight: width / 20,
              }}>
              {/* <MyCommunitylogo height="150" width="150"/> */}
              {/* <Image
                source={require('../assets/images/icon.png')}
                style={{
                  height: width / 2.3,
                  width: width / 2.3,
                  alignSelf: 'center',
                  marginBottom: height / 15,
                }}
              /> */}

              <Image
                source={require('../../src/assets/images/mc_logo.png')}
                style={{
                  height: 150,
                  width: 150,
                  alignSelf: 'center',
                  marginBottom: 20,
                }}
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
                  width: width / 1.12,
                  height: height / 16,
                  marginBottom: width / 40,
                }}>
                <Password_icon height="25" width="28" />
                <FloatingLabelInput
                  width={width / 1.3}
                  mandatory={true}
                  value={this.state.old_password}
                  returnKeyType={'next'}
                  ref={ref => (this.customInput1 = ref)}
                  // onSubmitEditing={() =>
                  //   this.customInput8.refs.innerTextInput8.focus()
                  // }
                  secureTextEntry={this.state.old_passSecure}
                  refInner="innerTextInput1"
                  placeholder="Old Password *"
                  placeholderTextColor={'#808B96'}
                  onChangeText={value => {
                    this.setState({
                      old_password: value,
                    });
                  }}
                />

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => this.oldviewPassword()}
                  style={{
                    right: width / 10,
                    alignSelf: 'flex-end',
                    bottom: height / 215,
                  }}>
                  <Image
                    source={
                      this.state.old_passSecure
                        ? require('../assets/images/eye-closed.png')
                        : require('../assets/images/eye-open.png')
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

              {this.state.old_password == '' && this.state.error ? (
                <Text style={styles.errorStyle}>
                  Please enter your old password
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
                  placeholder="New Password *"
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
                        ? require('../assets/images/eye-closed.png')
                        : require('../assets/images/eye-open.png')
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
                  width={width / 1.3}
                  mandatory={true}
                  value={this.state.confirm_password}
                  returnKeyType={'done'}
                  ref={ref => (this.customInput3 = ref)}
                  // onSubmitEditing={() =>
                  //   this.customInput8.refs.innerTextInput8.focus()
                  // }
                  secureTextEntry={this.state.confirm_passSecure}
                  refInner="innerTextInput3"
                  placeholder="Confirm Password *"
                  placeholderTextColor={'#808B96'}
                  onChangeText={value => {
                    this.setState({
                      confirm_password: value,
                    });
                  }}
                />

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => this.confirmViewPassword()}
                  style={{
                    right: width / 10,
                    alignSelf: 'flex-end',
                    bottom: height / 215,
                  }}>
                  <Image
                    source={
                      this.state.confirm_passSecure
                        ? require('../assets/images/eye-closed.png')
                        : require('../assets/images/eye-open.png')
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
                  Please enter your new password
                </Text>
              ) : this.state.password.length < 6 && this.state.error ? (
                <Text style={styles.errorStyle}>
                  Password length must be more than 6 characters
                </Text>
              ) : null}

              <TouchableOpacity
                onPress={() => {
                  this.submitChangePassword();
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
