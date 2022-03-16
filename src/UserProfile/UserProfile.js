import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Container, Content} from 'native-base';
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
export default class UserProfile extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      place: '',
      countryName: '',
      countryCode: '',
      notification: '0',
      dob: '',
      existingProfilePic: '',
      existingBannerPic: '',
      removedImages:[],
      profilePic:{},
      profileImage:'',
      bannerPic:{},
      bannerImage:'',
      error: false,
      passSecure: true,
      loader: false,
      countryId: '',
      isNotification: false,
      userdata: {},
      countries: [],
      userRole:'',
      categoryId: '',
      categoryName: '',
      businessCategoryList: [],
      subCategoryId: '',
      subCategoryName: '',
      subCategoryList: [],
      selectedItems: [],
      industryList: [],
      industryTypeName: '',
      industryTypeId: '',

    };
  }

  componentDidMount() {
    this.setState({loader: true, isNotification: false});
    this.getUserData();
    this.getCountries();
    this.fetchCategoryList();
    this.fetchIndustryList();
    setTimeout(() => this.setState({loader: false}), 1000);
  }
  async askStoragePermission() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'File storage permission',
        message: 'Al-Omaniya needs access to your storage ',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  }


  async uploadprofilePic() {
    let that = this;
    let garnt = await this.askStoragePermission();
    if (Platform.OS === 'ios') {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.images],
        });
        this.setState({
          profilePic: res,
          profileImage: res.name,
        });
      } catch (error) {
        if (DocumentPicker.isCancel(error)) {
        } else {
          throw error;
        }
      }
    } else {
      if (garnt) {
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.images],
          });
          this.setState({
            profilePic: res,
            profileImage: res.name,
          });
        } catch (error) {
          if (DocumentPicker.isCancel(error)) {
          } else {
            throw error;
          }
        }
      }
    }
  }
  async uploadbannerPic() {
    let that = this;
    let garnt = await this.askStoragePermission();
    if (Platform.OS === 'ios') {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.images],
        });
        this.setState({
          bannerPic: res,
          bannerImage: res.name,
        });
      } catch (error) {
        if (DocumentPicker.isCancel(error)) {
        } else {
          throw error;
        }
      }
    } else {
      if (garnt) {
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.images],
          });
          this.setState({
            bannerPic: res,
            bannerImage: res.name,
          });
        } catch (error) {
          if (DocumentPicker.isCancel(error)) {
          } else {
            throw error;
          }
        }
      }
    }
  }

  async getUserData() {
    await ApiHelper.get(API.userData)
      .then(res => {
        var dataLen = res.data.data;
        this.setState(
          {
            userdata: dataLen,
            name: dataLen.name,
            email: dataLen.email,
            place: dataLen.addressString?dataLen.addressString:'',
            countryName: dataLen.countryName,
            countryCode: dataLen.countryCode,
            notification: dataLen.notification=='1'?true:false,
            dob: dataLen.dob,
            existingProfilePic: dataLen.existingProfilePic?dataLen.existingProfilePic:'',
            existingBannerPic: dataLen.existingBannerPic?dataLen.existingBannerPic:'',
            profilePic:{},
            bannerPic:{},
            removedImages:[],
            userRole:dataLen.userRole,
            categoryId: dataLen.categoryId,
            subCategoryId: dataLen.subCategoryId,
            industryTypeId: dataLen.industryTypeId,
            loader: false,
          },
          () => {
            // console.log('user arr', this.state.userdata);
          },
        );
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
          let obj = {label: row.countryName, value: row.countryCode+'-'+row.countryName};
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
      name: this.state.name,
      email: this.state.email.trim(),
      addressString: this.state.place,
      countryCode: this.state.countryCode,
      countryName: this.state.countryName,
      notification: this.state.notification?'1':'0',
      dob: this.state.dob,
      existingProfilePic: this.state.existingProfilePic,
      existingBannerPic: this.state.existingBannerPic,
      removedImages: this.state.removedImages,
      profilePic: this.state.profilePic,
      bannerPic: this.state.bannerPic,
    };

    const params = new FormData();
    params.append('name', this.state.name);
    params.append('email', this.state.email.trim());
    params.append('addressString', this.state.addressString);
    params.append('countryCode', this.state.countryCode);
    params.append('countryName', this.state.countryName);
    params.append('notification', this.state.notification?'1':'0');
    params.append('dob', this.state.dob);
    params.append('existingProfilePic', this.state.existingProfilePic);
    params.append('existingBannerPic', this.state.existingBannerPic);
    params.append('removedImages', this.state.removedImages);
    params.append('profilePic', this.state.profilePic);
    params.append('bannerPic', this.state.bannerPic);

  
    await ApiHelper.put(API.updateIndUser, params)
      .then(res => {
        console.log('res ', res);
        this.setState({
          loader: false,
        });
        Toast.showWithGravity(res.data.message, Toast.LONG, Toast.BOTTOM);
        this.getUserData();
      })
      .catch(err => {
        this.setState({
          loader: false,
        });
        console.log(err);
      });
  }

  async updateCorporateProfile() {
    this.setState({
      emailValid: true,
      loader: true,
    });
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
      name: this.state.name,
      email: this.state.email.trim(),
      addressString: this.state.place,
      countryCode: this.state.countryCode,
      countryName: this.state.countryName,
      notification: this.state.notification?'1':'0',
      dob: this.state.dob,
      existingProfilePic: this.state.existingProfilePic,
      existingBannerPic: this.state.existingBannerPic,
      removedImages: this.state.removedImages,
      profilePic: this.state.profilePic,
      bannerPic: this.state.bannerPic,
      category: this.state.categoryId,
      subCategory: this.state.subCategoryId,
      industryType: this.state.industryTypeId,
    };

    const params = new FormData();
    params.append('name', this.state.name);
    params.append('email', this.state.email.trim());
    params.append('addressString', this.state.addressString);
    params.append('countryCode', this.state.countryCode);
    params.append('countryName', this.state.countryName);
    params.append('notification', this.state.notification?'1':'0');
    params.append('existingProfilePic', this.state.existingProfilePic);
    params.append('existingBannerPic', this.state.existingBannerPic);
    params.append('removedImages', this.state.removedImages);
    params.append('profilePic', this.state.profilePic);
    params.append('bannerPic', this.state.bannerPic);
    params.append('businenessCategory', this.state.categoryId);
    params.append('businenessSubCategory', this.state.subCategoryId);
    params.append('industryType', this.state.industryTypeId);

  
    await ApiHelper.put(API.updateCorpUser, params)
      .then(res => {
        console.log('res ', res);
        this.setState({
          loader: false,
        });
        Toast.showWithGravity(res.data.message, Toast.LONG, Toast.BOTTOM);
        this.getUserData();
      })
      .catch(err => {
        this.setState({
          loader: false,
        });
        console.log(err);
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

  async fetchSubCategoryList() {
    await ApiHelper.get(API.businessSubCategory + this.state.categoryId).then(
      res => {
        this.arrayholder = res.data.data;
        var dataLen = res.data.data;
        var len = dataLen.length;
        var subCategoryList = [];
        for (let i = 0; i < len; i++) {
          let row = dataLen[i];
          let obj = {label: row.subCategoryName, value: row.subCategoryId};
          subCategoryList.push(obj);
        }
        this.setState({subCategoryList: subCategoryList});
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
                this.state.userRole == '1'
                ? this.updateProfile()
                : this.updateCorporateProfile();
              }}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: width / 22,
                  fontWeight: 'bold',
                }}>
                Save
              </Text>
            </TouchableOpacity>
            {/* <Notification_icon_white height="22" width="22" /> */}
          </View>
        </View>

        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: '#eae3e5',
            paddingBottom: height / 10,
          }}>
          <Loader visibility={this.state.loader} />
       
          {'bannerPic' in this.state.userdata && this.state.userdata.bannerPic != '' ? (
                <Image
                source={{
                  uri:
                    CONSTANTS.THUMBNAIL_IMG + this.state.userdata.bannerPic,
                }}
                  style={{
                    height: height / 4,
                    width: width / 1,
                    opacity: 0.5,
                    backgroundColor: 'rgba(0.4,0.5,0.5,1.5)',
                  }}
                />
        
          ) : (
            <Image
              source={require('../assets/images/bg1.jpeg')}
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
              top: height / 20,
              left: width / 2.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 150 / 2,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: '#ddd',
                backgroundColor: 'white',
              }}>
              {'profilePic' in this.state.userdata && this.state.userdata.profilePic != '' ? (
                
                <Image
                  source={{
                    uri:
                      CONSTANTS.THUMBNAIL_IMG + this.state.userdata.profilePic,
                  }}
                  style={{height: 70, width: 70}}
                />
              ) : (
                <ProfilePic height="70" width="70" />
              )}
            </View>
            <Text
              style={{
                color: 'white',
                fontSize: width / 22,
                textAlign: 'center',
              }}>
              {this.state.userdata.name}
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: width / 28,
                textAlign: 'center',
              }}>
              {this.state.userdata.username}
            </Text>
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
                color: '#282828',
              }}>
              My Profile
            </Text>
            {this.state.userRole=="2"?(
              <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Directory');
              }}
              style={{position: 'absolute', right: 0}}>
              <Text style={{color: '#3366FF', fontSize: width / 23}}>
                + Add Business
              </Text>
            </TouchableOpacity>
            ):null}
            
          </View>
          <View
            style={{
              marginTop: height / 30,
              borderBottomWidth: 6,
              borderBottomColor: '#D0D0D0',
              marginBottom: height / 40,
            }}
          />

          <View style={{marginStart: width / 15, marginEnd: width / 15}}>
            <View style={{flexDirection: 'row', marginBottom: height / 90}}>
              <Text style={{fontSize: width / 24}}>Name</Text>
              <Text style={{color: '#F00000', fontSize: width / 23}}>*</Text>
            </View>

            <FloatingLabelBorderInput
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

            <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={{fontSize: width / 24}}>Email</Text>
              <Text style={{color: '#F00000', fontSize: width / 23}}>*</Text>
            </View>

            <FloatingLabelBorderInput
              width={width / 1.15}
              mandatory={true}
              value={this.state.email}
              returnKeyType={'next'}
              ref={ref => (this.customInput2 = ref)}
              refInner="innerTextInput2"
              //   onSubmitEditing={() =>
              //     this.customInput6.refs.innerTextInput6.focus()
              //   }
              //   placeholder="Reference Number"
              //   placeholderTextColor={'#808B96'}
              onChangeText={value => {
                this.setState({
                  email: value,
                });
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={{fontSize: width / 24}}>Place</Text>
              <Text style={{color: '#F00000', fontSize: width / 23}}>*</Text>
            </View>

            <FloatingLabelBorderInput
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
              data={this.state.countries}
              multiline={false}
              value={''}
              onChange={(value, index) => {
                var country_value = value.split("-");
                this.setState(
                  {
                    countryCode: country_value[0],
                    countryName: country_value[1],
                  },
                  () => {
                    // console.log('usertype>', this.state.countryId);
                  },
                );
              }}
            />
{this.state.userRole == '1' ? (
  <View>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={{fontSize: width / 24}}>DOB</Text>
              <Text style={{color: '#F00000', fontSize: width / 23}}>*</Text>
            </View>

            <FloatingLabelBorderInput
              width={width / 1.15}
              mandatory={true}
              value={this.state.dob}
              returnKeyType={'next'}
              ref={ref => (this.customInpu4 = ref)}
              refInner="innerTextInput4"
              multiline={true}
              //   onSubmitEditing={() =>
              //     this.customInput6.refs.innerTextInput6.focus()
              //   }
              //   placeholder="Reference Number"
              //   placeholderTextColor={'#808B96'}
              onChangeText={value => {
                this.setState({
                  dob: value,
                });
              }}
            />
            </View>
):null}

{this.state.userRole == '2' ? (


                  <View>
                     <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={{fontSize: width / 24}}>Category</Text>
              <Text style={{color: '#F00000', fontSize: width / 23}}>*</Text>
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
                            console.log('usertype>', this.state.categoryName);
                          },
                        );
                      }}
                    />
                  </View>
):null}
{this.state.userRole == '2' ? (

                  <View>
                         <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={{fontSize: width / 24}}>Sub Category</Text>
              <Text style={{color: '#F00000', fontSize: width / 23}}>*</Text>
            </View>
                    <DropDownBorder
                      width={width / 1.32}
                      placeholder="Choose Sub Categories"
                      placeholderTextColor="#808080"
                      data={this.state.subCategoryList}
                      multiline={false}
                      value={this.state.subCategoryId}
                      onChange={(value, index) => {
                        this.setState(
                          {
                            subCategoryId: value,
                          },
                          () => {
                            console.log(
                              'subCategoryId>',
                              this.state.subCategoryId,
                            );
                          },
                        );
                      }}
                    />
                  </View>
                ):null}
                {this.state.userRole == '2' ? (
                  <View>
                        <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={{fontSize: width / 24}}>Industry Type</Text>
              <Text style={{color: '#F00000', fontSize: width / 23}}>*</Text>
            </View>
                    <DropDownBorder
                      width={width / 1.32}
                      placeholder="Choose Industry Type"
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
                            console.log('usertype>', this.state.industryTypeId);
                          },
                        );
                      }}
                    />
                  </View>
                  
                  ) : null }

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
              buttonOffColor="white"
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
    marginTop: -8,
    textAlign: 'left',
    marginLeft: 8,
  },
});
