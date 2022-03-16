import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {Container, Content} from 'native-base';
import FloatingLabelInput from '../components/FloatingLabelInput';
var {height, width} = Dimensions.get('window');
import User_icon from '../assets/svg/User_icon.svg';
import Mobile_icon from '../assets/svg/Mobile_icon.svg';
import Email_icon from '../assets/svg/Email_icon.svg';
import Calender_icon from '../assets/svg/Calender_icon.svg';
import Referrence_icon from '../assets/svg/Referrence_icon.svg';
import Password_icon from '../assets/svg/Password_icon.svg';
import Back_button_icon from '../assets/svg/Back_button_icon.svg';
import DatePicker from 'react-native-datepicker';
import DropDown from '../components/DropDown';
import CheckBox from '../assets/svg/CheckBox.svg';
import Indivudal_icon from '../assets/svg/Indivudal_icon.svg';
import Companyname_icon from '../assets/svg/Companyname_icon.svg';
import Industry_icon from '../assets/svg/Industry_icon.svg';
import Category_icon from '../assets/svg/Category_icon.svg';
import {Dropdown} from 'react-native-material-dropdown-v2-fixed';
import DropDown_icon from '../assets/svg/DropDown_icon.svg';
import {ApiHelper} from '../helpers/ApiHelper';
import {API} from '../config/api';
import Loader from '../components/Loader';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {StackActions} from '@react-navigation/native';
import {CONSTANTS} from '../config/constants';
export default class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      fullName: '',
      mobileNumber: '',
      email: '',
      dob: '',
      referenceNum: '',
      userName: '',
      password: '',
      datePickerVisible: false,
      userType: '',
      userTypeId: '',
      companyName: '',
      dataCategory: '',
      dataSubCategory: '',
      industryType: '',
      isCorporate: false,
      error: false,
      passSecure: true,
      emailValid: true,
      invalid: false,
      loader: false,
      categoryId: '',
      categoryName: '',
      businessCategoryList: [],
      subCategoryId: '',
      selectedSubCategory: [],
      subCategoryName: '',
      subCategoryList: [],
      selectedItems: [],
      industryList: [],
      industryTypeName: '',
      industryTypeId: '',
      isChecked: false,
      userNameExist: false,
    };
  }
  componentDidMount() {
    this.setState({
      isCorporate: false,
      userType: 'Individual',
    });
    this.fetchCategoryList();
    this.fetchIndustryList();
  }
  async checkUserExist() {
    let formData = {
      username: this.state.userName,
    };

    await ApiHelper.head(API.userExist + this.state.userName, formData, false)
      .then(res => {
        // console.log('error from user exist',res);
        if (res == undefined) {
          this.setState({
            userNameExist: false,
          });
        } else {
          this.setState({
            userNameExist: true,
          });
        }
      })
      .catch(err => {
        //console.log('error from user exist',err);
      });
  }

  async checkUserExistOnSignup(userType) {
    let formData = {
      username: this.state.userName,
    };

    await ApiHelper.head(API.userExist + this.state.userName, formData, false)
      .then(res => {
        // console.log('error from user exist',res);
        if (res == undefined) {
          this.setState({
            userNameExist: false,
          });

          this.state.userType === 'Corporate'
            ? this.signUpCorporate()
            : this.signUpIndivudal();
        } else {
          this.setState({
            userNameExist: true,
          });
        }
      })
      .catch(err => {
        //console.log('error from user exist',err);
      });
  }

  getEmail(text) {
    this.setState({
      email: text,
      invalid: false,
    });
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
  openDatePicker() {
    this.setState({datePickerVisible: true});
  }
  async signUpIndivudal() {
    this.setState({
      emailValid: true,
      loader: true,
    });
    if (
      (this.state.fullName == '' && this.state.fullName.length < 3) ||
      this.state.userType == '' ||
      // this.state.dob == '' ||
      // this.state.referenceNum == '' ||
      // this.state.email == '' ||
      (this.state.mobileNumber == '' && this.state.mobileNumber.length < 6) ||
      // this.state.email == '' ||
      this.state.userName == '' ||
      this.state.userNameExist == true ||
      (this.state.password == '' && this.state.password.length < 6) ||
      this.state.isChecked == false
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

      if (formError) {
        return false;
      }
      let formData = {
        name: this.state.fullName,
        username: this.state.userName,
        email: this.state.email.trim(),
        password: this.state.password,
        ccd: CONSTANTS.COUNTRY_CODE,
        mobile: this.state.mobileNumber,
        dob: this.state.dob,
        referenceNumber: this.state.referenceNum,
      };
      console.log('formdata', formData);
      await ApiHelper.post(API.individualUser, formData)
        .then(res => {
          //console.log('res ', res);
          this.setState({
            loader: false,
          });
          Toast.showWithGravity(res.data.message, Toast.LONG, Toast.BOTTOM);
          this.props.navigation.navigate('OtpVerification', {
            user_id: res.data.data._id,
            user_name: this.state.userName,
          });
        })
        .catch(err => {
          this.setState({
            loader: false,
          });
          console.log(err);
        });
      //this.props.navigation.navigate('OtpVerification')
    }
  }
  async signUpCorporate() {
    this.setState({
      emailValid: true,
      loader: true,
    });

    if (
      // this.state.userType == '' ||
      // this.state.email == '' ||
      this.state.mobileNumber == '' ||
      this.state.userName == '' ||
      this.state.userNameExist == true ||
      this.state.password == '' ||
      this.state.companyName == '' ||
      this.state.categoryId == '' ||
      this.state.industryTypeId == '' ||
      // this.state.subCategoryId == '' ||
      this.state.isChecked == false
    ) {
      console.log('error false');
      this.setState({
        error: true,
        loader: false,
      });
    } else {
      console.log('error true');
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

      if (formError) {
        return false;
      }

      let formData = {
        name: this.state.companyName,
        username: this.state.userName,
        email: this.state.email.trim(),
        password: this.state.password,
        ccd: CONSTANTS.COUNTRY_CODE,
        mobile: this.state.mobileNumber,
        category: this.state.categoryId,
        subCategory: -1,
        industryType: this.state.industryTypeId,
        // referenceNumber: this.state.referenceNum,
      };
      console.log('formdata coor', formData);
      await ApiHelper.post(API.corporateUser, formData)
        .then(res => {
          console.log('res ', res);
          this.setState({
            loader: false,
          });
          Toast.showWithGravity(res.data.message, Toast.LONG, Toast.BOTTOM);
          this.props.navigation.navigate('OtpVerification', {
            user_id: res.data.data._id,
            user_name: this.state.userName,
          });
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
        this.setState({subCategoryList: subCategoryItems});
      },
    );
  }

  async fetchIndustryList() {
    //   await ApiHelper.get(API.industryTypes).then(res => {
    //     this.arrayholder = res.data.data;
    //     var dataLen = res.data.data;
    //     var len = dataLen.length;
    //     var industryListArr = [];
    //     for (let i = 0; i < len; i++) {
    //       let row = dataLen[i];
    //       let obj = {label: row.title, value: row.code};
    //       industryListArr.push(obj);
    //     }
    //     this.setState({industryList: industryListArr});
    //   });

    var industryListArr = [
      {
        label: 'Product',
        value: 1,
      },
      {
        label: 'Service',
        value: 2,
      },
      {
        label: 'Product & Service',
        value: 3,
      },
    ];

    this.setState({industryList: industryListArr});
  }
  viewPassword() {
    this.setState({
      passSecure: !this.state.passSecure,
    });
  }
  // onSelectedItemsChange = selectedItems => {
  //   this.setState({selectedItems});
  // };
  onSelectedItemsChange = selectedSubCategory => {
    this.setState({
      selectedSubCategory,
      subCategoryId: selectedSubCategory.toString(),
    });
  };
  render() {
    const {selectedItems} = this.state;

    let userTypes = [
      {
        value: 'Individual',
        label: 'Individual User',
      },
      {
        value: 'Corporate',
        label: 'Corporate User',
      },
    ];

    let pickerStyle = {
      marginTop: height / 7.8,
      marginLeft: width / 20,
      // marginRight:12,
      borderRadius: 8,
      paddingLeft: 8,
      width: width / 1.17,
      //  marginLeft:12
    };

    return (
      <Container>
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: '#eae3e5',
            paddingBottom: height / 70,
          }}>
          <Loader visibility={this.state.loader} />

          <View
            style={{
              flexDirection: 'column',
              marginTop: height / 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginStart: width / 22,
                marginEnd: width / 22,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack(null);
                }}>
                <Back_button_icon height="25" width="25" />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: width / 16,
                  fontWeight: 'bold',
                  //color: '#bd1d53',
                  // marginTop:height/15,
                  position: 'absolute',
                  right: 8,
                }}>
                Register
              </Text>
            </View>
            <View
              style={{
                marginTop: height / 10,
                flexDirection: 'column',
                paddingLeft: width / 20,
                paddingRight: width / 20,
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 25,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingLeft: width / 10,
                  width: width / 1.2,
                  height: height / 16,
                  marginBottom: width / 40,
                }}>
                <Indivudal_icon height="30" width="30" />
                <View
                  style={{
                    backgroundColor: 'white',
                    color: '#000000',
                    height: height / 16,
                    paddingLeft: width / 46,
                    height: height / 16,
                    borderRadius: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Dropdown
                    data={userTypes}
                    placeholder="Choose Usertype"
                    placeholderTextColor="#808080"
                    value={this.state.userType}
                    onChangeText={value => {
                      this.setState(
                        {
                          userType: value,
                        },
                        () => {
                          if (value == 'Corporate') {
                            this.setState({isCorporate: true});
                          } else {
                            this.setState({isCorporate: false});
                          }
                        },
                      );
                    }}
                    containerStyle={{
                      height: height / 18,
                      width: width / 1.32,
                      // paddingLeft: width / 45,
                      paddingRight: width / 45,
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
                    style={{
                      color: '#000000',
                      fontSize: width / 25,
                      alignItems: 'center',
                      alignSelf: 'center',
                      fontWeight: 'bold',
                    }}
                  />
                </View>
              </View>
              {this.state.userType == '' && this.state.error ? (
                <Text style={styles.errorStyle}>Please choose user type</Text>
              ) : null}

              {this.state.isCorporate == false ? (
                <View>
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 25,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: width / 10,
                      width: width / 1.2,
                      height: height / 16,
                      marginBottom: width / 40,
                    }}>
                    <User_icon height="25" width="23" />
                    <FloatingLabelInput
                      width={width / 1.3}
                      mandatory={true}
                      value={this.state.fullName}
                      returnKeyType={'next'}
                      ref={ref => (this.customInput1 = ref)}
                      onSubmitEditing={() =>
                        this.customInput2.refs.innerTextInput2.focus()
                      }
                      refInner="innerTextInput1"
                      placeholder="Full Name *"
                      placeholderTextColor={'#808B96'}
                      onChangeText={value => {
                        this.setState({
                          fullName: value,
                        });
                      }}
                    />
                  </View>

                  {this.state.fullName == '' && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please enter full name
                    </Text>
                  ) : this.state.fullName.length < 3 && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please enter valid name
                    </Text>
                  ) : null}

                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 25,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: width / 10,
                      width: width / 1.22,
                      height: height / 16,
                      marginBottom: width / 40,
                    }}>
                    <Mobile_icon height="28" width="32" />
                    <Text
                      style={{
                        fontSize: width / 25,
                        color: '#ABB2B9',
                        paddingLeft: width / 50,
                      }}>
                      {CONSTANTS.COUNTRY_CODE_TEXT}
                    </Text>
                    <FloatingLabelInput
                      width={width / 1.53}
                      mandatory={true}
                      value={this.state.mobileNumber}
                      returnKeyType={'next'}
                      ref={ref => (this.customInput2 = ref)}
                      onSubmitEditing={() =>
                        this.customInput3.refs.innerTextInput3.focus()
                      }
                      keyboard="number-pad"
                      refInner="innerTextInput2"
                      placeholder="Mobile Number *"
                      placeholderTextColor={'#808B96'}
                      onChangeText={value => {
                        this.setState({
                          mobileNumber: value,
                        });
                      }}
                    />
                  </View>

                  {this.state.mobileNumber == '' && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please enter your mobile number
                    </Text>
                  ) : (this.state.mobileNumber.length < 6 ||
                      this.state.mobileNumber.length > 15) &&
                    this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please enter a valid mobile number
                    </Text>
                  ) : null}
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 25,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: width / 10,
                      width: width / 1.2,
                      height: height / 16,
                      marginBottom: width / 40,
                    }}>
                    <Email_icon height="26" width="25" />
                    <FloatingLabelInput
                      width={width / 1.3}
                      mandatory={true}
                      value={this.state.email}
                      returnKeyType={'next'}
                      ref={ref => (this.customInput3 = ref)}
                      refInner="innerTextInput3"
                      placeholder="Email Address"
                      placeholderTextColor={'#808B96'}
                      onChangeText={text => this.getEmail(text)}
                    />
                  </View>

                  <View>
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
                      <View
                        style={{
                          backgroundColor: 'white',
                          borderRadius: 25,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingLeft: width / 10,
                          width: width / 1.2,
                          height: height / 16,
                          marginBottom: width / 40,
                        }}>
                        <Calender_icon height="30" width="25" />
                        <FloatingLabelInput
                          width={width / 1.3}
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
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 25,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: width / 10,
                      width: width / 1.2,
                      height: height / 16,
                      marginBottom: width / 40,
                    }}>
                    <Referrence_icon height="24" width="25" />
                    <FloatingLabelInput
                      width={width / 1.3}
                      mandatory={true}
                      value={this.state.referenceNum}
                      returnKeyType={'next'}
                      ref={ref => (this.customInput5 = ref)}
                      onSubmitEditing={() =>
                        this.customInput6.refs.innerTextInput6.focus()
                      }
                      refInner="innerTextInput5"
                      placeholder="Reference Number"
                      placeholderTextColor={'#808B96'}
                      onChangeText={value => {
                        this.setState({
                          referenceNum: value,
                        });
                      }}
                    />
                  </View>
                  {/* {this.state.referenceNum == '' && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please enter your reference number
                    </Text>
                  ) : null} */}
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 25,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: width / 10,
                      width: width / 1.2,
                      height: height / 16,
                      marginBottom: width / 40,
                    }}>
                    <User_icon height="25" width="25" />
                    <FloatingLabelInput
                      autoCapitalize="none"
                      width={width / 1.3}
                      mandatory={true}
                      value={this.state.userName}
                      returnKeyType={'next'}
                      ref={ref => (this.customInput6 = ref)}
                      onSubmitEditing={() => {
                        this.customInput7.refs.innerTextInput7.focus();
                        this.checkUserExist();
                      }}
                      refInner="innerTextInput6"
                      placeholder="Username *"
                      placeholderTextColor={'#808B96'}
                      onChangeText={value => {
                        this.setState({
                          userName: value,
                        });
                      }}
                      onBlur={this.state.userName ? this.checkUserExist() : ''}
                    />
                  </View>
                  {this.state.userName == '' && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please enter your username
                    </Text>
                  ) : null}
                  {this.state.userNameExist == true ? (
                    <Text style={styles.errorStyle}>
                      This username is already exist, please try another
                    </Text>
                  ) : null}
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 25,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: width / 10,
                      width: width / 1.12,
                      height: height / 16,
                      marginBottom: width / 40,
                    }}>
                    <Password_icon height="25" width="28" />
                    <FloatingLabelInput
                      autoCapitalize="none"
                      width={width / 1.3}
                      mandatory={true}
                      value={this.state.password}
                      returnKeyType={'next'}
                      ref={ref => (this.customInput7 = ref)}
                      // onSubmitEditing={() =>
                      //   this.customInput8.refs.innerTextInput8.focus()
                      // }
                      secureTextEntry={this.state.passSecure}
                      refInner="innerTextInput7"
                      placeholder="Password *"
                      placeholderTextColor={'#808B96'}
                      onChangeText={value => {
                        this.setState({
                          password: value,
                        });
                      }}
                    />

                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => this.viewPassword()}
                      style={{
                        right: width / 10,
                        alignSelf: 'flex-end',
                        bottom: height / 215,
                      }}>
                      <Image
                        source={
                          this.state.passSecure
                            ? require('../assets/images/eye-closed.png')
                            : require('../assets/images/eye-open.png')
                        }
                        resizeMode={'contain'}
                        style={{
                          height: height / 18,
                          width: width / 13,
                          right: height / 150,
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  {this.state.password == '' && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please enter your password
                    </Text>
                  ) : this.state.password.length < 6 && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Password length must be more than 6 characters
                    </Text>
                  ) : null}
                </View>
              ) : (
                <View>
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 25,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: width / 10,
                      width: width / 1.2,
                      height: height / 16,
                      marginBottom: width / 40,
                    }}>
                    <Companyname_icon height="25" width="23" />
                    <FloatingLabelInput
                      width={width / 1.3}
                      mandatory={true}
                      value={this.state.companyName}
                      returnKeyType={'done'}
                      ref={ref => (this.customInput10 = ref)}
                      refInner="innerTextInput10"
                      placeholder="Company Name *"
                      placeholderTextColor={'#808B96'}
                      onChangeText={value => {
                        this.setState({
                          companyName: value,
                        });
                      }}
                    />
                  </View>
                  {this.state.companyName == '' && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please enter company name
                    </Text>
                  ) : null}
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 25,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: width / 10,
                      width: width / 1.2,
                      height: height / 16,
                      marginBottom: width / 40,
                    }}>
                    <Category_icon height="25" width="25" />
                    <DropDown
                      width={width / 1.32}
                      placeholder="Choose Category *"
                      placeholderTextColor="#808080"
                      data={this.state.businessCategoryList}
                      value={this.state.categoryId}
                      multiline={false}
                      onChange={(value, index) => {
                        this.setState(
                          {
                            categoryId: value,
                          },
                          () => {
                            // this.fetchSubCategoryList();
                          },
                        );
                      }}
                    />
                  </View>
                  {this.state.categoryId == '' && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please choose choose category
                    </Text>
                  ) : null}

                  {/* <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 25,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: width / 20,
                      width: width / 1.12,
                      height: height / 16,
                      marginBottom: width / 40,
                    }}>
                    <Category_icon height="25" width="25" />
                    <ScrollView>
                      <SectionedMultiSelect
                        styles={{
                          toggleIcon: '#ddd',
                        }}
                        colors={{
                          primary: '#bd1d53',
                          selectToggleTextColor: '#808080',
                        }}
                        confirmText={'Ok'}
                        hideSearch={true}
                        items={this.state.subCategoryList}
                        IconRenderer={Icon}
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
                      Please choose choose sub categories
                    </Text>
                  ) : null} */}
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 25,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: width / 10,
                      width: width / 1.2,
                      height: height / 16,
                      marginBottom: width / 40,
                    }}>
                    <Industry_icon height="28" width="27" />
                    <DropDown
                      width={width / 1.32}
                      placeholder="Choose Industry Type *"
                      placeholderTextColor="#808080"
                      data={this.state.industryList}
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
                  </View>
                  {this.state.industryTypeId == '' && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please choose industry type
                    </Text>
                  ) : null}
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 25,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: width / 10,
                      width: width / 1.22,
                      height: height / 16,
                      marginBottom: width / 40,
                    }}>
                    <Mobile_icon height="28" width="32" />
                    <Text
                      style={{
                        fontSize: width / 25,
                        color: '#ABB2B9',
                        paddingLeft: width / 50,
                      }}>
                      {CONSTANTS.COUNTRY_CODE_TEXT}
                    </Text>
                    <FloatingLabelInput
                      width={width / 1.53}
                      mandatory={true}
                      value={this.state.mobileNumber}
                      returnKeyType={'next'}
                      ref={ref => (this.customInput11 = ref)}
                      onSubmitEditing={() =>
                        this.customInput12.refs.innerTextInput12.focus()
                      }
                      keyboard="number-pad"
                      refInner="innerTextInput11"
                      placeholder="Mobile Number *"
                      placeholderTextColor={'#808B96'}
                      onChangeText={value => {
                        this.setState({
                          mobileNumber: value,
                        });
                      }}
                    />
                  </View>
                  {this.state.mobileNumber == '' && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please enter your mobile number
                    </Text>
                  ) : null}
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 25,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: width / 10,
                      width: width / 1.2,
                      height: height / 16,
                      marginBottom: width / 40,
                    }}>
                    <Email_icon height="26" width="25" />
                    <FloatingLabelInput
                      width={width / 1.3}
                      mandatory={true}
                      value={this.state.email}
                      returnKeyType={'next'}
                      ref={ref => (this.customInput12 = ref)}
                      onSubmitEditing={() =>
                        this.customInput13.refs.innerTextInput13.focus()
                      }
                      refInner="innerTextInput12"
                      placeholder="Email Address"
                      placeholderTextColor={'#808B96'}
                      onChangeText={text => this.getEmail(text)}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 25,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: width / 10,
                      width: width / 1.2,
                      height: height / 16,
                      marginBottom: width / 40,
                    }}>
                    <User_icon height="25" width="25" />
                    <FloatingLabelInput
                      width={width / 1.3}
                      mandatory={true}
                      value={this.state.userName}
                      returnKeyType={'next'}
                      ref={ref => (this.customInput13 = ref)}
                      onSubmitEditing={() =>
                        this.customInput14.refs.innerTextInput14.focus()
                      }
                      refInner="innerTextInput13"
                      placeholder="Username *"
                      placeholderTextColor={'#808B96'}
                      onChangeText={value => {
                        this.setState({
                          userName: value,
                        });
                      }}
                    />
                  </View>
                  {this.state.userName == '' && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please enter your username
                    </Text>
                  ) : null}
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 25,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: width / 10,
                      width: width / 1.12,
                      height: height / 16,
                      marginBottom: width / 40,
                    }}>
                    <Password_icon height="25" width="28" />
                    <FloatingLabelInput
                      width={width / 1.3}
                      mandatory={true}
                      value={this.state.password}
                      secureTextEntry={this.state.passSecure}
                      returnKeyType={'next'}
                      ref={ref => (this.customInput14 = ref)}
                      refInner="innerTextInput14"
                      placeholder="Password *"
                      placeholderTextColor={'#808B96'}
                      onChangeText={value => {
                        this.setState({
                          password: value,
                        });
                      }}
                    />
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => this.viewPassword()}
                      style={{
                        right: width / 10,
                        alignSelf: 'flex-end',
                        bottom: height / 215,
                      }}>
                      <Image
                        source={
                          this.state.passSecure
                            ? require('../assets/images/eye-closed.png')
                            : require('../assets/images/eye-open.png')
                        }
                        resizeMode={'contain'}
                        style={{
                          height: height / 18,
                          width: width / 13,
                          right: height / 150,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  {this.state.password == '' && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please enter your password
                    </Text>
                  ) : null}
                </View>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 80,
                  marginStart: width / 40,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({isChecked: !this.state.isChecked});
                  }}
                  style={{
                    backgroundColor: 'white',
                    height: 20,
                    width: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 4,
                  }}>
                  {this.state.isChecked ? <CheckBox /> : null}
                </TouchableOpacity>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{alignSelf: 'center', marginStart: width / 34}}>
                    I agree with{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('TermsandCondition');
                    }}>
                    <Text style={{color: '#bd1d53'}}>Terms & Condition</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {!this.state.isChecked && this.state.error ? (
                <Text
                  style={{
                    color: 'red',
                    fontSize: width / 30,
                    width: width / 1.1,
                    marginBottom: height / 80,
                    marginTop: height / 90,
                    textAlign: 'left',
                    marginLeft: 8,
                  }}>
                  Please check terms & condition
                </Text>
              ) : null}
              <TouchableOpacity
                onPress={() => {
                  // this.state.userType == 'Corporate'
                  //   ? this.signUpCorporate()
                  //   : this.signUpIndivudal();

                  this.checkUserExistOnSignup(this.state.userType);
                }}
                style={{
                  width: width / 1.12,
                  borderRadius: 28,
                  marginTop: width / 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#bd1d53',
                  height: width / 8,
                }}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: width / 22,
                    fontWeight: 'bold',
                  }}>
                  Register
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: '#262626', fontSize: width / 28}}>
                  Continue as a{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.dispatch(
                      StackActions.replace('HomeMenu'),
                    );
                  }}>
                  <Text
                    style={{
                      color: '#bd1d53',
                      fontWeight: 'bold',
                      fontSize: width / 28,
                    }}>
                    Guest User
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 80,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: '#262626', fontSize: width / 28}}>
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('Login');
                  }}>
                  <Text
                    style={{
                      color: '#bd1d53',
                      fontWeight: 'bold',
                      fontSize: width / 28,
                    }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text
            style={{
              fontSize: width / 30,
              color: '#909090',
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: height / 30,
            }}>
            © My Community.All Rights Reserved
          </Text>
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
    marginTop: -8,
    textAlign: 'left',
    marginLeft: 8,
  },
});
