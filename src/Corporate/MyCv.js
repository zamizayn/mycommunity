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
  StatusBar,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  Container,
  Content,
  Header,
  Left,
  Body,
  Right,
  Button,
  Badge,
  Title,
  List,
  ListItem,
  Thumbnail,
} from 'native-base';
import Toast from 'react-native-simple-toast';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import RNFetchBlob from 'rn-fetch-blob';
import {faFile} from '@fortawesome/free-solid-svg-icons';
import BackBtn_white from '../assets/svg/BackBtn_white.svg';
import theme from '../config/styles.js';
import SearchBlackIcon from '../assets/svg/SearchBlackIcon.svg';
import Notification_icon_white from '../assets/svg/Notification_icon_white.svg';
import Filter_icon from '../assets/svg/FilterIcon.svg';
import FilterResetSvg from '../assets/svg/FilterReset.svg';
import RoomSvg from '../assets/svg/Room_status.svg';
import ChairSvg from '../assets/svg/Furniture_status.svg';
import Industry_icon from '../assets/svg/Industry_icon.svg';
import {left} from 'styled-system';
import Loader from '../components/Loader';
import {ApiHelper} from '../helpers/ApiHelper';
import {API} from '../config/api';
import {CONSTANTS} from '../config/constants';
import {AppColors} from '../Themes';
import Icon from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-material-dropdown-v2-fixed';
import DropDown_icon from '../assets/svg/DropDown_icon.svg';
import FloatingLabelInput from '../components/FloatingLabelInput';
import moment from 'moment';
import FloatingLabelBorderInput from '../components/FloatingLabelBorderInput';
var {height, width} = Dimensions.get('window');
export default class MyCv extends Component {
  constructor() {
    super();
    this.state = {
      properties: [],
      loader: false,
      totalCount: 0,
      pageNo: 1,
      limit: 10,
      loading: false,
      searchKey: '',
      filterSearchKey: '',
      notifyRequired: false,
      filterVisible: false,
      paginationLoading: false,
      filterData: false,
    };
  }

  closeFilterModal(save) {
    if (save) {
      this.setState(
        {
          searchKey: this.state.filterSearchKey,
          propertyCategory: this.state.filterCategory,
          filterVisible: false,
          pageNo: 1,
          loader: true,
          filterData: true,
        },
        () => {
          this.getPromotions();
        },
      );
    } else {
      this.setState({
        filterVisible: false,
      });
    }
  }

  componentDidMount() {
    this.setState({loader: true});
    this.getPromotions();
  }

