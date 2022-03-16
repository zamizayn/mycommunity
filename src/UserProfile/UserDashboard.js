import {Content, Container, Card, CardItem, Badge} from 'native-base';
import IconFA from 'react-native-vector-icons/FontAwesome';
import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from '../../node_modules/react-native-vector-icons/MaterialCommunityIcons';
import Carousel from 'react-native-snap-carousel';
import Mall_Icon from '../assets/svg/Mall_Icon.svg';
import Job_Icon from '../assets/svg/Job_Icon.svg';
import Properties_icon from '../assets/svg/Properties_icon.svg';
import Vehicle_icon from '../assets/svg/Vehicle_icon.svg';
import RightArrow from '../assets/svg/RightArrow.svg';
import ProfilePic from '../assets/svg/ProfilePic.svg';
import SearchBlackIcon from '../assets/svg/SearchBlackIcon.svg';
import MenuIcon from '../assets/svg/MenuIcon.svg';
import BestDealIcon from '../assets/svg/BestDealIcon.svg';
import Services_icon from '../assets/svg/Services_icon.svg';
import Shops_icon from '../assets/svg/Shops_icon';
import Directory_icon from '../assets/svg/Directory_icon.svg';
import News_icon from '../assets/svg/News_icon.svg';
import Notification_icon_white from '../assets/svg/Notification_icon_white.svg';
import Loader from '../components/Loader';
import {ApiHelper} from '../helpers/ApiHelper';
import {API} from '../config/api';
import moment from 'moment';
import {CONSTANTS} from '../config/constants';
import SeeMore from 'react-native-see-more-inline';
import * as Progress from 'react-native-progress';
import theme from '../config/styles.js';
var {height, width} = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * width) / 100;
  return Math.round(value);
}

const slideHeight = height * 0.2;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = width;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;
const entryBorderRadius = 8;
const SLIDER_1_FIRST_ITEM = 1;

export default class UserDasboard extends Component {
  constructor() {
    super();
    this.state = {
      loader: true,
      userdata: {},
      profilePercentage: 0,
    };
    this._renderItem = this._renderItem.bind(this);
  }
  componentDidMount() {
    this.setState({loader: true});
    this.getUserData();
    // setTimeout(() => this.setState({loader: false}), 1000);
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getUserData();
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  _renderItem = ({item, index}) => {
    return (
      <View style={style.cardWrapparent}>
        <Card style={style.cardWrap}>
          <CardItem cardBody style={style.cardBorder}>
            <Image source={item.title} style={style.cardImage} />
          </CardItem>
        </Card>
      </View>
    );
  };
  _handleTextReady = () => {
    // ...
  };

  async getUserData() {
    await ApiHelper.get(API.userData)
      .then(res => {
        var dataLen = res.data.data;
        var profilePercentage = 0.5;
        if (dataLen.userRole == '2' && dataLen.addressString != '') {
          profilePercentage = 1;
        }
        this.setState(
          {
            userdata: dataLen,
            loader: false,
            profilePercentage: profilePercentage,
          },
          () => {
            // console.log('user arr', this.state.userdata);
          },
        );
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
              this.props.navigation.openDrawer();
              //this.props.navigation.goBack(null);
            }}>
            <MenuIcon height="22" width="22" />
          </TouchableOpacity>
          <Text
            style={{
              color: 'white',
              marginStart: width / 22,
              fontSize: width / 22,
            }}>
            Dashboard
          </Text>
          {/* <View
            style={{
              right: width / 22,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 'auto',
            }}>
            <Badge
              style={{
                position: 'absolute',
                backgroundColor: 'white',
                width: 14,
                height: 14,
                borderRadius: 14 / 2,
                right: -3,
                top: 0,
                margin: 0,
                padding: 0,
                paddingLeft: 4,
                paddingRight: 4,
                zIndex: 1,
              }}>
              <Text
                style={[
                  theme.fontBold,
                  {
                    fontSize: width / 35,
                    lineHeight: height / 55,

                    color: '#BC1D54',
                  },
                ]}>
                2
              </Text>
            </Badge>
            <Notification_icon_white height="22" width="22" />
          </View> */}
        </View>
        <Loader visibility={this.state.loader} />

        {this.state.loader == false ? (
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              backgroundColor: '#fff',
              paddingBottom: height / 80,
            }}>
            {/* <Loader visibility={this.state.loader} /> */}

            {'bannerPic' in this.state.userdata &&
            this.state.userdata.bannerPic != '' ? (
              <Image
                source={{
                  uri: CONSTANTS.THUMBNAIL_IMG + this.state.userdata.bannerPic,
                }}
                style={{
                  height: height / 4,
                  width: width / 1,
                  opacity: 0.5,
                  resizeMode: 'cover',
                  flex: 1,
                  backgroundColor: 'rgba(0.4,0.5,0.5,1.5)',
                }}
              />
            ) : (
              <Image
                source={require('../assets/images/bg1.jpeg')}
                style={{
                  height: height / 4,
                  width: width / 1,
                  opacity: 0.5,
                  backgroundColor: 'rgba(0.4,0.5,0.5,1.5)',
                }}
              />
            )}

            <View
              style={{
                position: 'absolute',
                top: height / 20,
                left: 0,
                justifyContent: 'center',
                alignItems: 'center',
                right: 0,

                marginLeft: 'auto',
                marginRight: 'auto',
                marginHorizontal: 0,
                textAlign: 'center',
                flex: 2,
              }}>
              <View style={{maxWidth: width / 1.5}}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: height / 90,
                  }}>
                  <View
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 150 / 2,
                      overflow: 'hidden',

