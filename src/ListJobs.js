import React, {Component} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
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
import Time_icon from './assets/svg/time.svg';
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
import {Dropdown} from 'react-native-element-dropdown';
import DropDown from './components/DropDown';
import DropDown_icon from './assets/svg/DropDown_icon.svg';
import FloatingLabelInput from './components/FloatingLabelInput';
import moment from 'moment';
import FloatingLabelBorderInput from './components/FloatingLabelBorderInput';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import FilterResetSvg from './assets/svg/FilterReset.svg';
import CustomMarkerLeft from './components/CustomMarkerLeft';
import CustomMarkerRight from './components/CustomMarkerRight';
import CustomLabel from './components/CustomLabel';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faShare} from '@fortawesome/free-solid-svg-icons';
import shareLink from './helpers/SocialShare';

var {height, width} = Dimensions.get('window');
export default class ListJobs extends Component {
  empTypeData = [
    {
      label: 'Full-time',
      value: '1',
    },
    {
      label: 'Part-time',
      value: '2',
    },
  ];
  salaryTypeData = [
    {
      label: 'Monthly',
      value: '1',
    },
    {
      label: 'Yearly',
      value: '2',
    },
  ];
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
      filterQualification: '',
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
      paginationLoading: false,
      values: [3, 7],
      filterData: false,
      value: null,
      isFocus: false,
    };
  }
  multiSliderValuesChange = values => {
    this.setState({
      values,
    });
  };
  componentDidMount() {
    this.setState({loader: true});
    // this.getJobs();

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
        () => this.getJobs(),
      );
    } else {
      this.getPromotedList();
    }
    this.fetchFilterAttributes();
  }

  fetchFilterAttributes() {
    this.fetchCategoryList();
    this.getLocationsData();
    this.fetchQualificationList();
  }

  async getPromotedList() {
    await ApiHelper.get(API.jobsPromoted)
      .then(res => {
        if ('data' in res.data && res.data.data) {
          var dataLen = res.data.data;

          // console.log(dataLen);
          var promotedList = [];
          res.data.data.map(item => {
            console.log(item);
            var updatedItem = {...item, ...{promoted: true}};
            promotedList.push(updatedItem);
          });
          this.setState(
            {
              jobs: promotedList,
            },
            () => {
              // console.log(this.state.jobs);
            },
          );
          this.getJobs();
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

  async getJobs() {
    let url = `?pageNo=${this.state.pageNo}&limit=${this.state.limit}`;
    if (this.state.searchKey !== '') {
      url = url + `&searchKey=${this.state.searchKey}`;
    }
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
    console.log('Search Url', url);

    await ApiHelper.get(API.jobs + url)
      .then(res => {
        if ('data' in res.data && res.data.data) {
          var dataLen = res.data.data;
          this.setState({
            jobs:
              // this.state.pageNo == 1
              //   ? res.data.data
              //   :
              [...this.state.jobs, ...res.data.data],
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
          filterData: true,
          jobs: [],
          totalCount: 0,
        },
        () => {
          this.getJobs();

          // this.getPromotedList();
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
        loader: true,
        pageNo: 1,
        filterData: false,
        jobs: [],
        totalCount: 0,
      },
      () => {
        // this.getJobs();

        this.getPromotedList();
      },
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
          () => this.getJobs(),
        )
      : null;
  };

  getEmployeeType(id) {
    return this.empTypeData
      .filter(item => item.value === id)
      .map(item => item.label);
  }
  getSalaryType(id) {
    return this.salaryTypeData
      .filter(item => item.value === id)
      .map(item => item.label);
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
            Jobs
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
                      data={this.state.jobCategories}
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
                        this.setState({
                        filterCategory: item.value,
                      });
                      this.fetchSubCategories(item.value);
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
                </View> */}
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
                  {/* <DropDown
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
                      data={this.state.qualifications}
                      value={this.state.filterQualification}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!this.state.isFocus ? 'Choose qualification' : '...'}
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
                          filterQualification: item.value,
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
                    Employee Type
                  </Text>
                </View>
                <View style={{marginTop: height / 80}}>
                  {/* <DropDown
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
                        label: 'Full-time',
                        value: '1',
                      },
                      {
                        label: 'Part-time',
                        value: '2',
                      },
                    ]}
                    value={this.state.filterEmployeeType}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!this.state.isFocus ? 'Choose empoyee type' : '...'}
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
                          filterEmployeeType: item.value,
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
                    value={this.state.filterLocation}
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
                          filterLocation: item.value,
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
                {/* <View
                  style={{
                    flexDirection: 'row',
                    marginTop: height / 30,
                  }}>
                  <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                    Salary Range
                  </Text>
                </View> */}
                {/* <View style={{marginTop: height / 25}}>
                  <MultiSlider
                    selectedStyle={{
                      backgroundColor: '#BC1D54',
                      height: 5,
                    }}
                    unselectedStyle={{
                      backgroundColor: '#F2DBE4',
                      height: 5,
                      borderRadius: 5,
                    }}
                    values={[
                      this.state.filterSalaryFrom,
                      this.state.filterSalaryTo,
                    ]}
                    sliderLength={width / 1.2}
                    onValuesChange={this.multiSliderValuesChange}
                    min={0}
                    max={10}
                    step={1}
                    showSteps={false}
                    enableLabel={true}
                    isMarkersSeparated={true}
                    customMarkerLeft={CustomMarkerLeft}
                    customMarkerRight={CustomMarkerRight}
                    customLabel={CustomLabel}
                  />
                </View> */}
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
                      backgroundColor: '#ffffff',
                      borderRadius: 8,
                      borderColor: '#f0eced',
                      marginStart: width / 20,
                      marginEnd: width / 20,
                      marginVertical: 5,
                    }}
                    onPress={() => {
                      this.props.navigation.navigate('JobDetails', {
                        id: item.slug,
                      });
                    }}>
                    <Left style={{}}>
                      {item.imageKey == '' ? (
                        <Thumbnail
                          style={{
                            width: width / 2.9,
                            height: width / 2.6,
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
                            height: width / 2.6,
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
                              color: '#747474',
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
                            let url = 'jobs/' + item?.slug;
                            shareLink(url);
                          }}>
                          <FontAwesomeIcon icon={faShare} color={'#bd1d53'} />
                        </TouchableOpacity>
                      </View>
                      <Text
                        style={[
                          theme.fontMedium,
                          {fontSize: width / 30, color: '#747474'},
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
                          }}>
                          <Text
                            style={[
                              theme.fontBold,
                              {
                                fontSize: width / 27,
                              },
                              {
                                color: AppColors.fontRed,
                              },
                            ]}>
                            QAR {item.salary}
                          </Text>
                          <Text
                            style={{
                              fontStyle: 'italic',
                              marginLeft: width / 70,
                              color: '#747474',
                            }}>
                            {this.getSalaryType(item.salaryType)}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: 4,
                          }}>
                          {/* <Time_icon width="12" height="12" /> */}
                          <Text
                            style={[
                              theme.fontMedium,
                              {
                                fontSize: width / 30,
                                color: '#747474',
                              },
                            ]}>
                            JobId: {item.jobId}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 4,
                          }}>
                          <Time_icon width="12" height="12" />
                          <Text
                            style={[
                              theme.fontMedium,
                              {
                                fontSize: width / 30,
                                color: '#747474',
                                marginLeft: 8,
                              },
                            ]}>
                            {this.getEmployeeType(item.employeeType)}
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
    padding: 5,
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
