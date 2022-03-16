import {
  Content,
  Container,
  Card,
  CardItem,
  Icon,
  Button,
  Textarea,
} from 'native-base';
import React, {Component, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  Share,
  KeyboardAvoidingView,
  Linking,
  Platform,
  RefreshControl,
} from 'react-native';
import {
  Header,
  Left,
  Body,
  Right,
  Badge,
  Title,
  List,
  ListItem,
} from 'native-base';
// import {CheckBox} from 'react-native-elements';

import CheckBox from './assets/svg/CheckBox.svg';
import BackBtn_white from './assets/svg/BackBtn_white.svg';
import Carousel from 'react-native-snap-carousel';
import Mall_Icon from './assets/svg/Mall_Icon.svg';
import {Dropdown} from 'react-native-element-dropdown';
import Job_Icon from './assets/svg/Job_Icon.svg';
import Properties_icon from './assets/svg/Properties_icon.svg';
import Vehicle_icon from './assets/svg/Vehicle_icon.svg';
import RightArrow from './assets/svg/RightArrow.svg';
import ProfilePic from './assets/svg/ProfilePic.svg';
import SearchBlackIcon from './assets/svg/SearchBlackIcon.svg';
import MenuIcon from './assets/svg/MenuIcon.svg';
import BestDealIcon from './assets/svg/BestDealIcon.svg';
import Services_icon from './assets/svg/Services_icon.svg';
import Shops_icon from './assets/svg/Shops_icon';
import Directory_icon from './assets/svg/Directory_icon.svg';
import Product_icon from './assets/svg/products-icon.svg';
import News_icon from './assets/svg/News_icon.svg';
import Promotion_Icon from './assets/svg/Promotion_Icon.svg';
// import GiftboxExplode from './assets/gif/gift-box-explode.gif';
import Notification_icon_white from './assets/svg/Notification_icon_white.svg';
import FloatingLabelBorderInput from './components/FloatingLabelBorderInput';
import Add_image from './assets/svg/Add_image.svg';
import Add_video from './assets/svg/Add_video.svg';
import Submitted_successfully from './assets/svg/Submitted_successfully.svg';
import Loader from './components/Loader';
import {ApiHelper} from './helpers/ApiHelper';
import {API} from './config/api';
import moment from 'moment';
import {CONSTANTS} from './config/constants';
import SeeMore from 'react-native-see-more-inline';
import AsyncStorageHelper from './helpers/AsyncStorageHelper';
import Toast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import YoutubePlayer from 'react-native-youtube-iframe';
import VideoViewer from './components/MediaView/VideoViewer';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import theme from './config/styles.js';
import {Thumbnail} from 'react-native-thumbnail-video';
import FloatingLabelInput from './components/FloatingLabelInput';
import {AppColors} from './Themes';
import DropDown from './components/DropDown';
import GifImage from '@lowkey/react-native-gif';
import {alignItems, border, borderWidth} from 'styled-system';
import ImagePicker from 'react-native-image-crop-picker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faImage, faSearch} from '@fortawesome/free-solid-svg-icons';
import {faWhatsapp} from '@fortawesome/free-brands-svg-icons';
import {faVideo} from '@fortawesome/free-solid-svg-icons';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons';
import ImageView from 'react-native-image-viewing';
import AddSvg from './assets/svg/Add_icon.svg';
import crashlytics from '@react-native-firebase/crashlytics';
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';

var {height, width} = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * width) / 100;
  return Math.round(value);
}

const slideHeight = height * 0.2;
const slideWidth = wp(82);
const itemHorizontalMargin = wp(2);

export const sliderWidth = width;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;
const entryBorderRadius = 8;
const SLIDER_1_FIRST_ITEM = 1;

const gift_box_explode = require('./assets/gif/gift_to_explode.webp');
const around_me = require('./assets/gif/Around-me.gif');
const my_properties = require('./assets/gif/My-Property.gif');

export default class Home extends Component {
  constructor() {
    super();

    this.state = {
      loader: false,
      newsArr1: {},
      newsArr2: {},
      feedArr: [],
      productArr: [],
      isUserLoggedIn: false,
      userRole: '',
      userDate: null,
      youTubeVideoViewer: false,
      youTubeVideoCode: '',
      playing: false,
      videoViewer: false,
      videoViewerUrl: '',
      ads: [],
      feedAds: [],
      gifts: [],
      filterVisible: false,
      contactLanguages: [
        {
          label: 'English',
          value: 'English',
        },
      ],
      contactLanguage: null,
      contactName: '',
      contactNumber: '',
      contactEmail: '',
      contactFile: '',
      contactDescription: '',
      contactTerms: false,
      isChecked: false,
      globalSearchVisible: false,
      feedSearchVisible: false,
      feedSearchKey: '',
      categories: [],
      filterCategory: null,
      filterSearchKey: '',
      showGiftDetails: false,
      giftDetailsSelected: null,
      verifyModalView: false,

      postTitle: '',
      whatsappNumber: '974',
      postType: '1',
      postContent: '',
      image: '',
      existingImage: '',
      error: false,
      update: false,
      loaderAddPost: false,
      removedImages: '',
      postId: '',
      successfull: false,
      addPostVisible: false,
      isImageViewerVisible: false,
      imageViewerImages: [],
      refreshing: false,
      value : null,
      isFocus: false
    };

    this._renderItem = this._renderItem.bind(this);
   
  }
 

  componentDidMount() {
    // crashlytics().log('test log.');

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

    this.checkUserLoggedIn();
    this.getUser();
    this.setState({loader: true});
    this.fetchCategoryList();
    this.getAds();
    this.getGifts();
    this.getFeedAds();
    // this.getLatestFeeds();
    this.fetchProductList();
    setTimeout(() => this.setState({loader: false}), 1000);
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getLatestFeeds();
  };

  async checkUserLoggedIn() {
    var userData = null;
    try {
      userData = await AsyncStorageHelper.getItem('USERDATA');
      // console.log('userDataH', JSON.parse(userData));
      this.setState({isUserLoggedIn: userData ? true : false});
      this.setState({userData: JSON.parse(userData)});
    } catch (e) {
      this.setState({isUserLoggedIn: false});
    }
  }

  async getUser() {
    const user = await AsyncStorageHelper.getItem('ISUSER');
    //console.log("user", user)
  }