                      backgroundColor: 'white',
                    }}>
                    {'profilePic' in this.state.userdata &&
                    this.state.userdata.profilePic != '' ? (
                      <Image
                        source={{
                          uri:
                            CONSTANTS.THUMBNAIL_IMG +
                            this.state.userdata.profilePic,
                        }}
                        style={{height: 70, width: 70}}
                      />
                    ) : (
                      <ProfilePic height="70" width="70" />
                    )}
                  </View>
                </View>
                <Text
                  style={[
                    theme.fontBold,
                    {
                      color: 'white',
                      fontSize: width / 22,
                      textAlign: 'center',
                    },
                  ]}
                  numberOfLines={1}>
                  {this.state.userdata.name}
                </Text>
                <Text
                  style={[
                    theme.fontMedium,
                    {
                      color: 'white',
                      fontSize: width / 28,
                      textAlign: 'center',
                    },
                  ]}
                  numberOfLines={1}>
                  {this.state.userdata.username}
                </Text>
              </View>
            </View>

            <View
              style={{
                paddingEnd: width / 15,
                paddingStart: width / 15,
                paddingTop: height / 50,
                paddingBottom: height / 30,
                flexDirection: 'column',
                backgroundColor: 'white',
                borderBottomWidth: 6,
                borderBottomColor: '#EDEDEE',
              }}>
              <Text
                style={[
                  theme.fontBold,
                  {
                    fontWeight: 'bold',
                    fontSize: width / 34,
                    color: '#212121',
                  },
                ]}>
                Contact Number
              </Text>
              <Text
                style={[
                  theme.fontMedium,
                  {
                    fontSize: width / 34,
                    color: '#747576',
                  },
                ]}>
                +{this.state.userdata.ccd} {this.state.userdata.mobile}
              </Text>
              <View style={{paddingEnd: width / 15, paddingTop: height / 50}}>
                <Text
                  style={[
                    theme.fontBold,
                    {
                      color: '#212121',
                      fontSize: width / 34,
                      fontWeight: 'bold',
                    },
                  ]}>
                  Email
                </Text>
                <Text
                  style={[
                    theme.fontMedium,
                    {color: '#747576', fontSize: width / 34},
                  ]}>
                  {this.state.userdata.email}
                </Text>
              </View>
              {this.state.userdata.userRole == '1' ? (
                <View
                  style={{
                    position: 'absolute',
                    right: 0,
                    paddingEnd: width / 15,
                    paddingTop: height / 50,
                  }}>
                  <Text
                    style={[
                      theme.fontBold,
                      {
                        color: '#212121',
                        fontSize: width / 34,
                        fontWeight: 'bold',
                        textAlign: 'right',
                      },
                    ]}>
                    Refferal ID
                  </Text>
                  <Text
                    style={[
                      theme.fontMedium,
                      {
                        color: '#747576',
                        fontSize: width / 34,
                        textAlign: 'right',
                      },
                    ]}>
                    {this.state.userdata.referenceNumber}
                  </Text>
                </View>
              ) : null}
            </View>
            {this.state.userdata.userRole == '2' ? (
              <View
                style={{
                  paddingEnd: width / 15,
                  paddingStart: width / 15,
                  paddingTop: height / 50,
                  paddingBottom: height / 30,
                  flexDirection: 'column',
                  backgroundColor: 'white',
                  borderBottomWidth: 6,
                  borderBottomColor: '#EDEDEE',
                }}>
                <Text
                  style={[
                    theme.fontBold,
                    {
                      fontSize: width / 24,
                      color: '#3CBF65',
                      position: 'absolute',
                      right: width / 15,
                      top: height / 50,
                    },
                  ]}>
                  {this.state.profilePercentage * 100}%
                </Text>
                <Text
                  style={[
                    theme.fontBold,
                    {
                      fontWeight: 'bold',
                      fontSize: width / 29,
                      color: '#212121',
                    },
                  ]}>
                  Profile Progress Percentage
                </Text>
                <Text
                  style={[
                    theme.fontMedium,
                    {
                      color: '#747576',
                      fontSize: width / 34,
                      marginBottom: height / 50,
                    },
                  ]}>
                  Complete your Profile to get all features
                </Text>

                <Progress.Bar
                  progress={this.state.profilePercentage}
                  width={null}
                  height={9}
                  color={'#3CBF65'}
                  unfilledColor={'#DCDDDE'}
                  borderWidth={0}
                />
                <Text
                  style={[
                    theme.fontMedium,
                    {
                      color: '#28292A',
                      fontSize: width / 34,
                      marginTop: height / 90,
                    },
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('EditProfile');
                    }}>
                    <Text style={{color: '#116BE8'}}>
                      Complete your profile{' '}
                      <Text style={{color: '#28292A'}}>
                        to avail all benifits
                      </Text>
                    </Text>
                  </TouchableOpacity>
                </Text>
              </View>
            ) : null}
            <View
              style={{
                paddingEnd: width / 15,
                paddingStart: width / 15,
                paddingTop: height / 50,
                paddingBottom: height / 30,
                flexDirection: 'column',
                backgroundColor: 'white',
                borderBottomWidth: 6,
                borderBottomColor: '#EDEDEE',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    theme.fontBold,
                    {
                      fontWeight: 'bold',
                      fontSize: width / 24,
                      color: '#212121',
                    },
                  ]}>
                  Redeem Point
                </Text>
                <Icon
                  style={{
                    fontSize: width / 22,
                    color: '#BDBEBF',
                    marginLeft: width / 60,
                  }}
                  name="information-outline"
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}>
                <View style={{flex: 4}}>
                  <Text
                    style={[
                      theme.fontMedium,
                      {
                        color: '#28292A',
                        fontSize: width / 34,
                        marginTop: height / 90,
                      },
                    ]}>
                    You can redeem this points at the time of your next purchase
                    from MyCommunity.Qa
                  </Text>
                </View>
                <View style={{flex: 2}}>
                  <Text
                    style={[
                      theme.fontBold,
                      {
                        textAlign: 'right',
                        fontSize: width / 24,
                        color: '#3CBF65',
                      },
                    ]}>
                    {this.state.userdata.availableRedeemPoint}
                  </Text>
                  <Text
                    style={[
                      theme.fontMedium,
                      {
                        textAlign: 'right',
                        fontSize: width / 34,
                        color: '#212121',
                      },
                    ]}>
                    Available
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('ViewUsers');
              }}>
              <View
                style={{
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  borderRadius: 8,
                  shadowColor: 'grey',
                  shadowOffset: {width: 0, height: 0},
                  shadowOpacity: 1,
                  shadowRadius: 8,
                  elevation: 8,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingLeft: 16,
                  paddingRight: 14,
                  marginTop: 6,
                  marginBottom: 6,
                  marginLeft: 6,
                  marginRight: 10,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{flex: 2}}>View Blocked Users</Text>
                  <IconFA name="chevron-right" size={17} color="grey" />
                </View>
              </View>
            </TouchableOpacity>
          </Content>
        ) : null}
      </Container>
    );
  }
}

const style = StyleSheet.create({
  viewRound: {
    width: width / 6.2,
    height: width / 6.2,
    borderRadius: width / 6.2 / 2,
    backgroundColor: 'white',
    borderColor: '#BEBEBE',
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewRoundText: {
    justifyContent: 'center',
    alignSelf: 'center',
    // marginTop: height / 80,
    fontSize: width / 33,
    color: 'black',
    textAlign: 'center',
    width: width / 6,
  },
  viewRoundContainer: {flexDirection: 'column', marginRight: width / 24},
  dealCard: {
    backgroundColor: '#FFFFFF',
    height: height / 3.5,
    width: width / 2.3,
    borderRadius: 12,
  },
  cardWrapparent: {
    paddingBottom: 10,
    alignItems: 'center',
  },
  cardImage: {
    height: 130,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    flex: 1,
    overflow: 'hidden',
    resizeMode: 'cover',
    width: itemWidth,
    borderRadius: entryBorderRadius,
  },
  cardWrap: {
    borderRadius: entryBorderRadius,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    width: itemWidth / 1.04,
    marginTop: height / 45,
    marginHorizontal: width / 30,
  },
  cardBorder: {
    borderRadius: entryBorderRadius,
    flex: 1,

    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
});
