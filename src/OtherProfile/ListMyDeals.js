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
import BackBtn_white from '../assets/svg/BackBtn_white.svg';
import theme from '../config/styles.js';
import SearchBlackIcon from '../assets/svg/SearchBlackIcon.svg';
import Notification_icon_white from '../assets/svg/Notification_icon_white.svg';
import Filter_icon from '../assets/svg/FilterIcon.svg';
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
import DropDown from '../components/DropDown';
import DropDown_icon from '../assets/svg/DropDown_icon.svg';
import FloatingLabelInput from '../components/FloatingLabelInput';
import moment from 'moment';
import FloatingLabelBorderInput from '../components/FloatingLabelBorderInput';
import FilterResetSvg from '../assets/svg/FilterReset.svg';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faShare} from '@fortawesome/free-solid-svg-icons';
import shareLink from '../helpers/SocialShare';
import TimeAgo from 'react-timeago';

var {height, width} = Dimensions.get('window');
export default class ListMyDeals extends Component {
  furnitureStatuses = [
    {
      label: 'Furnished',
      value: 1,
    },
    {
      label: 'Semifurnished',
      value: 2,
    },
    {
      label: 'Unfurnished',
      value: 3,
    },
  ];
  constructor() {
    super();
    this.state = {
      services: [],
      loader: false,
      pageNo: 1,
      limit: 8,
      searchKey: '',
      filterSearchKey: '',
      notifyRequired: false,
      filterVisible: false,
      serviceCategories: [
        {label: 'Choose all category', value: ''},
        {label: 'Hotels', value: 200},
        {label: 'Events', value: 201},
        {label: 'Super market', value: 202},
        {label: 'Clothing', value: 208},
        {label: 'Toy shop', value: 209},
        {label: 'Desert safari', value: 212},
        {label: 'Beauty salon', value: 213},
        {label: 'Snooker', value: 216},
        {label: 'Gym', value: 208},
        {label: 'Salon Men', value: 10},
        {label: 'Seafood restaurant', value: 223},
        {label: 'Arabic restaurant', value: 224},
        {label: 'Fast Food restaurant', value: 225},
        {label: 'Indian restaurant', value: 226},
        {label: 'Asian restaurant', value: 227},
        {label: 'Coffee & Tea', value: 228},
      ],
      serviceCategory: '',
      serviceSubCategories: [],
      serviceSubCategory: '',
      filterCategory: '',
      filterSubCategory: '',
      locations: [],
      filterLocationCode: '',
      locationCode: '',
      priceFrom: '',
      filterPriceFrom: '',
      priceTo: '',
      filterPriceTo: '',
      roomCount: '',
      filterRoomCount: '',
      bathroomCount: '',
      filterBathroomCount: '',
      deposit: '',
      filterDeposite: '',
      furniture: '',
      filterFurniture: '',
      status: '',
      filterStatus: '',
      filterBestDealStatus: '',
      bestDeal: '0',
      totalCount: 0,
      paginationLoading: false,
      filterData: false,
    };
  }

