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
  StyleSheet
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
import SearchBlackIcon from './assets/svg/SearchBlackIcon.svg';
import Notification_icon_white from './assets/svg/Notification_icon_white.svg';
import Filter_icon from './assets/svg/FilterIcon.svg';
import FilterResetSvg from './assets/svg/FilterReset.svg';
import RoomSvg from './assets/svg/Room_status.svg';
import ChairSvg from './assets/svg/Furniture_status.svg';
import Industry_icon from './assets/svg/Industry_icon.svg';
import {left} from 'styled-system';
import Loader from './components/Loader';
import {ApiHelper} from './helpers/ApiHelper';
import {API} from './config/api';
import {CONSTANTS} from './config/constants';
import {AppColors} from './Themes';
import Icon from 'react-native-vector-icons/Ionicons';
// import {DropDown} from 'react-native-material-DropDown-v2-fixed';
import {Dropdown} from 'react-native-element-dropdown';
import DropDown_icon from './assets/svg/DropDown_icon.svg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DropDown from './components/DropDown';
import FloatingLabelInput from './components/FloatingLabelInput';
import moment from 'moment';
import FloatingLabelBorderInput from './components/FloatingLabelBorderInput';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faShare} from '@fortawesome/free-solid-svg-icons';
import shareLink from './helpers/SocialShare';

