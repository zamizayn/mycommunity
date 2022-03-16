import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Icon,
  ListItem,
  Left,
  Thumbnail,
  Body,
  Header,
  Button,
  Title,
  Right,
  Content,
} from 'native-base';
var {height, width} = Dimensions.get('window');
import {AppColors} from '../Themes';
import {CONSTANTS} from '../config/constants';
import theme from '../config/styles.js';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {API} from '../config/api';
import {ApiHelper} from '../helpers/ApiHelper';
import moment from 'moment';
import FloatingLabelInput from '../components/FloatingLabelInput';
import {Dropdown} from 'react-native-material-dropdown-v2-fixed';
import DropDown_icon from '../assets/svg/DropDown_icon.svg';
import BackBtn_white from '../assets/svg/BackBtn_white.svg';
import FloatingLabelBorderInput from '../components/FloatingLabelBorderInput';

export default class Properties extends Component {
  constructor() {
    super();
    this.state = {
      properties: [],
      loader: false,
      pageNo: 1,
      limit: 10,
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
      totalCount: 0,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState(
        {
          pageNo: 1,
        },
        () => {
          this.getProperties();
          this.fetchCategoryList();
          this.getLocationsData();
        },
      );
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot.notifyRequired) {
      if (this.state.properties.length == 0) {
        this.setState(
          {
            pageNo: 1,
          },
          () => {
            this.getProperties();
            this.fetchCategoryList();
            this.getLocationsData();
          },
        );
      }
    }
    if (snapshot.filter) {
      this.setState({
        filterVisible: this.props.filter,
      });
    }

    if (snapshot.removeFilter) {
      if (this.props.removeFilter) {
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
            pageNo: 1,
            loader: true,
          },
          () => {
            this.getProperties();
          },
        );
      }
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    return {
      notifyRequired: prevProps.tabIndex !== this.props.tabIndex,
      filter: prevProps.filter !== this.props.filter,
      removeFilter: prevProps.removeFilter !== this.props.removeFilter,
    };
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  async getProperties() {
    let url = `?pageNo=${this.state.pageNo}&limit=${this.state.limit}&searchKey=${this.state.searchKey}`;
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
    // if (this.state.status !== '') {
    //   url = url + `&status=${this.state.status}`;
    // }
    //console.log("Search Url", url);
    await ApiHelper.get(API.propertiesUsers + this.props.userId)
      .then(res => {
        if ('data' in res.data && res.data.data) {
          var dataLen = res.data.data;
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

  handleEnd = () => {
    // this.state.properties.length > 10
    //   ? this.setState(
    //       {
    //         pageNo: this.state.pageNo + 1,
    //         loading: true,
    //         paginationLoading: true,
    //       },
    //       () => this.getProperties(),
    //     )
    //   : null;
  };

  async changeStatus(id, status) {
    this.setState({
      loader: true,
    });
    let formData = {
      id: id,
      status: status,
    };
    await ApiHelper.patch(API.properties + '/' + id + '/status', formData)
      .then(res => {
        this.setState(
          {
            pageNo: 1,
          },
          () => this.getProperties(),
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

  async delete(id) {
    this.setState({
      loader: true,
    });
    const params = new FormData();
    params.append('id', id);
    await ApiHelper.delete(API.properties + '/' + id, params)
      .then(res => {
        this.setState(
          {
            pageNo: 1,
          },
          () => this.getProperties(),
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
          status: this.state.filterStatus,
          pageNo: 1,
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
    this.props.resetFilterProp();
  }

  renderAccessory() {
    return (
      <View
        style={{
          top: height / 98,
          bottom: 0,
          right: 18,
          resizeMode: 'contain',
        }}>
        <DropDown_icon width="15" height="15" />
      </View>
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
      <>
        {this.state.loader ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              width: width,
            }}>
            <ActivityIndicator size="large" color="#bd1d53" />
            <StatusBar barStyle="default" />
          </View>
        ) : this.state.properties.length > 0 ? (
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
                  marginLeft: 0,
                  backgroundColor: '#ffffff',
                  borderTopRightRadius: 8,
                  borderBottomRightRadius: 8,
                  borderBottomWidth: 1,
                  borderColor: '#f0eced',
                  paddingHorizontal: width / 20,
                }}
                onPress={() => {
                  console.log("SLUGGG"+item._id);
                  this.props.navigation.navigate('PropertyDetail', {
                    id: item?._id,
                  });
                }}>
                <Left style={{}}>
                  <Thumbnail
                    round
                    source={{uri: CONSTANTS.SMALL_IMG + item?.imageKey}}
                    large
                  />
                </Left>
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
                      {item?.name}
                    </Text>
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
                            this.props.navigation.navigate('ViewProperty', {
                              id: item._id,
                            });
                          }}>
                          <Text
                            style={[
                              {
                                paddingHorizontal: 10,
                                paddingTop: 10,
                                fontSize: 16,
                              },
                              theme.fontRegular,
                            ]}>
                            View
                          </Text>
                        </MenuOption>
                        <MenuOption
                          onSelect={() => {
                            this.props.navigation.navigate('AddProperty', {
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
                            this.changeStatus(
                              item._id,
                              item.active ? '0' : '1',
                            );
                          }}>
                          <Text
                            style={({fontSize: 30}, theme.fontRegular)}
                            style={{
                              paddingHorizontal: 10,
                              paddingTop: 10,
                              fontSize: 16,
                            }}>
                            {item.active ? 'Disable' : 'Enable'}
                          </Text>
                        </MenuOption>
                        <MenuOption
                          onSelect={() => {
                            this.delete(item._id);
                          }}>
                          <Text
                            style={({fontSize: 30}, theme.fontRegular)}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 10,
                              fontSize: 16,
                            }}>
                            Delete
                          </Text>
                        </MenuOption>
                      </MenuOptions>
                    </Menu> */}
                  </View>
                  <Text
                    style={[
                      theme.fontMedium,
                      {fontSize: width / 32, marginTop: 1},
                    ]}
                    note
                    numberOfLines={1}>
                    at {item?.locationDetails?.locationName}
                  </Text>
                  <View style={{marginTop: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 2,
                      }}>
                      <Text
                        style={[
                          theme.fontMedium,
                          {
                            fontSize: width / 32,
                            color: '#747474',
                            fontStyle: 'italic',
                          },
                        ]}>
                        {item?.categoryName}
                      </Text>
                      {/* {item?.active ? (
                        <Text
                          style={[
                            theme.fontMedium,
                            {
                              fontSize: width / 32,
                              color: '#5dc25a',
                            },
                          ]}>
                          Enabled
                        </Text>
                      ) : (
                        <Text
                          style={[
                            theme.fontMedium,
                            {
                              fontSize: width / 32,
                              color: AppColors.fontRed,
                            },
                          ]}>
                          Disabled
                        </Text>
                      )} */}
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
                            fontSize: width / 27,
                          },
                          {
                            color: AppColors.fontRed,
                          },
                        ]}>
                        QAR {item?.price}
                      </Text>
                      <Text
                        style={[
                          theme.fontMedium,
                          {
                            fontSize: width / 32,
                            color: '#b6b6b6',
                          },
                        ]}>
                        {moment(item?.createdAt).format('DD MMMM, YYYY')}
                      </Text>
                    </View>
                  </View>
                </Body>
              </ListItem>
            )}
          />
        ) : (
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: height / 30,
              flex: 1,
            }}
            ref={c => (this.contentRef = c)}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>No properties found.</Text>
            </View>
          </Content>
        )}
        {this.state.paginationLoading && this.state.properties.length > 0 ? (
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
                <Dropdown
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
                  onChangeText={(value, index) => {
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
              <View style={{marginTop: height / 80}}>
                <Dropdown
                  placeholder="Choose furniture status"
                  placeholderTextColor="#808080"
                  data={[
                    {
                      label: 'Furniture available',
                      value: 1,
                    },
                    {
                      label: 'No Furniture',
                      value: 0,
                    },
                  ]}
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
                  onChangeText={(value, index) => {
                    this.setState({
                      filterFurniture: value,
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
                  Deposite Status
                </Text>
              </View>
              <View style={{marginTop: height / 80}}>
                <Dropdown
                  placeholder="Choose deposite status"
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
                  onChangeText={(value, index) => {
                    this.setState({
                      filterDeposite: value,
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
                  Active Status
                </Text>
              </View>
              <View style={{marginTop: height / 80}}>
                <Dropdown
                  placeholder="Choose status"
                  placeholderTextColor="#808080"
                  data={[
                    {
                      label: 'Enabled',
                      value: 1,
                    },
                    {
                      label: 'Disabled',
                      value: 0,
                    },
                  ]}
                  value={this.state.filterStatus}
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
                  onChangeText={(value, index) => {
                    this.setState({
                      filterStatus: value,
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
      </>
    );
  }
}
