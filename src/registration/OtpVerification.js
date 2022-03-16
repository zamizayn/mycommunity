import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import {Container, Content} from 'native-base';
var {height, width} = Dimensions.get('window');
import Back_button_icon from '../assets/svg/Back_button_icon.svg';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import CountDown from 'react-native-countdown-component';
import Toast from 'react-native-simple-toast';
import Verified_congratulations from '../assets/svg/Verified_congratulations.svg';
import {ApiHelper} from '../helpers/ApiHelper';
import {API} from '../config/api';
import Loader from '../components/Loader';
import MyCommunitylogo from '../assets/svg/MyCommunitylogo.svg';
export default class OtpVerification extends Component {
  username = '';
  user_id = '';
  constructor() {
    super();
    this.state = {
      otpCode: '',
      timerSeconds: 420,
      verifyModalView: false,
      isRunning: false,
      timeFinished: false,
      username: '',
      loader: false,
    };
  }
  componentDidMount() {
    this.username = this.props.route.params.user_name;
    this.user_id = this.props.route.params.user_id;
    this.resend = this.props.route.params.otp_resend;
    this.setState({
      isRunning: true,
    });
    if (this.resend == 1) {
      this.resendOTP();
    }
  }

  async resendOTP() {
    this.setState({
      loader: true,
    });
    let formData = {
      username: this.username,
    };
    await ApiHelper.post(API.resendOTP, formData)
      .then(res => {
        Toast.showWithGravity(res.data.message, Toast.LONG, Toast.BOTTOM);
      })
      .catch(err => {});
    this.setState({
      timeFinished: false,
      isRunning: true,
      loader: false,
    });
  }

  async verifyOtp() {
    if (this.state.otpCode == '') {
      Toast.showWithGravity('Please enter otp', Toast.LONG, Toast.BOTTOM);
    } else {
      let formData = {
        uid: this.user_id,
        token: this.state.otpCode,
      };
      await ApiHelper.post(API.verifyUser, formData)
        .then(res => {
          console.log('res otp ', res);
          this.setState({
            loader: false,
          });
          this.setState({
            verifyModalView: true,
            isRunning: false,
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
  closeModal = () => {
    this.setState({
      verifyModalView: false,
    });
  };

  verifyModal = () => {
    return (
      <View>
        <Modal
          visible={this.state.verifyModalView}
          animationType="slide"
          transparent={true}
          backgroundColor="#fff"
          onRequestClose={() => {
            this.setState({
              verifyModalView: false,
            });
          }}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            enabled>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                backgroundColor: 'rgba(100,100,100, 0.5)',
                //padding: 20,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  height: height / 2,
                  width: '90%',
                  borderRadius: 20,
                  borderWidth: 1,
                  // marginBottom: -(width / 1.5),
                  borderColor: '#fff',
                  paddingBottom: height / 3,
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    marginTop: height / 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Verified_congratulations height="90" width="90" />
                </View>

                <Text
                  style={{
                    // fontSize: width / 21,
                    fontSize: width / 18,
                    color: 'black',
                    marginBottom: height / 60,
                    marginTop: height / 30,
                    // width:width/1,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginStart: width / 22,
                    marginEnd: width / 30,
                    fontWeight: 'bold',
                  }}>
                  Congragulations!
                </Text>
                <Text
                  style={{
                    color: '#5A5A5A',
                    fontSize: width / 25,
                    paddingBottom: height / 76,
                    fontFamily: 'AvenirLTStd-Book',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginStart: width / 22,
                    marginEnd: width / 30,
                  }}>
                  You have successfully verified
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.closeModal();
                      this.props.navigation.navigate('Login');
                    }}
                    style={{
                      width: width / 1.3,
                      borderRadius: 28,
                      marginTop: width / 13,
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
                      Continue
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  };

  render() {
    return (
      <Container>
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{backgroundColor: '#eae3e5', flex: 1}}>
          <Loader visibility={this.state.loader} />
          <KeyboardAvoidingView
            keyboardShouldPersistTaps="always"
            // style={{ flex: 1 }}
            keyboardVerticalOffset={100}
            behavior={'position'}>
            <View
              style={{
                flexDirection: 'column',
                marginTop: height / 14,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginStart: width / 20,
                  marginEnd: width / 22,
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
                    right: 12,
                  }}>
                  OTP Verification
                </Text>
              </View>

              <View
                style={{
                  marginTop: height / 10,
                  flexDirection: 'column',
                  paddingLeft: width / 20,
                  paddingRight: width / 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MyCommunitylogo height="200" width="200" />
                {/* <Image
                  source={require('../assets/images/icon.png')}
                  style={{ height: width / 2.3, width: width / 2.3 }}
                /> */}

                <Text style={{marginTop: height / 30, fontSize: width / 27}}>
                  Please submit your otp
                </Text>

                <OTPInputView
                  style={{
                    width: '87%',
                    height: height / 12,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginTop: height / 23,
                  }}
                  pinCount={4}
                  code={this.state.otpCode} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                  onCodeChanged={code => {
                    this.setState({otpCode: code});
                  }}
                  //   autoFocusOnLoad
                  codeInputFieldStyle={styles.underlineStyleBase}
                  codeInputHighlightStyle={styles.underlineStyleHighLighted}
                  onCodeFilled={code => {
                    // Alert.alert("haii")
                    console.log(`Code is ${code}, you are good to go!`);
                  }}
                />

                <TouchableOpacity
                  onPress={() => {
                    this.verifyOtp();
                  }}
                  style={{
                    width: width / 1.12,
                    borderRadius: 28,
                    marginTop: width / 13,
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
                {!this.state.timeFinished ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: height / 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: width / 27,
                        marginEnd: -5,
                      }}>
                      Otp expires in
                    </Text>
                    <CountDown
                      size={15}
                      until={this.state.timerSeconds}
                      onFinish={() => {
                        this.setState({
                          timeFinished: true,
                        });
                      }}
                      digitStyle={
                        {
                          //   backgroundColor: '#FFF',
                          //   borderWidth: 1,
                          //   borderColor: '#00C882',
                        }
                      }
                      running={this.state.isRunning}
                      digitTxtStyle={{color: '#303030'}}
                      timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
                      separatorStyle={{color: '#303030'}}
                      timeToShow={['M', 'S']}
                      timeLabels={{m: null, s: null}}
                      showSeparator
                    />
                    <Text
                      style={{
                        fontSize: width / 27,
                        marginStart: -5,
                      }}>
                      minutes
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this.resendOTP()}
                    style={{
                      marginTop: height / 30,
                    }}>
                    <Text>Resend OTP</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
          {this.verifyModal()}
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
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: 'red',
  },

  underlineStyleBase: {
    width: width / 6,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#BEBEBE',
    color: 'black',
  },

  underlineStyleHighLighted: {
    borderColor: '#696969',
    color: 'black',
  },
});
