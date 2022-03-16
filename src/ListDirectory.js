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
  StyleSheet,
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
import BackBtn_white from './assets/svg/BackBtn_white.svg';
import theme from './config/styles.js';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SearchBlackIcon from './assets/svg/SearchBlackIcon.svg';
import Notification_icon_white from './assets/svg/Notification_icon_white.svg';
import Filter_icon from './assets/svg/FilterIcon.svg';
import Phone_icon from './assets/svg/phone.svg';
import Email_icon from './assets/svg/Email_icon.svg';
import Industry_icon from './assets/svg/Industry_icon.svg';
import {left} from 'styled-system';
import Loader from './components/Loader';
import {ApiHelper} from './helpers/ApiHelper';
import {API} from './config/api';
import {CONSTANTS} from './config/constants';
import {AppColors} from './Themes';
import Icon from '../node_modules/react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import DropDown from './components/DropDown';
import DropDown_icon from './assets/svg/DropDown_icon.svg';
import FloatingLabelInput from './components/FloatingLabelInput';
import FilterResetSvg from './assets/svg/FilterReset.svg';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faShare} from '@fortawesome/free-solid-svg-icons';
import shareLink from './helpers/SocialShare';

var {height, width} = Dimensions.get('window');
const industryTypes = {1: 'Product', 2: 'Service', 3: 'Product & Service'};
export default class ListDirectory extends Component {
  constructor() {
    super();
    this.state = {
      businessDirectory: [],
      loader: false,
      totalCount: 0,
      pageNo: 1,
      limit: 10,
      searchKey: '',
      categoryId: '',
      locationCode: '',
      loading: false,
      modalVisible: false,
      businessCategoryList: [],
      locations: [],
      filterData: false,
      filterLocationCode: '',
      filterCategoryId: '',
      filterVisible: false,
      value: null,
      isFocus: false,
    };
  }
  async getLocationsData() {
    await ApiHelper.get(API.locations).then(res => {
      var dataLen = res.data.data;
      var len = dataLen.length;
      var locationList = [];
      for (let i = 0; i < len; i++) {
        let row = dataLen[i];
        let obj = {
          label: row.name,
          value: row.code + '-' + row.name,
        };
        locationList.push(obj);
      }
      this.setState({locations: locationList});
    });
  }
  async fetchCategoryList() {
    await ApiHelper.get(API.businessCategory).then(res => {
      this.arrayholder = res.data.data;
      var dataLen = res.data.data;
      var len = dataLen.length;
      var categoryList = [];
      for (let i = 0; i < len; i++) {
        let row = dataLen[i];
        let obj = {label: row.categoryName, value: row.categoryId};
        categoryList.push(obj);
      }
      this.setState({businessCategoryList: categoryList});
    });
  }

  componentDidMount() {
    this.setState({loader: true});
    this.getMydirectoryData();
    this.getLocationsData();
    this.fetchCategoryList();
  }
  async getMydirectoryData() {
    this.setState({
      loader: true,
    });

    let url = `?pageNo=${this.state.pageNo}&limit=${this.state.limit}`;
    if (this.state.searchKey !== '') {
      url = url + `&searchKey=${this.state.searchKey}`;
    }
    if (this.state.categoryId !== '') {
      url = url + `&categoryId=${this.state.categoryId}`;
    }
    if (this.state.locationCode !== '') {
      url = url + `&locationCode=${this.state.locationCode}`;
    }
    await ApiHelper.get(API.businessDirectory + url)
      .then(res => {
        // console.log('mydirectory - ',res)
        if ('data' in res.data && res.data.data) {
          var dataLen = res.data.data;
          this.setState(
            {
              businessDirectory:
                this.state.pageNo == 1
                  ? dataLen
                  : [...this.state.businessDirectory, ...dataLen],
              totalCount:
                this.state.pageNo == 1
                  ? res.data.totalCount
                  : dataLen.length > 0
                  ? res.data.totalCount
                  : this.state.totalCount,
              loader: false,
            },
            () => {
              // console.log('user arr', this.state.userdata);
            },
          );
        }
      })
      .catch(err => {
        this.setState({
          loader: false,
        });
        console.log(err);
      });
  }
  handleEnd = () => {
    this.state.totalCount > 0
      ? this.setState(
          {
            pageNo: this.state.pageNo + 1,
            loading: true,
          },
          () => this.getMydirectoryData(),
        )
      : null;
  };

