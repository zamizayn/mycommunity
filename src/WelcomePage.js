import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Container, Content} from 'native-base';
var {height, width} = Dimensions.get('window');
import MyCommunitylogo from './assets/svg/MyCommunitylogo.svg';
import AsyncStorageHelper from './helpers/AsyncStorageHelper';
import theme from './config/styles.js';
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
export default class WelcomePage extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    const inAppUpdates = new SpInAppUpdates(
      false, // isDebug
    );
    // curVersion is optional if you don't provide it will automatically take from the app using react-native-device-info
    inAppUpdates
      .checkNeedsUpdate({})
      .then(result => {
        // console.log(result);
        if (result.shouldUpdate) {
          let updateOptions = {};
          if (Platform.OS === 'android') {
            // android only, on iOS the user will be promped to go to your app store page
            updateOptions = {
              updateType: IAUUpdateKind.IMMEDIATE,
            };
          }
          inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
        }
      })
      .catch(err => {
        // console.log(err);
      });
  }
  render() {
    return (
      <Container>
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{backgroundColor: '#eae3e5', flex: 1}}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: height / 7,
            }}>
            {/* <MyCommunitylogo height="200" width="200" /> */}
            <Image
              source={require('../src/assets/images/mc_logo.png')}
              style={{height: 170, width: 170}}
              resizeMode="contain"
            />
            <Text
              style={[
                theme.fontBold,
                {
                  fontSize: width / 16,
                  fontWeight: 'bold',
                  color: '#bd1d53',
                  marginTop: height / 15,
                },
              ]}>
              Welcome!
            </Text>
            {/* <Text
              style={[
                theme.fontRegular,
                {
                  fontSize: width / 27,
                  fontWeight: '300',
                  color: '#262626',
                  marginTop: height / 50,
                  marginStart: width / 13.5,
                  marginEnd: width / 13.5,
                  textAlignVertical: 'center',
                  textAlign: 'center',
                },
              ]}
            /> */}

            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('SignUp');
              }}
              style={[
                theme.fontBold,
                {
                  width: width / 1.12,
                  borderRadius: 20,
                  marginTop: width / 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#bd1d53',
                  height: width / 8,
                },
              ]}>
              <Text
                style={[
                  theme.fontBold,
                  {
                    color: '#FFFFFF',
                    fontSize: width / 20,
                    fontWeight: 'bold',
                  },
                ]}>
                Sign Up
              </Text>
            </TouchableOpacity>

            <View style={{flexDirection: 'row', marginTop: height / 20}}>
              <Text style={{color: '#262626', fontSize: width / 28}}>
                Continue as a{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  //AsyncStorageHelper.storeItem('ISUSER', 'no_user_exist');
                  this.props.navigation.navigate('HomeMenu');
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

            <View style={{flexDirection: 'row', marginTop: height / 50}}>
              <Text style={{color: '#262626', fontSize: width / 28}}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Login');
                }}>
                <Text
                  style={[
                    theme.fontBold,
                    {
                      color: '#bd1d53',
                      fontWeight: 'bold',
                      fontSize: width / 28,
                    },
                  ]}
                  textBreakStrategy="simple">
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={[
              theme.fontRegular,
              {
                fontSize: width / 30,
                color: '#909090',
                justifyContent: 'center',
                alignSelf: 'center',
                position: 'absolute',
                bottom: 12,
              },
            ]}>
            © My Community.All Rights Reserved
          </Text>
        </Content>
      </Container>
    );
  }
}
