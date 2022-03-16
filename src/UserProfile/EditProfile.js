import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Container, Content, Icon} from 'native-base';
var {height, width} = Dimensions.get('window');
import BackBtn_white from '../assets/svg/BackBtn_white.svg';
import Notification_icon_white from '../assets/svg/Notification_icon_white.svg';
import ProfilePic from '../assets/svg/ProfilePic.svg';
import FloatingLabelBorderInput from '../components/FloatingLabelBorderInput';
import DropDownBorder from '../components/DropDownBorder';
import FlipToggle from 'react-native-flip-toggle-button';
import {CONSTANTS} from '../config/constants';
import {API} from '../config/api';
import {ApiHelper} from '../helpers/ApiHelper';
import Loader from '../components/Loader';
import Toast from 'react-native-simple-toast';
import DocumentPicker from 'react-native-document-picker';
import IconSimple from '../../node_modules/react-native-vector-icons/SimpleLineIcons';
import theme from '../config/styles.js';
import FileUpload from '../helpers/FileUpload';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorageHelper from '../helpers/AsyncStorageHelper';
import {AppColors} from '../Themes/';
import DatePicker from 'react-native-datepicker';
import Calender_icon from '../assets/svg/Calender_icon.svg';
import {borderRadius} from 'styled-system';
export default class EditProfile extends Component {
  industryTypes = [
    {label: 'Product', value: 1},
    {label: 'Service', value: 2},
    {label: 'Product & Service', value: 3},
  ];
  constructor() {
    super();
    this.state = {
      datePickerVisible: false,
      name: '',
      email: '',
      mobile: '',
      place: '',
      countryName: '',
      countryCode: '',
      notification: '0',
      dob: '',
      existingProfilePic: '',
      existingBannerPic: '',
      removedImages: [],
      profilePic: {},
      profileImage: '',
      bannerPic: {},
      bannerImage: '',
      error: false,
      passSecure: true,
      loader: false,
      countryId: '',
      isNotification: false,
      userdata: {},
      countries: [],
      userRole: '',
      categoryId: '',
      categoryName: '',
      businessCategoryList: [],
      subCategoryId: '',
      selectedSubCategory: [],
      subCategoryIdz: [],
      subCategoryName: '',
      subCategoryList: [],
      selectedItems: [],
      industryList: [],
      industryTypeName: '',
      industryTypeId: '',
      bannerUploadData: null,
      bannerPickerData: {},
      profileUploadData: null,
      profilePickerData: {},
    };
  }

  componentDidMount() {
    this.setState({loader: true, isNotification: false});
    this.getUserData();
    this.getCountries();
    // setTimeout(() => this.setState({loader: false}), 1000);
  }
  openDatePicker() {
    this.setState({datePickerVisible: true});
  }