var {height, width} = Dimensions.get('window');
export default class ListProperty extends Component {
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
      propertyCategories: [],
      propertyCategory: '',
      filterCategory: '',
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
      paginationLoading: false,
      filterData: false,
      value: null,
      isFocus: false,
    };
  }

  closeFilterModal(save) {
    if (save) {
      this.setState(
        {
          searchKey: this.state.filterSearchKey,
          propertyCategory: this.state.filterCategory,
          filterVisible: false,
          locationCode: this.state.filterLocationCode,
          priceFrom: this.state.filterPriceFrom,
          priceTo: this.state.filterPriceTo,
          roomCount: this.state.filterRoomCount,
          bathroomCount: this.state.filterBathroomCount,
          deposit: this.state.filterDeposite,
          furniture: this.state.filterFurniture,
          pageNo: 1,
          loader: true,
          filterData: true,
          properties: [],
          totalCount: 0,
        },
        () => {
          this.getProperties();

          // this.getPromotedList();
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
    // this.getProperties();
    // this.getPromotedList();

    const searchKey =
      'params' in this.props.route && this.props.route.params
        ? this.props.route.params.searchKey
        : '';

    if (searchKey !== '') {
      this.setState(
        {
          filterSearchKey: searchKey,
          searchKey: searchKey,
        },
        () => this.getProperties(),
      );
    } else {
      this.getPromotedList();
    }
    this.fetchCategoryList();
    this.getLocationsData();
  }

  async fetchCategoryList() {
    await ApiHelper.get(API.propertyCategory).then(res => {
      this.arrayholder = res.data.data;
      this.setState({
        propertyCategories: this.arrayholder.map(c => ({
          label: c.name,
          value: c.code,
        })),
      });
    });
  }

  async getLocationsData() {
    await ApiHelper.get(API.locations)
      .then(res => {
        var dataLen = res.data.data;
        var len = dataLen.length;
        var locationList = [];
        for (let i = 0; i < len; i++) {
          let row = dataLen[i];
          let obj = {
            label: row.name,
            value: row.code,
          };
          locationList.push(obj);
        }
        this.setState({locations: locationList});
      })
      .catch(err => {
        this.setState({
          loader: false,
        });
        console.log(err);
      });
  }

  async getPromotedList() {
    await ApiHelper.get(API.propertiesPromoted)
      .then(res => {
        if ('data' in res.data && res.data.data) {
          var dataLen = res.data.data;

          var promotedList = [];
          res.data.data.map(item => {
            var updatedItem = {...item, ...{promoted: true}};
            promotedList.push(updatedItem);
          });
          this.setState({
            properties: promotedList,
          });
          this.getProperties();
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

  async getProperties() {
    let url = `?pageNo=${this.state.pageNo}&limit=${this.state.limit}`;
    if (this.state.searchKey !== '') {
      url = url + `&searchKey=${this.state.searchKey}`;
    }
    if (this.state.propertyCategory !== '') {
      url = url + `&categoryId=${this.state.propertyCategory}`;
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
    if (this.state.roomCount !== '') {
      url = url + `&roomCount=${this.state.roomCount}`;
    }
    if (this.state.bathroomCount !== '') {
      url = url + `&bathroomCount=${this.state.bathroomCount}`;
    }
    if (this.state.deposit !== '') {
      url = url + `&deposit=${this.state.deposit}`;
    }
    if (this.state.furniture !== '') {
      url = url + `&furniture=${this.state.furniture}`;
    }

    console.log('Search Url', url);
    await ApiHelper.get(API.properties + url)
      .then(res => {
        if ('data' in res.data && res.data.data) {
          var dataLen = res.data.data;
          // console.log('Properties', res.data);
          this.setState({
            properties:
              // this.state.pageNo == 1
              //   ? res.data.data
              //   :
              [...this.state.properties, ...res.data.data],
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

  getFurniture(value) {
    const furniture = this.furnitureStatuses.filter(it => it.value == value);
    if (furniture.length) {
      return furniture[0].label;
    }
    return '';
  }

  handleEnd = () => {
    this.state.totalCount > 0
      ? this.setState(
          {
            pageNo: this.state.pageNo + 1,
            loading: true,
            paginationLoading: true,
          },
          () => this.getProperties(),
        )
      : null;
  };

  resetFilter() {
    this.setState(
      {
        searchKey: '',
        filterSearchKey: '',
        propertyCategory: '',
        filterCategory: '',
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
        loader: true,
        pageNo: 1,
        filterData: false,
        properties: [],
        totalCount: 0,
      },
      () => {
        // this.getProperties();

        this.getPromotedList();
      },
    );
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
            Properties
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
                    placeholder="Choose Category"
                    placeholderTextColor="#808080"
                    data={this.state.propertyCategories}
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
                    DropDownPosition={1}
                    rippleInsets={{top: 0, bottom: 0}}
                    DropDownOffset={{
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
                          filterCategory: value,
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
                      data={this.state.propertyCategories}
                      value={this.state.filterCategory}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!this.state.isFocus ? 'Choose category' : '...'}
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
                        this.setState(
                        {
                          filterCategory: item.value,
                        },
                        () => {
                          // console.log('usertype>', this.state.countryId);
                        },
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
                    DropDownPosition={1}
                    rippleInsets={{top: 0, bottom: 0}}
                    DropDownOffset={{
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
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={this.state.locations}
                    value={this.state.filterLocationCode}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!this.state.isFocus ? 'Choose location' : '...'}
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
                        this.setState(
                        {
                          filterLocationCode: item.value,
                        },
                        () => {
                          // console.log('usertype>', this.state.countryId);
                        },
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
                <View
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
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: height / 30,
                      }}>
                      <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                        No. of Bedroom
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
                        value={this.state.filterRoomCount}
                        returnKeyType={'next'}
                        placeholder="No. of bedroom"
                        placeholderTextColor={'#808B96'}
                        onChangeText={value => {
                          this.setState({
                            filterRoomCount: value,
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
                      <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                        No. of Bathroom
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
                        value={this.state.filterBathroomCount}
                        returnKeyType={'next'}
                        placeholder="No. of bathroom"
                        placeholderTextColor={'#808B96'}
                        onChangeText={value => {
                          this.setState({
                            filterBathroomCount: value,
                          });
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: height / 30,
                  }}>
                  <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                    Furniture Status
                  </Text>
                </View>
                <View style={{marginTop: height / 75}}>
                  {/* <DropDown
                    placeholder="Select a status"
                    placeholderTextColor="#808080"
                    data={this.furnitureStatuses}
                    value={this.state.filterFurniture}
                    containerStyle={{
                      width: null,
                      borderRadius: 8,
                      paddingStart: width / 60,
                      backgroundColor: '#fff',
                      borderBottomWidth: 1,
                      borderColor: '#BDBEBF',
                    }}
                    pickerStyle={pickerStyle}
                    DropDownPosition={1}
                    rippleInsets={{top: 0, bottom: 0}}
                    DropDownOffset={{
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
                    onChange={value => {
                      this.setState({
                        filterFurniture: value,
                      });
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
                      data={this.furnitureStatuses}
                      value={this.state.filterFurniture}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!this.state.isFocus ? 'Select a status' : '...'}
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
                        this.setState(
                        {
                          filterFurniture: item.value,
                        },
                        () => {
                          // console.log('usertype>', this.state.countryId);
                        },
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
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: height / 30,
                  }}>
                  <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                    Deposite Status
                  </Text>
                </View>
                <View style={{marginTop: height / 75}}>
                  {/* <DropDown
                    placeholder="Select a status"
                    placeholderTextColor="#808080"
                    data={[
                      {
                        label: 'Deposite required',
                        value: 1,
                      },
                      {
                        label: 'No Deposit',
                        value: 0,
                      },
                    ]}
                    value={this.state.filterDeposite}
                    containerStyle={{
                      width: null,
                      borderRadius: 8,
                      paddingStart: width / 60,
                      backgroundColor: '#fff',
                      borderBottomWidth: 1,
                      borderColor: '#BDBEBF',
                    }}
                    pickerStyle={pickerStyle}
                    DropDownPosition={1}
                    rippleInsets={{top: 0, bottom: 0}}
                    DropDownOffset={{
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
                    onChange={value => {
                      this.setState({
                        filterDeposite: value,
                      });
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
                      data={[
                      {
                        label: 'Deposite required',
                        value: 1,
                      },
                      {
                        label: 'No Deposit',
                        value: 0,
                      },
                    ]}
                    value={this.state.filterDeposite}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!this.state.isFocus ? 'Select a status' : '...'}
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
                        this.setState(
                        {
                          filterDeposite: item.value,
                        },
                        () => {
                          // console.log('usertype>', this.state.countryId);
                        },
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
                    onPress={() => {
                      this.props.navigation.navigate('PropertyDetail', {
                        id: item._id,
                      });
                    }}>
                    <Left style={{}}>
                      {item.imageKey == '' ? (
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
                          source={{uri: CONSTANTS.SMALL_IMG + item.imageKey}}
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
                          {item.name}
                        </Text>

                        <TouchableOpacity
                          style={{
                            marginStart: 4,
                            marginEnd: 4,
                            width: width / 15,
                          }}
                          onPress={() => {
                            let url = 'properties/' + item?._id;
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
                        at {item.locationDetails.locationName}
                      </Text>
                      <View style={{marginTop: 10, marginBottom: 5}}>
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
                                fontSize: width / 27,
                              },
                              {
                                color: AppColors.fontRed,
                              },
                            ]}>
                            QAR {item.price}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 4,
                          }}>
                          <RoomSvg width="15" height="15" />
                          <Text
                            style={[
                              theme.fontMedium,
                              {
                                fontSize: width / 30,
                                color: '#747474',
                                marginLeft: 8,
                              },
                            ]}>
                            {item.noOfRooms} BHK
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 4,
                          }}>
                          <ChairSvg width="15" height="15" />
                          <Text
                            style={[
                              theme.fontMedium,
                              {
                                fontSize: width / 30,
                                color: '#747474',
                                marginLeft: 8,
                              },
                            ]}>
                            {this.getFurniture(item.furnitureStatus)}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 5,
                          right: 10,
                        }}>
                        <Text
                          style={[
                            theme.fontMedium,
                            {
                              fontSize: width / 32,
                              color: '#747474',
                            },
                          ]}>
                          {moment(item.createdAt).format('DD MMMM, YYYY')}
                        </Text>
                      </View>
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

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 4,
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
    padding: 10,
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
