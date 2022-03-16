import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
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
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

export default class AddBusiness extends Component {
  weeksShort = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  weeksLong = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  inputRefs = {
    mobile: React.createRef(),
    email: React.createRef(),
    website: React.createRef(),
    address: React.createRef(),
    description: React.createRef(),
  };
  contentRef;
  constructor() {
    super();
    const focused = () => {
      this.setState({backgroundcolor: ''});
    };

    const blured = () => {
      this.setState({backgroundcolor: ''});
    };
    this.state = {
      companyName: '',
      description: '',
      address: '',
      website: '',
      email: '',
      specializedIn: '',
      awards: '',
      workingHours: [
        {MON: ''},
        {TUE: ''},
        {WED: ''},
        {THU: ''},
        {FRI: ''},
        {SAT: ''},
        {SUN: ''},
      ],
      contactName: '',
      contactNumber: '',
      contactTimeFrom: '',
      contactTimeTo: '',
      locationCode: '',
      locationName: '',
      lat: '',
      lng: '',
      addressString: '',
      image: [],
      existingImage: [],
      awardImages: [],
      awardExistingImages: [],
      error: false,
      fromtime: '',
      totime: '',
      loader: false,
      isFocused: false,
      isBusinessInfo: false,
      isContact: false,
      isFocusedDescr: false,
      isFocusedSpl: false,
      isDateFromPickerVisible: false,
      isDateToPickerVisible: false,
      isChecked: false,
      locations: [],
      region: {
        latitude: 21.0000287,
        longitude: 57.0036901,
        latitudeDelta: 5,
        longitudeDelta: 0.03,
        locationPlace: '',
      },
      businessRegion: {
        latitude: 21.0000287,
        longitude: 57.0036901,
      },
      update: false,
      removedImages: [],
    };
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

  async addBusiness() {
    this.setState({
      emailValid: true,
      loader: true,
    });
    if (
      this.state.companyName == '' ||
      this.state.address == '' ||
      this.state.specializedIn == '' ||
      this.state.contactName == '' ||
      this.state.contactNumber == '' ||
      this.state.locationCode == '' ||
      this.state.locationName == '' ||
      this.state.lat == '' ||
      this.state.lng == '' ||
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

      const params = new FormData();
      params.append('companyName', this.state.companyName);
      params.append('description', this.state.description);
      params.append('address', this.state.address);
      params.append('website', this.state.website);
      params.append('email', this.state.email.trim());
      params.append('specializedIn', this.state.specializedIn);
      params.append('awards', this.state.awards);
      params.append(
        'workingHours',
        JSON.stringify(
          this.state.workingHours.map(dHour => {
            const workHours = this.short;
          }),
        ),
      );
      params.append('contactName', this.state.contactName);
      params.append('contactNumber', this.state.contactNumber);
      params.append('contactTimeFrom', this.state.fromtime);
      params.append('contactTimeTo', this.state.totime);
      params.append('locationCode', this.state.locationCode);
      params.append('locationName', this.state.locationName);
      params.append('lat', this.state.lat);
      params.append('lng', this.state.lng);
      params.append('addressString', this.state.address);

      if (this.state.image.length) {
        for (let i = 0; i < this.state.image.length; i++) {
          params.append('image', this.state.image[i]);
        }
      }

      if (this.state.awardImages.length) {
        for (let i = 0; i < this.state.awardImages.length; i++) {
          params.append('awardImages', this.state.awardImages[i]);
        }
      }

      // console.log("Form Data", params);

      await ApiHelper.form_post(API.businessDirectory, params)
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

  async updateBusiness() {
    console.log('Working hours', this.state.workingHours);
    this.setState({
      emailValid: true,
      loader: true,
    });
    if (
      this.state.companyName == '' ||
      this.state.address == '' ||
      this.state.specializedIn == '' ||
      this.state.contactName == '' ||
      this.state.contactNumber == '' ||
      this.state.locationCode == '' ||
      this.state.locationName == '' ||
      this.state.lat == '' ||
      this.state.lng == '' ||
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

      const params = new FormData();
      params.append('companyName', this.state.companyName);
      params.append('description', this.state.description);
      params.append('address', this.state.address);
      params.append('website', this.state.website);
      params.append('email', this.state.email.trim());
      params.append('specializedIn', this.state.specializedIn);
      params.append('awards', this.state.awards);
      params.append('workingHours', JSON.stringify(this.state.workingHours));
      params.append('contactName', this.state.contactName);
      params.append('contactNumber', this.state.contactNumber);
      params.append('contactTimeFrom', this.state.fromtime);
      params.append('contactTimeTo', this.state.totime);
      params.append('locationCode', this.state.locationCode);
      params.append('locationName', this.state.locationName);
      params.append('lat', this.state.lat);
      params.append('lng', this.state.lng);
      params.append('addressString', this.state.address);
      params.append('removedImages', JSON.stringify(this.state.removedImages));
      params.append(
        'existingImages',
        JSON.stringify(this.state.existingImage.map(img => img.url)),
      );
      params.append(
        'existingAwardImages',
        JSON.stringify(this.state.awardExistingImages.map(img => img.url)),
      );

      if (this.state.image.length) {
        for (let i = 0; i < this.state.image.length; i++) {
          params.append('image', this.state.image[i]);
        }
      }

      if (this.state.awardImages.length) {
        for (let i = 0; i < this.state.awardImages.length; i++) {
          params.append('awardImages', this.state.awardImages[i]);
        }
      }

      // console.log("Form Data", params);

      await ApiHelper.form_put(API.businessDirectory, params)
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

  async getBusinessData() {
    await ApiHelper.get(API.getBusiness)
      .then(res => {
        if ('data' in res.data && res.data.data) {
          const businessData = res.data.data;
          console.log('Business Data', businessData);
          let deltaObj = {};
          if ('lat' in businessData.mapDetails && businessData.mapDetails.lat) {
            deltaObj = this.deltaFrom(
              businessData.mapDetails.lat,
              businessData.mapDetails.lng,
              1000,
            );
          }
          this.setState({
            update:
              'companyName' in businessData && businessData.companyName
                ? true
                : false,
            companyName: businessData.companyName
              ? businessData.companyName
              : this.state.companyName,
            contactNumber: businessData.contactDetails.contactNumber
              ? businessData.contactDetails.contactNumber
              : this.state.contactNumber,
            email: businessData.email ? businessData.email : this.state.email,
            website: businessData.website
              ? businessData.website
              : this.state.website,
            address: businessData.address
              ? businessData.address
              : this.state.address,
            description: businessData.description
              ? businessData.description
              : this.state.description,
            specializedIn: businessData.specializedIn
              ? businessData.specializedIn
              : this.state.specializedIn,
            awards: businessData.awards
              ? businessData.awards
              : this.state.awards,
            awardExistingImages: businessData.awardImages
              ? businessData.awardImages
              : this.state.awardExistingImages,
            existingImage: businessData.imageFiles
              ? businessData.imageFiles
              : this.state.existingImage,
            contactName: businessData.contactDetails.contactName
              ? businessData.contactDetails.contactName
              : businessData.userDetails.name,
            fromtime: businessData.contactDetails.contactTimeFrom
              ? businessData.contactDetails.contactTimeFrom
              : this.state.fromtime,
            totime: businessData.contactDetails.contactTimeTo
              ? businessData.contactDetails.contactTimeTo
              : this.state.totime,
            workingHours:
              businessData.workingHours.length > 0
                ? businessData.workingHours.map(hour => {
                    let newHour = {};
                    newHour[hour.day] = hour.hours;
                    return newHour;
                  })
                : this.state.workingHours,
            locationCode: businessData.locationDetails.locationCode
              ? businessData.locationDetails.locationCode
              : this.state.locationCode,
            locationName: businessData.locationDetails.locationName
              ? businessData.locationDetails.locationName
              : this.state.locationName,
            region: {
              latitude: businessData.mapDetails.lat
                ? businessData.mapDetails.lat
                : 21.0000287,
              longitude: businessData.mapDetails.lng
                ? businessData.mapDetails.lng
                : 57.0036901,
              latitudeDelta:
                'latitudeDelta' in deltaObj ? deltaObj.latitudeDelta : 5,
              longitudeDelta:
                'longitudeDelta' in deltaObj ? deltaObj.longitudeDelta : 0.03,
            },
            businessRegion: {
              latitude: businessData.mapDetails.lat
                ? businessData.mapDetails.lat
                : 21.0000287,
              longitude: businessData.mapDetails.lng
                ? businessData.mapDetails.lng
                : 57.0036901,
            },
            lat: businessData.mapDetails.lat
              ? businessData.mapDetails.lat
              : 21.0000287,
            lng: businessData.mapDetails.lng
              ? businessData.mapDetails.lng
              : 57.0036901,
            isChecked: true,
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
            value: row.code + '-' + row.name,
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
  componentDidMount() {
    this.getBusinessData();
    this.getLocationsData();
    this.setState({
      isContact: false,
      isBusinessInfo: true,
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

  // Award picker
  async pickAwards() {
    try {
      const options = {
        title: 'Awards and Certificates',
        mediaType: 'photo',
        multiple: true,
      };
      const awards = await ImagePicker.openPicker(options);
      const awardImages = awards.map(award => {
        return {
          uri: award.path,
          type: award.mime,
          name: award.path.replace(/^.*[\\\/]/, ''),
        };
      });
      this.state.awardImages = this.state.awardImages.concat(awardImages);
      this.setState({
        awardImages: this.state.awardImages,
      });
    } catch (e) {}
  }

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

  onWorkingHourFrom(time, index) {
    const newFrom = moment(time).format('hh:mm a', true);
    const existingHours =
      index in this.state.workingHours ? this.state.workingHours[index] : '';
    const existHour =
      existingHours !== '' ? existingHours[this.weeksShort[index]] : '';
    if (existingHours !== '' && existHour !== '') {
      const existHourSplit = existingHours[this.weeksShort[index]].split('-');
      const existFrom = existHourSplit[0];
      const existTo = existHourSplit[1];
      this.state.workingHours[index][this.weeksShort[index]] =
        newFrom + '-' + existTo;
      this.setState({
        workingHours: this.state.workingHours,
      });
    } else {
      this.state.workingHours[index] = {};
      this.state.workingHours[index][this.weeksShort[index]] = newFrom + '-0';
      this.setState({
        workingHours: this.state.workingHours,
      });
    }
  }

  onWorkingHourTo(time, index) {
    const newTo = moment(time).format('hh:mm a', true);
    const existingHours =
      index in this.state.workingHours ? this.state.workingHours[index] : '';
    const existHour =
      existingHours !== '' ? existingHours[this.weeksShort[index]] : '';
    if (existingHours !== '' && existHour !== '') {
      const existHourSplit = existingHours[this.weeksShort[index]].split('-');
      const existFrom = existHourSplit[0];
      const existTo = existHourSplit[1];
      this.state.workingHours[index][this.weeksShort[index]] =
        existFrom + '-' + newTo;
      this.setState({
        workingHours: this.state.workingHours,
      });
    } else {
      this.state.workingHours[index] = {};
      this.state.workingHours[index][this.weeksShort[index]] = '0-' + newTo;
      this.setState({
        workingHours: this.state.workingHours,
      });
    }
  }

  workingHourFrom(index) {
    const existingHours =
      index in this.state.workingHours ? this.state.workingHours[index] : '';
    if (existingHours !== '') {
      const existHour = existingHours[this.weeksShort[index]];
      if (existHour !== '') {
        const existHourSplit = existingHours[this.weeksShort[index]].split('-');
        const existFrom = existHourSplit[0] !== '0' ? existHourSplit[0] : '';
        return existFrom;
      }
    }
    return '';
  }

  workingHourTo(index) {
    const existingHours =
      index in this.state.workingHours ? this.state.workingHours[index] : '';
    if (existingHours !== '') {
      const existHour = existingHours[this.weeksShort[index]];
      if (existHour !== '') {
        const existHourSplit = existingHours[this.weeksShort[index]].split('-');
        const existTo = existHourSplit[1] !== '0' ? existHourSplit[1] : '';
        return existTo;
      }
    }
    return '';
  }

  onCloseHour(index) {
    this.state.workingHours[index] = {};
    this.state.workingHours[index][this.weeksShort[index]] = '';
    this.setState({
      workingHours: this.state.workingHours,
    });
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
  handleFocus = () => this.setState({isFocused: true});
  handleFocusDescp = () => this.setState({isFocusedDescr: true});
  handleFocusSpecialized = () => this.setState({isFocusedSpl: true});
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

          <Text
            style={{
              color: 'white',
              marginStart: width / 22,
              fontSize: width / 22,
            }}>
            {this.state.update ? 'Update Business' : 'Add Business'}
          </Text>
          <View style={{position: 'absolute', right: width / 20}}>
            <Notification_icon_white height="22" width="22" />
          </View>
        </View>

        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: '#EEECEE',
            paddingBottom: height / 30,
          }}
          ref={c => (this.contentRef = c)}>
          <Loader visibility={this.state.loader} />

          <View
            style={{
              flexDirection: 'row',
              height: height / 15,
              marginBottom: height / 32,
              backgroundColor: 'white',
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.setState({
                  isBusinessInfo: true,
                  isContact: false,
                });
              }}
              style={
                this.state.isBusinessInfo
                  ? {
                      borderBottomWidth: 2,
                      backgroundColor: 'white',
                      borderBottomColor: '#bd1d53',
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }
                  : {
                      borderWidth: 0,
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }
              }>
              <Text
                style={
                  this.state.isBusinessInfo
                    ? {
                        color: '#000000',
                        fontSize: width / 25,
                        fontWeight: 'bold',
                      }
                    : {
                        color: '#888888',
                        fontSize: width / 25,
                        fontWeight: 'bold',
                      }
                }>
                Business Info
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.setState({
                  isBusinessInfo: false,
                  isContact: true,
                });
              }}
              style={
                this.state.isContact
                  ? {
                      borderBottomWidth: 2,
                      backgroundColor: 'white',
                      borderBottomColor: '#bd1d53',
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }
                  : {
                      borderWidth: 0,
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }
              }>
              <Text
                style={
                  this.state.isContact
                    ? {
                        color: '#000000',
                        fontSize: width / 25,
                        fontWeight: 'bold',
                      }
                    : {
                        color: '#888888',
                        fontSize: width / 25,
                        fontWeight: 'bold',
                      }
                }>
                Contact
              </Text>
            </TouchableOpacity>
          </View>

          {this.state.isBusinessInfo ? (
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
                  Company Name
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
                value={this.state.companyName}
                returnKeyType={'next'}
                ref={ref => (this.customInput2 = ref)}
                refInner="innerTextInput2"
                onSubmitEditing={() => {
                  this.inputRefs.mobile.getNativeRef().focus();
                }}
                placeholder="Company Name"
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    companyName: value,
                  });
                }}
              />
              {this.state.companyName == '' && this.state.error ? (
                <Text style={styles.errorStyle}>Please enter company name</Text>
              ) : null}

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 50,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Mobile Number
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
                  ref={r => (this.inputRefs.mobile = r)}
                  returnKeyType={'next'}
                  autoCorrect={false}
                  onSubmitEditing={() => {
                    this.inputRefs.email.getNativeRef().focus();
                  }}
                />
              </View>
              {this.state.contactNumber == '' && this.state.error ? (
                <Text style={styles.errorStyle}>
                  Please enter mobile number
                </Text>
              ) : null}
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 50,
                  marginBottom: height / 70,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Email
                </Text>
              </View>
              <FloatingLabelBorderInput
                width={width / 1.15}
                mandatory={true}
                value={this.state.email}
                returnKeyType={'next'}
                onSubmitEditing={() => {
                  this.inputRefs.website.getNativeRef().focus();
                }}
                refInner={r => (this.inputRefs.email = r)}
                placeholder="Company Email"
                placeholderTextColor={'#808B96'}
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
                  marginTop: height / 50,
                  marginBottom: height / 70,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Website
                </Text>
              </View>
              <FloatingLabelBorderInput
                width={width / 1.15}
                mandatory={true}
                value={this.state.website}
                returnKeyType={'next'}
                refInner={r => (this.inputRefs.website = r)}
                onSubmitEditing={() => {
                  this.inputRefs.address.getNativeRef().focus();
                }}
                placeholder="Company Website"
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    website: value,
                  });
                }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 50,
                  marginBottom: height / 70,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Address
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
                value={this.state.address}
                returnKeyType={'next'}
                refInner={r => (this.inputRefs.address = r)}
                // onSubmitEditing={() => {
                //   this.inputRefs["description"].getNativeRef().focus()
                // }}
                placeholder="Company Address"
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    address: value,
                  });
                }}
              />
              {this.state.address == '' && this.state.error ? (
                <Text style={styles.errorStyle}>
                  Please enter your company address
                </Text>
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
                style={{
                  borderColor: this.state.isFocused ? '#D4D4D5' : '#D4D4D5',
                  borderWidth: this.state.isFocused ? 1 : 1,
                  backgroundColor: this.state.isFocusedDescr
                    ? 'white'
                    : 'white',
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
                returnKeyType="go"
                onFocus={this.handleFocusDescp}
                autoCorrect={false}
                ref={r => this.inputRefs["description"] = r}
              /> */}

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 50,
                  marginBottom: height / 70,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Specialized in
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
                  value={this.state.specializedIn}
                  style={{width: width / 1.15}}
                  rowSpan={5}
                  placeholder="Specialization details here..."
                  onChangeText={value => {
                    this.setState({
                      specializedIn: value,
                    });
                  }}
                />
              </View>
              {/* <TextInput
                style={{
                  borderColor: this.state.isFocused ? '#D4D4D5' : '#D4D4D5',
                  borderWidth: this.state.isFocused ? 1 : 1,
                  backgroundColor: this.state.isFocusedSpl ? 'white' : 'white',
                  height: height / 15.8,
                  width: width / 1.15,
                  borderRadius: 8,
                  fontSize: width / 25,
                  color: '#000000',
                  paddingStart: width / 20,
                  height: height / 7,
                }}
                multiline={true}
                value={this.state.specializedIn}
                onChangeText={text => {
                  this.setState({
                    specializedIn: text,
                  });
                }}
                returnKeyType="go"
                autoCorrect={false}
              /> */}
              {this.state.specializedIn == '' && this.state.error ? (
                <Text style={styles.errorStyle}>
                  Please enter specialization details
                </Text>
              ) : null}

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 50,
                  marginBottom: height / 70,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Awards
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
                  value={this.state.awards}
                  style={{width: width / 1.15}}
                  rowSpan={5}
                  placeholder="Award details here..."
                  onChangeText={value => {
                    this.setState({
                      awards: value,
                    });
                  }}
                />
              </View>
              {/* <TextInput
                style={{
                  borderColor: this.state.isFocused ? '#D4D4D5' : '#D4D4D5',
                  borderWidth: this.state.isFocused ? 1 : 1,
                  backgroundColor: this.state.isFocusedSpl ? 'white' : 'white',
                  height: height / 15.8,
                  width: width / 1.15,
                  borderRadius: 8,
                  fontSize: width / 25,
                  color: '#000000',
                  paddingStart: width / 20,
                  height: height / 7,
                }}
                multiline={true}
                value={this.state.awards}
                onChangeText={text => {
                  this.setState({
                    awards: text,
                  });
                }}
                returnKeyType="go"
                autoCorrect={false}
              /> */}

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 30,
                  marginBottom: height / 70,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Awards and Certificate
                </Text>
                {/* <Text style={{ color: '#000000', fontSize: width / 24 }}>*</Text> */}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {this.state.awardExistingImages.map((image, ind) => {
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
                          this.state.awardExistingImages.splice(ind, 1);
                          this.state.removedImages.push(image.url);
                          this.setState({
                            awardExistingImages: this.state.awardExistingImages,
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
                {this.state.awardImages.map((image, ind) => {
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
                          this.state.awardImages.splice(ind, 1);
                          this.setState({
                            awardImages: this.state.awardImages,
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
                  onPress={() => this.pickAwards()}
                  activeOpacity={0.6}
                  style={{
                    alignSelf: 'flex-start',
                    margin: width / 85,
                  }}>
                  <Add_image height="100" width="100" />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 30,
                  marginBottom: height / 70,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Image Gallery
                </Text>
                {/* <Text style={[theme.fontMedium, { color: '#000000', fontSize: width / 24 }]}>*</Text> */}
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
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isBusinessInfo: false,
                    isContact: true,
                  });
                  this.contentRef._root.scrollToPosition(0, 0);
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
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                backgroundColor: '#EEECEE',
                // height: height,
              }}>
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
                    Contact Name
                  </Text>
                  <Text style={{color: '#000000', fontSize: width / 24}}>
                    *
                  </Text>
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
                />
                {this.state.contactName == '' && this.state.error ? (
                  <Text style={styles.errorStyle}>
                    Please enter contact name
                  </Text>
                ) : null}
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: height / 30,
                  }}>
                  <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                    Contact Time
                  </Text>
                </View>
                <View style={{marginTop: height / 70, flexDirection: 'row'}}>
                  <View style={{marginEnd: width / 40, flex: 1}}>
                    <Item
                      onPress={() => {
                        this.showDatePickerFrom();
                      }}
                      regular
                      style={{
                        paddingRight: width / 45,
                        borderColor: '#D4D4D5',
                        borderWidth: 2,
                        backgroundColor: 'white',
                        borderRadius: 8,
                      }}>
                      <Input
                        disabled
                        placeholder="From Time"
                        value={this.state.fromtime}
                        style={{
                          fontSize: width / 25,
                          color: '#000000',
                        }}
                      />
                      <Image source={require('../assets/images/time.png')} />
                    </Item>

                    <DateTimePickerModal
                      isVisible={this.state.isDateFromPickerVisible}
                      mode="time"
                      onConfirm={this.handleConfirmFrom}
                      onCancel={this.hideDatePickerFrom}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <Item
                      regular
                      onPress={() => {
                        this.showDatePickerTo();
                      }}
                      style={{
                        paddingRight: width / 45,
                        borderColor: '#D4D4D5',
                        borderWidth: 2,
                        backgroundColor: 'white',
                        borderRadius: 8,
                      }}>
                      <Input
                        disabled
                        value={this.state.totime}
                        placeholder="To Time"
                        style={{
                          fontSize: width / 25,
                          color: '#000000',
                        }}
                      />
                      <DateTimePickerModal
                        isVisible={this.state.isDateToPickerVisible}
                        mode="time"
                        onConfirm={this.handleConfirmTo}
                        onCancel={this.hideDatePickerTo}
                      />
                      <Image source={require('../assets/images/time.png')} />
                    </Item>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    marginTop: height / 30,
                    marginBottom: height / 90,
                  }}>
                  <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                    Working Hours
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: height / 4.5,
                }}>
                <Tabs
                  renderTabBar={() => (
                    <ScrollableTab
                      underlineStyle={{backgroundColor: '#BC1D54', height: 2.6}}
                    />
                  )}>
                  {this.weeksLong.map((week, index) => {
                    return (
                      <Tab
                        style={{backgroundColor: '#EEECEE'}}
                        heading={
                          <TabHeading style={{backgroundColor: '#fff'}}>
                            <Text>{week}</Text>
                          </TabHeading>
                        }>
                        <DayTab
                          onFromConfirm={time => {
                            this.onWorkingHourFrom(time, index);
                          }}
                          onToConfirm={time => {
                            this.onWorkingHourTo(time, index);
                          }}
                          fromTime={this.workingHourFrom(index)}
                          toTime={this.workingHourTo(index)}
                          onClose={() => {
                            this.onCloseHour(index);
                          }}
                          update={this.state.update}
                        />
                      </Tab>
                    );
                  })}
                </Tabs>
              </View>
              <View style={{marginStart: width / 15, marginEnd: width / 15}}>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#D4D4D5',
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: height / 30,
                  }}>
                  <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                    Location
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
                    value={
                      this.state.locationCode && this.state.locationName
                        ? this.state.locationCode +
                          '-' +
                          this.state.locationName
                        : ''
                    }
                    // value={this.state.locationName}
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
                      const location_value = value.split('-');
                      this.setState(
                        {
                          locationCode: location_value[0],
                          locationName: location_value[1],
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
                      marginTop: height / 30,
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
                  <View>
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
                <View style={{marginTop: height / 40}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: height / 80,
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
                      <Text
                        style={{alignSelf: 'center', marginStart: width / 34}}>
                        I agree with{' '}
                      </Text>
                      <TouchableOpacity>
                        <Text style={{color: '#bd1d53'}}>
                          Terms & Condition
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {!this.state.isChecked && this.state.error ? (
                    <Text style={styles.errorStyle}>
                      Please check terms & condition
                    </Text>
                  ) : null}
                  <TouchableOpacity
                    style={{
                      width: width / 1.15,
                      borderRadius: 8,
                      marginTop: width / 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#bd1d53',
                      height: width / 8,
                    }}
                    onPress={() => {
                      this.state.update
                        ? this.updateBusiness()
                        : this.addBusiness();
                    }}>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: width / 22,
                        fontWeight: 'bold',
                      }}>
                      {this.state.update ? 'Update' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
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
