import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Pressable,
  Modal,
  Image,
  ScrollView,
  Share,
  Linking,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Title,
  Card,
  CardItem,
  Icon,
} from 'native-base';
import BackBtn_white from './assets/svg/BackBtn_white.svg';
import theme from './config/styles.js';
import Loader from './components/Loader';
import {ApiHelper} from './helpers/ApiHelper';
import {API} from './config/api';
import {CONSTANTS} from './config/constants';
import {AppColors} from './Themes';
import moment from 'moment';
import FilterSvg from './assets/svg/Filter_icon_white.svg';
import Filter_icon from './assets/svg/FilterIcon.svg';
import FilterResetSvg from './assets/svg/FilterReset.svg';
import AddSvg from './assets/svg/Add_icon.svg';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import AsyncStorageHelper from './helpers/AsyncStorageHelper';
import VideoViewer from './components/MediaView/VideoViewer';
import SeeMore from 'react-native-see-more-inline';
import Toast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FloatingLabelInput from './components/FloatingLabelInput';
import DropDown from './components/DropDown';
// import YoutubePlayer from 'react-native-youtube-iframe';
var {height, width} = Dimensions.get('window');
import {Thumbnail} from 'react-native-thumbnail-video';
import ImageView from 'react-native-image-viewing';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faImage} from '@fortawesome/free-solid-svg-icons';
import {faWhatsapp} from '@fortawesome/free-brands-svg-icons';
import {Dropdown} from 'react-native-element-dropdown';

