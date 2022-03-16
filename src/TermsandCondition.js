import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Container, Content} from 'native-base';
import BackBtn_white from './assets/svg/BackBtn_white.svg';
import theme from './config/styles.js';
import {Directions} from 'react-native-gesture-handler';
import {WebView} from 'react-native-webview';

var {height, width} = Dimensions.get('window');
export default class TermsandCondition extends Component {
  constructor() {
    super();
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
            Terms & Conditions
          </Text>
        </View>

        <WebView
          originWhitelist={['*']}
          source={{
            uri: 'https://mycommunity.qa/terms',
          }}
          style={{height: height, width: width}}
          scrollEnabled={true}
        />
        {/* <Content
          contentContainerStyle={{
            backgroundColor: '#F9F9F9',
            paddingTop: height / 30,
            paddingBottom: height / 30,
          }}>
          <View style={{paddingStart: width / 13.5, paddingEnd: width / 13.5}}>
            <Text
              style={[
                theme.fontRegular,
                {
                  fontSize: width / 18,
                  marginBottom: height / 50,
                  color: '#262627',
                },
              ]}>
              Terms and Conditions
            </Text>
            <Text
              style={[
                theme.fontRegular,
                {
                  color: '#747576',
                  fontSize: width / 25,

                  marginBottom: height / 35,
                },
              ]}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged.
            </Text>
            <Text
              style={[
                theme.fontBold,
                {
                  fontSize: width / 20,
                  marginBottom: height / 50,
                  color: '#262627',
                },
              ]}>
              Information we collect
            </Text>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  width: width / 40,
                  height: width / 40,
                  borderRadius: 40 / 2,
                  position: 'absolute',
                  left: 0,
                  top: height / 150,
                  // marginTop: height / 130,
                  borderColor: '#BC1D54',
                  borderWidth: width / 300,
                }}></View>
              <Text
                style={{
                  flex: 1,
                  paddingLeft: width / 25,
                  color: '#747576',
                  fontSize: width / 25,
                  fontWeight: '300',
                }}>
                It was popularised in the 1960s with
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  width: width / 40,
                  height: width / 40,
                  borderRadius: 40 / 2,
                  position: 'absolute',
                  left: 0,
                  top: height / 150,
                  // marginTop: height / 130,
                  borderColor: '#BC1D54',
                  borderWidth: width / 300,
                }}></View>
              <Text
                style={{
                  flex: 1,
                  paddingLeft: width / 25,
                  color: '#747576',
                  fontSize: width / 25,
                  fontWeight: '300',
                }}>
                Release of Letraset sheets containing
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  width: width / 40,
                  height: width / 40,
                  borderRadius: 40 / 2,
                  position: 'absolute',
                  left: 0,
                  top: height / 150,
                  // marginTop: height / 130,
                  borderColor: '#BC1D54',
                  borderWidth: width / 300,
                }}></View>
              <Text
                style={{
                  flex: 1,
                  paddingLeft: width / 25,
                  color: '#747576',
                  fontSize: width / 25,
                  fontWeight: '300',
                }}>
                Lorem Ipsum passages, and more recently
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: height / 30}}>
              <View
                style={{
                  width: width / 40,
                  height: width / 40,
                  borderRadius: 40 / 2,
                  position: 'absolute',
                  left: 0,
                  top: height / 150,
                  // marginTop: height / 130,
                  borderColor: '#BC1D54',
                  borderWidth: width / 300,
                }}></View>
              <Text
                style={{
                  flex: 1,
                  paddingLeft: width / 25,
                  color: '#747576',
                  fontSize: width / 25,
                  fontWeight: '300',
                }}>
                PageMaker including versions of Lorem Ipsum
              </Text>
            </View>
            <View>
              <Text
                style={[
                  theme.fontRegular,
                  {
                    color: '#747576',
                    fontSize: width / 25,

                    marginBottom: height / 35,
                  },
                ]}>
                Dummy text of the printing and typesetting industry. Lorem Ipsum
                has been the industry's
                <Text style={{color: '#1481E1'}}>standard dummy text ever</Text>
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type
              </Text>
            </View>
            <Text
              style={[
                theme.fontBold,
                {
                  fontSize: width / 20,
                  marginBottom: height / 50,
                  color: '#262627',
                },
              ]}>
              Use of your information
            </Text>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  width: width / 40,
                  height: width / 40,
                  borderRadius: 40 / 2,
                  position: 'absolute',
                  left: 0,
                  top: height / 150,
                  // marginTop: height / 130,
                  borderColor: '#BC1D54',
                  borderWidth: width / 300,
                }}></View>
              <Text
                style={{
                  flex: 1,
                  paddingLeft: width / 25,
                  color: '#747576',
                  fontSize: width / 25,
                  fontWeight: '300',
                }}>
                It was popularised in the 1960s with
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  width: width / 40,
                  height: width / 40,
                  borderRadius: 40 / 2,
                  position: 'absolute',
                  left: 0,
                  top: height / 150,
                  // marginTop: height / 130,
                  borderColor: '#BC1D54',
                  borderWidth: width / 300,
                }}></View>
              <Text
                style={{
                  flex: 1,
                  paddingLeft: width / 25,
                  color: '#747576',
                  fontSize: width / 25,
                  fontWeight: '300',
                }}>
                Release of Letraset sheets containing
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  width: width / 40,
                  height: width / 40,
                  borderRadius: 40 / 2,
                  position: 'absolute',
                  left: 0,
                  top: height / 150,
                  // marginTop: height / 130,
                  borderColor: '#BC1D54',
                  borderWidth: width / 300,
                }}></View>
              <Text
                style={{
                  flex: 1,
                  paddingLeft: width / 25,
                  color: '#747576',
                  fontSize: width / 25,
                  fontWeight: '300',
                }}>
                Lorem Ipsum passages, and more recently
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: height / 30}}>
              <View
                style={{
                  width: width / 40,
                  height: width / 40,
                  borderRadius: 40 / 2,
                  position: 'absolute',
                  left: 0,
                  top: height / 150,
                  // marginTop: height / 130,
                  borderColor: '#BC1D54',
                  borderWidth: width / 300,
                }}></View>
              <Text
                style={{
                  flex: 1,
                  paddingLeft: width / 25,
                  color: '#747576',
                  fontSize: width / 25,
                  fontWeight: '300',
                }}>
                PageMaker including versions of Lorem Ipsum
              </Text>
            </View>
            <View>
              <Text
                style={[
                  theme.fontRegular,
                  {
                    color: '#747576',
                    fontSize: width / 25,

                    marginBottom: height / 35,
                  },
                ]}>
                Dummy text of the printing and typesetting industry. Lorem Ipsum
                has been the industry's standard dummy text ever since the
                1500s, when an{' '}
                <Text style={{color: '#1481E1'}}>
                  unknown printer took a galley{' '}
                </Text>
                of type and scrambled it to make a type
              </Text>
            </View>
          </View>
        </Content> */}
      </Container>
    );
  }
}