  async fetchCategoryList() {
    await ApiHelper.get(API.categories)
      .then(res => {
        if (res !== null) {
          this.arrayholder = res.data.data;
          this.setState({
            categories: this.arrayholder.map(c => ({
              label: c.category,
              value: c.id,
            })),
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  _renderItem = ({item, index}) => {
    return (
      <View style={style.cardWrapparent}>
        <Card style={style.cardWrap}>
          <CardItem cardBody style={style.cardBorder}>
            <Image
              source={{
                uri: item.title,
              }}
              style={style.cardImage}
              resizeMode="stretch"
            />
          </CardItem>
        </Card>
      </View>
    );
  };
  _handleTextReady = () => {
    // ...
  };

  async getLatestFeeds() {
    this.setState({loader: true});
    let url = '?pageNo=1&limit=24';
    await ApiHelper.get(API.userFeeds + url)
      .then(res => {
        if (res !== null) {
          var dataLen = res.data.data;
          if (dataLen.length) {
            // this.setState({
            //   feedArr: dataLen,
            // });
            console.log('fee', 'fee');
            var feedsWithAds = [];
            res.data.data.map((item, index) => {
              if (
                this.state.feedAds.length > 0 &&
                index > 0 &&
                index % 3 === 0
              ) {
                let feedIndex = index / 3;
                if (this.state.feedAds.length > feedIndex) {
                  feedsWithAds.push(this.state.feedAds[feedIndex]);
                }
              }
              feedsWithAds.push(item);
            });

            this.setState({
              feedArr: feedsWithAds,
            });
          }
        }
        this.setState({
          loader: false,
          refreshing: false,
        });
      })
      .catch(err => {
        this.setState({
          loader: false,
          refreshing: false,
        });
        console.log(err);
      });
  }

  async fetchProductList() {
    await ApiHelper.get(API.homeMyDeals)
      .then(res => {
        if (res !== null) {
          var dataLen = res.data.data;
          if (dataLen.length) {
            this.setState({
              productArr: dataLen,
            });
          }
        }
        this.setState({
          loader: false,
        });
      })
      .catch(err => {
        this.setState({
          loader: false,
        });
        console.log(err);
      });
  }
  async updateLike(id) {
    let formData = {
      id: id,
    };
    await ApiHelper.patch(API.likeUserFeed + id, formData)
      .then(res => {
        this.getLatestFeeds();
        Toast.showWithGravity(res.data.message, Toast.LONG, Toast.BOTTOM);
      })
      .catch(err => {
        this.setState({
          loader: false,
        });
        console.log(err);
      });
  }
  async blockFeed(id) {
    this.setState({
      loader: true,
    });
    let formData = {
      id: id,
    };
    await ApiHelper.patch(API.blockFeed + '/' + id, formData)
      .then(res => {
        this.setState(
          {
            pageNo: 1,
          },
          () => this.getLatestFeeds(),
        );
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({
      loader: false,
      paginationLoading: false,
    });
  }
  playVideo(url) {
    this.setState({
      videoViewer: true,
      videoViewerUrl: CONSTANTS.ORGINAL_IMG + url,
    });
  }

  viewImage(url) {
    var urls = [{uri: url}];

    this.setState({
      imageViewerImages: urls,
      isImageViewerVisible: true,
    });
  }
  validateYouTubeUrl(url) {
    if (url) {
      var regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match && match[2].length === 11) {
        return match[2];
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  async getAds() {
    await ApiHelper.get(API.adsHome)
      .then(res => {
        if (res !== null) {
          if ('data' in res.data && res.data.data && res.data.data.length > 0) {
            var bannerAds = [];
            res.data.data.map(item => {
              bannerAds.push({
                title: CONSTANTS.IMAGE_URL_PREFIX + item?.adImage,
              });
            });
            this.setState({
              ads: bannerAds,
            });
          } else {
            // this.getDefaultAds();
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({
      loader: false,
      paginationLoading: false,
    });
  }

  async getGifts() {
    await ApiHelper.get(API.defaultAds)
      .then(res => {
        if (res !== null) {
          if ('data' in res.data && res.data.data && res.data.data.length > 0) {
            // var bannerAds = [];
            // res.data.data.map(item => {
            //   bannerAds.push({title: CONSTANTS.IMAGE_URL_PREFIX + item?.image});
            // });
            this.setState({
              gifts: res.data.data,
            });
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({
      loader: false,
      paginationLoading: false,
    });
  }

  async getFeedAds() {
    await ApiHelper.get(API.adsFeedHome)
      .then(res => {
        if (res !== null) {
          if ('data' in res.data && res.data.data) {
            this.setState({
              feedAds: res.data.data,
            });
          }
        }
        this.getLatestFeeds();
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({
      loader: false,
      paginationLoading: false,
    });
  }

  closeFilterModal(save) {
    this.setState({
      filterVisible: false,
    });
  }

  onShare = async link => {
    try {
      let postFullLink = CONSTANTS.SHARE_BASE_URL + link;
      const result = await Share.share({
        message: postFullLink,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  applyGlobalSearchModal(save) {
    this.setState({
      ...this.state,
      globalSearchVisible: false,
    });

    switch (this.state.filterCategory) {
      case '1': {
        this.props.navigation.navigate('ListJobs', {
          searchKey: this.state.filterSearchKey,
        });
        break;
      }
      case '2': {
        this.props.navigation.navigate('ListMalls', {
          searchKey: this.state.filterSearchKey,
        });
        break;
      }
      case '3': {
        this.props.navigation.navigate('ListMalls', {
          searchKey: this.state.filterSearchKey,
        });
        break;
      }
      case '4': {
        this.props.navigation.navigate('ListNews', {
          searchKey: this.state.filterSearchKey,
        });
        break;
      }
      case '5': {
        this.props.navigation.navigate('ListProducts', {
          searchKey: this.state.filterSearchKey,
        });
        break;
      }
      case '6': {
        this.props.navigation.navigate('ListProperty', {
          searchKey: this.state.filterSearchKey,
        });
        break;
      }
      case '7': {
        this.props.navigation.navigate('ListServices', {
          searchKey: this.state.filterSearchKey,
        });
        break;
      }
      case '8': {
        this.props.navigation.navigate('ListVehicles', {
          searchKey: this.state.filterSearchKey,
        });
        break;
      }
      case '9': {
        this.props.navigation.navigate('ListFeeds', {
          searchKey: this.state.filterSearchKey,
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  renderContactForm = () => {
    let pickerStyle = {
      marginTop: height / 7.8,
      marginLeft: width / 20,
      borderRadius: 8,
      paddingLeft: 8,
      width: width / 1.17,
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.filterVisible}
        onRequestClose={() => {
          this.closeFilterModal(false);
        }}>
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <Header
            style={{
              flexDirection: 'row',
              backgroundColor: AppColors.primaryColor,
              height: height / 12,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
            androidStatusBarColor={AppColors.primaryColor}
            iosBarStyle="default">
            <Left>
              <Button
                transparent
                onPress={() => {
                  this.closeFilterModal(false);
                }}>
                <BackBtn_white height="22" width="20" />
              </Button>
            </Left>
            <Body>
              <Title
                style={{
                  color: 'white',

                  fontSize: width / 22,
                }}>
                Contact Request
              </Title>
            </Body>
            {/* <Right>
            <Button
              transparent
              onPress={() => {
                this.closeFilterModal(true);
              }}>
              <Icon
                name="checkmark"
                style={{fontSize: width / 12, color: '#fff'}}
              />
            </Button>
          </Right> */}
          </Header>

          <ScrollView
            contentContainerStyle={{
              paddingStart: width / 15,
              paddingEnd: width / 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 30,
              }}>
              <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                Contact name <Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <View
              style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                alignItems: 'center',
                width: width / 1.2,
                height: height / 15,
                marginBottom: width / 40,
                marginTop: height / 65,
                borderColor: '#BDBEBF',
                borderBottomWidth: 1,
              }}>
              <FloatingLabelInput
                width={width / 1.3}
                mandatory={false}
                value={this.state.contactName}
                returnKeyType={'next'}
                placeholder=""
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    contactName: value,
                  });
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 30,
              }}>
              <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                Contact name <Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <View
              style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                alignItems: 'center',
                width: width / 1.2,
                height: height / 15,
                marginBottom: width / 40,
                marginTop: height / 65,
                borderColor: '#BDBEBF',
                borderBottomWidth: 1,
              }}>
              <FloatingLabelInput
                width={width / 1.3}
                mandatory={false}
                value={this.state.contactEmail}
                returnKeyType={'next'}
                placeholder=""
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    contactEmail: value,
                  });
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 30,
              }}>
              <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                Contact number <Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <View
              style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                alignItems: 'center',
                width: width / 1.2,
                height: height / 15,
                marginBottom: width / 40,
                marginTop: height / 65,
                borderColor: '#BDBEBF',
                borderBottomWidth: 1,
              }}>
              <FloatingLabelInput
                width={width / 1.3}
                mandatory={false}
                value={this.state.contactNumber}
                returnKeyType={'next'}
                placeholder=""
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    contactNumber: value,
                  });
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 30,
              }}>
              <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                Choose language
              </Text>
            </View>
            <View style={{marginTop: height / 80}}>
              <DropDown
                placeholder="Choose language"
                placeholderTextColor="#808080"
                data={this.state.contactLanguages}
                value={this.state.contactLanguage}
                containerStyle={{
                  width: null,
                  borderRadius: 8,
                  paddingStart: width / 60,
                  backgroundColor: '#fff',
                  borderBottomWidth: 1,
                  borderColor: '#BDBEBF',
                }}
                pickerStyle={pickerStyle}
                dropdownPosition={1}
                rippleInsets={{top: 0, bottom: 0}}
                dropdownOffset={{
                  top: height / 70,
                }}
                fontSize={width / 25}
                baseColor="#000000"
                inputContainerStyle={{borderBottomWidth: 0}}
                renderAccessory={this.renderAccessory}
                style={[
                  theme.fontRegular,
                  {
                    color: '#000000',
                    fontSize: width / 25,
                    alignItems: 'center',
                    alignSelf: 'center',
                  },
                ]}
                onChange={(value, index) => {
                  this.setState({
                    contactLanguage: value,
                  });
                }}
              />
            </View>

            <View
              style={{
                paddingRight: width / 45,
                borderWidth: 1,
                borderColor: '#D4D4D5',
                backgroundColor:
                  this.state.postType == '3' && this.state.image
                    ? '#D4D4D5'
                    : 'white',
                borderRadius: 8,
              }}>
              <Textarea
                value={this.state.contactDescription}
                style={{width: width / 1.15}}
                rowSpan={5}
                onChangeText={value => {
                  this.setState({
                    contactDescription: value,
                  });
                }}
              />
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 30,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({isChecked: !this.state.isChecked});
                  }}
                  style={{
                    backgroundColor: 'white',
                    height: 20,
                    width: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 4,
                    zIndex: 1000,
                  }}>
                  {this.state.isChecked ? <CheckBox /> : null}
                </TouchableOpacity>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{alignSelf: 'center', marginStart: width / 34}}>
                    I agree with{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('TermsandCondition');
                    }}>
                    <Text style={{color: '#bd1d53'}}>Terms & Condition</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {!this.state.isChecked && this.state.error ? (
                <Text style={style.errorStyle}>
                  Please check terms & condition
                </Text>
              ) : null}

              <View
                style={{
                  paddingTop: height / 20,
                  paddingBottom: height / 50,
                  marginBottom: height / 20,
                }}>
                <Button
                  block
                  rounded
                  style={{
                    backgroundColor: AppColors.primaryColor,
                    elevation: 0,
                  }}
                  onPress={() => {
                    this.closeFilterModal(true);
                  }}>
                  <Icon
                    name="checkmark"
                    style={{
                      fontSize: width / 18,
                      color: '#fff',
                    }}
                  />
                  <Text style={{color: 'white'}}>Submit</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  renderGlobalSearch = () => {
    let pickerStyle = {
      marginTop: height / 7.8,
      marginLeft: width / 20,
      borderRadius: 8,
      paddingLeft: 8,
      width: width / 1.17,
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.globalSearchVisible}
        onRequestClose={() => {
          // this.closeFilterModal(false);

          this.setState({
            ...this.state,
            globalSearchVisible: false,
          });
        }}>
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <Header
            style={{
              flexDirection: 'row',
              backgroundColor: AppColors.primaryColor,
              height: height / 12,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
            androidStatusBarColor={AppColors.primaryColor}
            iosBarStyle="default">
            <Left>
              <Button
                transparent
                onPress={() => {
                  // this.closeFilterModal(false);

                  this.setState({
                    ...this.state,
                    globalSearchVisible: false,
                  });
                }}>
                <BackBtn_white height="22" width="20" />
              </Button>
            </Left>
            <Body>
              <Title
                style={{
                  color: 'white',

                  fontSize: width / 22,
                }}>
                Global Search
              </Title>
            </Body>
            <Right>
              <Button
                transparent
                onPress={() => {
                  if (this.state.filterCategory) {
                    this.applyGlobalSearchModal(true);
                  } else {
                    Toast.showWithGravity(
                      'Please select category',
                      Toast.LONG,
                      Toast.BOTTOM,
                    );
                  }
                }}>
                <Icon
                  name="checkmark"
                  style={{fontSize: width / 12, color: '#fff'}}
                />
              </Button>
            </Right>
          </Header>

          <ScrollView
            contentContainerStyle={{
              paddingStart: width / 15,
              paddingEnd: width / 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 30,
              }}>
              <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                Search Key
              </Text>
            </View>
            <View
              style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                alignItems: 'center',
                width: width / 1.2,
                height: height / 15,
                marginBottom: width / 40,
                marginTop: height / 65,
                borderColor: '#BDBEBF',
                borderBottomWidth: 1,
              }}>
              <FloatingLabelInput
                width={width / 1.3}
                mandatory={false}
                value={this.state.filterSearchKey}
                returnKeyType={'next'}
                placeholder="Search Key"
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    filterSearchKey: value,
                  });
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 30,
              }}>
              <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                Category
              </Text>
            </View>
            <View style={{marginTop: height / 80}}>
              {/* <DropDown
                placeholder="Choose category"
                placeholderTextColor="#808080"
                data={this.state.categories}
                value={this.state.filterCategory}
                containerStyle={{
                  width: null,
                  borderRadius: 8,
                  paddingStart: width / 60,
                  backgroundColor: '#fff',
                  borderBottomWidth: 1,
                  borderColor: '#BDBEBF',
                }}
                pickerStyle={pickerStyle}
                dropdownPosition={1}
                rippleInsets={{top: 0, bottom: 0}}
                dropdownOffset={{
                  top: height / 70,
                }}
                fontSize={width / 25}
                baseColor="#000000"
                inputContainerStyle={{borderBottomWidth: 0}}
                renderAccessory={this.renderAccessory}
                style={[
                  theme.fontRegular,
                  {
                    color: '#000000',
                    fontSize: width / 25,
                    alignItems: 'center',
                    alignSelf: 'center',
                  },
                ]}
                onChange={(value, index) => {
                  this.setState({
                    filterCategory: value,
                  });
                  // this.fetchSubCategories(value);
                }}
              />
              
               */}
            </View>
            <View style={style.dropContainer}>
            
              <Dropdown
                style={[style.dropdown, this.state.isFocus && {borderColor: 'blue'}]}
                placeholderStyle={style.placeholderStyle}
                selectedTextStyle={style.selectedTextStyle}
                inputSearchStyle={style.inputSearchStyle}
                iconStyle={style.iconStyle}
                data={this.state.categories}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!this.state.isFocus ? 'Select item' : '...'}
                searchPlaceholder="Search..."
                value={this.state.filterCategory}
                onFocus={()=> {
                   this.setState({
                     isFocus:true
                   })
                } }
                onBlur={() => {
                  this.setState({
                    isFocus:false
                  })
                }}
                onChange={item => {
                 // setValue(item.value);
                 // setIsFocus(false);
                  this.setState({
                          filterCategory: item.value,
                          isFocus:false,
                          value:item.value
                        });
                }}
                renderLeftIcon={() => (
                  <AntDesign
                    // style={style.icon}
                    color={this.state.isFocus ? 'blue' : 'black'}
                    name="Safety"
                    size={20}
                  />
                )}
              />
            </View>

            <View>
              <View
                style={{
                  paddingTop: height / 20,
                  paddingBottom: height / 50,
                  marginBottom: height / 20,
                }}>
                <Button
                  block
                  rounded
                  style={{
                    backgroundColor: AppColors.primaryColor,
                    elevation: 0,
                  }}
                  onPress={() => {
                    if (this.state.filterCategory) {
                      this.applyGlobalSearchModal(true);
                    } else {
                      Toast.showWithGravity(
                        'Please select category',
                        Toast.LONG,
                        Toast.BOTTOM,
                      );
                    }
                  }}>
                  <Icon
                    name="checkmark"
                    style={{
                      fontSize: width / 18,
                      color: '#fff',
                    }}
                  />
                  <Text style={{color: 'white'}}>Apply Filter</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  applyFeedSearchModal(save) {
    this.setState({
      ...this.state,
      feedSearchVisible: false,
    });

    this.props.navigation.navigate('ListFeeds', {
      searchKey: this.state.feedSearchKey,
    });
  }

  renderFeedSearch = () => {
    let pickerStyle = {
      marginTop: height / 7.8,
      marginLeft: width / 20,
      borderRadius: 8,
      paddingLeft: 8,
      width: width / 1.17,
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.feedSearchVisible}
        onRequestClose={() => {
          // this.closeFilterModal(false);

          this.setState({
            ...this.state,
            feedSearchVisible: false,
          });
        }}>
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <Header
            style={{
              flexDirection: 'row',
              backgroundColor: AppColors.primaryColor,
              height: height / 12,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
            androidStatusBarColor={AppColors.primaryColor}
            iosBarStyle="default">
            <Left>
              <Button
                transparent
                onPress={() => {
                  // this.closeFilterModal(false);

                  this.setState({
                    ...this.state,
                    feedSearchVisible: false,
                  });
                }}>
                <BackBtn_white height="22" width="20" />
              </Button>
            </Left>
            <Body>
              <Title
                style={{
                  color: 'white',

                  fontSize: width / 22,
                }}>
                Feed Search
              </Title>
            </Body>
            <Right>
              <Button
                transparent
                onPress={() => {
                  this.applyFeedSearchModal(true);
                }}>
                <Icon
                  name="checkmark"
                  style={{fontSize: width / 12, color: '#fff'}}
                />
              </Button>
            </Right>
          </Header>

          <ScrollView
            contentContainerStyle={{
              paddingStart: width / 15,
              paddingEnd: width / 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 30,
              }}>
              <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                Search Key
              </Text>
            </View>
            <View
              style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                alignItems: 'center',
                width: width / 1.2,
                height: height / 15,
                marginBottom: width / 40,
                marginTop: height / 65,
                borderColor: '#BDBEBF',
                borderBottomWidth: 1,
              }}>
              <FloatingLabelInput
                width={width / 1.3}
                mandatory={false}
                value={this.state.feedSearchKey}
                returnKeyType={'next'}
                placeholder="Search Key"
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    feedSearchKey: value,
                  });
                }}
              />
            </View>

            <View>
              <View
                style={{
                  paddingTop: height / 20,
                  paddingBottom: height / 50,
                  marginBottom: height / 20,
                }}>
                <Button
                  block
                  rounded
                  style={{
                    backgroundColor: AppColors.primaryColor,
                    elevation: 0,
                  }}
                  onPress={() => {
                    this.applyFeedSearchModal(true);
                  }}>
                  <Icon
                    name="checkmark"
                    style={{
                      fontSize: width / 18,
                      color: '#fff',
                    }}
                  />
                  <Text style={{color: 'white'}}>Apply Filter</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  _renderItemGift = item => {
    return (
      <View style={style.giftCardWrap}>
        <TouchableOpacity
          style={style.giftCardImage}
          activeOpacity={0.8}
          onPress={() => {
            // console.log('showModalGiftDetails');

            if (this.state.isUserLoggedIn) {
              this.showModalGiftDetails(item);
            } else {
              Toast.showWithGravity(
                'Please login to open the gift.',
                Toast.LONG,
                Toast.BOTTOM,
              );
            }
          }}>
          <Image
            source={gift_box_explode}
            style={style.giftCardImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderGiftDetails = () => {
    return (
      <Modal
        visible={this.state.showGiftDetails}
        animationType="slide"
        transparent={true}
        backgroundColor="#fff"
        onRequestClose={() => {
          this.hideModalGiftDetails();
        }}>
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
              width: '90%',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#fff',
              paddingBottom: 25,
              paddingTop: 5,
              paddingHorizontal: width / 17,
            }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 5,
                top: 5,
                padding: 6,
                backgroundColor: AppColors.fontColorLight,
                borderRadius: 50,
              }}
              activeOpacity={0.8}
              onPress={() => {
                this.hideModalGiftDetails();
              }}>
              <Icon
                style={{color: '#737373', fontSize: 14}}
                name="close"
                type="Ionicons"
                onPress={() => {
                  this.hideModalGiftDetails();
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: width / 20,
                color: 'black',
                fontFamily: 'Roboto-Bold',
                marginTop: 20,
                marginBottom: 20,
              }}>
              {this.state?.giftDetailsSelected?.title}
            </Text>

            <View
              style={{
                marginTop: 10,
              }}>
              <Image
                style={{width: '100%', height: height / 3}}
                source={{
                  uri:
                    CONSTANTS.IMAGE_URL_PREFIX +
                    this.state?.giftDetailsSelected?.image,
                }}
                resizeMode="cover"
                // style={style.cardImage}
              />
            </View>
            <View
              style={{
                paddingHorizontal: 5,
              }}>
              <View
                style={{
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'Roboto-Medium',
                    color: '#5f5f5f',
                    marginTop: 2,
                    fontSize: 16,
                  }}
                  selectable>
                  {this.state?.giftDetailsSelected?.title}
                </Text>
              </View>

              <View
                style={{
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'Roboto-Medium',
                    color: '#5f5f5f',
                    marginTop: 2,
                    fontSize: 16,
                  }}
                  selectable>
                  {this.state?.giftDetailsSelected?.description}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#bd1d53',
                    paddingVertical: 10,
                    paddingHorizontal: 25,
                    borderRadius: 0,
                  }}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (
                      this.state?.giftDetailsSelected?.websiteUrl &&
                      Linking.canOpenURL(
                        this.state?.giftDetailsSelected?.websiteUrl,
                      )
                    ) {
                      Linking.openURL(
                        this.state?.giftDetailsSelected?.websiteUrl,
                      );
                    }
                  }}>
                  <Text style={[theme.fontRegular, {color: '#fff'}]}>
                    View more
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  async showModalGiftDetails(gift) {
    const auth_user = await AsyncStorageHelper.getItem('ISUSER');
    // if (auth_user == 'user_exist') {
    this.setState({
      showGiftDetails: true,
      auth_user: auth_user,
      giftDetailsSelected: gift,
    });
    // } else {
    //   this.props.navigation.navigate('Login');
    // }
  }

  async hideModalGiftDetails() {
    this.setState({
      showGiftDetails: false,
      giftDetailsSelected: null,
    });
  }

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
                  <Submitted_successfully height="90" width="90" />
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
                  Successful!
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
                  You have successfully{' '}
                  {this.state.update ? 'updated' : 'submitted'}!
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        verifyModalView: false,
                      });
                      // this.props.navigation.goBack();
                    }}
                    style={{
                      paddingHorizontal: 30,
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
                      Ok
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

  async changePostType(postType) {
    this.setState({
      postType: postType,
    });
    if (postType === 1) {
      this.setState({
        image: '',
        removedImages: this.state.existingImage,
        existingImage: '',
      });
    } else if (postType === 2) {
      this.setState({
        removedImages: '',
        existingImage: this.state.removedImages,
        image: '',
      });
    } else {
      this.setState({
        removedImages: this.state.existingImage,
        existingImage: '',
        image: '',
      });
    }
  }
  // Gallery Images picker
  async pickGallery() {
    try {
      const options = {
        title: 'Gallery',
        mediaType: this.state.postType === '2' ? 'photo' : 'video',
      };
      const gallery = await ImagePicker.openPicker(options);
      const galleryImages = {
        uri: gallery.path,
        type: gallery.mime,
        name: gallery.path.replace(/^.*[\\\/]/, ''),
      };
      console.log('Gallery Image', gallery);
      this.setState({
        image: galleryImages,
        existingImage: '',
        removedImages: this.state.image,
      });
    } catch (e) {}
  }

  async addPost() {
    this.setState({
      loader: true,
    });
    if (
      this.state.postTitle == '' ||
      (this.state.postType == '1' && this.state.postContent == '') ||
      (this.state.postType == '2' && this.state.image == '') ||
      (this.state.postType == '3' &&
        this.state.image == '' &&
        this.state.postContent == '')
      //   ||
      // this.state.isChecked == false
    ) {
      this.setState({
        error: true,
        loader: false,
      });
    } else {
      const params = new FormData();
      params.append('postTitle', this.state.postTitle);
      params.append('whatsappNumber', this.state.whatsappNumber);

      params.append('postType', this.state.postType);
      params.append('postContent', this.state.postContent);
      if (this.state.image) {
        params.append('attachment', this.state.image);
      }
      console.log('Form Data', params);
      await ApiHelper.form_post(API.userFeeds, params)
        .then(res => {
          if (res == undefined) {
            this.setState({
              loader: false,
              successfull: false,
            });
          } else {
            this.setState({
              loader: false,
              postTitle: '',
              whatsappNumber: '',
              postType: '1',
              postContent: '',
              image: '',
              existingImage: '',
              error: false,
              update: false,
              loaderAddPost: false,
              removedImages: '',
              postId: '',
              addPostVisible: false,
            });
            this.getLatestFeeds();
          }
        })
        .catch(err => {
          this.setState({
            loader: false,
          });
        });
    }
  }

  renderAddFeed = () => {
    let pickerStyle = {
      marginTop: height / 7.8,
      marginLeft: width / 20,
      // marginRight:12,
      borderRadius: 8,
      paddingLeft: 8,
      width: width / 1.17,
      //  marginLeft:12
    };
    return (
      // <Container
      //   style={{
      //     backgroundColor: 'white',
      //   }}>

      <View
        style={{
          width: '100%',
          flexDirection: 'column',
          backgroundColor: 'white',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          borderBottomColor: '#ededed',
          borderBottomWidth: 1,
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            backgroundColor: 'white',
            height: height / 14,
            justifyContent: 'flex-start',
            alignItems: 'center',
            borderBottomColor: '#ededed',
            borderBottomWidth: 1,
          }}>
          <TouchableOpacity
            style={{
              paddingStart: width / 50,
              paddingEnd: width / 40,
              borderRightColor: '#ededed',
              borderRightWidth: 1,
            }}
            onPress={() => {
              this.changePostType('1');
            }}>
            <Text
              style={{
                color: this.state.postType === '1' ? '#bd1d53' : 'black',
                marginStart: width / 40,
                fontSize: width / 26,
                fontWeight: 'bold',
              }}>
              Text
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              paddingStart: width / 50,
              paddingEnd: width / 40,
              borderRightColor: '#ededed',
              borderRightWidth: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              this.changePostType('2');
            }}>
            <FontAwesomeIcon icon={faImage} color={'#bd1d53'} />
            <Text
              style={{
                color: this.state.postType === '2' ? '#bd1d53' : 'black',
                marginStart: width / 40,
                fontSize: width / 26,
                fontWeight: 'bold',
              }}>
              Photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingStart: width / 50,
              paddingEnd: width / 40,
              borderRightColor: '#ededed',
              borderRightWidth: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              this.changePostType('3');
            }}>
            <FontAwesomeIcon icon={faVideo} color={'#bd1d53'} />
            <Text
              style={{
                color: this.state.postType === '3' ? '#bd1d53' : 'black',
                marginStart: width / 40,
                fontSize: width / 26,
                fontWeight: 'bold',
              }}>
              Video
            </Text>
          </TouchableOpacity>
        </View>

        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: '#ffffff',
            paddingBottom: height / 30,
          }}>
          <Loader visibility={this.state.loaderAddPost} />

          <View
            style={{
              marginStart: width / 15,
              marginEnd: width / 15,
              flexDirection: 'column',
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 50,
              }}
            />

            <FloatingLabelBorderInput
              width={width / 1.3}
              mandatory={true}
              value={this.state.postTitle}
              returnKeyType={'next'}
              placeholder="Title"
              placeholderTextColor={'#808B96'}
              onChangeText={value => {
                this.setState({
                  postTitle: value,
                });
              }}
            />
            {this.state.postTitle == '' && this.state.error ? (
              <Text style={style.errorStyle}>Please enter title</Text>
            ) : null}
            {this.state.postType == '3' ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 50,
                }}>
                <Text
                  style={[
                    theme.fontMedium,
                    {color: 'red', fontSize: width / 32},
                  ]}>
                  Either Content or Attachment is mandatory
                </Text>
              </View>
            ) : null}

            <View
              style={{
                width: width / 1.3,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: width / 30,
                borderColor: AppColors.borderColor,
                borderWidth: 1,
                borderRadius: 8,
              }}>
              {/* <Text
              style={{
                color: this.state.postType === '4' ? '#bd1d53' : 'black',
                marginStart: width / 40,
                fontSize: width / 26,
                fontWeight: 'bold',
              }}>
              Whatsapp
            </Text> */}

              <FontAwesomeIcon icon={faWhatsapp} color={'#bd1d53'} size={18} />
              <FloatingLabelInput
                width={width / 1.6}
                value={this.state.whatsappNumber}
                returnKeyType={'next'}
                placeholder="Whatsapp"
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    whatsappNumber: value,
                  });
                }}
              />
            </View>

            <View
              style={{
                paddingRight: width / 45,
                borderWidth: 1,
                borderColor: '#D4D4D5',
                backgroundColor:
                  this.state.postType == '3' && this.state.image
                    ? '#D4D4D5'
                    : 'white',
                borderRadius: 8,
                marginTop: width / 30,
              }}>
              <Textarea
                disabled={
                  this.state.postType == '3' && this.state.image ? true : false
                }
                value={this.state.postContent}
                style={{width: width / 1.15}}
                rowSpan={5}
                placeholder={
                  this.state.postType == '3'
                    ? 'Type a youtube url here...'
                    : 'Write your post description...'
                }
                onChangeText={value => {
                  this.setState({
                    postContent: value,
                  });
                }}
              />
            </View>

            {this.state.postType == '1' &&
            this.state.postContent == '' &&
            this.state.error ? (
              <Text style={style.errorStyle}>Please enter content</Text>
            ) : null}

            {this.state.postType == '2' || this.state.postType == '3' ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: height / 100,
                    marginBottom: height / 70,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  {this.state.image ? (
                    <View
                      style={{
                        margin: width / 85,
                      }}>
                      <TouchableOpacity
                        style={{
                          height: 25,
                          width: 25,
                          position: 'absolute',
                          zIndex: 1000,
                          right: 0,
                          top: 0,
                          backgroundColor: '#bd1d53',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        activeOpacity={0.7}
                        onPress={() => {
                          this.setState({
                            image: '',
                          });
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                          }}>
                          X
                        </Text>
                      </TouchableOpacity>
                      <Image
                        source={{uri: this.state?.image?.uri}}
                        style={{
                          height: width / 3,
                          width: width / 1.3,
                          resizeMode: 'cover',
                        }}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        if (
                          this.state.postType == '3' &&
                          this.state.postContent != ''
                        ) {
                          Toast.showWithGravity(
                            'You can add either content or attachment',
                            Toast.LONG,
                            Toast.BOTTOM,
                          );
                        } else {
                          this.pickGallery();
                        }
                      }}
                      activeOpacity={0.6}
                      style={{
                        alignSelf: 'flex-start',
                        margin: width / 85,
                      }}>
                      {this.state.postType == '2' ? (
                        // <Add_image height={width / 4} width={width / 1.2} />
                        <View
                          style={{
                            borderStyle: 'dashed',
                            borderColor: '#bd1d53',
                            borderWidth: 1,
                            borderRadius: 8,
                            height: width / 3,
                            width: width / 1.3,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'black',
                              marginStart: width / 40,
                              fontSize: width / 28,
                              fontWeight: 'bold',
                            }}>
                            Add image
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            borderStyle: 'dashed',
                            borderColor: '#bd1d53',
                            borderWidth: 1,
                            borderRadius: 8,
                            height: width / 3,
                            width: width / 1.3,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'black',
                              marginStart: width / 40,
                              fontSize: width / 28,
                              fontWeight: 'bold',
                            }}>
                            Add video
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </>
            ) : null}

            {this.state.postType == '2' &&
            this.state.image == '' &&
            this.state.error ? (
              <Text style={style.errorStyle}>Please add an attachment</Text>
            ) : null}

            {this.state.postType == '3' &&
            this.state.image == '' &&
            this.state.postContent == '' &&
            this.state.error ? (
              <Text style={style.errorStyle}>
                Please enter a youtube url in content box or add an attachment
              </Text>
            ) : null}

            {this.state.postType == '3' &&
            this.state.image &&
            this.state.postContent == '' &&
            this.state.error ? (
              <Text style={style.errorStyle}>
                Either the content or attachment is mandatory for video posts
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={() => {
                this.addPost();
              }}
              style={{
                borderRadius: 8,
                marginTop: width / 12,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#bd1d53',
                height: width / 8,
                paddingLeft: width / 70,
                paddingRight: width / 70,

                paddingTop: width / 90,
                paddingBottom: width / 90,
              }}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: width / 22,
                  fontWeight: 'bold',
                }}>
                {'Publish Post'}
              </Text>
            </TouchableOpacity>
          </View>
          {this.verifyModal()}
        </Content>
      </View>
    );
  };

  render() {
    //  let userRole = this.props.route.params.userRole;
    //   console.log("userRole in home",userRole)
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

          {/* <View
            style={{
              position: 'absolute',
              right: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                this.getLatestFeeds();
              }}>
              <FontAwesomeIcon size={20} icon={faRecycle} color={'#FFFFFF'} />
            </TouchableOpacity>
          </View> */}
          <View
            style={{
              position: 'absolute',
              right: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  ...this.state,
                  globalSearchVisible: true,
                });
              }}>
              <FontAwesomeIcon size={20} icon={faSearch} color={'#FFFFFF'} />
            </TouchableOpacity>
          </View>
        </View>
        <Loader visibility={this.state.loader} />

        {this.renderContactForm()}
        {this.renderGlobalSearch()}
        {this.renderFeedSearch()}
        {this.renderGiftDetails()}

        {this.state.loader == false ? (
          <Content
            ref={c => (this.component = c)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              backgroundColor: '#f1f1f1',
              paddingBottom: height / 60,
            }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }>
            <Carousel
              layout={'default'}
              ref={c => {
                this._carousel = c;
              }}
              data={this.state.ads}
              renderItem={this._renderItem}
              sliderWidth={sliderWidth}
              itemHeight={1000}
              itemWidth={itemWidth}
              hasParallaxImages={true}
              inactiveSlideScale={1}
              inactiveSlideOpacity={0.7}
              loop={true}
              loopClonesPerSide={3}
              autoplay={true}
              autoplayDelay={500}
              autoplayInterval={2000}
              firstItem={SLIDER_1_FIRST_ITEM}
            />

            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 70,
                justifyContent: 'space-around',
              }}>
              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  height: width / 2.8,
                  width: width / 2.4,
                  borderRadius: 15,
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    console.log('MyProperties');

                    this.props.navigation.navigate('MyProperties');
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={my_properties}
                      style={{width: width / 3.4, height: width / 3.4}}
                      resizeMode="contain"
                      resizeMethod="resize"
                    />
                  </View>
                  <Text>My Properties</Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  height: width / 2.8,
                  width: width / 2.4,
                  borderRadius: 15,
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.props.navigation.navigate('AroundMe');
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={around_me}
                      style={{width: width / 3.4, height: width / 3.4}}
                      resizeMode="contain"
                      resizeMethod="resize"
                    />
                  </View>
                  <Text>Around Me</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ***** best deals */}
            <View
              style={{
                marginTop: height / 70,
                backgroundColor: '#ffffff',
                height: height / 3.2,
              }}>
              <View
                style={{
                  marginStart: width / 22,
                  marginEnd: width / 22,
                  flexDirection: 'column',
                }}>
                <View style={{flexDirection: 'row', marginTop: height / 90}}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: width / 20,
                      fontWeight: 'bold',
                      color: '#bd1d53',
                    }}>
                    My Deals
                  </Text>
                  <TouchableOpacity
                    style={{position: 'absolute', right: 0}}
                    onPress={() => {
                      this.props.navigation.navigate('ListMyDeals');
                    }}>
                    <Text style={{color: '#bd1d53', fontWeight: 'bold'}}>
                      View All
                    </Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: height / 90,
                    }}>
                    {this.state.productArr.length
                      ? this.state.productArr.map((item, index) =>
                          item ? (
                            <View key={index} style={style.dealCard}>
                              <TouchableOpacity
                                onPress={() => {
                                  this.props.navigation.navigate(
                                    'MyDealsDetails',
                                    {
                                      id: item._id,
                                    },
                                  );

                                  // this.props.navigation.navigate(
                                  //   'ProductDetails',
                                  //   {
                                  //     id: item.slug,
                                  //   },
                                  // );
                                }}>
                                <Image
                                  source={{
                                    uri: CONSTANTS.SMALL_IMG + item?.coverImage,
                                  }}
                                  style={{
                                    height: height / 7,
                                    width: width / 2.3,
                                    borderRadius: 12,
                                    backgroundColor: '#D0D0D0',
                                  }}
                                />

                                <Text
                                  numberOfLines={1}
                                  style={{
                                    flexWrap: 'wrap',
                                    fontSize: width / 34,
                                    marginTop: width / 80,
                                    // justifyContent: "center",
                                    // alignSelf: "center",
                                    marginStart: width / 28,
                                  }}>
                                  {item?.title}
                                </Text>

                                <Text
                                  style={[
                                    theme.fontMedium,
                                    {
                                      fontSize: width / 32,
                                      color: '#747474',
                                      marginStart: width / 28,
                                    },
                                  ]}
                                  note
                                  numberOfLines={1}>
                                  at {item?.location}
                                </Text>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginStart: width / 28,
                                  }}>
                                  <Text
                                    style={[
                                      theme.fontMedium,
                                      {
                                        fontSize: width / 32,
                                        color: '#a73a6f',
                                        // borderColor: '#a73a6f',
                                        // borderRadius: 4,
                                        // borderWidth: 1,
                                        // padding: 4,
                                      },
                                    ]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail">
                                    {item?.categoryName}
                                  </Text>
                                </View>
                                {/* <View
                                  style={{
                                    flexDirection: 'row',
                                    marginTop: width / 80,
                                    marginStart: width / 28,
                                  }}>
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      flexWrap: 'wrap',
                                      fontSize: width / 34,
                                      color: '#bd1d53',
                                      fontWeight: 'bold',
                                    }}>
                                    {item.bestDeal == true
                                      ? 'QAR ' + item.offerPrice
                                      : 'QAR ' + item.price}
                                  </Text>
                                  {item.bestDeal == true ? (
                                    <Text
                                      style={{
                                        color: '#0c6d3f',
                                        fontSize: width / 34,
                                        fontWeight: 'bold',
                                        marginStart: width / 60,
                                      }}>
                                      {item.discountValue}% off
                                    </Text>
                                  ) : null}
                                </View>
                                {item.bestDeal == true ? (
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      flexWrap: 'wrap',
                                      fontSize: width / 34,
                                      marginStart: width / 28,
                                      textDecorationLine: 'line-through',
                                      textDecorationStyle: 'solid',
                                    }}>
                                    QAR {item.actualPrice}
                                  </Text>
                                ) : null} */}
                              </TouchableOpacity>
                            </View>
                          ) : null,
                        )
                      : null}
                  </View>
                </ScrollView>
              </View>
            </View>

            {/* gifts */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: height / 90,
              }}>
              {this.state?.gifts.map((item, index) =>
                this._renderItemGift(item),
              )}
            </View>

            {/* home menu */}

            <View style={{marginStart: width / 22, marginEnd: width / 22}}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{
                  marginTop: height / 100,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    //justifyContent: 'space-between',
                  }}>
                  <View style={style.viewRoundContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('ListMalls');
                      }}>
                      <View style={style.viewRound}>
                        <Mall_Icon height="40" width="40" />
                      </View>
                      <Text style={style.viewRoundText}>Malls</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={style.viewRoundContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('ListJobs');
                      }}>
                      <View style={style.viewRound}>
                        <Job_Icon height="40" width="40" />
                      </View>
                      <Text style={style.viewRoundText}>Jobs</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={style.viewRoundContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('ListProperty');
                      }}>
                      <View style={style.viewRound}>
                        <Properties_icon height="40" width="40" />
                      </View>
                      <Text style={style.viewRoundText}>Properties</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={style.viewRoundContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('ListVehicles');
                      }}>
                      <View style={style.viewRound}>
                        <Vehicle_icon height="40" width="40" />
                      </View>
                      <Text style={style.viewRoundText}>Vehicles</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={style.viewRoundContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('ListProducts');
                      }}>
                      <View style={style.viewRound}>
                        <Product_icon height="40" width="40" />
                      </View>
                      <Text style={style.viewRoundText}>Products</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={style.viewRoundContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('ListServices');
                      }}>
                      <View style={style.viewRound}>
                        <Services_icon height="40" width="40" />
                      </View>
                      <Text style={style.viewRoundText}>Services</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={style.viewRoundContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('ListDirectory');
                      }}>
                      <View style={style.viewRound}>
                        <Directory_icon height="40" width="40" />
                      </View>
                      <Text numberOfLines={2} style={style.viewRoundText}>
                        My Directory
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={style.viewRoundContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('ListNews');
                      }}>
                      <View style={style.viewRound}>
                        <News_icon height="40" width="40" />
                      </View>
                      <Text numberOfLines={2} style={style.viewRoundText}>
                        News & Article
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={style.viewRoundContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('ListMyDeals');
                      }}>
                      <View style={style.viewRound}>
                        <BestDealIcon height="40" width="40" />
                      </View>
                      <Text style={style.viewRoundText}>My Deals</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 100,
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  marginStart: width / 24,
                  marginEnd: width / 24,
                  backgroundColor: '#bd1d53',
                  padding: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                }}
                onPress={() => {
                  // this.setState({filterVisible: true});

                  if (this.state.isUserLoggedIn) {
                    this.props.navigation.navigate('ContactForm');
                  } else {
                    Toast.showWithGravity(
                      'Please login to send your inquiries.',
                      Toast.LONG,
                      Toast.BOTTOM,
                    );
                  }
                }}>
                <Text
                  style={{
                    fontSize: width / 24,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  What are you looking for?
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  marginStart: width / 24,
                  marginEnd: width / 24,
                  backgroundColor: '#bd1d53',
                  padding: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                }}
                onPress={() => {
                  if (this.state.isUserLoggedIn) {
                    this.setState({
                      addPostVisible: !this.state.addPostVisible,
                    });
                  } else {
                    Toast.showWithGravity(
                      'Please login to add feed.',
                      Toast.LONG,
                      Toast.BOTTOM,
                    );
                  }
                }}>
                <Text
                  style={{
                    fontSize: width / 24,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  Add Feed
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'column',
                marginTop: height / 80,
                marginStart: width / 22,
                marginEnd: width / 22,
              }}>
              {this.state.feedArr.length > 0 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: width / 20, fontWeight: 'bold'}}>
                    Latest feeds
                  </Text>

                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#bd1d53',
                      padding: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 8,
                    }}
                    onPress={() => {
                      this.setState({
                        ...this.state,
                        feedSearchVisible: true,
                      });
                    }}>
                    <Text
                      style={{
                        fontSize: width / 24,
                        fontWeight: 'bold',
                        color: 'white',
                        textAlign: 'center',
                      }}>
                      Search Feeds
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('ListFeeds');
                    }}>
                    <Text
                      style={{
                        fontSize: width / 24,
                        fontWeight: 'bold',
                        // backgroundColor: '#bd1d53',
                        color: 'black',
                        paddingLeft: 10,
                        paddingTop: 4,
                        paddingBottom: 4,
                        textAlign: 'center',
                      }}>
                      View All
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {this.state.addPostVisible ? this.renderAddFeed() : null}

              {this.state.feedArr.map(item => {
                var videoCode = this.validateYouTubeUrl(item.postContent);
                // const videoCode = '';
                return (
                  <>
                    {'adImage' in item && item?.adImage ? (
                      <Image
                        style={{
                          width: width / 1.1,
                          marginTop: height / 50,
                          height: height / 4,
                        }}
                        source={{
                          uri: CONSTANTS.IMAGE_URL_PREFIX + item?.adImage,
                        }}
                      />
                    ) : (
                      <Card
                        style={{
                          backgroundColor: '#FFFFFF',
                          //height: height / 1.8,
                          width: width / 1.1,
                          borderRadius: 2,
                          marginTop: 10,
                          // shadowOpacity: 0.5,
                          //elevation:0,
                          paddingBottom: width / 33,
                        }}>
                        <View
                          style={{
                            marginStart: width / 22,
                            marginEnd: width / 22,
                            marginTop: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            {item.userDetails.profilePic != '' ? (
                              <Image
                                source={{
                                  uri:
                                    CONSTANTS.THUMBNAIL_IMG +
                                    item.userDetails.profilePic,
                                }}
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 50 / 2,
                                }}
                              />
                            ) : (
                              <Image
                                source={require('./assets/images/placeholder-img.png')}
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 50 / 2,
                                }}
                              />
                            )}

                            <View
                              style={{
                                flexDirection: 'column',
                                marginStart: width / 30,
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                              }}>
                              <TouchableOpacity
                                onPress={() => {
                                  this.props.navigation.navigate(
                                    'UserMenuTabsOther',
                                    {
                                      initialPage: 6,
                                      userId: item?.userDetails?._id,
                                    },
                                  );
                                }}>
                                <Text style={{color: '#bd1d53'}}>
                                  {item.userDetails.name}
                                </Text>
                              </TouchableOpacity>
                              <Text
                                style={{
                                  color: '#808080',
                                  fontSize: width / 30,
                                }}>
                                {moment(item.updatedAt).format('DD MMMM YYYY')}
                              </Text>
                            </View>
                          </View>
                          <View>
                            <Menu>
                              <MenuTrigger>
                                <Text
                                  style={{
                                    marginRight: -10,
                                    paddingHorizontal: 5,
                                  }}>
                                  <Icon
                                    name="more-vertical"
                                    type="Feather"
                                    style={{
                                      fontSize: 24,
                                      color: '#868686',
                                    }}
                                  />
                                </Text>
                              </MenuTrigger>
                              <MenuOptions>
                                <MenuOption
                                  onSelect={() => {
                                    if (this.state.isUserLoggedIn) {
                                      this.blockFeed(item._id);
                                    } else {
                                      Toast.showWithGravity(
                                        'Please login to block this post.',
                                        Toast.LONG,
                                        Toast.BOTTOM,
                                      );
                                    }
                                  }}>
                                  <Text
                                    //   style={({fontSize: 30}, theme.fontRegular)}
                                    style={{
                                      paddingHorizontal: 10,
                                      paddingTop: 10,
                                      fontSize: 16,
                                    }}>
                                    Block User
                                  </Text>
                                </MenuOption>
                              </MenuOptions>
                            </Menu>
                          </View>
                        </View>
                        <View
                          style={{
                            marginStart: width / 22,
                            marginEnd: width / 22,
                          }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              flexWrap: 'wrap',
                              fontSize: width / 27,
                              marginTop: height / 80,
                              fontWeight: 'bold',
                            }}>
                            {item.postTitle}
                          </Text>
                        </View>
                        {item.postType == 1 ? (
                          <View
                            style={{
                              marginStart: width / 22,
                              marginEnd: width / 22,
                              marginTop: 10,
                              marginBottom: 10,
                            }}>
                            <SeeMore
                              numberOfLines={3}
                              seeMoreText="View More"
                              seeLessText="View Less"
                              linkColor="#bd135d"
                              style={{
                                fontSize: width / 30,
                                fontWeight: '300',
                                textAlign: 'justify',
                                color: '#262626',
                              }}>
                              {item.postContent}
                            </SeeMore>
                          </View>
                        ) : item.postType == 2 ? (
                          <View>
                            {item.postContent != '' ? (
                              <View
                                style={{
                                  marginStart: width / 22,
                                  marginEnd: width / 22,
                                  marginTop: 10,
                                  marginBottom: 10,
                                }}>
                                <SeeMore
                                  numberOfLines={3}
                                  seeMoreText="View More"
                                  seeLessText="View Less"
                                  linkColor="#bd135d"
                                  style={{
                                    fontSize: width / 30,
                                    fontWeight: '300',
                                    textAlign: 'justify',
                                    color: '#262626',
                                  }}>
                                  {item.postContent}
                                </SeeMore>
                              </View>
                            ) : null}
                            {'attachment' in item && item.attachment ? (
                              <TouchableOpacity
                                onPress={() => {
                                  this.viewImage(
                                    CONSTANTS.MEDIUM_IMG + item.attachment,
                                  );
                                }}>
                                <Image
                                  style={{
                                    width: width / 1.1,
                                    marginTop: height / 50,
                                    height: height / 4,
                                  }}
                                  source={{
                                    uri: CONSTANTS.MEDIUM_IMG + item.attachment,
                                  }}
                                />
                              </TouchableOpacity>
                            ) : null}
                          </View>
                        ) : item.postType == 3 ? (
                          'attachment' in item && item.attachment != '' ? (
                            <View>
                              <View
                                style={{
                                  backgroundColor: 'grey',
                                  marginVertical: 10,
                                }}>
                                <Image
                                  style={{
                                    width: width / 1.1,
                                    height: height / 4.1,
                                  }}
                                  source={{
                                    uri:
                                      CONSTANTS.MEDIUM_IMG +
                                      item.videoPlaceholder,
                                  }}
                                />
                                <TouchableOpacity
                                  style={{
                                    height: height / 4.1,
                                    position: 'absolute',
                                    alignSelf: 'center',
                                    zIndex: 1000,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                  activeOpacity={1}
                                  onPress={() => {
                                    this.playVideo(item.attachment);
                                  }}>
                                  <Text
                                    style={{
                                      color: '#fff',
                                    }}>
                                    <Ionicons
                                      name="play-circle-outline"
                                      type="Ionicons"
                                      style={{
                                        color: '#fff',
                                        fontSize: 70,
                                      }}
                                    />
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          ) : (
                            <View>
                              {videoCode != '' ? (
                                <View
                                  style={{
                                    backgroundColor: 'grey',
                                    marginVertical: 10,
                                    marginTop: height / 50,
                                    height: height / 4.1,
                                  }}>
                                  <Thumbnail
                                    imageWidth={width / 1.1}
                                    imageHeight={height / 4.1}
                                    showPlayIcon={false}
                                    url={item.postContent}
                                    children={
                                      <Ionicons
                                        name="play-circle-outline"
                                        type="Ionicons"
                                        style={{
                                          color: '#fff',
                                          fontSize: 70,
                                        }}
                                      />
                                    }
                                  />
                                </View>
                              ) : (
                                <View
                                  style={{
                                    backgroundColor: 'grey',
                                    marginVertical: 10,
                                  }}>
                                  <Image
                                    style={{
                                      width: width / 1.1,
                                      height: height / 4.1,
                                    }}
                                    source={{
                                      uri:
                                        CONSTANTS.MEDIUM_IMG +
                                        item.videoPlaceholder,
                                    }}
                                  />
                                  <TouchableOpacity
                                    style={{
                                      height: height / 4.1,
                                      position: 'absolute',
                                      alignSelf: 'center',
                                      zIndex: 1000,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}
                                    activeOpacity={1}
                                    onPress={() => {
                                      this.playVideo(item.postContent);
                                    }}>
                                    <Text
                                      style={{
                                        color: '#fff',
                                      }}>
                                      <Ionicons
                                        name="play-circle-outline"
                                        type="Ionicons"
                                        style={{
                                          color: '#fff',
                                          fontSize: 70,
                                        }}
                                      />
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              )}
                            </View>
                          )
                        ) : null}
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: height / 80,
                          }}>
                          <TouchableOpacity
                            style={{
                              width: width / 8,
                              height: height / 30,
                              backgroundColor: '#4267B2',
                              justifyContent: 'center',
                              alignItems: 'center',
                              alignSelf: 'center',
                              borderColor: '#BEBEBE',
                              borderWidth: 1,
                            }}
                            onPress={() => {
                              if (this.state.isUserLoggedIn) {
                                this.updateLike(item._id);
                              } else {
                                Toast.showWithGravity(
                                  'Please login to like this post.',
                                  Toast.LONG,
                                  Toast.BOTTOM,
                                );
                              }
                            }}>
                            <Text
                              style={{
                                color: '#FFFFFF',
                                fontSize: width / 30,
                                fontWeight: 'bold',
                              }}>
                              Like
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              width: width / 8,
                              height: height / 30,
                              borderColor: '#BEBEBE',
                              justifyContent: 'center',
                              borderWidth: 1,
                              alignItems: 'center',
                              marginStart: width / 24,
                            }}>
                            <Text
                              style={{color: 'black', fontSize: width / 30}}>
                              {item.likeCount >= 1000
                                ? item.likeCount / 1000 + 'k'
                                : item.likeCount}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={{
                              width: width / 8,
                              height: height / 30,
                              backgroundColor: '#4267B2',
                              justifyContent: 'center',
                              alignItems: 'center',
                              alignSelf: 'center',
                              borderColor: '#BEBEBE',
                              borderWidth: 1,
                              marginStart: width / 24,
                            }}
                            onPress={() => {
                              this.onShare(item?.slug);
                            }}>
                            <Text
                              style={{
                                color: '#FFFFFF',
                                fontSize: width / 30,
                                fontWeight: 'bold',
                              }}>
                              Share
                            </Text>
                          </TouchableOpacity>
                          {item?.whatsappNumber ? (
                            <TouchableOpacity
                              style={{
                                marginStart: width / 24,
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                              onPress={() => {
                                Linking.openURL(
                                  'whatsapp://send?text=&phone=' +
                                    item?.whatsappNumber,
                                );
                              }}>
                              <FontAwesomeIcon
                                icon={faWhatsapp}
                                color={'#bd1d53'}
                                size={24}
                              />

                              <Text
                                style={{
                                  color: '#bd1d53',
                                  fontSize: width / 30,
                                  fontWeight: 'bold',
                                  marginStart: 2,
                                }}>
                                Chat
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      </Card>
                    )}
                  </>
                );
              })}
            </View>
          </Content>
        ) : null}
        <VideoViewer
          title="Video"
          visible={this.state.videoViewer}
          url={this.state.videoViewerUrl}
          onClose={() => {
            this.setState({
              videoViewer: false,
            });
          }}
        />
        <ImageView
          images={this.state.imageViewerImages}
          imageIndex={0}
          visible={this.state.isImageViewerVisible}
          onRequestClose={() => {
            this.setState({isImageViewerVisible: false});
          }}
        />

        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            width: 50,
            position: 'absolute',
            bottom: 30,
            right: 20,
            height: 50,
            backgroundColor: AppColors.primaryColor,
            borderRadius: 100,
          }}
          onPress={() => {
            this.component._root.scrollToPosition(0, 0);
          }}>
          <FontAwesomeIcon size={20} icon={faArrowUp} color={'#FFFFFF'} />
        </TouchableOpacity>
      </Container>
    );
        }
}

