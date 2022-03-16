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
import {Container, Content, Icon, Textarea} from 'native-base';
var {height, width} = Dimensions.get('window');
import Notification_icon_white from './assets/svg/Notification_icon_white.svg';
import FloatingLabelBorderInput from './components/FloatingLabelBorderInput';
import Add_image from './assets/svg/Add_image.svg';
import Add_video from './assets/svg/Add_video.svg';
import BackBtn_white from './assets/svg/BackBtn_white.svg';
import theme from './config/styles.js';
import CheckBox from './assets/svg/CheckBox.svg';
import DropDown from '././components/DropDown';
import DropDown_icon from './assets/svg/DropDown_icon.svg';
import Loader from './components/Loader';
import {ApiHelper} from './helpers/ApiHelper';
import {API} from './config/api';
import ImagePicker from 'react-native-image-crop-picker';
import {AppColors} from './Themes';
import {CONSTANTS} from './config/constants';
import Submitted_successfully from './assets/svg/Submitted_successfully.svg';
import Toast from 'react-native-simple-toast';
import AsyncStorageHelper from './helpers/AsyncStorageHelper';

export default class ContactForm extends Component {
  constructor() {
    super();
    this.state = {
      postTitle: '',
      postType: '1',
      postContent: '',
      image: '',
      existingImage: '',
      error: false,
      loader: false,
      update: false,
      removedImages: '',
      postId: '',
      successfull: false,
      isChecked: false,
      userDate: null,

      contactLanguage: '',
      contactName: '',
      contactNumber: '',
      contactEmail: '',
      contactFile: '',
      contactDescription: '',
      contactTerms: false,
    };
  }

  componentDidMount() {
    const id =
      'params' in this.props.route && this.props.route.params
        ? this.props.route.params.id
        : '';
    // if (id) {
    //   this.getPostData(id);
    //   this.setState({
    //     postId: id,
    //   });
    // }
    this.getUser();
  }

  async getUser() {
    var userData = null;
    try {
      userData = await AsyncStorageHelper.getItem('USERDATA');
      // console.log('userDataH', JSON.parse(userData));
      this.setState({userData: JSON.parse(userData)}, () => {
        this.setState(
          {
            contactEmail: this.state.userData?.email,
            contactName: this.state.userData?.name,
            contactNumber:
              this.state.userData?.ccd + this.state.userData?.mobile,
          },
          () => {
            // console.log(this.state.contactEmail);
          },
        );
      });
    } catch (e) {}
  }

  async addPost() {
    this.setState({
      loader: true,
    });
    if (
      this.state.contactName === '' ||
      this.state.contactEmail === '' ||
      this.state.contactNumber === '' ||
      this.state.contactLanguage === '' ||
      this.state.contactDescription === '' ||
      !this.state.isChecked
    ) {
      this.setState({
        error: true,
        loader: false,
      });
    } else {
      const params = new FormData();
      params.append('name', this.state.contactName);
      params.append('email', this.state.contactEmail);
      params.append('mobile', this.state.contactNumber);
      params.append('preferredLanguage', this.state.contactLanguage);
      params.append('message', this.state.contactDescription);
      params.append('ccd', '974');

      if (this.state.image) {
        params.append('image', this.state.image);
      }
      console.log('Form Data', params);
      await ApiHelper.form_post(API.contactRequest, params)
        .then(res => {
          console.log('contact', res.data.data);
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
        });
    }
  }