  async testFileUpload() {
    const params = new FormData();
    params.append(
      'file',
      this.state.profilePic?.uri ? this.state.profilePic : '',
    );
    console.log('Upload data', JSON.stringify(params));

    await ApiHelper.form_post(API.fileUpload, params)
      .then(res => {
        console.log('test file upload res --- ', res);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async uploadprofilePic() {
    const options = {
      title: 'Select Profile Picture',
      type: 'photo',
      width: 500,
      height: 500,
      self: this,
      dataState: 'profilePickerData',
      upload: false,
      progressState: '',
      size: '500x500',
      crop: false,
    };
    this.profileUploadData = await FileUpload.filePicker(options);
    this.setState({
      profilePic: {
        uri: this.state.profilePickerData.path,
        type: this.state.profilePickerData.mime,
        name: this.state.profilePickerData.path.replace(/^.*[\\\/]/, ''),
      },
    });
  }
  async uploadbannerPic() {
    const options = {
      title: 'Select Profile Banner',
      type: 'photo',
      width: 1024,
      height: 403,
      self: this,
      dataState: 'bannerPickerData',
      upload: false,
      progressState: '',
      size: '1024x403',
      crop: false,
    };
    this.bannerUploadData = await FileUpload.filePicker(options);
    this.setState({
      bannerPic: {
        uri: this.state.bannerPickerData.path,
        type: this.state.bannerPickerData.mime,
        name: this.state.bannerPickerData.path.replace(/^.*[\\\/]/, ''),
      },
    });
  }

  async getUserData() {
    await ApiHelper.get(API.userData)
      .then(res => {
        var dataLen = res.data.data;
        AsyncStorageHelper.storeItem('USERDATA', JSON.stringify(dataLen));
        var subCategoryIdzInt = dataLen.businenessSubCategory.map(i =>
          Number(i),
        );
        this.setState(
          {
            userdata: dataLen,
            name: dataLen.name,
            email: dataLen.email,
            mobile: dataLen.mobile,
            place: dataLen.addressString ? dataLen.addressString : '',
            countryName: 'Qatar',
            countryCode: 'QA',
            notification: dataLen.notification == '1' ? true : false,
            dob: dataLen.dob,
            existingProfilePic: dataLen.profilePic ? dataLen.profilePic : '',
            existingBannerPic: dataLen.bannerPic ? dataLen.bannerPic : '',
            profilePic: {},
            bannerPic: {},
            removedImages: [],
            userRole: dataLen.userRole,
            categoryId: dataLen.businenessCategory,
            subCategoryId: subCategoryIdzInt.toString(),
            subCategoryIdz: dataLen.businenessSubCategory,
            industryTypeId: dataLen.industryType[0],
            loader: false,
            profilePickerData: {},
            bannerPickerData: {},
          },
          () => {
            // console.log('user arr', this.state.userdata);
          },
        );
        if (this.state.userRole == '2') {
          this.fetchCategoryList();
          this.fetchIndustryList();
          this.fetchSubCategoryList();
        }
      })
      .catch(err => {
        this.setState({
          loader: false,
        });
        console.log(err);
      });
  }
  async getCountries() {
    await ApiHelper.get(API.countries)
      .then(res => {
        var dataLen = res.data.data;
        var len = dataLen.length;
        var countryList = [];
        for (let i = 0; i < len; i++) {
          let row = dataLen[i];
          let obj = {
            label: row.countryName,
            value: row.countryCode + '-' + row.countryName,
          };
          countryList.push(obj);
        }
        this.setState({countries: countryList});
      })
      .catch(err => {
        this.setState({
          loader: false,
        });
        console.log(err);
      });
  }
  async updateProfile() {
    this.setState({
      emailValid: true,
      loader: true,
    });
    if (
      this.state.name == '' ||
      (this.state.countryCode == '' && this.state.countryName == '')
    ) {
      this.setState({
        error: true,
        loader: false,
      });
    } else {
      let formError = false;
      let emailreg = /^(?:[\w\.\-]+@([\w\-]+\.)+[a-zA-Z+ -]+)?$/;
      if (emailreg.test(this.state.email) === false) {
        this.setState({
          error: true,
          emailValid: false,
          loader: false,
        });
        formError = true;
      }

      if (this.state.mobile == '' && this.state.mobile.length < 6) {
        this.setState({
          error: true,
          mobileValid: false,
          loader: false,
        });
        formError = true;
      }

      if (formError) {
        return false;
      }

      const params = new FormData();
      params.append('name', this.state.name);
      params.append('email', this.state.email.trim());
      params.append('mobile', this.state.mobile.trim());
      params.append('addressString', this.state.place);
      params.append('countryCode', this.state.countryCode);
      params.append('countryName', this.state.countryName);
      params.append('notification', this.state.notification ? '1' : '0');
      params.append('dob', this.state.dob);
      params.append('existingProfilePic', this.state.existingProfilePic);
      params.append('existingBannerPic', this.state.existingBannerPic);
      params.append('removedImages', JSON.stringify(this.state.removedImages));
      if (this.state.profilePic?.uri) {
        params.append(
          'profilePic',
          this.state.profilePic?.uri ? this.state.profilePic : '',
        );
      }
      if (this.state.bannerPic?.uri) {
        params.append(
          'bannerPic',
          this.state.bannerPic?.uri ? this.state.bannerPic : '',
        );
      }

      await ApiHelper.form_put(API.updateIndUser, params)
        .then(res => {
          if (res == undefined) {
            this.setState({
              loader: false,
            });
          } else {
            this.setState({
              loader: false,
            });
            Toast.showWithGravity(res.data.message, Toast.LONG, Toast.BOTTOM);
            this.getUserData();
          }
        })
        .catch(err => {
          this.setState({
            loader: false,
          });
          console.log(err);
        });
    }
  }

  async updateCorporateProfile() {
    this.setState({
      emailValid: true,
      loader: true,
    });
    if (
      this.state.name == '' ||
      (this.state.countryCode == '' && this.state.countryName == '') ||
      this.state.categoryId == '' ||
      this.state.subCategoryId == '' ||
      this.state.industryTypeId == ''
    ) {
      this.setState({
        error: true,
        loader: false,
      });
    } else {
      let formError = false;
      let emailreg = /^(?:[\w\.\-]+@([\w\-]+\.)+[a-zA-Z+ -]+)?$/;
      if (emailreg.test(this.state.email) === false) {
        this.setState({
          error: true,
          emailValid: false,
          loader: false,
        });
        formError = true;
      }

      if (this.state.mobile == '' && this.state.mobile.length < 6) {
        this.setState({
          error: true,
          mobileValid: false,
          loader: false,
        });
        formError = true;
      }
      if (formError) {
        return false;
      }

      const params = new FormData();
      params.append('name', this.state.name);
      params.append('email', this.state.email.trim());
      params.append('mobile', this.state.mobile.trim());
      params.append('addressString', this.state.place);
      params.append('countryCode', this.state.countryCode);
      params.append('countryName', this.state.countryName);
      params.append('notification', this.state.notification ? '1' : '0');
      params.append('existingProfilePic', this.state.existingProfilePic);
      params.append('existingBannerPic', this.state.existingBannerPic);
      params.append('removedImages', JSON.stringify(this.state.removedImages));
      params.append('businenessCategory', this.state.categoryId);
      params.append('businenessSubCategory', this.state.subCategoryId);
      params.append('industryType', this.state.industryTypeId);
      if (this.state.profilePic?.uri) {
        params.append(
          'profilePic',
          this.state.profilePic?.uri ? this.state.profilePic : '',
        );
      }
      if (this.state.bannerPic?.uri) {
        params.append(
          'bannerPic',
          this.state.bannerPic?.uri ? this.state.bannerPic : '',
        );
      }
      console.log('Upload data', JSON.stringify(params));

      await ApiHelper.form_put(API.updateCorpUser, params)
        .then(res => {
          if (res == undefined) {
            this.setState({
              loader: false,
            });
          } else {
            this.setState({
              loader: false,
            });
            Toast.showWithGravity(res.data.message, Toast.LONG, Toast.BOTTOM);
            this.getUserData();
          }
        })
        .catch(err => {
          this.setState({
            loader: false,
          });
          console.log(err);
        });
    }
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

  async fetchSubCategoryList() {
    await ApiHelper.get(API.businessSubCategory + this.state.categoryId).then(
      res => {
        this.arrayholder = res.data.data;
        var dataLen = res.data.data;
        var len = dataLen.length;
        var subCategoryList = [];
        for (let i = 0; i < len; i++) {
          let row = dataLen[i];
          let obj = {name: row.subCategoryName, id: row.subCategoryId};
          subCategoryList.push(obj);
        }
        const subCategoryItems = [
          {
            name: 'Sub Categories',
            id: 0,
            children: subCategoryList,
          },
        ];
        const subCategoryIdzInt = this.state.subCategoryIdz.map(i => Number(i));
        this.setState({
          subCategoryList: subCategoryItems,
          selectedSubCategory: subCategoryIdzInt,
        });
      },
    );
  }

  async fetchIndustryList() {
    await ApiHelper.get(API.industryTypes).then(res => {
      this.arrayholder = res.data.data;
      var dataLen = res.data.data;
      var len = dataLen.length;
      var industryListArr = [];
      for (let i = 0; i < len; i++) {
        let row = dataLen[i];
        let obj = {label: row.title, value: row.code};
        industryListArr.push(obj);
      }
      this.setState({industryList: industryListArr});
    });
  }
  onSelectedItemsChange = selectedSubCategory => {
    console.log('selectedSubCategory', selectedSubCategory);
    this.setState({
      selectedSubCategory,
      subCategoryId: selectedSubCategory.toString(),
    });
  };

  render() {
    return (
      <Container>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#bd1d53',
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
            My Profile
          </Text>
          <View style={{position: 'absolute', right: width / 20}}>
            <TouchableOpacity
              onPress={() => {
                this.state.userRole == '2'
                  ? this.updateCorporateProfile()
                  : this.updateProfile();
              }}>
              <Icon
                name="checkmark"
                height="22"
                width="22"
                style={{
                  color: '#fff',
                }}
              />
              {/* <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: width / 22,
                  fontWeight: 'bold',
                }}>
                Save
              </Text> */}
            </TouchableOpacity>
            {/* <Notification_icon_white height="22" width="22" /> */}
          </View>
        </View>

        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: '#fff',
            paddingBottom: height / 10,
          }}>
          <Loader visibility={this.state.loader} />

          {'bannerPic' in this.state.userdata &&
          this.state.userdata.bannerPic != '' ? (
            <Image
              source={{
                uri: this.state.bannerPickerData.path
                  ? this.state.bannerPickerData.path
                  : CONSTANTS.THUMBNAIL_IMG + this.state.userdata.bannerPic,
              }}
              style={{
                height: height / 4,
                width: width / 1,
                opacity: 0.5,
                resizeMode: 'cover',
                flex: 1,
                backgroundColor: 'rgba(0.4,0.5,0.5,1.5)',
              }}
            />
          ) : (
            <Image
              source={
                this.state.bannerPickerData.path
                  ? {uri: this.state.bannerPickerData.path}
                  : require('../assets/images/bg1.jpeg')
              }
              style={{
                height: height / 4,
                width: width / 1,
                opacity: 0.5,
                backgroundColor: 'rgba(0.4,0.5,0.5,1.5)',
              }}
            />
          )}
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
              top: height / 5,
              right: width / 15,
              backgroundColor: '#ffffff69',
              borderRadius: 50,
              padding: 8,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.uploadbannerPic();
              }}>
              <IconSimple
                style={{
                  fontSize: width / 22,
                  color: '#fff',
                }}
                name="camera"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
              top: height / 35,
              right: width / 2.9,
              backgroundColor: '#ffffff69',
              borderRadius: 50,
              padding: 8,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.uploadprofilePic();
              }}>
              <IconSimple
                style={{
                  fontSize: width / 22,
                  color: '#fff',
                }}
                name="camera"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'absolute',
              top: height / 20,
              left: 0,
              justifyContent: 'center',
              alignItems: 'center',
              right: 0,
              marginLeft: 'auto',
              marginRight: 'auto',
              marginHorizontal: 0,
              textAlign: 'center',
              flex: 2,
            }}>
            <View style={{maxWidth: width / 1.5}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: height / 90,
                }}>
                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 150 / 2,
                    overflow: 'hidden',
                    backgroundColor: 'white',
                  }}>
                  {'profilePic' in this.state.userdata &&
                  this.state.userdata.profilePic != '' ? (
                    <Image
                      source={{
                        uri: this.state.profilePickerData.path
                          ? this.state.profilePickerData.path
                          : CONSTANTS.THUMBNAIL_IMG +
                            this.state.userdata.profilePic,
                      }}
                      style={{height: 70, width: 70}}
                    />
                  ) : this.state.profilePickerData.path ? (
                    <Image
                      source={{
                        uri: this.state.profilePickerData.path,
                      }}
                      style={{height: 70, width: 70}}
                    />
                  ) : (
                    <ProfilePic height="70" width="70" />
                  )}
                </View>
              </View>
              <Text
                style={[
                  theme.fontBold,
                  {
                    color: 'white',
                    fontSize: width / 22,
                    textAlign: 'center',
                  },
                ]}
                numberOfLines={1}>
                {this.state.userdata.name}
              </Text>
              <Text
                style={[
                  theme.fontMedium,
                  {
                    color: 'white',
                    fontSize: width / 28,
                    textAlign: 'center',
                  },
                ]}
                numberOfLines={1}>
                {this.state.userdata.username}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginStart: width / 15,
              marginEnd: width / 15,
              marginTop: height / 30,
              flexDirection: 'column',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: width / 23,
                color: AppColors.fontColorDark,
              }}>
              My Profile
            </Text>
            {this.state.userRole == '2' ? (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('AddBusiness');
                }}
                style={{position: 'absolute', right: 0}}>
                <Text style={{color: '#3366FF', fontSize: width / 23}}>
                  + Add Business
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View
            style={{
              marginTop: height / 30,
              borderBottomWidth: 6,
              borderBottomColor: AppColors.bgColorPages,
              marginBottom: height / 40,
            }}
          />

          <View style={{marginStart: width / 15, marginEnd: width / 15}}>
            <View style={{flexDirection: 'row', marginBottom: height / 90}}>
              <Text style={{fontSize: width / 24}}>
                {this.state.userRole == '2' ? 'Company Name' : 'Name'}
              </Text>
              <Text style={{color: '#F00000', fontSize: width / 23}}>*</Text>
            </View>

            <FloatingLabelBorderInput
              backgroundColor={AppColors.bgColorPages}
              width={width / 1.15}
              mandatory={true}
              value={this.state.name}
              returnKeyType={'next'}
              ref={ref => (this.customInput1 = ref)}
              refInner="innerTextInput1"
              //   placeholder="Reference Number"
              //   placeholderTextColor={'#808B96'}
              onChangeText={value => {
                this.setState({
                  name: value,
                });
              }}
            />
            {this.state.name == '' && this.state.error ? (
              <Text style={styles.errorStyle}>Please enter your name</Text>
            ) : null}
            {this.state.userRole == '2' ? (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: height / 90,
                    marginTop: height / 50,
                  }}>
                  <Text style={{fontSize: width / 24}}>Category</Text>
                  <Text style={{color: '#F00000', fontSize: width / 23}}>
                    *
                  </Text>
                </View>
                <DropDownBorder
                  width={width / 1.32}
                  placeholder="Choose Category"
                  placeholderTextColor="#808080"
                  data={this.state.businessCategoryList}
                  value={this.state.categoryId}
                  multiline={true}
                  onChange={(value, index) => {
                    this.setState(
                      {
                        categoryId: value,
                      },
                      () => {
                        this.fetchSubCategoryList();
                        // console.log('usertype>', this.state.categoryName);
                      },
                    );
                  }}
                />
                {this.state.categoryId == '' && this.state.error ? (
                  <Text style={styles.errorStyle}>Please select category</Text>
                ) : null}
              </View>
            ) : null}
            {this.state.userRole == '2' ? (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: height / 90,
                    marginTop: height / 50,
                  }}>
                  <Text style={{fontSize: width / 24}}>Sub Category</Text>
                  <Text style={{color: '#F00000', fontSize: width / 23}}>
                    *
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: AppColors.borderColor,
                    backgroundColor: AppColors.bgColorPages,
                    color: AppColors.fontColorDark,
                    height: height / 14,
                    borderRadius: 8,
                  }}>
                  <ScrollView>
                    <SectionedMultiSelect
                      styles={{
                        toggleIcon: AppColors.primaryColor,
                      }}
                      colors={{
                        primary: AppColors.primaryColor,
                        selectToggleTextColor: '#808080',
                      }}
                      confirmText={'Ok'}
                      hideSearch={true}
                      items={this.state.subCategoryList}
                      IconRenderer={MaterialIcons}
                      uniqueKey="id"
                      subKey="children"
                      selectText="Sub Categories *"
                      showDropDowns={false}
                      readOnlyHeadings={true}
                      onSelectedItemsChange={this.onSelectedItemsChange}
                      selectedItems={this.state.selectedSubCategory}
                    />
                  </ScrollView>
                </View>
                {this.state.subCategoryId == '' && this.state.error ? (
                  <Text style={styles.errorStyle}>
                    Please select sub category
                  </Text>
                ) : null}
              </View>
            ) : null}
            {this.state.userRole == '2' ? (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: height / 90,
                    marginTop: height / 50,
                  }}>
                  <Text style={{fontSize: width / 24}}>Industry Type</Text>
                  <Text style={{color: '#F00000', fontSize: width / 23}}>
                    *
                  </Text>
                </View>
                <DropDownBorder
                  width={width / 1.32}
                  placeholder="Choose Industry Type"
                  placeholderTextColor="#808080"
                  data={this.industryTypes}
                  multiline={false}
                  value={this.state.industryTypeId}
                  onChange={(value, index) => {
                    this.setState(
                      {
                        industryTypeId: value,
                      },
                      () => {
                        // console.log('usertype>', this.state.industryTypeId);
                      },
                    );
                  }}
                />
                {this.state.industryTypeId == '' && this.state.error ? (
                  <Text style={styles.errorStyle}>
                    Please select industry type
                  </Text>
                ) : null}
              </View>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={{fontSize: width / 24}}>Email</Text>
            </View>

            <FloatingLabelBorderInput
              backgroundColor={AppColors.bgColorPages}
              width={width / 1.15}
              mandatory={true}
              value={this.state.email}
              returnKeyType={'next'}
              ref={ref => (this.customInput2 = ref)}
              refInner="innerTextInput2"
              onChangeText={value => {
                this.setState({
                  email: value,
                });
              }}
            />
            {this.state.emailValid == false && this.state.error ? (
              <Text style={styles.errorStyle}>
                Please enter a valid email address
              </Text>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={{fontSize: width / 24}}>Phone Number</Text>
            </View>

            <FloatingLabelBorderInput
              backgroundColor={AppColors.bgColorPages}
              width={width / 1.15}
              mandatory={true}
              value={this.state.mobile}
              returnKeyType={'next'}
              ref={ref => (this.customInput2 = ref)}
              refInner="innerTextInput2"
              onChangeText={value => {
                this.setState({
                  mobile: value,
                });
              }}
            />
            {this.state.mobileValid == false && this.state.error ? (
              <Text style={styles.errorStyle}>
                Please enter a valid phone number
              </Text>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={{fontSize: width / 24}}>Place</Text>
            </View>

            <FloatingLabelBorderInput
              backgroundColor={AppColors.bgColorPages}
              width={width / 1.15}
              mandatory={true}
              value={this.state.place}
              returnKeyType={'next'}
              ref={ref => (this.customInpu3 = ref)}
              refInner="innerTextInput3"
              multiline={true}
              //   onSubmitEditing={() =>
              //     this.customInput6.refs.innerTextInput6.focus()
              //   }
              //   placeholder="Reference Number"
              //   placeholderTextColor={'#808B96'}
              onChangeText={value => {
                this.setState({
                  place: value,
                });
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={{fontSize: width / 24}}>Country</Text>
              <Text style={{color: '#F00000', fontSize: width / 23}}>*</Text>
            </View>
            <DropDownBorder
              width={width / 1.32}
              placeholder="Choose Country"
              placeholderTextColor="#808080"
              data={[{label: 'Qatar', value: 'QA'}]}
              multiline={false}
              value={'QA'}
              onChange={(value, index) => {
                var country_value = value.split('-');
                this.setState(
                  {
                    countryCode: 'QA',
                    countryName: 'Qatar',
                  },
                  () => {
                    // console.log('usertype>', this.state.countryId);
                  },
                );
              }}
            />
            {this.state.countryCode == '' &&
            this.state.countryName == '' &&
            this.state.error ? (
              <Text style={styles.errorStyle}>Please select your country</Text>
            ) : null}
            {this.state.userRole == '1' ? (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: height / 90,
                    marginTop: height / 50,
                  }}>
                  <Text style={{fontSize: width / 24}}>Date of Birth</Text>
                </View>
                <DatePicker
                  style={{
                    width: 0,
                    height: 0,
                    borderWidth: 0,
                    borderColor: 'white',
                  }}
                  showIcon={false}
                  ref="datepicker"
                  date={this.state.dob}
                  mode="date"
                  maxDate="31-12-2000"
                  customStyles={{
                    dateInput: {
                      borderLeftWidth: 0,
                      borderRightWidth: 0,
                      borderTopWidth: 0,
                    },
                  }}
                  fhfh
                  format="DD-MM-YYYY"
                  confirmBtnText="OK"
                  cancelBtnText="Cancel"
                  onDateChange={date => {
                    this.setState({dob: date});
                  }}
                />
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    this.refs.datepicker.onPressDate();
                  }}
                  activeOpacity={0.8}>
                  <View style={{flexDirection: 'row'}}>
                    <FloatingLabelBorderInput
                      disabled={true}
                      backgroundColor={AppColors.bgColorPages}
                      width={width / 1.15}
                      mandatory={true}
                      value={this.state.dob}
                      returnKeyType={'next'}
                      ref={ref => (this.customInput4 = ref)}
                      editable={false}
                      refInner="innerTextInput4"
                      placeholder="Date Of Birth"
                      placeholderTextColor={'#808B96'}
                      onChangeText={value => {
                        this.setState({
                          dob: value,
                        });
                      }}
                    />
                    <Calender_icon
                      height="30"
                      width="30"
                      style={{position: 'absolute', right: width / 25, top: 10}}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            ) : // <View>

            //   <FloatingLabelBorderInput
            //    backgroundColor={AppColors.bgColorPages}
            //     width={width / 1.15}
            //     mandatory={true}
            //     value={this.state.dob}
            //     returnKeyType={'next'}
            //     ref={ref => (this.customInpu4 = ref)}
            //     refInner="innerTextInput4"
            //     multiline={true}
            //     //   onSubmitEditing={() =>
            //     //     this.customInput6.refs.innerTextInput6.focus()
            //     //   }
            //     //   placeholder="Reference Number"
            //     //   placeholderTextColor={'#808B96'}
            //     onChangeText={value => {
            //       this.setState({
            //         dob: value,
            //       });
            //     }}
            //   />
            // </View>
            null}

            <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={{fontSize: width / 24}}>Notification</Text>
              <Text style={{color: '#F00000', fontSize: width / 23}}>*</Text>
            </View>
            <FlipToggle
              value={this.state.notification}
              buttonWidth={50}
              buttonHeight={20}
              buttonOnColor="#00CC66"
              buttonOffColor={AppColors.fontColorLight}
              disabledButtonOnColor="#919191"
              sliderOnColor="white"
              sliderOffColor="#919191"
              buttonRadius={50}
              labelStyle={{color: 'white', fontSize: '23'}}
              onToggle={value => {
                this.setState({notification: value});
              }}
            />
          </View>
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  errorStyle: {
    color: 'red',
    fontSize: width / 30,
    width: width / 1.1,
    marginBottom: height / 80,
    marginTop: 5,
    textAlign: 'left',
    marginLeft: 8,
  },
});