  componentDidMount() {
    //   this.setState({loader: true});
    //   // this.getServices();
    //   this.getPromotedList();
    //   this.fetchFilterAttributes();
    console.log('MyDeals');
    // this.getServices();
    // this.fetchFilterAttributes();

    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      console.log('MyDealsi');
      this.setState(
        {
          pageNo: 1,
        },
        () => {
          console.log('MyDealsii');
          this.getServices();
          this.fetchFilterAttributes();
        },
      );
    });
  }

  fetchFilterAttributes() {
    this.getLocationsData();
    this.fetchCategoryList();
  }
  async fetchCategoryList() {
    // await ApiHelper.get(API.myDealsCategories).then(res => {
    //   this.arrayholder = res.data.data;
    //   this.setState({
    //     serviceCategories: this.arrayholder.map(c => ({
    //       label: c.catName,
    //       value: c.catId,
    //     })),
    //   });
    // });
  }
  async fetchSubCategories(id) {
    this.setState({
      loader: true,
    });
    await ApiHelper.get(API.serviceSubCategories + id).then(res => {
      this.arrayholder = res.data.data;
      this.setState({
        subcategories: this.arrayholder.map(c => ({
          label: c.subCatName,
          value: c.subCatId,
        })),
      });
    });
    this.setState({
      loader: false,
    });
  }

  async getLocationsData() {
    await ApiHelper.get(API.locations).then(res => {
      this.arrayLocations = res.data.data;
      this.setState({
        locations: this.arrayLocations.map(c => ({
          label: c.name,
          value: c.code,
        })),
      });
    });
    this.setState({
      loader: false,
    });
  }

  // handleEnd = () => {
  //   this.state.services.length > 10
  //     ? this.setState(
  //         {
  //           pageNo: this.state.pageNo + 1,
  //           loading: true,
  //           paginationLoading: true,
  //         },
  //         () => this.getServices(),
  //       )
  //     : null;
  // };

  resetFilter() {
    this.setState(
      {
        searchKey: '',
        filterSearchKey: '',
        serviceCategory: '',
        serviceSubCategory: '',
        filterCategory: '',
        filterSubCategory: '',
        filterLocationCode: '',
        locationCode: '',
        priceFrom: '',
        filterPriceFrom: '',
        priceTo: '',
        filterPriceTo: '',
        roomCount: '',
        filterRoomCount: '',
        bathroomCount: '',
        filterBathroomCount: '',
        deposit: '',
        filterDeposite: '',
        furniture: '',
        filterFurniture: '',
        status: '',
        filterStatus: '',
        filterBestDealStatus: '',
        loader: true,
        pageNo: 1,
        filterData: false,
      },
      () => {
        this.getServices();
        // this.getPromotedList();
      },
    );
  }

  async getPromotedList() {
    this.setState({
      loader: true,
    });
    await ApiHelper.get(API.myDealsPromoted)
      .then(res => {
        if ('data' in res.data && res.data.data) {
          var dataLen = res.data.data;

          console.log(dataLen);

          var promotedList = [];
          res.data.data.map(item => {
            var updatedItem = [...item, {promoted: true}];
            promotedList.push(updatedItem);
          });

          this.setState({
            services: promotedList,
          });
          this.getServices();
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

  async getServices() {
    let url = `?pageNo=${this.state.pageNo}&limit=${this.state.limit}`;
    if (this.state.searchKey !== '') {
      url = url + `&searchKey=${this.state.searchKey}`;
    }
    if (this.state.bestDeal !== '') {
      url = url + `&bestDeal=${this.state.bestDeal}`;
    }
    if (this.state.serviceCategory !== '') {
      url = url + `&categoryId=${this.state.serviceCategory}`;
    }
    if (this.state.serviceSubCategory !== '') {
      url = url + `&subCategoryId=${this.state.serviceSubCategory}`;
    }
    if (this.state.locationCode !== '') {
      url = url + `&location=${this.state.locationCode}`;
    }
    if (this.state.priceFrom !== '') {
      url = url + `&priceFrom=${this.state.priceFrom}`;
    }
    if (this.state.priceTo !== '') {
      url = url + `&priceTo=${this.state.priceTo}`;
    }

    console.log('Search Url', url);

    this.setState({
      loader: true,
    });
    await ApiHelper.get(
      API.myDealsOtherProfile + '?userId=' + this.props?.userId,
    )
      .then(res => {
        if ('data' in res.data && res.data.data) {
          var dataLen = res.data.data;
          this.setState({
            services:
              // this.state.pageNo == 1
              //   ? res.data.data
              //   :
              [...this.state.services, ...res.data.data],
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
          serviceCategory: this.state.filterCategory,
          serviceSubCategory: this.state.filterSubCategory,
          filterVisible: false,
          locationCode: this.state.filterLocationCode,
          priceFrom: this.state.filterPriceFrom,
          priceTo: this.state.filterPriceTo,
          roomCount: this.state.filterRoomCount,
          bathroomCount: this.state.filterBathroomCount,
          deposit: this.state.filterDeposite,
          furniture: this.state.filterFurniture,
          status: this.state.filterStatus,
          bestDeal: this.state.filterBestDealStatus,
          pageNo: 1,
          filterData: true,
        },
        () => {
          this.getServices();
          // this.getPromotedList();
        },
      );
    } else {
      this.setState({
        filterVisible: false,
      });
    }
  }

  handleEnd = () => {
    // this.state.totalCount > 0
    //   ? this.setState(
    //       {
    //         pageNo: this.state.pageNo + 1,
    //         loading: true,
    //         paginationLoading: true,
    //       },
    //       () => this.getServices(),
    //     )
    //   : null;
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
        {/* <View
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
            My Deals
          </Text>
        </View> */}
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
                  <DropDown
                    placeholder="Choose category"
                    placeholderTextColor="#808080"
                    data={this.state.serviceCategories}
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
                      this.fetchSubCategories(value);
                    }}
                  />
                </View>
                {/* <View
                  style={{
                    flexDirection: 'row',
                    marginTop: height / 30,
                  }}>
                  <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                    Sub Category
                  </Text>
                </View>
                <View style={{marginTop: height / 80}}>
                  <DropDown
                    placeholder="Choose sub category"
                    placeholderTextColor="#808080"
                    data={this.state.serviceSubCategories}
                    value={this.state.filterSubCategory}
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
                        filterSubCategory: value,
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
                    Location
                  </Text>
                </View>
                <View style={{marginTop: height / 80}}>
                  <DropDown
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
                  />
                </View> */}
                {/* <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <View
                      style={{
                        marginTop: height / 30,
                        flexDirection: 'row',
                      }}>
                      <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                        Price From
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: width / 2.4,
                        height: height / 15,
                        marginBottom: width / 40,
                        marginTop: height / 65,
                        borderColor: '#BDBEBF',
                        borderBottomWidth: 1,
                      }}>
                      <FloatingLabelInput
                        keyboard="number-pad"
                        width={width / 1.3}
                        mandatory={false}
                        value={this.state.filterPriceFrom}
                        returnKeyType={'next'}
                        placeholder="Amount"
                        placeholderTextColor={'#808B96'}
                        onChangeText={value => {
                          this.setState({
                            filterPriceFrom: value,
                          });
                        }}
                      />
                    </View>
                  </View>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: height / 30,
                      }}>
                      <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                        Price To
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: width / 2.4,
                        height: height / 15,
                        marginBottom: width / 40,
                        marginTop: height / 65,
                        borderColor: '#BDBEBF',
                        borderBottomWidth: 1,
                      }}>
                      <FloatingLabelInput
                        keyboard="number-pad"
                        width={width / 1.3}
                        mandatory={false}
                        value={this.state.filterPriceTo}
                        returnKeyType={'next'}
                        placeholder="Amount"
                        placeholderTextColor={'#808B96'}
                        onChangeText={value => {
                          this.setState({
                            filterPriceTo: value,
                          });
                        }}
                      />
                    </View>
                  </View>
                </View> */}

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
          </View> */}
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#F0ECED',
          }}>
          <View
            style={{
              marginBottom: height / 25,
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
                {this.state.totalCount} Results Found
              </Text>
            </View> */}
            <View>
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={this.state.services}
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
                    onPress={() => {
                      this.props.navigation.navigate('MyDealsDetails', {
                        id: item._id,
                      });
                    }}>
                    <Left style={{}}>
                      {item.coverImage == '' ? (
                        <Thumbnail
                          style={{
                            width: width / 2.9,
                            height: width / 2.7,
                            resizeMode: 'cover',
                            alignSelf: 'stretch',
                            borderRadius: 0,
                          }}
                          source={require('../assets/images/placeholder-img.png')}
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
                          source={{uri: CONSTANTS.SMALL_IMG + item.coverImage}}
                        />
                      )}
                    </Left>
                    <Body style={{}}>
                      {item?.promoted ? (
                        <View
                          style={{
                            justifyContent: 'flex-end',
                            flexDirection: 'row',
                            marginTop: -12,
                          }}>
                          <Text
                            style={[
                              theme.fontMedium,
                              {
                                fontSize: width / 32,
                                color: '#fff',
                                backgroundColor: 'red',
                                paddingLeft: 3,
                                paddingRight: 3,
                              },
                            ]}
                            numberOfLines={1}>
                            Promoted
                          </Text>
                        </View>
                      ) : null}
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
                          {item.title}
                        </Text>

                        {/* <TouchableOpacity
                          style={{
                            marginStart: 4,
                            marginEnd: 4,
                            width: width / 15,
                          }}
                          onPress={() => {
                            let url = 'promotions/' + item?._id;
                            shareLink(url);
                          }}>
                          <FontAwesomeIcon icon={faShare} color={'#bd1d53'} />
                        </TouchableOpacity> */}
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
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={[
                            theme.fontMedium,
                            {fontSize: width / 32, color: '#747474'},
                          ]}
                          numberOfLines={2}
                          ellipsizeMode="tail">
                          {item.description}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={[
                            theme.fontMedium,
                            {
                              fontSize: width / 32,
                              color: '#a73a6f',
                              borderColor: '#a73a6f',
                              borderRadius: 4,
                              borderWidth: 1,
                              padding: 4,
                            },
                          ]}
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {item.categoryName}
                        </Text>
                      </View>

                      <Text
                        style={[
                          theme.fontMedium,
                          {fontSize: width / 32, color: '#747474'},
                        ]}
                        numberOfLines={2}
                        ellipsizeMode="tail">
                        Promotion Id: {item?.promotionId}
                      </Text>
                      <View
                        style={{
                          marginStart: 3,
                        }}>
                        <Text
                          style={[
                            theme.fontMedium,
                            {
                              fontSize: width / 35,
                              color: '#979797',
                            },
                          ]}>
                          {'Validity : '}
                          {moment(item?.startDateTime).format(
                            'MMMM DD, YYYY hh:mm a',
                          )}
                          {' to '}
                          {moment(item?.endDateTime).format(
                            'MMMM DD, YYYY hh:mm a',
                          )}
                        </Text>

                        {moment().isSameOrBefore(item?.endDateTime) ? (
                          <Text
                            style={[
                              theme.fontMedium,
                              {
                                fontSize: width / 35,
                                color: '#979797',
                              },
                            ]}>
                            {'Expires '}
                            <TimeAgo
                              live={false}
                              component={Text}
                              date={item?.endDateTime}
                            />
                          </Text>
                        ) : (
                          <Text
                            style={[
                              theme.fontMedium,
                              {
                                fontSize: width / 35,
                                color: '#979797',
                              },
                            ]}>
                            Expired
                          </Text>
                        )}
                      </View>
                    </Body>
                  </ListItem>
                )}
              />
              {this.state.paginationLoading &&
              this.state.services.length > 0 ? (
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
