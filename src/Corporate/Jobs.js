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
// import {Dropdown} from 'react-native-material-dropdown-v2-fixed';
import DropDown from '.././components/DropDown';
import DropDown_icon from '../assets/svg/DropDown_icon.svg';
import BackBtn_white from '../assets/svg/BackBtn_white.svg';
import FloatingLabelBorderInput from '../components/FloatingLabelBorderInput';

export default class Jobs extends Component {
  constructor() {
    super();
    this.state = {
      jobs: [],
      loader: false,
      pageNo: 1,
      limit: 10,
      searchKey: '',
      filterSearchKey: '',
      notifyRequired: false,
      filterVisible: false,
      jobCategories: [],
      jobCategory: '',
      jobSubCategories: [],
      jobSubCategory: '',
      qualifications: [],
      qualification: '',
      filterqualification: '',
      filterCategory: '',
      filterSubCategory: '',
      locations: [],
      filterLocation: '',
      location: '',
      salaryFrom: '',
      filterSalaryFrom: '',
      salaryTo: '',
      filterSalaryTo: '',
      employeeType: '',
      filterEmployeeType: '',
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
          console.log('jobs page 2');
          this.getJobs();
          this.fetchCategoryList();
          this.getLocationsData();
          this.fetchQualificationList();
        },
      );
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot.notifyRequired) {
      if (this.state.jobs.length == 0) {
        this.setState(
          {
            pageNo: 1,
          },
          () => {
            this.getJobs();
            this.fetchCategoryList();
            this.getLocationsData();
            this.fetchQualificationList();
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
            jobCategory: '',
            jobSubCategory: '',
            filterCategory: '',
            filterSubCategory: '',
            filterLocation: '',
            location: '',
            salaryFrom: '',
            filterSalaryFrom: '',
            salaryTo: '',
            filterSalaryTo: '',
            employeeType: '',
            filterEmployeeType: '',
            status: '',
            filterStatus: '',
          },
          () => {
            this.getJobs();
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

  async getJobs() {
    let url = `?pageNo=${this.state.pageNo}&limit=${this.state.limit}&searchKey=${this.state.searchKey}`;

    if (this.state.jobCategory !== '') {
      url = url + `&categoryId=${this.state.jobCategory}`;
    }
    if (this.state.jobSubCategory !== '') {
      url = url + `&subCategoryId=${this.state.jobSubCategory}`;
    }
    if (this.state.qualification !== '') {
      url = url + `&qualification=${this.state.qualification}`;
    }
    if (this.state.employeeType !== '') {
      url = url + `&employeeType=${this.state.employeeType}`;
    }
    if (this.state.location !== '') {
      url = url + `&location=${this.state.location}`;
    }
    if (this.state.salaryFrom !== '') {
      url = url + `&salaryFrom=${this.state.salaryFrom}`;
    }
    if (this.state.salaryTo !== '') {
      url = url + `&salaryTo=${this.state.salaryTo}`;
    }
    if (this.state.status !== '') {
      url = url + `&status=${this.state.status}`;
    }
    // console.log('Search Url', url);
    await ApiHelper.get(API.myJobs + url)
      .then(res => {
        if ('data' in res.data && res.data.data) {
          var dataLen = res.data.data;
          this.setState({
            jobs:
              this.state.pageNo == 1
                ? res.data.data
                : [...this.state.jobs, ...res.data.data],
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

  async fetchQualificationList() {
    await ApiHelper.get(API.jobQualifications).then(res => {
      this.arrayholder = res.data.data;
      this.setState({
        qualifications: this.arrayholder.map(c => ({
          label: c.qualificationName,
          value: c.qualificationId,
        })),
      });
    });
  }
  async fetchCategoryList() {
    await ApiHelper.get(API.jobCategories).then(res => {
      this.arrayholder = res.data.data;
      this.setState({
        jobCategories: this.arrayholder.map(c => ({
          label: c.catName,
          value: c.catId,
        })),
      });
    });
  }
  async fetchSubCategories(id) {
    this.setState({
      loader: true,
    });
    await ApiHelper.get(API.jobSubCategories + id).then(res => {
      this.arrayholder = res.data.data;
      this.setState({
        jobSubCategories: this.arrayholder.map(c => ({
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

  handleEnd = () => {
    this.state.jobs.length > 10
      ? this.setState(
          {
            pageNo: this.state.pageNo + 1,
            loading: true,
            paginationLoading: true,
          },
          () => this.getJobs(),
        )
      : null;
  };

  async changeStatus(id, status) {
    this.setState({
      loader: true,
    });
    let formData = {
      id: id,
      status: status,
    };
    await ApiHelper.patch(API.jobs + '/' + id + '/status', formData)
      .then(res => {
        this.setState(
          {
            pageNo: 1,
          },
          () => this.getJobs(),
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
    await ApiHelper.delete(API.jobs + '/' + id, params)
      .then(res => {
        this.setState(
          {
            pageNo: 1,
          },
          () => this.getJobs(),
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
          jobCategory: this.state.filterCategory,
          jobSubCategory: this.state.filterSubCategory,
          filterVisible: false,
          location: this.state.filterLocation,
          salaryFrom: this.state.filterSalaryFrom,
          salaryTo: this.state.filterSalaryTo,
          employeeType: this.state.filterEmployeeType,
          qualification: this.state.filterQualification,
          status: this.state.filterStatus,
          pageNo: 1,
        },
        () => {
          this.getJobs();
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
        ) : this.state.jobs.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={this.state.jobs}
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
                onPress={() => {}}>
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
                        {fontSize: width / 27, color: '#747474'},
                      ]}
                      numberOfLines={1}>
                      {item.name}
                    </Text>
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
                            this.props.navigation.navigate('ViewJob', {
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
                            this.props.navigation.navigate('AddJob', {
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
                    </Menu>
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
                        {item.categoryName}
                      </Text>
                      {item.status ? (
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
                      )}
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
              <Text>No jobs found.</Text>
            </View>
          </Content>
        )}
        {this.state.paginationLoading && this.state.jobs.length > 0 ? (
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
                <DropDown
                  placeholder="Choose category"
                  placeholderTextColor="#808080"
                  data={this.state.jobCategories}
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
              <View
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
                  data={this.state.jobSubCategories}
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
                  Qualification
                </Text>
              </View>
              <View style={{marginTop: height / 80}}>
                <DropDown
                  placeholder="Choose qualification"
                  placeholderTextColor="#808080"
                  data={this.state.qualifications}
                  value={this.state.filterQualification}
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
                        filterQualification: value,
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
                  Employee Type
                </Text>
              </View>
              <View style={{marginTop: height / 80}}>
                <DropDown
                  placeholder="Choose employee type"
                  placeholderTextColor="#808080"
                  data={[
                    {
                      label: 'Full-time',
                      value: '1',
                    },
                    {
                      label: 'Part-time',
                      value: '2',
                    },
                  ]}
                  value={this.state.filterEmployeeType}
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
                        filterEmployeeType: value,
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
                <DropDown
                  placeholder="Choose location"
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
                  onChange={(value, index) => {
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
                  justifyContent: 'space-between',
                }}>
                <View>
                  <View
                    style={{
                      marginTop: height / 30,
                      flexDirection: 'row',
                    }}>
                    <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                      Salary From
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
                      value={this.state.filterSalaryFrom}
                      returnKeyType={'next'}
                      placeholder="Amount"
                      placeholderTextColor={'#808B96'}
                      onChangeText={value => {
                        this.setState({
                          filterSalaryFrom: value,
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
                      Salary To
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
                      value={this.state.filterSalaryTo}
                      returnKeyType={'next'}
                      placeholder="Amount"
                      placeholderTextColor={'#808B96'}
                      onChangeText={value => {
                        this.setState({
                          filterSalaryTo: value,
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
                  Active Status
                </Text>
              </View>
              <View style={{marginTop: height / 80}}>
                <DropDown
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
                  onChange={(value, index) => {
                    this.setState(
                      {
                        filterStatus: value,
                      },
                      () => {
                        // console.log('usertype>', this.state.countryId);
                      },
                    );
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
