import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Modal,
  ScrollView,
} from 'react-native';
import {
  Container,
  Content,
  Item,
  Input,
  Tab,
  Tabs,
  TabHeading,
  ScrollableTab,
  Icon,
  ListItem,
  Left,
  Thumbnail,
  Body,
  Header,
  Button,
  Right,
  Title,
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
import Loader from '../components/Loader';
import moment from 'moment';
import FloatingLabelInput from '../components/FloatingLabelInput';
import BackBtn_white from '../assets/svg/BackBtn_white.svg';
import {Dropdown} from 'react-native-material-dropdown-v2-fixed';
import FloatingLabelBorderInput from '../components/FloatingLabelBorderInput';
export default class Vehicles extends Component {
  constructor() {
    super();

    this.state = {
      vehicles: [],
      loader: false,
      pageNo: 1,
      limit: 10,
      searchKey: '',
      notifyRequired: '',
      filterVisible: false,
      filterSearchKey: '',
      categories: [],
      category: '',
      filterCategory: '',
      brandId: '',
      filterBrandId: '',
      modelId: '',
      filterModelId: '',
      trimId: '',
      filterTrimId: '',
      year: '',
      filterYear: '',
      colorId: '',
      filterColorId: '',
      fuelTypeId: '',
      filterFuelTypeId: '',
      transmissionTypeId: '',
      filterTransmissionTypeId: '',
      serviceHistory: '',
      filterServiceHistory: '',
      status: '',
      filterStatus: '',
      noOfDoors: '',
      filterNoOfDoors: '',
      condition: '',
      filterCondition: '',
      priceFrom: '',
      filterPriceFrom: '',
      priceTo: '',
      filterPriceTo: '',
      location: '',
      filterLocation: '',
      locations: [],
      brands: [],
      models: [],
      trims: [],
      colors: [],
      fuelTypes: [],
      transmissionTypes: [],
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
          this.getVehicles();
          this.fetchFilterAttributes();
        },
      );
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot.notifyRequired) {
      if (this.state.vehicles.length == 0) {
        this.setState(
          {
            pageNo: 1,
          },
          () => {
            this.getVehicles();
            this.fetchFilterAttributes();
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
            category: '',
            filterCategory: '',
            brandId: '',
            filterBrandId: '',
            modelId: '',
            filterModelId: '',
            trimId: '',
            filterTrimId: '',
            year: '',
            filterYear: '',
            colorId: '',
            filterColorId: '',
            fuelTypeId: '',
            filterFuelTypeId: '',
            transmissionTypeId: '',
            filterTransmissionTypeId: '',
            serviceHistory: '',
            filterServiceHistory: '',
            status: '',
            filterStatus: '',
            noOfDoors: '',
            filterNoOfDoors: '',
            condition: '',
            filterCondition: '',
            priceFrom: '',
            filterPriceFrom: '',
            priceTo: '',
            filterPriceTo: '',
            location: '',
            filterLocation: '',
            pageNo: 1,
            loader: true,
          },
          () => {
            this.getVehicles();
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

  async getVehicles() {
    this.setState({
      loader: true,
    });
    // let url = `?pageNo=${this.state.pageNo}&limit=${this.state.limit}&searchKey=${this.state.searchKey}`;
    // if (this.state.brandId !== '') {
    //   url = url + `&brandId=${this.state.brandId}`;
    // }
    // if (this.state.modelId !== '') {
    //   url = url + `&modelId=${this.state.modelId}`;
    // }
    // if (this.state.trimId !== '') {
    //   url = url + `&trimId=${this.state.trimId}`;
    // }
    // if (this.state.year !== '') {
    //   url = url + `&year=${this.state.year}`;
    // }
    // if (this.state.colorId !== '') {
    //   url = url + `&colorId=${this.state.colorId}`;
    // }
    // if (this.state.fuelTypeId !== '') {
    //   url = url + `&fuelTypeId=${this.state.fuelTypeId}`;
    // }
    // if (this.state.transmissionTypeId !== '') {
    //   url = url + `&transmissionTypeId=${this.state.transmissionTypeId}`;
    // }
    // if (this.state.serviceHistory !== '') {
    //   url = url + `&serviceHistory=${this.state.serviceHistory}`;
    // }
    // if (this.state.status !== '') {
    //   url = url + `&status=${this.state.status}`;
    // }
    // if (this.state.noOfDoors !== '') {
    //   url = url + `&noOfDoors=${this.state.noOfDoors}`;
    // }
    // if (this.state.condition !== '') {
    //   url = url + `&condition=${this.state.condition}`;
    // }
    // if (this.state.priceFrom !== '') {
    //   url = url + `&priceFrom=${this.state.priceFrom}`;
    // }
    // if (this.state.priceTo !== '') {
    //   url = url + `&priceTo=${this.state.priceTo}`;
    // }
    // if (this.state.location !== '') {
    //   url = url + `&location=${this.state.location}`;
    // }

    //console.log("Search Url", url);
    await ApiHelper.get(API.vehiclesUsers + this.props.userId)
      .then(res => {
        // console.log("Vehicles", res.data.data);
        if ('data' in res.data && res.data.data) {
          var dataLen = res.data.data;
          this.setState({
            vehicles:
              this.state.pageNo == 1
                ? res.data.data
                : [...this.state.vehicles, ...res.data.data],
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

  fetchFilterAttributes() {
    this.getLocationsData();
    this.fetchCategoryList();
    this.fetchColors();
    this.fetchFuelTypes();
    this.fetchTransmission();
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

  async fetchColors() {
    await ApiHelper.get(API.vehicles + '/colors').then(res => {
      this.arrayholder = res.data.data;
      this.setState({
        colors: this.arrayholder.map(c => ({label: c.name, value: c.code})),
      });
    });
  }

  async fetchFuelTypes() {
    await ApiHelper.get(API.vehicles + '/fuel-types').then(res => {
      this.arrayholder = res.data.data;
      this.setState({
        fuelTypes: this.arrayholder.map(c => ({label: c.name, value: c.code})),
      });
    });
  }

  async fetchTransmission() {
    await ApiHelper.get(API.vehicles + '/transmission').then(res => {
      this.arrayholder = res.data.data;
      this.setState({
        transmissionTypes: this.arrayholder.map(c => ({
          label: c.name,
          value: c.code,
        })),
      });
    });
  }

  async fetchCategoryList() {
    await ApiHelper.get(API.vehicles + '/categories').then(res => {
      this.arrayholder = res.data.data;
      this.setState({
        categories: this.arrayholder.map(c => ({
          label: c.name,
          value: c.catId,
        })),
      });
    });
  }

  async fetchBrands(id) {
    this.setState({
      loader: true,
    });
    await ApiHelper.get(API.vehicles + '/brands/' + id).then(res => {
      this.arrayholder = res.data.data;
      this.setState({
        brands: this.arrayholder.map(c => ({
          label: c.brandName,
          value: c.brandId,
        })),
      });
    });
    this.setState({
      loader: false,
    });
  }

  async fetchModels(id) {
    this.setState({
      loader: true,
    });
    await ApiHelper.get(API.vehicles + '/models/' + id).then(res => {
      this.arrayholder = res.data.data;
      this.setState({
        models: this.arrayholder.map(c => ({
          label: c.modelName,
          value: c.modelId,
        })),
      });
    });
    this.setState({
      loader: false,
    });
  }

  async fetchTrims(id) {
    this.setState({
      loader: true,
    });
    await ApiHelper.get(API.vehicles + '/trims/' + id).then(res => {
      this.arrayholder = res.data.data;
      this.setState({
        trims: this.arrayholder.map(c => ({
          label: c.trimName,
          value: c.trimId,
        })),
      });
    });
    this.setState({
      loader: false,
    });
  }

  handleEnd = () => {
    // this.state.vehicles.length > 10
    //   ? this.setState(
    //     {
    //       pageNo: this.state.pageNo + 1,
    //       loading: true,
    //       paginationLoading: true
    //     },
    //     () => this.getVehicles(),
    //   )
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
    await ApiHelper.patch(API.vehicles + '/' + id + '/status', formData)
      .then(res => {
        this.setState(
          {
            pageNo: 1,
          },
          () => this.getVehicles(),
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
    await ApiHelper.delete(API.vehicles + '/' + id, params)
      .then(res => {
        this.setState(
          {
            pageNo: 1,
          },
          () => this.getVehicles(),
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
          filterVisible: false,
          location: this.state.filterLocation,
          priceFrom: this.state.filterPriceFrom,
          priceTo: this.state.filterPriceTo,
          brandId: this.state.filterBrandId,
          modelId: this.state.filterModelId,
          trimId: this.state.filterTrimId,
          year: this.state.filterYear,
          colorId: this.state.filterColorId,
          fuelTypeId: this.state.fuelTypeId,
          transmissionTypeId: this.state.filterTransmissionTypeId,
          serviceHistory: this.state.filterServiceHistory,
          noOfDoors: this.state.filterNoOfDoors,
          condition: this.state.filterCondition,
          status: this.state.filterStatus,
          pageNo: 1,
        },
        () => {
          this.getVehicles();
        },
      );
    } else {
      this.setState({
        filterVisible: false,
      });
    }
    this.props.resetFilterProp();
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
        ) : this.state.vehicles.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={this.state.vehicles}
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
                  console.log("BKJBJK"+item.slug);
                  this.props.navigation.navigate('VehicleDetail', {
                    id: item?.slug,
                  });
                }}>
                <Left style={{}}>
                  <Thumbnail
                    round
                    source={{uri: CONSTANTS.SMALL_IMG + item.imageKey}}
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
                      {item.name}
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
                            this.props.navigation.navigate('ViewVehicle', {
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
                            this.props.navigation.navigate('AddVehicle', {
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
                              item.status ? '0' : '1',
                            );
                          }}>
                          <Text
                            style={({fontSize: 30}, theme.fontRegular)}
                            style={{
                              paddingHorizontal: 10,
                              paddingTop: 10,
                              fontSize: 16,
                            }}>
                            {item.status ? 'Disable' : 'Enable'}
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
                    at {item.location}
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
                        {item.year}
                      </Text>
                      {/* {item.status ? (
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
                        QAR {item.price}
                      </Text>
                      <Text
                        style={[
                          theme.fontMedium,
                          {
                            fontSize: width / 32,
                            color: '#b6b6b6',
                          },
                        ]}>
                        {moment(item.createdAt).format('DD MMMM, YYYY')}
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
              <Text>No vehicles found.</Text>
            </View>
          </Content>
        )}
        {this.state.paginationLoading && this.state.vehicles.length > 0 ? (
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
              {this.state.loader ? (
                <View
                  style={{
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: width,
                  }}>
                  <ActivityIndicator size="large" color="#bd1d53" />
                  <StatusBar barStyle="default" />
                </View>
              ) : null}
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
                  marginTop: height / 50,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Choose Category
                </Text>
              </View>
              <View style={{marginTop: height / 80}}>
                <Dropdown
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
                  onChangeText={value => {
                    this.setState({
                      filterCategory: value,
                    });
                    this.fetchBrands(value);
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 30,
                }}>
                <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                  Brand
                </Text>
              </View>
              <View style={{marginTop: height / 80}}>
                <Dropdown
                  placeholder="Choose brand"
                  placeholderTextColor="#808080"
                  data={this.state.brands}
                  value={this.state.filterBrandId}
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
                      filterBrandId: value,
                    });
                    this.fetchModels(value);
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 30,
                }}>
                <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                  Model
                </Text>
              </View>

              <View style={{marginTop: height / 80}}>
                <Dropdown
                  placeholder="Choose model"
                  placeholderTextColor="#808080"
                  data={this.state.models}
                  value={this.state.filterModelId}
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
                      filterModelId: value,
                    });
                    this.fetchTrims(value);
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 30,
                }}>
                <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                  Trim
                </Text>
              </View>
              <View style={{marginTop: height / 80}}>
                <Dropdown
                  placeholder="Choose trim"
                  placeholderTextColor="#808080"
                  data={this.state.trims}
                  value={this.state.filterTrimId}
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
                      filterTrimId: value,
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
                  Year
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
                  keyboardType="number-pad"
                  width={width / 1.3}
                  mandatory={false}
                  value={this.state.filterYear}
                  returnKeyType={'next'}
                  placeholder="Year"
                  placeholderTextColor={'#808B96'}
                  onChangeText={value => {
                    this.setState({
                      filterYear: value,
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
                  Color
                </Text>
              </View>
              <View style={{marginTop: height / 80}}>
                <Dropdown
                  placeholder="Choose color"
                  placeholderTextColor="#808080"
                  data={this.state.colors}
                  value={this.state.filterColorId}
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
                      filterColorId: value,
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
                  Fuel Type
                </Text>
              </View>
              <View style={{marginTop: height / 80}}>
                <Dropdown
                  placeholder="Choose fuel type"
                  placeholderTextColor="#808080"
                  data={this.state.fuelTypes}
                  value={this.state.filterFuelTypeId}
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
                      filterFuelTypeId: value,
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
                  Transmission Type
                </Text>
              </View>
              <View style={{marginTop: height / 80}}>
                <Dropdown
                  placeholder="Choose transmission type"
                  placeholderTextColor="#808080"
                  data={this.state.transmissionTypes}
                  value={this.state.filterTransmissionTypeId}
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
                      filterTransmissionTypeId: value,
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
                  Service History
                </Text>
              </View>
              <View style={{marginTop: height / 80}}>
                <Dropdown
                  placeholder="Choose service history"
                  placeholderTextColor="#808080"
                  data={[
                    {
                      label: 'Available',
                      value: 1,
                    },
                    {
                      label: 'Not Available',
                      value: 0,
                    },
                  ]}
                  value={this.state.filterServiceHistory}
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
                      filterServiceHistory: value,
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
                  No of doors
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
                  keyboardType="number-pad"
                  width={width / 1.3}
                  mandatory={false}
                  value={this.state.filterNoOfDoors}
                  returnKeyType={'next'}
                  placeholder="No of door"
                  placeholderTextColor={'#808B96'}
                  onChangeText={value => {
                    this.setState({
                      filterNoOfDoors: value,
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
                  Condition
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
                  keyboardType="number-pad"
                  width={width / 1.3}
                  mandatory={false}
                  value={this.state.filterCondition}
                  returnKeyType={'next'}
                  placeholder="Condition"
                  placeholderTextColor={'#808B96'}
                  onChangeText={value => {
                    this.setState({
                      filterCondition: value,
                    });
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
                  value={this.state.filterLocation}
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
                        filterLocation: value,
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

const styles = StyleSheet.create({});
