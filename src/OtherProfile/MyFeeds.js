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
} from 'react-native';
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
import BackBtn_white from '../assets/svg/BackBtn_white.svg';
import theme from '../config/styles.js';
import Loader from '../components/Loader';
import {ApiHelper} from '../helpers/ApiHelper';
import {API} from '../config/api';
import {CONSTANTS} from '../config/constants';
import {AppColors} from '../Themes';
import moment from 'moment';
import FilterSvg from '../assets/svg/Filter_icon_white.svg';
import Filter_icon from '../assets/svg/FilterIcon.svg';
import FilterResetSvg from '../assets/svg/FilterReset.svg';
import AddSvg from '../assets/svg/Add_icon.svg';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import VideoViewer from '../components/MediaView/VideoViewer';
import SeeMore from 'react-native-see-more-inline';
import Toast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FloatingLabelInput from '../components/FloatingLabelInput';
import {Dropdown} from 'react-native-material-dropdown-v2-fixed';
// import YoutubePlayer from 'react-native-youtube-iframe';
var {height, width} = Dimensions.get('window');
import {Thumbnail} from 'react-native-thumbnail-video';
export default class MyFeeds extends Component {
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
      feeds: [],
      loader: false,
      totalCount: 0,
      pageNo: 1,
      limit: 10,
      videoViewer: false,
      videoViewerUrl: '',
      feedType: '',
      filterSearchKey: '',
      filterPostType: '',
      filterVisible: false,
      youTubeVideoViewer: false,
      youTubeVideoCode: '',
      playing: false,
    };
  }
  componentDidMount() {
    console.log('feeds focus1');
    this.getMyFeeds();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState(
        {
          pageNo: 1,
        },
        () => {
          console.log('feeds focus');
          this.setState({loader: true});
          this.getMyFeeds();
        },
      );
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  async getMyFeeds() {
    // let url = `?pageNo=${this.state.pageNo}&limit=${this.state.limit}&type=${this.state.feedType}`;
    await ApiHelper.get(API.feedsUsers + this.props?.userId)
      .then(res => {
        if ('data' in res.data && res.data.data) {
          var dataLen = res.data.data;
          console.log('my feeds', dataLen);
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
        },
        () => {
          this.getMyFeeds();
        },
      );
    } else {
      this.setState({
        filterVisible: false,
      });
    }
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
      },
      () => this.getMyFeeds(),
    );
  }

  handleEnd = () => {
    // this.state.totalCount > 0
    //   ? this.setState(
    //       {
    //         pageNo: this.state.pageNo + 1,
    //         loading: true,
    //         paginationLoading: true,
    //       },
    //       () => this.getMyFeeds(),
    //     )
    //   : null;
  };

  async deleteFeed(id) {
    this.setState({
      loader: true,
    });
    const params = new FormData();
    params.append('id', id);
    await ApiHelper.delete(API.userFeeds + '/' + id, params)
      .then(res => {
        this.setState(
          {
            pageNo: 1,
          },
          () => this.getMyFeeds(),
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
        <View>
          <Loader visibility={this.state.loader} />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#F0ECED',
          }}>
          <View
            style={{
              marginBottom: 12,
            }}>
            {/* <View
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
            </View> */}
            <View>
              <FlatList
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
                              source={require('../assets/images/placeholder-img.png')}
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
                            <Text style={{color: '#bd1d53'}}>
                              {item.userDetails.name}
                            </Text>
                            <Text
                              style={{color: '#808080', fontSize: width / 30}}>
                              {moment(item.updatedAt).format('DD MMMM YYYY')}
                            </Text>
                          </View>
                        </View>
                        <View>
                          {/* <Menu>
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
                                  this.props.navigation.navigate('AddMyFeeds', {
                                    id: item._id,
                                  });
                                }}>
                                <Text
                                  style={({fontSize: 30}, theme.fontRegular)}
                                  style={{
                                    paddingHorizontal: 10,
                                    paddingTop: 10,
                                    fontSize: 16,
                                  }}>
                                  Edit
                                </Text>
                              </MenuOption>
                              <MenuOption
                                onSelect={() => {
                                  this.deleteFeed(item._id);
                                }}>
                                <Text
                                  style={({fontSize: 30}, theme.fontRegular)}
                                  style={{
                                    paddingHorizontal: 10,
                                    paddingTop: 10,
                                    fontSize: 16,
                                  }}>
                                  Delete
                                </Text>
                              </MenuOption>
                            </MenuOptions>
                          </Menu> */}
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
                            <Image
                              style={{
                                width: width / 1.1,
                                height: height / 4,
                              }}
                              source={{
                                uri: CONSTANTS.MEDIUM_IMG + item.attachment,
                              }}
                            />
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
                                    marginTop: height / 50,
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
        {/* <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            width: 70,
            position: 'absolute',
            bottom: 30,
            right: 20,
            height: 70,
            backgroundColor: AppColors.primaryColor,
            borderRadius: 100,
          }}
          onPress={() => {
            this.props.navigation.navigate('AddMyFeeds');
          }}>
          <AddSvg width={22} height={22} />
        </TouchableOpacity> */}
      </Container>
    );
  }
}