export default class ListFeeds extends Component {
  postTypes = [
    {
      label: 'Text Post',
      value: '1',
    },
    {
      label: 'Image Post',
      value: '2',
    },
    {
      label: 'Video Post',
      value: '3',
    },
  ];
  constructor() {
    super();
    this.state = {
      isUserLoggedIn: false,
      feeds: [],
      loader: false,
      totalCount: 0,
      pageNo: 1,
      limit: 10,
      videoViewer: false,
      videoViewerUrl: '',
      feedType: '',
      searchKey: '',
      filterSearchKey: '',
      filterPostType: '',
      filterVisible: false,
      youTubeVideoViewer: false,
      youTubeVideoCode: '',
      playing: false,
      filterData: false,
      imageViewerImages: [],
      isImageViewerVisible: false,
      refreshing: false,
      value: null,
      isFocus: false,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      const searchKey =
        'params' in this.props.route && this.props.route.params
          ? this.props.route.params.searchKey
          : '';
      this.setState(
        {
          pageNo: 1,
          filterSearchKey: searchKey,
          searchKey: searchKey,
        },
        () => {
          this.checkUserLoggedIn();
          this.setState({loader: true});
          this.getUserFeeds();
        },
      );
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  onRefresh = () => {
    this.setState(
      {refreshing: true, feeds: [], totalCount: 0, pageNo: 1},
      () => {
        this.getUserFeeds();
      },
    );
  };

  async checkUserLoggedIn() {
    var userData = null;
    try {
      userData = await AsyncStorageHelper.getItem('USERDATA');
      console.log('userData', userData);
      this.setState({isUserLoggedIn: userData ? true : false});
    } catch (e) {
      this.setState({isUserLoggedIn: false});
    }
  }

  async getUserFeeds() {
    let url = `?pageNo=${this.state.pageNo}&limit=${this.state.limit}&searchKey=${this.state.searchKey}&type=${this.state.feedType}`;
    await ApiHelper.get(API.userFeeds + url)
      .then(res => {
        if ('data' in res.data && res.data.data) {
          var dataLen = res.data.data;
          // console.log('my feeds', res.data);
          this.setState({
            feeds:
              this.state.pageNo == 1
                ? res.data.data
                : [...this.state.feeds, ...res.data.data],
            totalCount:
              this.state.pageNo == 1
                ? res.data.totalCount
                : dataLen.length > 0
                ? res.data.totalCount
                : this.state.totalCount,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({
      loader: false,
      paginationLoading: false,
      refreshing: false,
    });
  }
  async updateLike(id) {
    this.setState({
      loader: true,
    });
    let formData = {
      id: id,
    };
    await ApiHelper.patch(API.likeUserFeed + id, formData)
      .then(res => {
        this.setState({
          loader: false,
        });
        Toast.showWithGravity(res.data.message, Toast.LONG, Toast.BOTTOM);
        this.getUserFeeds();
      })
      .catch(err => {
        this.setState({
          loader: false,
        });
        console.log(err);
      });
  }
  closeFilterModal(save) {
    if (save) {
      this.setState(
        {
          searchKey: this.state.filterSearchKey,
          feedType: this.state.filterPostType,
          pageNo: 1,
          filterVisible: false,
          filterData: true,
        },
        () => {
          this.getUserFeeds();
        },
      );
    } else {
      this.setState({
        filterVisible: false,
      });
    }
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
          () => this.getUserFeeds(),
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

  resetFilter() {
    this.setState(
      {
        searchKey: '',
        filterSearchKey: '',
        feedType: '',
        filterPostType: '',
        loader: true,
        pageNo: 1,
        filterData: false,
      },
      () => this.getUserFeeds(),
    );
  }

  handleEnd = () => {
    this.state.totalCount > 0
      ? this.setState(
          {
            pageNo: this.state.pageNo + 1,
            loading: true,
            paginationLoading: true,
          },
          () => this.getUserFeeds(),
        )
      : null;
  };

  playVideo(url) {
    this.setState({
      videoViewer: true,
      videoViewerUrl: CONSTANTS.ORGINAL_IMG + url,
    });
  }

  validateYouTubeUrl(url) {
    if (url != undefined || url != '') {
      var regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match && match[2].length == 11) {
        return match[2];
      } else {
        return '';
      }
    } else {
      return '';
    }
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
      // alert(error.message);
    }
  };

  viewImage(url) {
    var urls = [{uri: url}];

    this.setState({
      imageViewerImages: urls,
      isImageViewerVisible: true,
    });
  }

  render() {
    let pickerStyle = {
      marginTop: height / 7.8,
      marginLeft: width / 20,
      borderRadius: 8,
      paddingLeft: 8,
      width: width / 1.17,
    };
    return (
      <Container>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: AppColors.primaryColor,
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
            User Feeds
          </Text>
        </View>
        <View>
          <Loader visibility={this.state.loader} />
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
                    Filter Search
                  </Title>
                </Body>
                <Right>
                  <Button
                    transparent
                    onPress={() => {
                      this.closeFilterModal(true);
                    }}>
                    <Ionicons
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
                    Post Type
                  </Text>
                </View>
                <View style={{marginTop: height / 80}}>
                  {/* <DropDown
                    placeholder="Choose post type"
                    placeholderTextColor="#808080"
                    data={this.postTypes}
                    value={this.state.filterPostType}
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
                      this.setState(
                        {
                          filterPostType: value,
                        },
                        () => {
                          // console.log('usertype>', this.state.countryId);
                        },
                      );
                    }}
                  /> */}
                  <View style={styles.dropContainer}>
                    <Dropdown
                      style={[
                        styles.dropdown,
                        this.state.isFocus && {borderColor: 'blue'},
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={this.postTypes}
                      value={this.state.filterPostType}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!this.state.isFocus ? 'Choose post type' : '...'}
                      searchPlaceholder="Search..."
                      onFocus={() => {
                        this.setState({
                          isFocus: true,
                        });
                      }}
                      onBlur={() => {
                        this.setState({
                          isFocus: false,
                        });
                      }}
                      onChange={item => {
                       
                        this.setState({
                          isFocus: false,
                        });
                        this.setState(
                          {
                            filterPostType: item.value,
                          },
                          () => {},
                        );
                      }}
                      renderLeftIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={this.state.isFocus ? 'blue' : 'black'}
                          name="Safety"
                          size={20}
                        />
                      )}
                    />
                  </View>
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
                        this.closeFilterModal(true);
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
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Pressable
              onPress={() =>
                this.setState({
                  filterVisible: true,
                })
              }>
              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  width: null,
                  paddingStart: width / 8,
                  paddingEnd: width / 8,
                  paddingTop: height / 50,
                  paddingBottom: height / 50,
                  flexDirection: 'row',
                }}>
                <View style={{marginRight: width / 50}}>
                  <Filter_icon width="18" height="18" />
                </View>
                <Text style={{color: '#BC2055'}}>Filter</Text>
              </View>
            </Pressable>
            <View
              style={{
                marginTop: height / 60,
                marginBottom: height / 60,
                borderRightWidth: 1,
                borderColor: '#F0ECED',
              }}
            />
            {this.state.filterData ? (
              <>
                <Pressable onPress={() => this.resetFilter()}>
                  <View
                    style={{
                      backgroundColor: '#FFFFFF',
                      width: null,
                      paddingStart: width / 10,
                      paddingEnd: width / 10,
                      paddingTop: height / 50,
                      paddingBottom: height / 50,
                      flexDirection: 'row',
                    }}>
                    <View style={{marginRight: width / 50}}>
                      <FilterResetSvg width="18" height="18" />
                    </View>
                    <Text style={{color: '#BC2055'}}>Reset</Text>
                  </View>
                </Pressable>
                <View
                  style={{
                    marginTop: height / 60,
                    marginBottom: height / 60,
                    borderRightWidth: 1,
                    borderColor: '#F0ECED',
                  }}
                />
              </>
            ) : null}
          </View>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#F0ECED',
          }}>
          <View
            style={{
              marginBottom: height / 7,
            }}>
            <View
              style={{
                paddingVertical: height / 60,
                paddingStart: width / 15,
                paddingEnd: width / 15,
              }}>
              <Text
                style={[
                  theme.fontMedium,
                  {fontSize: width / 23, color: '#000'},
                ]}>
                {this.state.totalCount ? this.state.totalCount : 0} Results
                Found
              </Text>
            </View>
            <View>
              <Loader visibility={this.state.loader} />
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />
                }
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={this.state.feeds}
                keyExtractor={(x, i) => i}
                onEndReached={() => this.handleEnd()}
                style={{
                  paddingBottom: 30,
                }}
                contentContainerStyle={{
                  alignItems: 'center',
                }}
                onEndReachedThreshold={0.5}
                renderItem={({item}) => {
                  const videoCode = this.validateYouTubeUrl(item.postContent);
                  // const videoCode = '';
                  return (
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
                              style={{color: '#808080', fontSize: width / 30}}>
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
                                  width: width / 1.1,
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
                          <Text style={{color: 'black', fontSize: width / 30}}>
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
                  );
                }}
              />
              {this.state.paginationLoading && this.state.feeds.length > 0 ? (
                <View
                  style={{
                    position: 'absolute',
                    paddingVertical: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: width,
                    bottom: 1,
                  }}>
                  <ActivityIndicator
                    size="large"
                    animating
                    color={AppColors.primaryColor}
                  />
                </View>
              ) : null}
            </View>
          </View>
        </View>
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
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
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
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },
  contentContainer: {
    padding: 12,
  },
  dropContainer: {
    backgroundColor: 'white',
    padding: 16,
    width: '100%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  result: {
    borderWidth: 1,
    borderColor: '#666',
    width: '100%',
    padding: 10,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    // flex: 1,
    top: height / 12 + height / 18 + 12 + 60,
  },
  containerOuter: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  giftCardImage: {
    height: width / 6,
    width: width / 6,
    justifyContent: 'center',
  },
});
