import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Linking,
} from 'react-native';
import {
  Container,
  Content,
  Header,
  Left,
  Body,
  Right,
  Form,
  Item,
  Input,
  Button,
  Icon,
  Badge,
  Title,
  Textarea,
} from 'native-base';
import qs from 'qs';
import BackBtn_white from './assets/svg/BackBtn_white.svg';
import theme from './config/styles.js';
import {Directions} from 'react-native-gesture-handler';
import SearchBlackIcon from './assets/svg/SearchBlackIcon.svg';
import Notification_icon_white from './assets/svg/Notification_icon_white.svg';
import {API} from './config/api';
import {ApiHelper} from './helpers/ApiHelper';
import Loader from './components/Loader';
import Toast from 'react-native-simple-toast';
import {CONSTANTS} from './config/constants';
var {height, width} = Dimensions.get('window');
export default class Contact extends Component {
  constructor() {
    super();
    this.state = {
      isFocused: false,
      message: '',
      email: '',
      // ccd: CONSTANTS.COUNTRY_CODE,
      ccd: '',
      mobile: '',
      name: '',
    };
  }

  handleFocus = () => this.setState({isFocused: true});
  handleBlur = () => this.setState({isFocused: false});
  onFocusChange = () => {
    this.setState({isFocused: true});
  };

  async sendEmail(to, subject, body, options = {}) {
    const {cc, bcc} = options;

    let url = `mailto:${to}`;

    // Create email link query
    const query = qs.stringify({
      subject: subject,
      body: body,
      // cc: cc,
      // bcc: bcc,
    });

    if (query.length) {
      url += `?${query}`;
    }

    console.log(url);
    // Linking.openURL(
    //   'mailto:support@example.com?subject=SendMail&body=Description',
    // );
    // check if we can use this link
    // const canOpen = await Linking.canOpenURL(url);

    // if (!canOpen) {
    //   throw new Error('Provided URL can not be handled');
    // }

    return Linking.openURL(url);
  }

  async submitContactRequest() {
    this.setState({
      emailValid: true,
      loader: true,
    });
    if (
      this.state.name == '' ||
      this.state.ccd == '' ||
      this.state.mobile == '' ||
      this.state.email == '' ||
      this.state.message == ''
    ) {
      this.setState({
        error: true,
        loader: false,
      });
    } else {
      let formError = false;
      let emailreg = /^(?:[\w\.\-]+@([\w\-]+\.)+[a-zA-Z+ -]+)?$/;
      if (emailreg.test(this.state.email) === false) {
        this.setState({
          error: true,
          emailValid: false,
          loader: false,
        });
        formError = true;
      }
      if (formError) {
        return false;
      }

      // let formData = {
      //   message: this.state.message,
      //   email: this.state.email.trim(),
      //   ccd: CONSTANTS.COUNTRY_CODE,
      //   mobile: this.state.mobile,
      // };

      // const params = new FormData();
      // params.append('name', this.state.name);
      // params.append('ccd', this.state.ccd);
      // params.append('email', this.state.email);
      // params.append('mobile', this.state.mobile);
      // params.append('messsage', this.state.message);

      // console.log('Form Data', params);
      // await ApiHelper.form_post(API.contactRequest, params)
      //   .then(res => {
      //     // console.log('res ', res);
      //     this.setState({
      //       loader: false,
      //       message: '',
      //       mobile: '',
      //       email: '',
      //       ccd: '',
      //       name: '',
      //     });
      //     Toast.showWithGravity(res.data.message, Toast.LONG, Toast.BOTTOM);
      //   })
      //   .catch(err => {
      //     this.setState({
      //       loader: false,
      //     });
      //     console.log(err);
      //   });

      var body =
        'Name: ' +
        this.state.name +
        '\n ' +
        'Email: ' +
        this.state.email +
        '\n ' +
        'Phone: ' +
        this.state.ccd +
        ' ' +
        this.state.mobile +
        '\n ' +
        'Message: ' +
        this.state.message;

      this.sendEmail('support@mycommunity.qa', 'Contact Us', body).catch(
        err => {
          // console.log('err', err);
        },
      );
    }
  }
  render() {
    return (
      <Container>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#bd1d53',
            height: height / 12,
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              paddingStart: width / 20,
            }}
            onPress={() => {
              //  this.props.navigation.openDrawer()
              this.props.navigation.goBack(null);
            }}>
            <BackBtn_white height="22" width="20" />
          </TouchableOpacity>