  resetFilter() {
    this.setState(
      {
        categoryId: '',
        searchKey: '',
        locationCode: '',
        loader: true,
        pageNo: 1,
        filterData: false,
        filterVisible: false,
        filterCategoryId: '',
        filterLocationCode: '',
        filterSearchKey: '',
      },
      () => this.getMydirectoryData(),
    );
  }
  closeFilterModal(save) {
    if (save) {
      this.setState(
        {
          categoryId: this.state.filterCategoryId,
          locationCode: this.state.filterLocationCode,
          searchKey: this.state.filterSearchKey,
          pageNo: 1,
          filterVisible: false,
          filterData: true,
        },
        () => {
          this.getMydirectoryData();
        },
      );
    } else {
      this.setState({
        filterVisible: false,
      });
    }
  }

  render() {
    const {modalVisible} = this.state;
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
            My Directory
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

              <View style={{paddingStart: width / 15, paddingEnd: width / 15}}>
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
                    ref={ref => (this.customInput1 = ref)}
                    onSubmitEditing={() =>
                      this.customInput2.refs.innerTextInput2.focus()
                    }
                    refInner="innerTextInput1"
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
                  <View style={styles.dropContainer}>
                    <Dropdown
                      style={[
                        styles.dropdown,
                        this.state.isFocus && {borderColor: 'blue'},
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      //inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={this.state.businessCategoryList}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!this.state.isFocus ? 'Select Category' : '...'}
                      searchPlaceholder="Search..."
                      value={this.state.categoryId}
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
                          categoryId: item.value,
                          isFocus: false,
                        });

                        // setSelectedCategory(item.value);
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
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: height / 30,
                  }}>
                  <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                    Location
                  </Text>
                </View>
                <View style={{marginTop: height / 80}}>
                  {/* <DropDown
                    placeholder="Choose Location"
                    placeholderTextColor="#808080"
                    data={this.state.locations}
                    value={this.state.filterLocationCode}
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
                          filterLocationCode: value,
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
                      //inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={this.state.locations}
                      value={this.state.filterLocationCode}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!this.state.isFocus ? 'Select item' : '...'}
                      searchPlaceholder="Search..."
                      // value={value}
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
                        this.setState(
                        {
                          filterLocationCode: item.value,
                        },
                        () => {
                          // console.log('usertype>', this.state.countryId);
                        },
                      );
                        // setSelectedCategory(item.value);
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
              </View>
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
              paddingStart: width / 15,
              paddingEnd: width / 15,
              marginBottom: height / 7,
            }}>
            <View style={{paddingVertical: height / 60}}>
              <Text
                style={[
                  theme.fontMedium,
                  {fontSize: width / 23, color: '#000'},
                ]}>
                {this.state.totalCount} Results Found
              </Text>
            </View>
            <View>
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                extraData={this.state}
                data={this.state.businessDirectory}
                keyExtractor={(x, i) => i}
                onEndReached={() => this.handleEnd()}
                onEndReachedThreshold={0.5}
                // ListFooterComponent={
                //   () =>
                //     // this.state.page > 1 ? (
                //     this.state.loading ? (
                //       <ActivityIndicator
                //         size="large"
                //         animating
                //         color={AppColors.primaryColor}
                //       />
                //     ) : null
                //   // ) : null
                // }
                renderItem={({item}) => (
                  <ListItem
                    thumbnail
                    noBorder
                    style={{
                      marginLeft: 0,
                      backgroundColor: '#ffffff',
                      borderTopRightRadius: 8,
                      borderBottomRightRadius: 8,
                      marginBottom: height / 55,
                    }}
                    onPress={() => {
                      this.props.navigation.navigate('DirectoryDetail', {
                        id: item._id,
                      });
                    }}>
                    <Left
                      style={{
                        paddingTop: 0,
                        marginTop: 0,
                      }}>
                      {item.logoPic == '' ? (
                        <Thumbnail
                          style={{
                            width: width / 2.9,
                            height: width / 2.7,
                            resizeMode: 'cover',
                            alignSelf: 'stretch',
                            borderRadius: 0,
                          }}
                          source={require('./assets/images/placeholder-img.png')}
                        />
                      ) : (
                        <Thumbnail
                          style={{
                            width: width / 2.9,
                            height: width / 2.7,
                            resizeMode: 'cover',
                            alignSelf: 'stretch',
                            borderRadius: 0,
                          }}
                          source={{uri: CONSTANTS.SMALL_IMG + item.logoPic}}
                        />
                      )}

                      {/* <View
                          style={{
                            position: 'absolute',
                            top: height / 60,
                            left: width / 30,
                            paddingHorizontal: width / 30,
                            paddingVertical: width / 60,
                            borderRadius: 30,
                            backgroundColor: '#24A259',
                          }}>
                          <Text
                            style={{
                              fontSize: width / 33,
                              color: '#fff',
                              lineHeight: width / 33,
                            }}>
                            Open
                          </Text>
                        </View>
                        <View
                          style={{
                            position: 'absolute',
                            top: height / 60,
                            left: width / 30,
                            paddingHorizontal: width / 30,
                            paddingVertical: width / 60,
                            borderRadius: 30,
                            backgroundColor: '#F5141A',
                          }}>
                          <Text
                            style={{
                              fontSize: width / 33,
                              color: '#fff',
                              lineHeight: width / 33,
                            }}>
                            Closed
                          </Text>
                        </View> */}
                    </Left>
                    <Body
                      style={{
                        paddingTop: 0,
                        paddingBottom: 0,
                        marginTop: 10,
                        marginBottom: 10,
                      }}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={[
                            theme.fontMedium,
                            {
                              fontSize: width / 27,
                              color: '#000',
                              maxWidth: width / 2.5,
                            },
                          ]}
                          numberOfLines={1}>
                          {item?.companyName}
                        </Text>

                        <TouchableOpacity
                          style={{
                            marginStart: 4,
                            marginEnd: 4,
                            width: width / 15,
                          }}
                          onPress={() => {
                            let url = 'directories/' + item?._id;
                            shareLink(url);
                          }}>
                          <FontAwesomeIcon icon={faShare} color={'#bd1d53'} />
                        </TouchableOpacity>
                      </View>

                      <Text
                        style={[
                          theme.fontMedium,
                          {fontSize: width / 32, color: '#747474'},
                        ]}
                        note
                        numberOfLines={1}>
                        at {item.location}
                      </Text>
                      <View style={{marginTop: height / 60}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: height / 90,
                          }}>
                          <Phone_icon width="15" height="15" />
                          <Text
                            style={[
                              theme.fontMedium,
                              {
                                fontSize: width / 32,
                                color: '#747474',
                                marginLeft: width / 40,
                              },
                            ]}>
                            {CONSTANTS.COUNTRY_CODE_TEXT} {item.phone}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: height / 90,
                          }}>
                          <Email_icon width="15" height="15" />
                          <Text
                            style={[
                              theme.fontMedium,
                              {
                                fontSize: width / 32,
                                color: '#747474',
                                marginLeft: width / 40,
                              },
                            ]}>
                            {item.email}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: height / 90,
                          }}>
                          <Industry_icon width="15" height="15" />
                          <Text
                            style={[
                              theme.fontMedium,
                              {
                                fontSize: width / 32,
                                color: '#747474',
                                marginLeft: width / 40,
                              },
                            ]}>
                            {industryTypes[item.industryType[0]]}
                          </Text>
                        </View>
                        {/* <View
                        style={{
                          position: 'absolute',
                          zIndex: 1,
                          bottom: 1,
                          right: width / 30,
                        }}>
                        <Text
                          style={[
                            theme.fontMedium,
                            {color: '#B7B7B7', fontSize: width / 32},
                          ]}>
                          1 Mar 2021
                        </Text>
                      </View> */}
                      </View>
                    </Body>
                  </ListItem>
                )}
              />
            </View>
          </View>
        </View>
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
