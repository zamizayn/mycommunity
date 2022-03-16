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
  Button,
  Textarea,
  TabHeading,
  ScrollableTab,
  Icon,
} from 'native-base';
var {height, width} = Dimensions.get('window');
import Notification_icon_white from './assets/svg/Notification_icon_white.svg';
import {Dropdown} from 'react-native-material-dropdown-v2-fixed';
import FloatingLabelBorderInput from './components/FloatingLabelBorderInput';
import Icons from 'react-native-vector-icons/Entypo';
import theme from './config/styles.js';
import DropDown_icon from './assets/svg/DropDown_icon.svg';
import BackBtn_white from './assets/svg/BackBtn_white.svg';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CheckBox from './assets/svg/CheckBox.svg';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import {AppColors} from './Themes';
import {ApiHelper} from './helpers/ApiHelper';
import {API} from './config/api';
import Submitted_successfully from './assets/svg/Submitted_successfully.svg';
import {CONSTANTS} from './config/constants';
import Loader from './components/Loader';
import {StackActions, CommonActions} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
export default class ApplyJob extends Component {
  inputRefs = {
    name: React.createRef(),
    emailAddress: React.createRef(),
    phoneNumber: React.createRef(),
    qualification: React.createRef(),
    currentPosition: React.createRef(),
    positionLookingFor: React.createRef(),
    currentSalary: React.createRef(),
    salaryExpected: React.createRef(),
    totalExperience: React.createRef(),
    visaStatus: React.createRef(),
    remarks: React.createRef(),
  };
  visaStatusData = [
    {
      value: 'Yes',
    },
    {
      value: 'No',
    },
    {
      value: 'Pending',
    },
  ];
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
      emailAddress: '',
      phoneNumber: '',
      qualification: '',
      currentPosition: '',
      positionLookingFor: '',
      currentSalary: '',
      salaryExpected: '',
      totalExperience: '',
      visaStatus: '',
      remarks: '',
      cvFile: {uri: '', type: '', name: ''},
      error: false,
      loader: false,
      jobId: '',
      jobData: [],
      successfull: false,
    };
  }
  componentDidMount() {
    console.log("id isss"+id);
    const id =
      'params' in this.props.route && this.props.route.params
        ? this.props.route.params.id
        : '';
    const jobData =
      'params' in this.props.route && this.props.route.params
        ? this.props.route.params.data
        : '';
       
    if (id && jobData) {
      this.setState({
        jobId: id,
        jobData: jobData,
      });
    }
    this.getUserData();
  }

  async getUserData() {
    await ApiHelper.get(API.userData).then(res => {
      var dataLen = res.data.data;
      console.log("userData"+dataLen.name);
      this.setState(
        {
          name: dataLen.name,
          phoneNumber: dataLen.mobile,
          emailAddress: dataLen.email,
        },
        () => {
          // console.log('user arr', this.state.userdata);
        },
      );
    });
  }

  async applyJob() {
    this.setState({
      emailValid: true,
      loader: true,
    });
    if (
      this.state.jobId == '' ||
      this.state.name == '' ||
      this.state.emailAddress == '' ||
      this.state.phoneNumber == '' ||
      this.state.qualification == '' ||
      this.state.currentPosition == '' ||
      this.state.positionLookingFor == '' ||
      this.state.salaryExpected == '' ||
      this.state.totalExperience == '' ||
      this.state.visaStatus == '' ||
      this.state.cvFile.uri == ''
    ) {
      this.setState({
        error: true,
        loader: false,
      });
    } else {
      let formError = false;
      let emailreg = /^(?:[\w\.\-]+@([\w\-]+\.)+[a-zA-Z+ -]+)?$/;
      if (emailreg.test(this.state.emailAddress) === false) {
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
      params.append('jobId', this.state.jobId);
      params.append('name', this.state.name);
      params.append('emailAddress', this.state.emailAddress);
      params.append('phoneNumber', this.state.phoneNumber);
      params.append('qualification', this.state.qualification);
      params.append('currentPosition', this.state.currentPosition);
      params.append('positionLookingFor', this.state.positionLookingFor);
      params.append('currentSalary', this.state.currentSalary);
      params.append('salaryExpected', this.state.salaryExpected);
      params.append('totalExperience', this.state.totalExperience);
      params.append('visaStatus', this.state.visaStatus);
      params.append('remarks', this.state.remarks);
      params.append('cvFile', this.state.cvFile);

      // console.log('Form Data', params);

      await ApiHelper.form_post(API.applyJobs, params)
        .then(res => {
          console.log("response from api is"+res.json());
          if (res) {
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
  // Gallery Images picker
  async pickGallery() {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const docFile = {
        uri: res.uri,
        type: res.type,
        name: res.name,
      };
      this.setState({
        cvFile: docFile,
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }
  renderAccessory() {
    return (
      <View
        style={{
          top: 3,
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
                  You have successfully applied this job.
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
                      this.props.navigation.dispatch(
                        StackActions.replace('ApplyJob'),
                      );
                      this.props.navigation.navigate('JobDetails', {
                        id: this.state.jobData.slug,
                      });
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
              Apply Job
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity style={{marginRight: width / 25}}>
                <Icon
                  name="checkmark"
                  height="22"
                  width="22"
                  style={{
                    color: '#fff',
                  }}
                  onPress={() => {
                    this.applyJob();
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: height / 30,
          }}>
          <Loader visibility={this.state.loader} />
          <View style={{}}>
            <View style={[styles.businessInfoContent]}>
              <Text style={{color: '#1973EA', marginBottom: height / 70}}>
                Apply this Job
              </Text>
              <Text style={[theme.fontBold, {fontSize: width / 23}]}>
                {this.state.jobData.name}
              </Text>
              <Text
                style={[
                  theme.fontMedium,
                  {
                    fontSize: width / 35,
                    color: '#666768',
                    marginTop: 0,
                    marginBottom: 15,
                  },
                ]}>
                {moment(this.state.jobData.createdAt).format('LL')}
              </Text>
              <Text
                style={[
                  {
                    color: AppColors.fontRed,
                    fontSize: width / 30,
                    marginBottom: 15,
                  },
                ]}>
                ID{' '}
                <Text style={[{fontSize: width / 30, color: '#000'}]}>
                  {this.state.jobData.jobId}
                </Text>
              </Text>
            </View>
            <View
              style={{
                marginStart: width / 20,
                marginEnd: width / 20,
                flexDirection: 'column',
                marginTop: height / 50,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: height / 90,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Applicant Name
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
                width={width / 1.12}
                mandatory={true}
                height={height / 16}
                value={this.state.name}
                returnKeyType={'next'}
                placeholder="Name"
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    name: value,
                  });
                }}
                refInner={r => (this.inputRefs.name = r)}
                onSubmitEditing={() => {
                  this.inputRefs.emailAddress.getNativeRef().focus();
                }}
              />
              {this.state.name == '' && this.state.error ? (
                <Text style={styles.errorStyle}>
                  Please enter applicant name
                </Text>
              ) : null}
            </View>

            <View
              style={{
                marginStart: width / 20,
                marginEnd: width / 20,
                flexDirection: 'column',
                marginTop: height / 50,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: height / 90,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Applicant Email
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
                width={width / 1.12}
                height={height / 16}
                mandatory={true}
                value={this.state.emailAddress}
                returnKeyType={'next'}
                placeholder="Email"
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    emailAddress: value,
                  });
                }}
                refInner={r => (this.inputRefs.emailAddress = r)}
                onSubmitEditing={() => {
                  this.inputRefs.phoneNumber.getNativeRef().focus();
                }}
              />
              {this.state.emailAddress == '' && this.state.error ? (
                <Text style={styles.errorStyle}>
                  Please enter applicant email
                </Text>
              ) : this.state.emailValid == false && this.state.error ? (
                <Text style={styles.errorStyle}>
                  Please enter a valid email address
                </Text>
              ) : null}
            </View>
            <View
              style={{
                marginStart: width / 20,
                marginEnd: width / 20,
                flexDirection: 'column',
                marginTop: height / 50,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: height / 90,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Applicant Phone Number
                </Text>
                <Text
                  style={[
                    theme.fontMedium,
                    {color: '#000000', fontSize: width / 24},
                  ]}>
                  *
                </Text>
              </View>
              {/* <FloatingLabelBorderInput
                width={width / 1.12}
                height={height / 16}
                mandatory={true}
                value={this.state.phoneNumber}
                returnKeyType={'next'}
                placeholder="Phone number"
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    phoneNumber: value,
                  });
                }}
                refInner={r => (this.inputRefs['phoneNumber'] = r)}
                onSubmitEditing={() => {
                  this.inputRefs['qualification'].getNativeRef().focus();
                }}
              /> */}
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
                  width: width / 1.12,
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
                  value={this.state.phoneNumber}
                  onChangeText={text => {
                    this.setState({
                      phoneNumber: text,
                    });
                  }}
                  keyboardType="number-pad"
                  ref={r => (this.inputRefs.phoneNumber = r)}
                  returnKeyType={'next'}
                  autoCorrect={false}
                  onSubmitEditing={() => {
                    this.inputRefs.qualification.getNativeRef().focus();
                  }}
                />
              </View>
              {this.state.phoneNumber == '' && this.state.error ? (
                <Text style={styles.errorStyle}>Please enter phone number</Text>
              ) : null}
            </View>

            <View
              style={{
                marginStart: width / 20,
                marginEnd: width / 20,
                flexDirection: 'column',
                marginTop: height / 50,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: height / 90,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Job Qualification
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
                width={width / 1.12}
                height={height / 16}
                mandatory={true}
                value={this.state.qualification}
                returnKeyType={'next'}
                placeholder="Qualification"
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    qualification: value,
                  });
                }}
                refInner={r => (this.inputRefs.qualification = r)}
                onSubmitEditing={() => {
                  this.inputRefs.currentPosition.getNativeRef().focus();
                }}
              />
              {this.state.qualification == '' && this.state.error ? (
                <Text style={styles.errorStyle}>
                  Please enter qualification
                </Text>
              ) : null}
            </View>

            <View
              style={{
                marginStart: width / 20,
                marginEnd: width / 20,
                flexDirection: 'column',
                marginTop: height / 50,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: height / 90,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Current Job Position
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
                width={width / 1.12}
                height={height / 16}
                mandatory={true}
                value={this.state.currentPosition}
                returnKeyType={'next'}
                placeholder="Job position"
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    currentPosition: value,
                  });
                }}
                refInner={r => (this.inputRefs.currentPosition = r)}
                onSubmitEditing={() => {
                  this.inputRefs.positionLookingFor.getNativeRef().focus();
                }}
              />
              {this.state.currentPosition == '' && this.state.error ? (
                <Text style={styles.errorStyle}>Please enter job position</Text>
              ) : null}
            </View>

            <View
              style={{
                marginStart: width / 20,
                marginEnd: width / 20,
                flexDirection: 'column',
                marginTop: height / 50,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: height / 90,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Job Position Looking For
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
                width={width / 1.12}
                height={height / 16}
                mandatory={true}
                value={this.state.positionLookingFor}
                returnKeyType={'next'}
                placeholder="Job position looking for"
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    positionLookingFor: value,
                  });
                }}
                refInner={r => (this.inputRefs.positionLookingFor = r)}
                onSubmitEditing={() => {
                  this.inputRefs.currentSalary.getNativeRef().focus();
                }}
              />
              {this.state.positionLookingFor == '' && this.state.error ? (
                <Text style={styles.errorStyle}>
                  Please enter job position looking for
                </Text>
              ) : null}
            </View>

            <View
              style={{
                marginStart: width / 20,
                marginEnd: width / 20,
                flexDirection: 'column',
                marginTop: height / 50,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: height / 90,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Current Salary
                </Text>
              </View>
              <FloatingLabelBorderInput
                keyboard="number-pad"
                width={width / 1.12}
                height={height / 16}
                mandatory={true}
                value={this.state.currentSalary}
                returnKeyType={'next'}
                placeholder="Current salary"
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    currentSalary: value,
                  });
                }}
                refInner={r => (this.inputRefs.currentSalary = r)}
                onSubmitEditing={() => {
                  this.inputRefs.salaryExpected.getNativeRef().focus();
                }}
              />
            </View>
            <View
              style={{
                marginStart: width / 20,
                marginEnd: width / 20,
                flexDirection: 'column',
                marginTop: height / 50,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: height / 90,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Expected Salary
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
                keyboard="number-pad"
                width={width / 1.12}
                height={height / 16}
                mandatory={true}
                value={this.state.salaryExpected}
                returnKeyType={'next'}
                placeholder="Expected salary"
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    salaryExpected: value,
                  });
                }}
                refInner={r => (this.inputRefs.salaryExpected = r)}
                onSubmitEditing={() => {
                  this.inputRefs.totalExperience.getNativeRef().focus();
                }}
              />
              {this.state.salaryExpected == '' && this.state.error ? (
                <Text style={styles.errorStyle}>
                  Please enter expected salary
                </Text>
              ) : null}
            </View>

            <View
              style={{
                marginStart: width / 20,
                marginEnd: width / 20,
                flexDirection: 'column',
                marginTop: height / 50,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: height / 90,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Total Experience
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
                keyboard="number-pad"
                width={width / 1.12}
                height={height / 16}
                mandatory={true}
                value={this.state.totalExperience}
                returnKeyType={'next'}
                placeholder="Total experience"
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    totalExperience: value,
                  });
                }}
                refInner={r => (this.inputRefs.totalExperience = r)}
                onSubmitEditing={() => {
                  this.inputRefs.visaStatus.getNativeRef().focus();
                }}
              />
              {this.state.totalExperience == '' && this.state.error ? (
                <Text style={styles.errorStyle}>
                  Please enter total experience
                </Text>
              ) : null}
            </View>

            <View
              style={{
                marginStart: width / 20,
                marginEnd: width / 20,
                flexDirection: 'column',
                marginTop: height / 50,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: height / 90,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Visa Status
                </Text>
                <Text
                  style={[
                    theme.fontMedium,
                    {
                      color: '#000000',
                      fontSize: width / 24,
                      marginRight: width / 50,
                    },
                  ]}>
                  *
                </Text>
                {/* <Text
                  style={[
                    theme.fontRegular,
                    {fontSize: width / 26, color: 'red'},
                  ]}>
                  (Yes/No/Pending)
                </Text> */}
              </View>
              {/* <Dropdown
                placeholder="Select visa status"
                placeholderTextColor="#808080"
                data={this.visaStatusData}
                value={this.state.visaStatus}
                containerStyle={{
                  width: null,
                  borderRadius: 8,
                  paddingLeft: width / 30,
                  paddingRight: width / 45,
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: '#D4D4D5',
                  height: height / 16,
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
                    visaStatus: value,
                  });
                }}
              /> */}

              <FloatingLabelBorderInput
                width={width / 1.12}
                height={height / 16}
                mandatory={true}
                value={this.state.visaStatus}
                returnKeyType={'next'}
                placeholder="Visa status"
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  this.setState({
                    visaStatus: value,
                  });
                }}
                refInner={r => (this.inputRefs.visaStatus = r)}
              />
              {this.state.visaStatus == '' && this.state.error ? (
                <Text style={styles.errorStyle}>Please enter visa status</Text>
              ) : null}
            </View>
            <View
              style={{
                marginStart: width / 20,
                marginEnd: width / 20,
                flexDirection: 'column',
                marginTop: height / 50,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: height / 90,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Remarks
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
                  value={this.state.remarks}
                  style={{width: width}}
                  rowSpan={5}
                  placeholder="Remarks"
                  onChangeText={value => {
                    this.setState({
                      remarks: value,
                    });
                  }}
                />
              </View>
            </View>
            <View
              style={{
                marginStart: width / 20,
                marginEnd: width / 20,
                flexDirection: 'column',
                marginTop: height / 50,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: height / 90,
                }}>
                <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                  Attach Your CV
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
                <Button
                  iconLeft
                  rounded
                  block
                  style={{
                    elevation: 0,
                    backgroundColor: '#D4E6FB',
                    borderWidth: 1,
                    borderColor: '#B0D0F4',
                  }}
                  onPress={() => this.pickGallery()}>
                  <Icons
                    name="attachment"
                    style={{
                      color: '#1973EA',
                      fontSize: width / 20,
                      marginRight: width / 70,
                    }}
                  />
                  <Text style={{color: '#1973EA'}}>Attach CV</Text>
                </Button>
                <Text
                  style={{
                    color: '#1973EA',
                    textAlign: 'center',
                    marginTop: height / 50,
                  }}>
                  {this.state.cvFile.name}
                </Text>
                {this.state.cvFile.uri == '' && this.state.error ? (
                  <Text style={styles.errorStyle}>Please attach your CV</Text>
                ) : null}
              </View>

              <View>
                <View
                  style={{paddingTop: height / 20, paddingBottom: height / 50}}>
                  <Button
                    block
                    rounded
                    style={{backgroundColor: '#1973EA', elevation: 0}}
                    onPress={() => {
                      this.applyJob();
                    }}>
                    <Text style={{color: 'white'}}>Apply Now</Text>
                  </Button>
                </View>
              </View>
            </View>
          </View>
          {this.verifyModal()}
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  businessInfoContent: {
    marginTop: 14,
    paddingHorizontal: width / 20,
    borderBottomWidth: 5,
    borderBottomColor: '#f0eced',
  },
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
