import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  KeyboardAvoidingView,
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
  Textarea,
} from 'native-base';
var {height, width} = Dimensions.get('window');
import MenuIcon from '../assets/svg/MenuIcon.svg';
import Notification_icon_white from '../assets/svg/Notification_icon_white.svg';
import CheckBoxSvg from '../assets/svg/CheckBox.svg';
import ProfilePic from '../assets/svg/ProfilePic.svg';
import FloatingLabelBorderInput from '../components/FloatingLabelBorderInput';
import DropDownBorder from '../components/DropDownBorder';
import FlipToggle from 'react-native-flip-toggle-button';
import Add_image from '../assets/svg/Add_image.svg';
import BackBtn_white from '../assets/svg/BackBtn_white.svg';
import {Col, Row, Grid} from 'react-native-easy-grid';
import theme from '../config/styles.js';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CheckBox from '../assets/svg/CheckBox.svg';
import DropDown from '.././components/DropDown';
import DropDown_icon from '../assets/svg/DropDown_icon.svg';
import moment from 'moment';
import DayTab from '../components/DayTab';
import Loader from '../components/Loader';
import {ApiHelper} from '../helpers/ApiHelper';
import {API} from '../config/api';
import ImagePicker from 'react-native-image-crop-picker';
import MapView, {Marker} from 'react-native-maps';
import Toast from 'react-native-simple-toast';
import {AppColors} from '../Themes';
import {CONSTANTS} from '../config/constants';
import Submitted_successfully from '../assets/svg/Submitted_successfully.svg';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

export default class AddJob extends Component {
  inputRefs = {
    name: React.createRef(),
    description: React.createRef(),
    designation: React.createRef(),
    experience: React.createRef(),
    salary: React.createRef(),
    contactName: React.createRef(),
    contactNumber: React.createRef(),
    contactEmail: React.createRef(),
    addressString: React.createRef(),
  };

  constructor() {
    super();
    const focused = () => {
      this.setState({backgroundcolor: ''});
    };

    const blured = () => {
      this.setState({backgroundcolor: ''});
    };
    this.state = {
      name: '',
      description: '',
      categories: [],
      category: '',
      subcategories: [],
      subcategory: '',
      designation: '',
      qualifications: [],
      qualification: '',
      experience: '',
      salaryType: '',
      salary: '',
      employeeType: '',
      contactName: '',
      contactNumber: '',
      contactEmail: '',
      locationCode: '',
      locationName: '',
      lat: '',
      lng: '',
      addressString: '',
      image: [],
      existingImage: [],
      error: false,
      loader: false,
      isChecked: false,
      locations: [],
      region: {
        latitude: 21.0000287,
        longitude: 57.0036901,
        latitudeDelta: 5,
        longitudeDelta: 0.03,
      },
      businessRegion: {
        latitude: 21.0000287,
        longitude: 57.0036901,
      },
      update: false,
      removedImages: [],
      jobId: '',
      successfull: false,
    };
  }

  componentDidMount() {
    const id =
      'params' in this.props.route && this.props.route.params
        ? this.props.route.params.id
        : '';
    if (id) {
      this.getJobData(id);
      this.setState({
        jobId: id,
      });
    }
    this.getUserData();
    this.getLocationsData();
    this.fetchCategoryList();
    this.fetchQualificationList();
  }