const style = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  iconStyle: {
    width: 10,
    height: 10,
  },
  dropContainer: {
    backgroundColor: 'white',
    padding: 8,
    width: '100%',
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 10,
    height: 10,
  },
  inputSearchStyle: {
    color: 'black',
    height: 40,
    fontSize: 16,
  },
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
    backgroundColor: '#ededed',
    height: height / 4.5,
    width: width / 2.3,
    borderRadius: 12,
    marginEnd: width / 80,
    marginStart: width / 80,
  },
  cardWrapparent: {
    paddingBottom: 0,
    alignItems: 'center',
  },
  cardImage: {
    height: height / 7,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    flex: 1,
    overflow: 'hidden',
    resizeMode: 'cover',
    alignSelf: 'center',
    width: itemWidth,
    borderRadius: entryBorderRadius,
  },

  cardImageNew: {
    height: 200,
  },
  cardWrap: {
    borderRadius: entryBorderRadius,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    width: itemWidth / 1.04,
    marginTop: height / 60,
    marginHorizontal: width / 30,
  },
  cardBorder: {
    borderRadius: entryBorderRadius,
    flex: 1,

    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  errorStyle: {
    color: 'red',
    fontSize: width / 30,
    width: width / 1.1,
    marginBottom: height / 80,
    marginTop: 5,
    textAlign: 'left',
    marginLeft: 8,
  },
  gifbox: {
    width: Dimensions.get('window').width * 0.2,
    height: Dimensions.get('window').width * 0.2,
    marginVertical: 20,
    backgroundColor: 'rgba(0,255,0,1)',
    margin: 15,
    borderRadius: 30,
    overflow: 'hidden',
  },

  giftCardImage: {
    height: width / 5.6,
    width: width / 6,
    justifyContent: 'center',
    borderRadius: 25,
  },
  giftCardWrap: {
    backgroundColor: 'white',
    height: width / 4.6,
    width: width / 4.8,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginStart: width / 50,
    marginEnd: width / 50,
    marginBottom: width / 90,
  },
});
