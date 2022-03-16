import {
  Content,
  Container,
  Card,
  CardItem,
  Badge,
  Form,
  Item,
  Input,
  Label,
} from 'native-base';
import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from '../../node_modules/react-native-vector-icons/SimpleLineIcons';
import Carousel from 'react-native-snap-carousel';
import Mall_Icon from '../assets/svg/Mall_Icon.svg';
import Job_Icon from '../assets/svg/Job_Icon.svg';
import Properties_icon from '../assets/svg/Properties_icon.svg';
import Vehicle_icon from '../assets/svg/Vehicle_icon.svg';
import RightArrow from '../assets/svg/RightArrow.svg';
import ProfilePic from '../assets/svg/ProfilePic.svg';
import Password_icon from '../assets/svg/Password_icon_blue.svg';
import SearchBlackIcon from '../assets/svg/SearchBlackIcon.svg';
import FlipToggle from 'react-native-flip-toggle-button';
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
import BackBtn_white from '../assets/svg/BackBtn_white.svg';

import {CONSTANTS} from '../config/constants';
import SeeMore from 'react-native-see-more-inline';

import theme from '../config/styles.js';
import {AppColors} from '../Themes';
import AsyncStorageHelper from '../helpers/AsyncStorageHelper';
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

export default class CorporateProfile extends Component {
  constructor() {
    super();
    this.state = {
      loader: true,
      userRole: '',
      userdata: {},
      notification: '0',
      isNotification: false,
      subcategories: [],
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
        AsyncStorageHelper.storeItem('USERDATA', JSON.stringify(dataLen));
        this.setState(
          {
            userdata: dataLen,
            subcategories: dataLen.businessSubCategoryName,
            loader: false,
            notification: dataLen.notification ? true : false,
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
  async updateNotificationStatus() {
    let formData = {
      notification: this.state.notification ? '1' : '0',
    };

    await ApiHelper.patch(API.updateUserNotificationStatus, formData)
      .then(res => {
        Toast.showWithGravity(res.data.message, Toast.LONG, Toast.BOTTOM);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    if (this.state.userdata.userRole == '2') {
      var subcategory = [];
      for (let i = 0; i < this.state.subcategories.length; i++) {
        subcategory.push(
          <TouchableOpacity
            style={{
              marginRight: 10,
              borderWidth: 1,
              borderColor: AppColors.borderColor,
              borderRadius: 50,
              padding: 6,
              height: height / 25,
              paddingHorizontal: width / 19,
              marginBottom: 10,
            }}>
            <Text style={{fontSize: width / 33, color: '#28292A'}}>
              {this.state.subcategories[i]}
            </Text>
          </TouchableOpacity>,
        );
      }
    }
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
          {/* <TouchableOpacity
            style={{
              paddingStart: width / 20,
            }}
            onPress={() => {
              this.props.navigation.openDrawer();
              //this.props.navigation.goBack(null);
            }}>
            <MenuIcon height="22" width="22" />
          </TouchableOpacity> */}
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
            My Profile
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
                zIndex: 1,
                top: height / 40,
                right: width / 15,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('EditProfile');
                }}>
                <Icon
                  style={{
                    fontSize: width / 22,
                    color: '#fff',
                  }}
                  name="pencil"
                />
              </TouchableOpacity>
            </View>
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
                paddingTop: height / 30,
                paddingBottom: height / 30,
                flexDirection: 'row',
                backgroundColor: 'white',
                borderBottomWidth: 6,
                borderBottomColor: '#EDEDEE',
                justifyContent: 'space-between',
              }}>
              <Text
                style={[
                  theme.fontBlack,
                  {
                    fontSize: width / 28,
                    color: '#212121',
                  },
                ]}>
                My Profile
              </Text>
              {this.state.userdata.userRole == '2' ? (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('AddBusiness');
                    }}
                    style={{}}>
                    <Text
                      style={[
                        theme.fontRegular,
                        {color: '#1683FC', fontSize: width / 28},
                      ]}>
                      + Add Business
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            {/* Basic Info */}
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
                <View style={{marginBottom: height / 25}}>
                  <Text
                    style={[
                      theme.fontMedium,
                      {
                        color: '#747576',
                        fontSize: width / 32,
                        lineHeight: height / 30,
                      },
                    ]}>
                    Company Name{' '}
                    <Text style={{color: '#F00000', fontSize: width / 23}}>
                      *
                    </Text>
                  </Text>
                  <Text
                    style={[
                      theme.fontRegular,
                      {
                        fontSize: width / 28,
                        color: '#212121',
                      },
                    ]}>
                    {this.state.userdata.name}
                  </Text>
                  <View
                    style={{
                      position: 'absolute',
                      zIndex: 1,
                      top: 5,
                      right: width / 30,
                    }}>
                    {/* <TouchableOpacity>
                    <Icon
                      style={{
                        fontSize: width / 22,
                        color: '#BBDDFE',
                      }}
                      name="pencil"
                    />
                  </TouchableOpacity> */}
                  </View>
                </View>
                <View style={{marginBottom: height / 25}}>
                  <Text
                    style={[
                      theme.fontMedium,
                      {
                        color: '#747576',
                        fontSize: width / 32,
                        lineHeight: height / 30,
                      },
                    ]}>
                    Category
                  </Text>
                  <Text
                    style={[
                      theme.fontRegular,
                      {fontSize: width / 28, color: '#212121'},
                    ]}>
                    {this.state.userdata.businessCategoryName}
                  </Text>
                  <View
                    style={{
                      position: 'absolute',
                      zIndex: 1,
                      top: 5,
                      right: width / 30,
                    }}>
                    {/* <TouchableOpacity>
                    <Icon
                      style={{
                        fontSize: width / 22,
                        color: '#BBDDFE',
                      }}
                      name="pencil"
                    />
                  </TouchableOpacity> */}
                  </View>
                </View>
                <View>
                  <Text
                    style={[
                      theme.fontMedium,
                      {
                        color: '#747576',
                        fontSize: width / 32,
                        lineHeight: height / 30,
                      },
                    ]}>
                    Subcategories
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginTop: height / 90,
                    }}>
                    {/* <TouchableOpacity
                    style={{
                      marginRight: 10,
                      borderWidth: 2,
                      borderColor: '#DEDFE0',
                      borderRadius: 50,
                      marginBottom: 20,
                      padding: 6,
                      height: height / 20,
                      paddingHorizontal: width / 19,
                      marginBottom: 10,
                    }}>
                    <Text style={{fontSize: width / 33, color: '#28292A'}}>
                      Web Development
                    </Text>
                  </TouchableOpacity> */}
                    {/* <TouchableOpacity
                    style={{
                      marginRight: 10,
                      borderWidth: 2,
                      borderColor: '#DEDFE0',
                      borderRadius: 50,
                      marginBottom: 20,
                      padding: 6,
                      height: height / 20,
                      paddingHorizontal: width / 19,

                      marginBottom: 10,
                    }}>
                    <Text style={{fontSize: width / 33, color: '#28292A'}}>
                      Software Development
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginRight: 10,
                      borderWidth: 2,
                      borderColor: '#DEDFE0',
                      borderRadius: 50,
                      marginBottom: 20,
                      padding: 6,
                      height: height / 20,
                      paddingHorizontal: width / 19,

                      marginBottom: 10,
                    }}>
                    <Text style={{fontSize: width / 33, color: '#28292A'}}>
                      Intelligence Artificial
                    </Text>
                  </TouchableOpacity> */}
                    {subcategory}
                  </View>
                </View>
              </View>
            ) : (
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
                <View style={{marginBottom: height / 25}}>
                  <Text
                    style={[
                      theme.fontMedium,
                      {
                        color: '#747576',
                        fontSize: width / 32,
                        lineHeight: height / 30,
                      },
                    ]}>
                    Name{' '}
                    <Text style={{color: '#F00000', fontSize: width / 23}}>
                      *
                    </Text>
                  </Text>
                  <Text
                    style={[
                      theme.fontRegular,
                      {
                        fontSize: width / 28,
                        color: '#212121',
                      },
                    ]}>
                    {this.state.userdata.name}
                  </Text>
                  <View
                    style={{
                      position: 'absolute',
                      zIndex: 1,
                      top: 5,
                      right: width / 30,
                    }}>
                    {/* <TouchableOpacity>
                    <Icon
                      style={{
                        fontSize: width / 22,
                        color: '#BBDDFE',
                      }}
                      name="pencil"
                    />
                  </TouchableOpacity> */}
                  </View>
                </View>
                <View>
                  <Text
                    style={[
                      theme.fontMedium,
                      {
                        color: '#747576',
                        fontSize: width / 32,
                        lineHeight: height / 30,
                      },
                    ]}>
                    Refferal ID
                  </Text>
                  <Text
                    style={[
                      theme.fontRegular,
                      {fontSize: width / 28, color: '#212121'},
                    ]}>
                    {this.state.userdata.referenceNumber}
                  </Text>
                  <View
                    style={{
                      position: 'absolute',
                      zIndex: 1,
                      top: 5,
                      right: width / 30,
                    }}>
                    {/* <TouchableOpacity>
                    <Icon
                      style={{
                        fontSize: width / 22,
                        color: '#BBDDFE',
                      }}
                      name="pencil"
                    />
                  </TouchableOpacity> */}
                  </View>
                </View>
              </View>
            )}
            {/* Basic Info End */}
            {/* Contact info Start*/}
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
              <View style={{marginBottom: height / 25}}>
                <Text
                  style={[
                    theme.fontMedium,
                    {
                      color: '#747576',
                      fontSize: width / 32,
                      lineHeight: height / 30,
                    },
                  ]}>
                  Email{' '}
                </Text>
                <Text
                  style={[
                    theme.fontRegular,
                    {fontSize: width / 28, color: '#212121'},
                  ]}>
                  {this.state.userdata.email}
                </Text>
                <View
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                    top: 5,
                    right: width / 30,
                  }}>
                  {/* <TouchableOpacity>
                    <Icon
                      style={{
                        fontSize: width / 22,
                        color: '#BBDDFE',
                      }}
                      name="pencil"
                    />
                  </TouchableOpacity> */}
                </View>
              </View>
              <View style={{marginBottom: height / 25}}>
                <Text
                  style={[
                    theme.fontMedium,
                    {
                      color: '#747576',
                      fontSize: width / 32,
                      lineHeight: height / 30,
                    },
                  ]}>
                  Place
                </Text>
                <Text
                  style={[
                    theme.fontRegular,
                    {
                      fontSize: width / 28,
                      color: '#212121',
                      maxWidth: width / 1.5,
                      lineHeight: height / 35,
                    },
                  ]}>
                  {this.state.userdata.addressString}
                </Text>
                <View
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                    top: 5,
                    right: width / 30,
                  }}>
                  {/* <TouchableOpacity>
                    <Icon
                      style={{
                        fontSize: width / 22,
                        color: '#BBDDFE',
                      }}
                      name="pencil"
                    />
                  </TouchableOpacity> */}
                </View>
              </View>
              <View>
                <Text
                  style={[
                    theme.fontMedium,
                    {
                      color: '#747576',
                      fontSize: width / 32,
                      lineHeight: height / 30,
                    },
                  ]}>
                  Country{' '}
                  <Text style={{color: '#F00000', fontSize: width / 23}}>
                    *
                  </Text>
                </Text>
                <Text
                  style={[
                    theme.fontRegular,
                    {fontSize: width / 28, color: '#212121'},
                  ]}>
                  {this.state.userdata.countryName}
                </Text>
                <View
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                    top: 5,
                    right: width / 30,
                  }}>
                  {/* <TouchableOpacity>
                    <Icon
                      style={{
                        fontSize: width / 22,
                        color: '#BBDDFE',
                      }}
                      name="pencil"
                    />
                  </TouchableOpacity> */}
                </View>
              </View>
            </View>
            {/* Contact Info End */}
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
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('ChangePassword');
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: '#BBDDFE',
                      width: 32,
                      height: 32,
                      borderRadius: 32 / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: width / 40,
                    }}>
                    <Password_icon height="18" width="18" />
                  </View>
                  <Text
                    style={[
                      theme.fontRegular,
                      {
                        fontSize: width / 24,
                        color: '#1683FC',
                      },
                    ]}>
                    Change Password
                  </Text>
                </View>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{flex: 6, marginTop: height / 50}}>
                  <Text
                    style={[
                      theme.fontMedium,
                      {
                        fontWeight: '500',
                        fontSize: width / 24,
                        color: '#28292A',
                      },
                    ]}>
                    Notification
                  </Text>
                  <Text
                    style={[
                      theme.fontMedium,
                      {
                        color: '#747576',
                        fontSize: width / 32,
                      },
                    ]}>
                    Show Notification
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <FlipToggle
                    value={this.state.notification}
                    buttonWidth={50}
                    buttonHeight={20}
                    buttonOnColor="#00CC66"
                    buttonOffColor={AppColors.fontColorLight}
                    disabledButtonOnColor="#919191"
                    sliderOnColor="white"
                    sliderOffColor="#919191"
                    buttonRadius={50}
                    labelStyle={{color: 'white', fontSize: '23'}}
                    onToggle={value => {
                      this.setState({notification: value});
                      this.updateNotificationStatus();
                    }}
                  />
                </View>
              </View>
            </View>
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
