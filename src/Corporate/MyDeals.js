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
import Toast from 'react-native-simple-toast';
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
export default class MyDeals extends Component {
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
      limit: 50,
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
        },
        () => {
          this.getProperties();
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
    this.getProperties();
    this.fetchCategoryList();
    this.getLocationsData();
  }

  async fetchCategoryList() {
    await ApiHelper.get(API.propertyCategory).then(res => {
      // console.log('*****======================');
      // console.log(res);
      // console.log('======================*****');
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

  async getProperties() {
    let url = `?pageNo=${this.state.pageNo}&limit=${this.state.limit}`;
    if (this.state.searchKey !== '') {
      url = url + `&searchKey=${this.state.searchKey}`;
    }
    // if (this.state.propertyCategory !== '') {
    //   url = url + `&categoryId=${this.state.propertyCategory}`;
    // }
    // if (this.state.locationCode !== '') {
    //   url = url + `&location=${this.state.locationCode}`;
    // }
    // if (this.state.priceFrom !== '') {
    //   url = url + `&priceFrom=${this.state.priceFrom}`;
    // }
    // if (this.state.priceTo !== '') {
    //   url = url + `&priceTo=${this.state.priceTo}`;
    // }
    // if (this.state.roomCount !== '') {
    //   url = url + `&roomCount=${this.state.roomCount}`;
    // }
    // if (this.state.bathroomCount !== '') {
    //   url = url + `&bathroomCount=${this.state.bathroomCount}`;
    // }
    // if (this.state.deposit !== '') {
    //   url = url + `&deposit=${this.state.deposit}`;
    // }
    // if (this.state.furniture !== '') {
    //   url = url + `&furniture=${this.state.furniture}`;
    // }

    console.log('Search Url', url);
    await ApiHelper.get(API.dashboardMyDeals + url)
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
            () => this.getProperties(),
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
      },
      () => this.getProperties(),
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
            My Deals
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
                {/* <View
                  style={{
                    flexDirection: 'row',
                    marginTop: height / 30,
                  }}>
                  <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                    Category
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    width: '100%',
                    marginTop: height / 80,
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                  }}>
                  <Dropdown
                    placeholder="Choose Category"
                    placeholderTextColor="#808080"
                    data={this.state.propertyCategories}
                    value={this.state.filterCategory}
                    containerStyle={{
                      width: null,
                      borderRadius: 8,
                      paddingStart: width / 60,
                      backgroundColor: '#fff',
                      borderBottomWidth: 0,
                      borderColor: '#BDBEBF',
                      height: 40,
                    }}
                    pickerStyle={pickerStyle}
                    dropdownPosition={1}
                    rippleInsets={{top: 0, bottom: 0}}
                    dropdownOffset={{
                      top: height / 70,
                    }}
                    fontSize={width / 25}
                    // baseColor="#000000"
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
                    onChangeText={(value, index) => {
                      this.setState(
                        {
                          filterCategory: value,
                        },
                        () => {
                          // console.log('usertype>', this.state.countryId);
                        },
                      );
                    }}
                  />
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
                      // this.props.navigation.navigate('PropertyDetail', {
                      //   id: item._id,
                      // });
                    }}>
                    <Body style={{}}>
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
                          Id: {item?.promotionId}
                        </Text>
                      </View>
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
                          Name: {item?.title}
                        </Text>
                      </View>
                      {/* <Text
                        style={[
                          theme.fontMedium,
                          {fontSize: width / 32, color: '#747474'},
                        ]}
                        note
                        numberOfLines={1}>
                        {item?.description}
                      </Text> */}

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
                          Status:{' '}
                          {item?.isBlinkingEnabled ? 'Enabled' : 'Disabled'}
                        </Text>
                      </View>

                      <View
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
                            {item?.isBlinkingEnabled ? 'Disable' : 'Enable'}
                          </Text>
                        </TouchableOpacity>
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