  async getUserData() {
    await ApiHelper.get(API.userData).then(res => {
      var dataLen = res.data.data;
      if (!this.state.update) {
        this.setState(
          {
            contactName: dataLen.name,
            contactNumber: dataLen.mobile,
            contactEmail: dataLen.email,
          },
          () => {
            // console.log('user arr', this.state.userdata);
          },
        );
      }
    });
  }
  async fetchCategoryList() {
    await ApiHelper.get(API.jobCategories).then(res => {
      this.arrayholder = res.data.data;
      this.setState({
        categories: this.arrayholder.map(c => ({
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
      if (this.arrayholder.length > 0) {
        this.setState({
          subcategories: this.arrayholder.map(c => ({
            label: c.subCatName,
            value: c.subCatId,
          })),
        });
      } else {
        this.setState({
          subcategories: [],
        });
      }
    });
    this.setState({
      loader: false,
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

  deltaFrom(lat, lon, distance) {
    distance = distance / 2;
    const circumference = 40075;
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
    const angularDistance = distance / circumference;

    const latitudeDelta = distance / oneDegreeOfLatitudeInMeters;
    const longitudeDelta = Math.abs(
      Math.atan2(
        Math.sin(angularDistance) * Math.cos(lat),
        Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat),
      ),
    );

    return {
      latitudeDelta,
      longitudeDelta,
    };
  }

  async addJob() {
    this.setState({
      emailValid: true,
      loader: true,
    });
    if (
      this.state.name == '' ||
      this.state.description == '' ||
      this.state.category == '' ||
      this.state.designation == '' ||
      this.state.qualification == '' ||
      this.state.employeeType == '' ||
      this.state.contactName == '' ||
      this.state.contactNumber == '' ||
      this.state.locationCode == '' ||
      this.state.locationName == '' ||
      this.state.lat == '' ||
      this.state.lng == '' ||
      this.state.addressString == '' ||
      // this.state.image.length == 0 ||
      this.state.isChecked == false
    ) {
      this.setState({
        error: true,
        loader: false,
      });
    } else {
      let formError = false;
      let emailreg = /^(?:[\w\.\-]+@([\w\-]+\.)+[a-zA-Z+ -]+)?$/;
      if (emailreg.test(this.state.contactEmail) === false) {
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

      const params = new FormData();
      params.append('name', this.state.name);
      params.append('description', this.state.description);
      params.append('categoryId', this.state.category);
      params.append('subCategoryId', this.state.subcategory);
      params.append('designation', this.state.designation);
      params.append('qualification', this.state.qualification);
      params.append('experience', this.state.experience);
      params.append('salaryType', this.state.salaryType);
      params.append('salary', this.state.salary);
      params.append('employeeType', this.state.employeeType);
      params.append('contactName', this.state.contactName);
      params.append('contactNumber', this.state.contactNumber);
      params.append('contactEmail', this.state.contactEmail);
      params.append('contactTimeFrom', this.state.fromtime);
      params.append('contactTimeTo', this.state.totime);
      params.append('locationCode', this.state.locationCode);
      params.append('locationName', this.state.locationName);
      params.append('lat', this.state.lat);
      params.append('lng', this.state.lng);
      params.append('addressString', this.state.addressString);

      if (this.state.image.length) {
        for (let i = 0; i < this.state.image.length; i++) {
          params.append('image', this.state.image[i]);
        }
      }
      await ApiHelper.form_post(API.jobs, params)
        .then(res => {
          if (res) {
            if (res == undefined) {
              this.setState({
                loader: false,
                successfull: false,
              });
            } else {
              this.setState({
                loader: false,
                successfull: true,
              });
            }
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

  async updateJob() {
    this.setState({
      emailValid: true,
      loader: true,
    });
    if (
      this.state.name == '' ||
      this.state.description == '' ||
      this.state.category == '' ||
      this.state.designation == '' ||
      this.state.qualification == '' ||
      this.state.employeeType == '' ||
      this.state.contactName == '' ||
      this.state.contactNumber == '' ||
      this.state.locationCode == '' ||
      this.state.locationName == '' ||
      this.state.lat == '' ||
      this.state.lng == '' ||
      this.state.addressString == '' ||
      // (this.state.image.length == 0 && this.state.existingImage.length == 0) ||
      this.state.isChecked == false
    ) {
      this.setState({
        error: true,
        loader: false,
      });
    } else {
      let formError = false;
      let emailreg = /^(?:[\w\.\-]+@([\w\-]+\.)+[a-zA-Z+ -]+)?$/;
      if (emailreg.test(this.state.contactEmail) === false) {
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

      const params = new FormData();
      params.append('id', this.state.jobId);
      params.append('name', this.state.name);
      params.append('description', this.state.description);
      params.append('categoryId', this.state.category);
      params.append('subCategoryId', this.state.subcategory);
      params.append('designation', this.state.designation);
      params.append('qualification', this.state.qualification);
      params.append('experience', this.state.experience);
      params.append('salaryType', this.state.salaryType);
      params.append('salary', this.state.salary);
      params.append('employeeType', this.state.employeeType);
      params.append('contactName', this.state.contactName);
      params.append('contactNumber', this.state.contactNumber);
      params.append('contactEmail', this.state.contactEmail);
      params.append('contactTimeFrom', this.state.fromtime);
      params.append('contactTimeTo', this.state.totime);
      params.append('locationCode', this.state.locationCode);
      params.append('locationName', this.state.locationName);
      params.append('lat', this.state.lat);
      params.append('lng', this.state.lng);
      params.append('addressString', this.state.addressString);
      params.append('removedImages', JSON.stringify(this.state.removedImages));
      params.append(
        'existingImages',
        JSON.stringify(this.state.existingImage.map(img => img.url)),
      );

      if (this.state.image.length) {
        for (let i = 0; i < this.state.image.length; i++) {
          params.append('image', this.state.image[i]);
        }
      }

      await ApiHelper.form_put(API.jobs + '/' + this.state.jobId, params)
        .then(res => {
          if (res == undefined) {
            this.setState({
              loader: false,
              successfull: false,
            });
          } else {
            this.setState({
              loader: false,
              successfull: true,
            });
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

  async getJobData(id) {
    this.setState({
      loader: true,
    });
    await ApiHelper.get(API.jobs + '/' + id)
      .then(res => {
        if ('data' in res.data && res.data.data) {
          const jobData = res.data.data;
          console.log('Job data', jobData);
          let deltaObj = {};
          if ('lat' in jobData.mapDetails && jobData.mapDetails.lat) {
            deltaObj = this.deltaFrom(
              jobData.mapDetails.lat,
              jobData.mapDetails.lng,
              1000,
            );
          }

          this.setState(
            {
              update: 'name' in jobData && jobData.name ? true : false,
              name: jobData.name,
              category: jobData.categoryId,
              subcategory: jobData.subCategoryId,
              description: jobData.description,
              designation: jobData.designation,
              qualification: jobData.qualification.toString(),
              experience: jobData.experience,
              salaryType: jobData.salaryType,
              salary: jobData.salary,
              employeeType: jobData.employeeType,
              contactName: jobData.contactDetails.contactName,
              contactNumber: jobData.contactDetails.contactNumber,
              contactEmail: jobData.contactDetails.contactEmail,
              locationCode: jobData.locationDetails.locationCode,
              locationName: jobData.locationDetails.locationName,
              addressString: jobData.mapDetails.addressString,
              region: {
                latitude: jobData.mapDetails.lat
                  ? jobData.mapDetails.lat
                  : 21.0000287,
                longitude: jobData.mapDetails.lng
                  ? jobData.mapDetails.lng
                  : 57.0036901,
                latitudeDelta:
                  'latitudeDelta' in deltaObj ? deltaObj.latitudeDelta : 5,
                longitudeDelta:
                  'longitudeDelta' in deltaObj ? deltaObj.longitudeDelta : 0.03,
              },
              businessRegion: {
                latitude: jobData.mapDetails.lat
                  ? jobData.mapDetails.lat
                  : 21.0000287,
                longitude: jobData.mapDetails.lng
                  ? jobData.mapDetails.lng
                  : 57.0036901,
              },
              lat: jobData.mapDetails.lat ? jobData.mapDetails.lat : 21.0000287,
              lng: jobData.mapDetails.lng ? jobData.mapDetails.lng : 57.0036901,
              existingImage: jobData.imageKey,
              isChecked: true,
            },
            () => {
              this.fetchSubCategories(this.state.category);
            },
          );
        }
      })
      .catch(err => {
        console.log(err);
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

  // timepicker
  showDatePickerFrom = () => {
    this.setState({
      isDateFromPickerVisible: true,
    });
  };
  hideDatePickerFrom = () => {
    this.setState({
      isDateFromPickerVisible: false,
    });
  };

  hideDatePickerTo = () => {
    this.setState({
      isDateToPickerVisible: false,
    });
  };
  showDatePickerTo = () => {
    this.setState({
      isDateToPickerVisible: true,
    });
  };

  handleConfirmFrom = date => {
    console.warn('A date has been picked: ', date);
    this.setState({
      fromtime: moment(date).format('hh:mm a', true),
    });

    this.hideDatePickerFrom();
  };

  handleConfirmTo = date => {
    console.warn('A date has been picked: ', date);
    this.setState({
      totime: moment(date).format('hh:mm a', true),
    });
    this.hideDatePickerTo();
  };

  // Gallery Images picker
  async pickGallery() {
    try {
      const options = {
        title: 'Gallery',
        mediaType: 'photo',
        multiple: true,
      };
      const gallery = await ImagePicker.openPicker(options);
      const galleryImages = gallery.map(g => {
        return {
          uri: g.path,
          type: g.mime,
          name: g.path.replace(/^.*[\\\/]/, ''),
        };
      });
      this.state.image = this.state.image.concat(galleryImages);
      this.setState({
        image: this.state.image,
      });
    } catch (e) {}
  }

  // timepicker
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

  verifyModal = () => {
    return (
      <View>
        <Modal
          visible={this.state.successfull}
          animationType="slide"
          transparent={true}
          backgroundColor="#fff"
          onRequestClose={() => {
            this.setState({
              verifyModalView: false,
            });
          }}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            enabled>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                backgroundColor: 'rgba(100,100,100, 0.5)',
                //padding: 20,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  height: height / 2,
                  width: '90%',
                  borderRadius: 20,
                  borderWidth: 1,
                  // marginBottom: -(width / 1.5),
                  borderColor: '#fff',
                  paddingBottom: height / 3,
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    marginTop: height / 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Submitted_successfully height="90" width="90" />
                </View>

                <Text
                  style={{
                    // fontSize: width / 21,
                    fontSize: width / 18,
                    color: 'black',
                    marginBottom: height / 60,
                    marginTop: height / 30,
                    // width:width/1,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginStart: width / 22,
                    marginEnd: width / 30,
                    fontWeight: 'bold',
                  }}>
                  Successful!
                </Text>
                <Text
                  style={{
                    color: '#5A5A5A',
                    fontSize: width / 25,
                    paddingBottom: height / 76,
                    fontFamily: 'AvenirLTStd-Book',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginStart: width / 22,
                    marginEnd: width / 30,
                  }}>
                  You have successfully{' '}
                  {this.state.update ? 'updated' : 'submitted'}!
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        verifyModalView: false,
                      });
                      this.props.navigation.navigate('UserDasboardMenu');
                    }}
                    style={{
                      paddingHorizontal: 30,
                      borderRadius: 28,
                      marginTop: width / 13,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#bd1d53',
                      height: width / 8,
                    }}>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: width / 20,
                        fontWeight: 'bold',
                      }}>
                      Ok
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  };

  render() {
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
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              flex: 1,
            }}>
            <Text
              style={{
                color: 'white',
                marginStart: width / 22,
                fontSize: width / 22,
              }}>
              {this.state.update ? 'Update Job' : 'Add Job'}
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              {/* <View style={{marginRight: width / 20}}>
                <Notification_icon_white height="22" width="22" />
              </View> */}
              <TouchableOpacity style={{marginRight: width / 25}}>
                <Icon
                  name="checkmark"
                  height="22"
                  width="22"
                  style={{
                    color: '#fff',
                  }}
                  onPress={() => {
                    this.state.update ? this.updateJob() : this.addJob();
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: '#EEECEE',
            paddingBottom: height / 30,
          }}>
          <Loader visibility={this.state.loader} />
          <View
            style={{
              marginVertical: height / 70,
              marginStart: width / 15,
              marginEnd: width / 15,
            }}>
            <Text style={[theme.fontBold, {fontSize: width / 24}]}>
              {this.state.update ? 'Update Job' : 'Add Job'}
            </Text>
          </View>
          <View
            style={{
              marginStart: width / 15,
              marginEnd: width / 15,
              flexDirection: 'column',
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Job Name
              </Text>
              <Text
                style={[
                  theme.fontMedium,
                  {color: '#000000', fontSize: width / 24},
                ]}>
                *
              </Text>
            </View>

            <FloatingLabelBorderInput
              width={width / 1.15}
              mandatory={true}
              value={this.state.name}
              returnKeyType={'next'}
              placeholder="Job Name"
              placeholderTextColor={'#808B96'}
              onChangeText={value => {
                this.setState({
                  name: value,
                });
              }}
              refInner={r => (this.inputRefs.name = r)}
              // onSubmitEditing={() => {
              //   this.inputRefs['description'].getNativeRef().focus();
              // }}
            />
            {this.state.name == '' && this.state.error ? (
              <Text style={styles.errorStyle}>Please enter job name</Text>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 50,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Job Category
              </Text>
              <Text
                style={[
                  theme.fontMedium,
                  {color: '#000000', fontSize: width / 24},
                ]}>
                *
              </Text>
            </View>
            <View style={{marginTop: height / 75}}>
              <DropDown
                placeholder="Select category"
                placeholderTextColor="#808080"
                data={this.state.categories}
                value={this.state.category}
                containerStyle={{
                  width: null,
                  borderRadius: 8,
                  paddingLeft: width / 45,
                  paddingRight: width / 45,
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: '#D4D4D5',
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
                onChange={value => {
                  this.setState({
                    category: value,
                    subcategory: '',
                  });
                  this.fetchSubCategories(value);
                }}
              />
            </View>
            {this.state.category == '' && this.state.error ? (
              <Text style={styles.errorStyle}>Please select job category</Text>
            ) : null}

            {/* <View
              style={{
                flexDirection: 'row',
                marginTop: height / 50,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Choose Subcategory
              </Text>
            </View>
            <View style={{marginTop: height / 75}}>
              <DropDown
                placeholder="Select a sub category"
                placeholderTextColor="#808080"
                data={this.state.subcategories}
                value={this.state.subcategory}
                containerStyle={{
                  width: null,
                  borderRadius: 8,
                  paddingLeft: width / 45,
                  paddingRight: width / 45,
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: '#D4D4D5',
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
                onChange={value => {
                  this.setState({
                    subcategory: value,
                  });
                }}
              />
            </View> */}

            <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Designation
              </Text>
              <Text
                style={[
                  theme.fontMedium,
                  {color: '#000000', fontSize: width / 24},
                ]}>
                *
              </Text>
            </View>

            <FloatingLabelBorderInput
              width={width / 1.15}
              mandatory={true}
              value={this.state.designation}
              returnKeyType={'next'}
              placeholder="Designation"
              placeholderTextColor={'#808B96'}
              onChangeText={value => {
                this.setState({
                  designation: value,
                });
              }}
              refInner={r => (this.inputRefs.designation = r)}
            />
            {this.state.designation == '' && this.state.error ? (
              <Text style={styles.errorStyle}>
                Please enter job designation
              </Text>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 50,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Qualification
              </Text>
              <Text
                style={[
                  theme.fontMedium,
                  {color: '#000000', fontSize: width / 24},
                ]}>
                *
              </Text>
            </View>
            <View style={{marginTop: height / 75}}>
              <DropDown
                placeholder="Select a Qualification"
                placeholderTextColor="#808080"
                data={this.state.qualifications}
                value={this.state.qualification}
                containerStyle={{
                  width: null,
                  borderRadius: 8,
                  paddingLeft: width / 45,
                  paddingRight: width / 45,
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: '#D4D4D5',
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
                onChange={value => {
                  this.setState({
                    qualification: value,
                  });
                }}
              />
            </View>
            {this.state.qualification == '' && this.state.error ? (
              <Text style={styles.errorStyle}>Please select qualification</Text>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 50,
                marginBottom: height / 70,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Description
              </Text>
              <Text
                style={[
                  theme.fontMedium,
                  {color: '#000000', fontSize: width / 24},
                ]}>
                *
              </Text>
            </View>
            <View
              style={{
                paddingRight: width / 45,
                borderWidth: 1,
                borderColor: '#D4D4D5',
                backgroundColor: 'white',
                borderRadius: 8,
              }}>
              <Textarea
                value={this.state.description}
                style={{width: width / 1.15}}
                rowSpan={5}
                placeholder="Type your description here..."
                onChangeText={value => {
                  this.setState({
                    description: value,
                  });
                }}
              />
            </View>
            {/* <TextInput
              ref={r => (this.inputRefs['description'] = r)}
              style={{
                borderColor: '#D4D4D5',
                borderWidth: 1,
                backgroundColor: 'white',
                height: height / 15.8,
                width: width / 1.15,
                borderRadius: 8,
                fontSize: width / 25,
                color: '#000000',
                paddingStart: width / 20,
                height: height / 7,
              }}
              multiline={true}
              value={this.state.description}
              onChangeText={text => {
                this.setState({
                  description: text,
                });
              }}
              placeholder="Type your description here"
              returnKeyType="go"
              onFocus={this.handleFocusDescp}
              autoCorrect={false}
            /> */}
            {this.state.description == '' && this.state.error ? (
              <Text style={styles.errorStyle}>Please enter description</Text>
            ) : null}

            {/* <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Year of Experience
              </Text>
              <Text
                style={[
                  theme.fontMedium,
                  {color: '#000000', fontSize: width / 24},
                ]}>
                *
              </Text>
              <Text
                style={[
                  theme.fontRegular,
                  {fontSize: width / 26, color: 'red', marginLeft: width / 40},
                ]}>
                (Maximum 15 characters)
              </Text>
            </View>

            <FloatingLabelBorderInput
              width={width / 1.15}
              mandatory={true}
              value={this.state.experience}
              returnKeyType={'next'}
              placeholder="Experience"
              placeholderTextColor={'#808B96'}
              onChangeText={value => {
                this.setState({
                  experience: value,
                });
              }}
              refInner={r => (this.inputRefs.experience = r)}
            /> */}
            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 50,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Salary
              </Text>
              <Text
                style={[
                  theme.fontMedium,
                  {color: '#000000', fontSize: width / 24},
                ]}>
                *
              </Text>
              <Text
                style={[
                  theme.fontRegular,
                  {fontSize: width / 26, color: 'red', marginLeft: width / 40},
                ]}>
                (Annual/Monthly)
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 75,
                justifyContent: 'space-between',
              }}>
              <View>
                <View>
                  <DropDown
                    placeholder="Annual"
                    placeholderTextColor="#808080"
                    data={[
                      {
                        label: 'Monthly',
                        value: '1',
                      },
                      {
                        label: 'Yearly',
                        value: '2',
                      },
                    ]}
                    value={this.state.salaryType}
                    containerStyle={{
                      width: width / 2.45,
                      borderRadius: 8,
                      paddingLeft: width / 45,
                      paddingRight: width / 45,
                      backgroundColor: '#fff',
                      borderWidth: 1,
                      borderColor: '#D4D4D5',
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
                    onChange={value => {
                      this.setState({
                        salaryType: value,
                      });
                    }}
                  />
                </View>
              </View>
              <View>
                <FloatingLabelBorderInput
                  width={width / 3}
                  mandatory={true}
                  value={this.state.salary}
                  returnKeyType={'next'}
                  keyboard="number-pad"
                  placeholder="Salary"
                  placeholderTextColor={'#808B96'}
                  onChangeText={value => {
                    this.setState({
                      salary: value,
                    });
                  }}
                  refInner={r => (this.inputRefs.salary = r)}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 50,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Employee Type
              </Text>
              <Text
                style={[
                  theme.fontMedium,
                  {color: '#000000', fontSize: width / 24},
                ]}>
                *
              </Text>
              <Text
                style={[
                  theme.fontRegular,
                  {fontSize: width / 26, color: 'red', marginLeft: width / 80},
                ]}>
                (Full Time/Part Time/Contact Basis)
              </Text>
            </View>
            <View style={{marginTop: height / 75}}>
              <DropDown
                placeholder="Select employee type"
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
                value={this.state.employeeType}
                containerStyle={{
                  width: null,
                  borderRadius: 8,
                  paddingLeft: width / 45,
                  paddingRight: width / 45,
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: '#D4D4D5',
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
                onChange={value => {
                  this.setState({
                    employeeType: value,
                  });
                }}
              />
            </View>
            {this.state.employeeType == '' && this.state.error ? (
              <Text style={styles.errorStyle}>Please select employee type</Text>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Contact Name
              </Text>
              <Text style={{color: '#000000', fontSize: width / 24}}>*</Text>
            </View>

            <FloatingLabelBorderInput
              width={width / 1.15}
              mandatory={true}
              value={this.state.contactName}
              returnKeyType={'next'}
              placeholder="Contact Name"
              placeholderTextColor={'#808B96'}
              onChangeText={value => {
                this.setState({
                  contactName: value,
                });
              }}
              refInner={r => (this.inputRefs.contactName = r)}
              onSubmitEditing={() => {
                this.inputRefs.contactNumber.getNativeRef().focus();
              }}
            />
            {this.state.contactName == '' && this.state.error ? (
              <Text style={styles.errorStyle}>Please enter contact name</Text>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 50,
                marginBottom: height / 90,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Contact Number
              </Text>
              <Text style={{color: '#000000', fontSize: width / 24}}>*</Text>
            </View>
            <View
              style={{
                borderColor: this.state.isFocused ? '#D4D4D5' : '#D4D4D5',
                borderWidth: this.state.isFocused ? 1 : 1,
                backgroundColor: this.state.isFocused ? 'white' : 'white',
                borderRadius: 8,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingLeft: width / 20,
                width: width / 1.15,
                height: height / 16,
                marginTop: width / 30,
              }}>
              <Text
                style={{
                  fontSize: width / 25,
                  color: '#ABB2B9',
                }}>
                {CONSTANTS.COUNTRY_CODE_TEXT}
              </Text>
              <TextInput
                style={{
                  color: AppColors.fontColorDark,
                  backgroundColor: this.state.isFocused ? 'white' : 'white',
                  width: width / 1.5,
                  borderRadius: 8,
                }}
                value={this.state.contactNumber}
                onChangeText={text => {
                  this.setState({
                    contactNumber: text,
                  });
                }}
                keyboardType="number-pad"
                ref={r => (this.inputRefs.contactNumber = r)}
                returnKeyType={'next'}
                autoCorrect={false}
                onSubmitEditing={() => {
                  this.inputRefs.contactEmail.getNativeRef().focus();
                }}
              />
            </View>
            {/* <FloatingLabelBorderInput
              keyboard="number-pad"
              width={width / 1.15}
              mandatory={true}
              value={this.state.contactNumber}
              returnKeyType={'next'}
              placeholder="Contact Number"
              placeholderTextColor={'#808B96'}
              onChangeText={value => {
                this.setState({
                  contactNumber: value,
                });
              }}
              refInner={ref => (this.inputRefs['contactNumber'] = ref)}
              onSubmitEditing={() => {
                this.inputRefs['contactEmail'].getNativeRef().focus();
              }}
            /> */}
            {this.state.contactNumber == '' && this.state.error ? (
              <Text style={styles.errorStyle}>Please enter contact number</Text>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Contact Email
              </Text>
            </View>

            <FloatingLabelBorderInput
              width={width / 1.15}
              mandatory={true}
              value={this.state.contactEmail}
              returnKeyType={'next'}
              placeholder="Contact Email"
              placeholderTextColor={'#808B96'}
              onChangeText={value => {
                this.setState({
                  contactEmail: value,
                });
              }}
              refInner={ref => (this.inputRefs.contactEmail = ref)}
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
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Address
              </Text>
              <Text style={{color: '#000000', fontSize: width / 24}}>*</Text>
            </View>

            <FloatingLabelBorderInput
              width={width / 1.15}
              mandatory={true}
              value={this.state.addressString}
              returnKeyType={'next'}
              placeholder="Address"
              placeholderTextColor={'#808B96'}
              onChangeText={value => {
                this.setState({
                  addressString: value,
                });
              }}
              refInner={r => (this.inputRefs.addressString = r)}
            />
            {this.state.addressString == '' && this.state.error ? (
              <Text style={styles.errorStyle}>Please enter your address</Text>
            ) : null}
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 50,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Location Name
                </Text>
                <Text
                  style={[
                    theme.fontMedium,
                    {color: '#000000', fontSize: width / 24},
                  ]}>
                  *
                </Text>
              </View>
              <View style={{marginTop: height / 60}}>
                <DropDown
                  placeholder="Select a location"
                  placeholderTextColor="#808080"
                  data={this.state.locations}
                  // value={this.state.locationCode && this.state.locationName ? this.state.locationCode + '-' + this.state.locationName : ''}
                  value={this.state.locationCode}
                  containerStyle={{
                    width: null,
                    borderRadius: 8,
                    paddingLeft: width / 45,
                    paddingRight: width / 45,
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: '#D4D4D5',
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
                        locationCode: value,
                        locationName:
                          this.state.locations.length > 0
                            ? this.state.locations[index].label
                            : '',
                      },
                      () => {
                        // console.log('usertype>', this.state.countryId);
                      },
                    );
                  }}
                />
              </View>
              {this.state.locationCode == '' &&
              this.state.locationName == '' &&
              this.state.error ? (
                <Text style={styles.errorStyle}>
                  Please select your location
                </Text>
              ) : null}

              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: height / 60,
                    marginBottom: height / 60,
                  }}>
                  <GooglePlacesAutocomplete
                    styles={{
                      textInput: {
                        color: AppColors.fontColorDark,
                      },
                    }}
                    placeholder="Type a place name"
                    onPress={(data, details = null) => {
                      const deltaObj = this.deltaFrom(
                        details?.geometry?.location?.lat,
                        details?.geometry?.location?.lng,
                        1000,
                      );
                      this.setState({
                        region: {
                          latitude: details?.geometry?.location?.lat,
                          longitude: details?.geometry?.location?.lng,
                          latitudeDelta:
                            'latitudeDelta' in deltaObj
                              ? deltaObj.latitudeDelta
                              : 5,
                          longitudeDelta:
                            'longitudeDelta' in deltaObj
                              ? deltaObj.longitudeDelta
                              : 0.03,
                        },
                        businessRegion: {
                          latitude: details?.geometry?.location?.lat,
                          longitude: details?.geometry?.location?.lng,
                        },
                        lat: details?.geometry?.location?.lat,
                        lng: details?.geometry?.location?.lng,
                      });
                    }}
                    query={{
                      key: CONSTANTS.MAP_KEY,
                      language: 'en',
                    }}
                    enablePoweredByContainer={false}
                    nearbyPlacesAPI="GooglePlacesSearch"
                    debounce={200}
                    fetchDetails={true}
                  />
                </View>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: height / 60,
                    marginBottom: height / 60,
                  }}>
                  <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                    Location Map
                  </Text>
                  <Text
                    style={[
                      theme.fontMedium,
                      {color: '#000000', fontSize: width / 24},
                    ]}>
                    *
                  </Text>
                </View>

                <MapView
                  initialRegion={this.state.region}
                  region={this.state.region}
                  minHeight={280}>
                  <Marker
                    draggable
                    coordinate={this.state.businessRegion}
                    onDragEnd={e => {
                      this.setState({
                        businessRegion: e.nativeEvent.coordinate,
                        lat: e.nativeEvent.coordinate.latitude,
                        lng: e.nativeEvent.coordinate.longitude,
                      });
                    }}
                  />
                </MapView>
              </View>
              {this.state.lat == '' &&
              this.state.lng == '' &&
              this.state.error ? (
                <Text style={styles.errorStyle}>
                  Please select your location in map
                </Text>
              ) : null}
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 60,
                marginBottom: height / 70,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Add Image
              </Text>
              {/* <Text
                style={[
                  theme.fontMedium,
                  {color: '#000000', fontSize: width / 24},
                ]}>
                *
              </Text> */}
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {this.state.existingImage.map((image, ind) => {
                return (
                  <View
                    style={{
                      margin: width / 85,
                    }}>
                    <TouchableOpacity
                      style={{
                        height: 25,
                        width: 25,
                        position: 'absolute',
                        zIndex: 1000,
                        right: 0,
                        top: 0,
                        backgroundColor: '#bd1d53',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      activeOpacity={0.7}
                      onPress={() => {
                        this.state.existingImage.splice(ind, 1);
                        this.state.removedImages.push(image.url);
                        this.setState({
                          existingImage: this.state.existingImage,
                          removedImages: this.state.removedImages,
                        });
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                        }}>
                        X
                      </Text>
                    </TouchableOpacity>
                    <Image
                      source={{uri: CONSTANTS.SMALL_IMG + image.url}}
                      style={{
                        height: 100,
                        width: 100,
                        resizeMode: 'cover',
                      }}
                    />
                  </View>
                );
              })}
              {this.state.image.map((image, ind) => {
                return (
                  <View
                    style={{
                      margin: width / 85,
                    }}>
                    <TouchableOpacity
                      style={{
                        height: 25,
                        width: 25,
                        position: 'absolute',
                        zIndex: 1000,
                        right: 0,
                        top: 0,
                        backgroundColor: '#bd1d53',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      activeOpacity={0.7}
                      onPress={() => {
                        this.state.image.splice(ind, 1);
                        this.setState({
                          image: this.state.image,
                        });
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                        }}>
                        X
                      </Text>
                    </TouchableOpacity>
                    <Image
                      source={{uri: image.uri}}
                      style={{
                        height: 100,
                        width: 100,
                        resizeMode: 'cover',
                      }}
                    />
                  </View>
                );
              })}
              <TouchableOpacity
                onPress={() => this.pickGallery()}
                activeOpacity={0.6}
                style={{
                  alignSelf: 'flex-start',
                  margin: width / 85,
                }}>
                <Add_image height="100" width="100" />
              </TouchableOpacity>
            </View>

            {/* {this.state.image.length == 0 && this.state.error ? (
              <Text style={styles.errorStyle}>Please select job images</Text>
            ) : null} */}

            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 30,
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
                  zIndex: 1000,
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
              <Text style={styles.errorStyle}>
                Please check terms & condition
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={() => {
                this.state.update ? this.updateJob() : this.addJob();
              }}
              style={{
                width: width / 1.15,
                borderRadius: 8,
                marginTop: width / 12,
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
                {this.state.update ? 'Update Job' : 'Add Job'}
              </Text>
            </TouchableOpacity>
          </View>
          {this.verifyModal()}
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