          <Text
            style={{
              color: 'white',
              marginStart: width / 22,
              fontSize: width / 22,
            }}>
            Contact Us
          </Text>
        </View>
        {/* <Header
          style={{
            flexDirection: 'row',
            backgroundColor: '#bd1d53',
            height: height / 12,
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <Left>
            <Button
              transparent
              onPress={() => {
                //  this.props.navigation.openDrawer()
                this.props.navigation.goBack(null);
              }}>
              <BackBtn_white height="22" width="20" />
            </Button>
          </Left>
          <Body>
            <Title
              style={{
                color: 'white',
                paddingStart: width / 20,
                fontSize: width / 22,
              }}>
              Contact Us
            </Title>
          </Body> */}
        {/* <Right>
            <Button transparent>
              <SearchBlackIcon height="40" width="40" />
            </Button>
            <Button transparent>
              <Badge
                style={{
                  position: 'absolute',
                  backgroundColor: 'white',
                  width: 17,
                  height: 17,
                  borderRadius: 17 / 2,
                  right: width / 40,
                  top: height / 80,
                  margin: 0,
                  padding: 0,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}>
                <Text
                  style={[
                    theme.fontBold,
                    {
                      fontSize: width / 28,
                      lineHeight: height / 40,

                      color: '#BC1D54',
                    },
                  ]}>
                  2
                </Text>
              </Badge>
              <Notification_icon_white height="30" width="30" />
            </Button>
            <Button transparent>
              <Badge
                style={{
                  position: 'absolute',
                  backgroundColor: 'white',
                  width: 17,
                  height: 17,
                  borderRadius: 17 / 2,
                  right: width / 40,
                  top: height / 80,
                  margin: 0,
                  padding: 0,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}>
                <Text
                  style={[
                    theme.fontBold,
                    {
                      fontSize: width / 28,
                      lineHeight: height / 40,

                      color: '#BC1D54',
                    },
                  ]}>
                  2
                </Text>
              </Badge>
              <Notification_icon_white height="30" width="30" />
            </Button>
          </Right> */}
        {/* </Header> */}

        <Content
          contentContainerStyle={{
            backgroundColor: '#F9F9F9',
            paddingTop: height / 30,
            paddingBottom: height / 30,
          }}>
          <View style={{paddingStart: width / 13.5, paddingEnd: width / 13.5}}>
            {/* <Text
              style={[
                theme.fontRegular,
                {
                  fontSize: width / 18,
                  marginBottom: height / 50,
                  color: '#262627',
                },
              ]}>
              Contact Us
            </Text> */}
            {/* <Text
              style={[
                theme.fontRegular,
                {
                  color: '#747576',
                  fontSize: width / 25,

                  marginBottom: height / 35,
                },
              ]}
            /> */}

            <View style={{marginBottom: height / 35}}>
              <Text
                style={[
                  theme.fontBold,
                  {
                    fontSize: width / 28,
                    color: '#747576',
                  },
                ]}>
                Email ID
              </Text>
              <Text style={{fontSize: width / 28, color: '#747576'}}>
                info@mycommunity.qa{' '}
              </Text>
            </View>
            <View style={{marginBottom: height / 35}}>
              <Text
                style={[
                  theme.fontBold,
                  {
                    fontSize: width / 28,
                    color: '#747576',
                  },
                ]}>
                Phone Number
              </Text>
              <Text style={{fontSize: width / 28, color: '#747576'}}>
                ({CONSTANTS.COUNTRY_CODE_TEXT})+ 974 30367048
              </Text>
            </View>
            <View style={{marginBottom: height / 35}}>
              <Text
                style={[
                  theme.fontBold,
                  {
                    fontSize: width / 28,
                    color: '#747576',
                  },
                ]}>
                Location
              </Text>
              <Text style={{fontSize: width / 28, color: '#747576'}}>
                Al Mannai Building, 2nd floor, Office No. 8, Building No. 274,
                Zone 45, Street 310, Old Airport Road, Opposite to Q-Jet, PO BOX
                212075, Doha
              </Text>
            </View>
            <View style={{marginBottom: height / 35}}>
              <Text
                style={[
                  theme.fontBold,
                  {
                    fontSize: width / 28,
                    color: '#747576',
                  },
                ]}>
                Opening hours
              </Text>
              <Text style={{fontSize: width / 28, color: '#747576'}}>
                Sat-Thu 07:00am - 07:00pm
              </Text>
            </View>

            <View
              style={{
                width: width / 6,
                height: height / 140,
                backgroundColor: '#BC1D54',
              }}
            />