  async updatePost() {
    this.setState({
      loader: true,
    });
    if (
      this.state.postTitle == '' ||
      (this.state.postType == '1' && this.state.postContent == '') ||
      (this.state.postType == '2' &&
        this.state.image == '' &&
        this.state.existingImage == '') ||
      (this.state.postType == '3' &&
        this.state.image == '' &&
        this.state.existingImage == '' &&
        this.state.postContent == '') ||
      this.state.isChecked == false
    ) {
      this.setState({
        error: true,
        loader: false,
      });
    } else {
      const params = new FormData();
      params.append('postTitle', this.state.postTitle);
      params.append('postType', this.state.postType);
      params.append('postContent', this.state.postContent);
      params.append('removedAttachment', this.state.removedImages);
      params.append('existingAttachment', this.state.existingImage);
      if (this.state.image) {
        params.append('attachment', this.state.image);
      }
      //console.log('Form Data', params);
      await ApiHelper.form_put(API.userFeeds + '/' + this.state.postId, params)
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

  async getPostData(id) {
    this.setState({
      loader: true,
    });
    await ApiHelper.get(API.userFeeds + '/' + id)
      .then(res => {
        if ('data' in res.data && res.data.data) {
          const feedData = res.data.data;
          console.log('feedData data', feedData);
          this.setState({
            update:
              'postTitle' in feedData && feedData.postTitle ? true : false,
            postTitle: feedData.postTitle,
            postType: feedData.postType.toString(),
            postContent: feedData.postContent,
            existingImage: feedData.attachment,
            postId: feedData._id,
            isChecked: true,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({
      loader: false,
    });
  }

  // Gallery Images picker
  async pickGallery() {
    try {
      const options = {
        title: 'Gallery',
        mediaType: 'photo',
      };
      const gallery = await ImagePicker.openPicker(options);
      const galleryImages = {
        uri: gallery.path,
        type: gallery.mime,
        name: gallery.path.replace(/^.*[\\\/]/, ''),
      };
      console.log('Gallery Image', gallery);
      this.setState({
        image: galleryImages,
        existingImage: '',
        removedImages: this.state.image,
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
                      this.props.navigation.goBack();
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
      <Container style={{backgroundColor: AppColors.formBackground}}>
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
              {/* {this.state.update ? 'Update Post' : 'Add Post'} */}
              Contact Form
            </Text>
            {/* <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View style={{marginRight: width / 20}}>
                <Notification_icon_white height="22" width="22" />
              </View>
              <TouchableOpacity style={{marginRight: width / 25}}>
                <Icon
                  name="checkmark"
                  height="22"
                  width="22"
                  style={{
                    color: '#fff',
                  }}
                  onPress={() => {
                    this.state.update ? this.updatePost() : this.addPost();
                  }}
                />
              </TouchableOpacity>
            </View> */}
          </View>
        </View>

        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: AppColors.formBackground,
            paddingBottom: height / 30,
          }}>
          <Loader visibility={this.state.loader} />
          {/* <View
            style={{
              marginVertical: height / 70,
              marginStart: width / 15,
              marginEnd: width / 15,
            }}>
            <Text style={[theme.fontBold, {fontSize: width / 24}]}>
              {this.state.update ? 'Update Post' : 'Add Post'}
            </Text>
          </View> */}
          <View
            style={{
              marginStart: width / 15,
              marginEnd: width / 15,
              flexDirection: 'column',
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 50,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Language
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
                placeholder="Select language"
                placeholderTextColor="#808080"
                data={[
                  {
                    label: 'English',
                    value: 'English',
                  },
                ]}
                value={this.state.contactLanguage}
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
                // dropdownPosition={1}
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
                    contactLanguage: value,
                  });
                }}
              />
            </View>
            {this.state.contactLanguage === '' && this.state.error ? (
              <Text style={styles.errorStyle}>Please select language</Text>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Contact name
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
              value={this.state.contactName}
              returnKeyType={'next'}
              placeholder="Contact name"
              placeholderTextColor={'#808B96'}
              onChangeText={value => {
                this.setState({
                  contactName: value,
                });
              }}
            />
            {this.state.contactName == '' && this.state.error ? (
              <Text style={styles.errorStyle}>Please enter contact name</Text>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Contact email
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
              value={this.state.contactEmail}
              returnKeyType={'next'}
              placeholder="Contact email"
              placeholderTextColor={'#808B96'}
              onChangeText={value => {
                this.setState({
                  contactEmail: value,
                });
              }}
              keyboard="email-address"
              autoCapitalize="none"
            />
            {this.state.contactEmail == '' && this.state.error ? (
              <Text style={styles.errorStyle}>Please enter contact email</Text>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Contact number
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
              value={this.state.contactNumber}
              returnKeyType={'next'}
              placeholder="Contact number"
              placeholderTextColor={'#808B96'}
              onChangeText={value => {
                this.setState({
                  contactNumber: value,
                });
              }}
              keyboard="phone-pad"
            />
            {this.state.contactNumber == '' && this.state.error ? (
              <Text style={styles.errorStyle}>Please enter contact number</Text>
            ) : null}

            {/* {this.state.postType == '3' ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 50,
                }}>
                <Text
                  style={[
                    theme.fontMedium,
                    {color: 'red', fontSize: width / 32},
                  ]}>
                  Either Content or Attachment is mandatory
                </Text>
              </View>
            ) : null} */}
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
                backgroundColor:
                  this.state.postType == '3' && this.state.image
                    ? '#D4D4D5'
                    : 'white',
                borderRadius: 8,
              }}>
              <Textarea
                // disabled={
                //   this.state.postType == '3' && this.state.image ? true : false
                // }
                value={this.state.contactDescription}
                style={{width: width / 1.15}}
                rowSpan={5}
                placeholder={'Type your text here...'}
                onChangeText={value => {
                  this.setState({
                    contactDescription: value,
                  });
                }}
              />
            </View>

            {this.state.contactDescription == '' && this.state.error ? (
              <Text style={styles.errorStyle}>Please enter content</Text>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 60,
                marginBottom: height / 70,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Add Image
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {this.state.existingImage ? (
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
                      this.state.removedImages = this.state.existingImage;
                      this.setState({
                        existingImage: '',
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
                    source={{
                      uri: CONSTANTS.SMALL_IMG + this.state.existingImage,
                    }}
                    style={{
                      height: 100,
                      width: 100,
                      resizeMode: 'cover',
                    }}
                  />
                </View>
              ) : null}

              {this.state.image ? (
                <View
                  style={{
                    margin: width / 85,
                  }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      position: 'absolute',
                      alignSelf: 'center',
                      zIndex: 1000,
                      top: 35,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    activeOpacity={1}
                    onPress={() => {}}>
                    <Text
                      style={{
                        color: '#fff',
                      }}>
                      <Icon
                        name="play-circle-outline"
                        type="Ionicons"
                        style={{
                          color: '#fff',
                          width: 20,
                          height: 20,
                        }}
                      />
                    </Text>
                  </TouchableOpacity>
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
                      this.setState({
                        image: '',
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
                    source={{uri: this.state.image.uri}}
                    style={{
                      height: 100,
                      width: 100,
                      resizeMode: 'cover',
                    }}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    // if (
                    //   this.state.postType == '3' &&
                    //   this.state.postContent != ''
                    // ) {
                    //   Toast.showWithGravity(
                    //     'You can add either content or attachment',
                    //     Toast.LONG,
                    //     Toast.BOTTOM,
                    //   );
                    // } else {
                    this.pickGallery();
                    // }
                  }}
                  activeOpacity={0.6}
                  style={{
                    alignSelf: 'flex-start',
                    margin: width / 85,
                  }}>
                  <Add_image height="100" width="100" />
                </TouchableOpacity>
              )}
            </View>

            {/* {this.state.postType == '2' &&
            this.state.image == '' &&
            this.state.error ? (
              <Text style={styles.errorStyle}>Please add an attachment</Text>
            ) : null} */}

            {/* {this.state.postType == '3' &&
            this.state.image == '' &&
            this.state.postContent == '' &&
            this.state.error ? (
              <Text style={styles.errorStyle}>
                Please enter a youtube url in content box or add an attachment
              </Text>
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

            {/* {this.state.postType == '3' &&
            this.state.image &&
            this.state.postContent == '' &&
            this.state.error ? (
              <Text style={styles.errorStyle}>
                Either the content or attachment is mandatory for video posts
              </Text>
            ) : null} */}

            <TouchableOpacity
              onPress={() => {
                this.addPost();
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
                Submit
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