  async getPromotions() {
    let url = `?pageNo=${this.state.pageNo}&limit=${this.state.limit}`;
    if (this.state.searchKey !== '') {
      url = url + `&searchKey=${this.state.searchKey}`;
    }

    console.log('Search Url', url);
    await ApiHelper.get(API.cvList)
      .then(res => {
        if ('data' in res.data && res.data.data) {
          var dataLen = res.data.data;
          console.log('Properties', res.data);
          this.setState({
            properties:
              this.state.pageNo == 1
                ? res.data.data
                : [...this.state.properties, ...res.data.data],
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

  async updateBlinkStatus(id, status) {
    let formData = {
      id: id,
      status: status ? 1 : 0,
    };

    this.setState({
      loader: true,
    });
    await ApiHelper.patch(
      API.baseUrl + 'promotions/' + id + '/blinking/status',
      formData,
    )
      .then(res => {
        this.setState({
          loader: false,
        });
        if (res) {
          this.setState(
            {
              pageNo: 1,
              loading: true,
              paginationLoading: true,
            },
            () => this.getPromotions(),
          );
          Toast.showWithGravity(res.data.message, Toast.LONG, Toast.BOTTOM);
        }
      })
      .catch(err => {
        this.setState({
          loader: false,
        });
        console.log('blink status Error ', err.response);
      });
  }

  handleEnd = () => {
    // this.state.totalCount > 0
    //   ? this.setState(
    //       {
    //         pageNo: this.state.pageNo + 1,
    //         loading: true,
    //         paginationLoading: true,
    //       },
    //       () => this.getPromotions(),
    //     )
    //   : null;
  };

  resetFilter() {
    this.setState(
      {
        searchKey: '',
        filterSearchKey: '',
        loader: true,
        pageNo: 1,
        filterData: false,
      },
      () => this.getPromotions(),
    );
  }

  checkPermission = async fileUrl => {
    // Function to check the platform
    // If Platform is Android then check for permissions.

    if (Platform.OS === 'ios') {
      this.downloadFile(fileUrl);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          this.downloadFile(fileUrl);
          console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log('++++' + err);
      }
    }
  };

  downloadFile = fileUrl => {
    // Get today's date to add the time suffix in filename
    let date = new Date();

    // File URL which we want to download
    let FILE_URL = CONSTANTS.FILE_DOWNLOAD_BASEURL + fileUrl;
    // Function to get extention of the file url
    let file_ext = this.getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    this.setState({loader: true});

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const {config, fs} = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        console.log('res -> ', JSON.stringify(res));

        this.setState({loader: false});
        alert('File Downloaded Successfully.');
      });
  };

  getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

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
            My CV
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
          {/* <View
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
                  paddingStart: width / 10,
                  paddingEnd: width / 10,
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
          </View> */}
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
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={this.state.properties}
                keyExtractor={(x, i) => i}
                onEndReached={() => this.handleEnd()}
                style={{
                  marginTop: 5,
                  paddingBottom: 30,
                }}
                onEndReachedThreshold={0.5}
                renderItem={({item}) => (
                  <ListItem
                    thumbnail
                    noBorder
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 8,
                      borderColor: '#f0eced',
                      marginStart: width / 20,
                      marginEnd: width / 20,
                      marginVertical: 5,
                    }}
                    // onPress={() => {
                    // }}
                  >
                    <Body style={{}}>
                      {/* {'ads' in item && item?.ads?.length > 0 ? (
                        <Image
                          style={{
                            width: 120,
                            marginTop: 2,
                            height: 90,

                            resizeMode: 'stretch',
                          }}
                          source={{
                            uri: CONSTANTS.IMAGE_URL_PREFIX + item?.ads[0]?.url,
                          }}
                        />
                      ) : null} */}
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={[
                            theme.fontMedium,
                            {fontSize: width / 27, color: '#000'},
                          ]}
                          numberOfLines={1}>
                          {'Job Name: '}
                          {item?.jobDetails?.name}
                        </Text>
                      </View>
                      <Text
                        style={[
                          theme.fontMedium,
                          {fontSize: width / 30, color: '#747474'},
                        ]}
                        note
                        numberOfLines={1}>
                        {'Id: '}
                        {item?.jobDetails?.jobId}
                      </Text>
                      <Text
                        style={[
                          theme.fontMedium,
                          {fontSize: width / 30, color: '#747474'},
                        ]}
                        note
                        numberOfLines={1}>
                        {'Position looking for: '}
                        {item?.positionLookingFor}
                      </Text>
                      <Text
                        style={[
                          theme.fontMedium,
                          {fontSize: width / 30, color: '#747474'},
                        ]}
                        note
                        numberOfLines={1}>
                        {'Date: '}
                        {moment(item?.createdAt).format('DD-MM-YYYY')}
                      </Text>

                      <TouchableOpacity
                        onPress={() => {
                          this.checkPermission(item?.cvFile);
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 10,
                          }}>
                          <Text
                            style={[
                              theme.fontMedium,
                              {
                                fontSize: width / 30,
                                color: '#747474',
                              },
                            ]}
                            note
                            numberOfLines={1}>
                            {'CV file: '}
                          </Text>

                          <FontAwesomeIcon icon={faFile} color={'#bd1d53'} />
                        </View>
                      </TouchableOpacity>

                      {/* <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 4,
                        }}>
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#bd1d53',
                            paddingVertical: 10,
                            paddingHorizontal: 25,
                            borderRadius: 25,
                          }}
                          activeOpacity={0.8}
                          onPress={() => {
                            this.updateBlinkStatus(
                              item._id,
                              !item.isBlinkingEnabled,
                            );
                          }}>
                          <Text style={[theme.fontRegular, {color: '#fff'}]}>
                            {item.isBlinkingEnabled ? 'Disable' : 'Enable'}
                          </Text>
                        </TouchableOpacity>
                      </View> */}
                    </Body>
                  </ListItem>
                )}
              />
              {this.state.paginationLoading &&
              this.state.properties.length > 0 ? (
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
      </Container>
    );
  }
}