            <View style={{marginTop: height / 50}}>
              <Text
                style={[
                  theme.fontRegular,
                  {
                    fontSize: width / 18,
                    marginBottom: height / 50,
                    color: '#262627',
                  },
                ]}>
                Enquiry
              </Text>
              <View>
                <Form>
                  <Item
                    regular
                    style={{
                      marginBottom: height / 50,
                      paddingStart: 0,
                      marginStart: 0,
                      borderColor: 'transparent',
                    }}>
                    <Input
                      onChangeText={val => this.setState({name: val})}
                      getRef={input => {
                        this.name = input;
                      }}
                      placeholder="Name"
                      defaultValue={this.state.name}
                      style={{
                        fontSize: width / 25,
                        color: '#000000',
                        borderRadius: 8,
                        borderColor: '#F00000',

                        borderWidth: 0.5,
                        backgroundColor: 'white',
                        paddingStart: 0,
                        marginStart: 0,
                      }}
                      onFocus={this.handleFocus}
                      onBlur={this.handleBlur}
                      blurOnSubmit
                    />
                  </Item>
                  {this.state.name == '' && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please enter your name
                    </Text>
                  ) : null}
                  <Item
                    regular
                    style={{
                      marginBottom: height / 50,
                      paddingStart: 0,
                      marginStart: 0,
                      borderColor: 'transparent',
                    }}>
                    <Input
                      keyboardType="numeric"
                      onChangeText={val => this.setState({ccd: val})}
                      getRef={input => {
                        this.ccd = input;
                      }}
                      defaultValue={this.state.ccd}
                      placeholder="Country Code"
                      style={{
                        fontSize: width / 25,
                        color: '#000000',
                        borderRadius: 8,
                        borderColor: '#F00000',

                        borderWidth: 0.5,
                        backgroundColor: 'white',
                        paddingStart: 0,
                        marginStart: 0,
                      }}
                      onFocus={this.handleFocus}
                      onBlur={this.handleBlur}
                      blurOnSubmit
                    />
                  </Item>
                  {this.state.ccd == '' && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please enter country code
                    </Text>
                  ) : null}
                  <Item
                    regular
                    style={{
                      marginBottom: height / 50,
                      paddingStart: 0,
                      marginStart: 0,
                      borderColor: 'transparent',
                    }}>
                    <Input
                      keyboardType="numeric"
                      onChangeText={val => this.setState({mobile: val})}
                      getRef={input => {
                        this.mobile = input;
                      }}
                      placeholder="Mobile No"
                      defaultValue={this.state.mobile}
                      style={{
                        fontSize: width / 25,
                        color: '#000000',
                        borderRadius: 8,
                        borderColor: '#F00000',

                        borderWidth: 0.5,
                        backgroundColor: 'white',
                        paddingStart: 0,
                        marginStart: 0,
                      }}
                      onFocus={this.handleFocus}
                      onBlur={this.handleBlur}
                      blurOnSubmit
                    />
                  </Item>
                  {this.state.mobile == '' && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please enter your mobile number
                    </Text>
                  ) : null}
                  <Item
                    regular
                    style={{
                      marginBottom: height / 50,
                      paddingStart: 0,
                      marginStart: 0,
                      borderColor: 'transparent',
                    }}>
                    <Input
                      autoCapitalize="none"
                      keyboardType="email-address"
                      onChangeText={val => this.setState({email: val})}
                      getRef={input => {
                        this.email = input;
                      }}
                      placeholder="Email"
                      defaultValue={this.state.email}
                      style={{
                        fontSize: width / 25,
                        color: '#000000',
                        borderRadius: 8,
                        borderColor: '#F00000',

                        borderWidth: 0.5,
                        backgroundColor: 'white',
                        paddingStart: 0,
                        marginStart: 0,
                      }}
                      onFocus={this.handleFocus}
                      onBlur={this.handleBlur}
                      blurOnSubmit
                    />
                  </Item>
                  {this.state.email == '' && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please enter your email address
                    </Text>
                  ) : this.state.emailValid == false && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please enter a valid email address
                    </Text>
                  ) : null}
                  <Item
                    regular
                    style={{
                      marginBottom: height / 50,
                      paddingStart: 0,
                      marginStart: 0,
                      borderColor: 'transparent',
                    }}>
                    <Textarea
                      onChangeText={val => this.setState({message: val})}
                      getRef={input => {
                        this.message = input;
                      }}
                      defaultValue={this.state.message}
                      style={{
                        fontSize: width / 25,
                        color: '#000000',
                        width: '100%',
                        borderRadius: 8,
                        borderColor: '#F00000',
                        borderLeftWidth: 0.5,
                        borderRightWidth: 0.5,
                        borderTopWidth: 0.5,
                        borderBottomWidth: 0.5,
                        backgroundColor: 'white',
                        paddingStart: 0,
                        marginStart: 0,
                      }}
                      onFocus={this.handleFocus}
                      onBlur={this.handleBlur}
                      blurOnSubmit
                      rowSpan={5}
                      bordered
                      placeholder="Message"
                    />
                  </Item>
                  {this.state.message == '' && this.state.error ? (
                    <Text style={styles.errorStyle}>Please enter message</Text>
                  ) : null}
                </Form>
                <TouchableOpacity
                  style={{
                    width: width / 1.15,
                    borderRadius: 8,
                    marginTop: width / 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#bd1d53',
                    height: width / 8,
                  }}
                  onPress={() => {
                    this.submitContactRequest();
                  }}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: width / 22,
                      fontWeight: 'bold',
                    }}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
