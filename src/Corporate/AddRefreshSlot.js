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
  Alert,
} from 'react-native';
import {Container, Content, Icon, Textarea, Input, Item} from 'native-base';
var {height, width} = Dimensions.get('window');
import Notification_icon_white from '../assets/svg/Notification_icon_white.svg';
import FloatingLabelBorderInput from '../components/FloatingLabelBorderInput';
import Add_image from '../assets/svg/Add_image.svg';
import Add_video from '../assets/svg/Add_video.svg';
import BackBtn_white from '../assets/svg/BackBtn_white.svg';
import theme from '../config/styles.js';
import CheckBox from '../assets/svg/CheckBox.svg';
import DropDown from '.././components/DropDown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DropDown_icon from '../assets/svg/DropDown_icon.svg';
import Loader from '../components/Loader';
import {ApiHelper} from '../helpers/ApiHelper';
import {API} from '../config/api';
import ImagePicker from 'react-native-image-crop-picker';
import {AppColors} from '../Themes';
import {CONSTANTS} from '../config/constants';
import Submitted_successfully from '../assets/svg/Submitted_successfully.svg';
import Toast from 'react-native-simple-toast';
import moment from 'moment';

export default class AddRefreshSlot extends Component {
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
      date: '',
      isDatePickerVisible: false,
      modules: [],
      moduleSelected: '',
      items: [],
      itemSelected: '',
      slots: [],
      slotSelected: '',
    };
  }

  componentDidMount() {
    this.fetchModuleList();
    this.fetchTimeSlots();
    const id =
      'params' in this.props.route && this.props.route.params
        ? this.props.route.params.id
        : '';
    if (id) {
      this.getPostData(id);
      this.setState({
        postId: id,
      });
    }
  }

  async checkAvailability() {
    this.setState({
      loader: true,
    });
    if (
      this.state.date == '' ||
      this.state.moduleSelected == '' ||
      this.state.slotSelected == ''
    ) {
      this.setState({
        error: true,
        loader: false,
      });
    } else {
      // const params = new FormData();
      // params.append('date', this.state.date);
      // params.append('moduleType', this.state?.moduleSelected?.toString());
      // params.append('timeSlot', this.state.slotSelected);

      const params = {
        date: this.state.date,
        moduleType: this.state?.moduleSelected?.toString(),
        timeSlot: this.state.slotSelected,
      };

      console.log('params Data', params);
      await ApiHelper.post(API.checkSlotForRefresh, params)
        .then(res => {
          if (res == undefined) {
            this.setState({
              loader: false,
            });
            Alert.alert('Slot not available');
          } else {
            this.setState({
              loader: false,
            });
            // Alert.alert('Slot is available');
            this.bookPromotionSlot();
          }
        })
        .catch(err => {
          this.setState({
            loader: false,
          });
          Alert.alert('Cant check availablility. Please try after sometime.');
        });
    }
  }

  async bookPromotionSlot() {
    this.setState({
      loader: true,
    });
    if (
      this.state.date == '' ||
      this.state.moduleSelected == '' ||
      this.state.slotSelected == '' ||
      this.state.itemSelected == ''
    ) {
      this.setState({
        error: true,
        loader: false,
      });
    } else {
      // const params = new FormData();
      // params.append('date', this.state.date);
      // params.append('moduleType', this.state?.moduleSelected?.toString());
      // params.append('timeSlot', this.state.slotSelected);

      const params = {
        date: this.state.date,
        moduleType: this.state?.moduleSelected?.toString(),
        timeSlot: this.state.slotSelected,
        itemObjectId: this.state?.itemSelected?.toString(),
      };

      console.log('params Data', params);
      await ApiHelper.post(API.bookRefreshSlot, params)
        .then(res => {
          if (res == undefined) {
            this.setState({
              loader: false,
              successfull: false,
            });
            // Alert.alert('Slot not available');
          } else {
            this.setState({
              loader: false,
              successfull: true,
            });
            // Alert.alert('Slot is available');
          }
        })
        .catch(err => {
          this.setState({
            loader: false,
          });
          Alert.alert('Cant book slot now.. Please try after sometime.');
        });
    }
  }

  async addPost() {
    this.setState({
      loader: true,
    });
    if (
      this.state.postTitle == '' ||
      (this.state.postType == '1' && this.state.postContent == '') ||
      (this.state.postType == '2' && this.state.image == '') ||
      (this.state.postType == '3' &&
        this.state.image == '' &&
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
      if (this.state.image) {
        params.append('attachment', this.state.image);
      }
      console.log('Form Data', params);
      await ApiHelper.form_post(API.userFeeds, params)
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

  // Gallery Images picker
  async pickGallery() {
    try {
      const options = {
        title: 'Gallery',
        mediaType: this.state.postType == '2' ? 'photo' : 'video',
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

  async fetchModuleList() {
    await ApiHelper.get(API.moduleTypes).then(res => {
      this.arrayholder = res.data.data;
      this.setState({
        modules: this.arrayholder.map(c => ({
          label: c.name,
          value: c.code,
        })),
      });
    });
  }

  async fetchItems(value) {
    var url = '';
    switch (value) {
      case 1: {
        url = API.jobItems;
        break;
      }
      case 2: {
        url = API.propertiesItems;
        break;
      }
      case 3: {
        url = API.promotionItems;
        break;
      }
      case 4: {
        url = API.vehicleItems;
        break;
      }
      case 5: {
        url = API.productsItems;
        break;
      }
      case 6: {
        url = API.servicesItems;
        break;
      }
    }

    console.log('url', url);
    await ApiHelper.get(url).then(res => {
      this.arrayholder = res.data.data;

      console.log(this.arrayholder);

      // this.setState({
      //   items: this.arrayholder.map(c => ({
      //     label: c?.name ? c?.name : c?.title,
      //     value: c._id,
      //   })),
      // });

      var arr = [];

      this.arrayholder.map((c, index) => {
        var title = c?.name ? c?.name : c?.title ? c?.title : c?.designation;
        var location = c?.location
          ? c?.location
          : c?.locationDetails?.locationName
          ? c?.locationDetails?.locationName
          : '';
        var code = c?.jobId
          ? c?.jobId
          : c?.propertId
          ? c?.propertId
          : c?.promotionId
          ? c?.promotionId
          : c?.vehicleId
          ? c?.vehicleId
          : c?.productId
          ? c?.productId
          : c?.serviceId
          ? c?.serviceId
          : '';
        var label = code + ' | ' + title + ' | ' + location;
        arr?.push({
          label: label,
          value: c._id,
        });
      });

      this.setState({
        items: arr,
      });
    });
  }

  async fetchTimeSlots() {
    await ApiHelper.get(API.refreshSlots).then(res => {
      this.arrayholder = res.data.data;
      this.setState({
        slots: this.arrayholder.map(c => ({
          label: c,
          value: c,
        })),
      });
    });
  }

  // timepicker
  showDatePicker = () => {
    this.setState({
      isDatePickerVisible: true,
    });
  };
  hideDatePicker = () => {
    this.setState({
      isDatePickerVisible: false,
    });
  };

  handleConfirmDate = date => {
    // console.warn('A date has been picked: ', date);
    this.setState({
      date: moment(date).format('DD-MM-YYYY', true),
    });

    this.hideDatePicker();
  };

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
              Refresh Slot
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            />
          </View>
        </View>

        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: AppColors.formBackground,
            paddingBottom: height / 30,
          }}>
          <Loader visibility={this.state.loader} />
          <View
            style={{
              marginVertical: height / 70,
              marginStart: width / 15,
              marginEnd: width / 15,
            }}
          />
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
                Choose module
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
                placeholder="Select module"
                placeholderTextColor="#808080"
                data={this.state.modules}
                value={this.state.moduleSelected}
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
                  this.setState(
                    {
                      moduleSelected: value,
                      brandId: '',
                      modelId: '',
                      trimId: '',
                      items: [],
                      itemSelected: '',
                    },
                    () => {
                      this.fetchItems(value);
                    },
                  );
                }}
              />
            </View>
            {this.state.moduleSelected == '' && this.state.error ? (
              <Text style={styles.errorStyle}>Please select module</Text>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                marginBottom: height / 90,
                marginTop: height / 50,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Date
              </Text>
              <Text
                style={[
                  theme.fontMedium,
                  {color: '#000000', fontSize: width / 24},
                ]}>
                *
              </Text>
            </View>
            <View style={{marginTop: height / 70, flexDirection: 'row'}}>
              <View style={{marginEnd: width / 40, flex: 1}}>
                <Item
                  onPress={() => {
                    this.showDatePicker();
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
                    placeholder="dd-mm-yyyy"
                    value={this.state.date}
                    style={{
                      fontSize: width / 25,
                      color: '#000000',
                    }}
                  />
                  {/* <Image source={require('../assets/images/time.png')} /> */}
                </Item>

                <DateTimePickerModal
                  isVisible={this.state.isDatePickerVisible}
                  mode="date"
                  onConfirm={this.handleConfirmDate}
                  onCancel={this.hideDatePicker}
                />
              </View>
            </View>

            {this.state.date == '' && this.state.error ? (
              <Text style={styles.errorStyle}>Please select date</Text>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 50,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Choose Item
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
                placeholder="Select item"
                placeholderTextColor="#808080"
                data={this.state.items}
                value={this.state.itemSelected}
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
                  this.setState(
                    {
                      itemSelected: value,
                      brandId: '',
                      modelId: '',
                      trimId: '',
                    },
                    () => {
                      // this.fetchItems(value);
                    },
                  );
                }}
              />
            </View>
            {this.state.itemSelected == '' && this.state.error ? (
              <Text style={styles.errorStyle}>Please select item</Text>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 50,
              }}>
              <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                Choose Time slot
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
                placeholder="Select time slot"
                placeholderTextColor="#808080"
                data={this.state.slots}
                value={this.state.slotSelected}
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
                  this.setState(
                    {
                      slotSelected: value,
                      brandId: '',
                      modelId: '',
                      trimId: '',
                    },
                    () => {
                      // this.fetchItems(value);
                    },
                  );
                }}
              />
            </View>
            {this.state.slotSelected == '' && this.state.error ? (
              <Text style={styles.errorStyle}>Please select time slot</Text>
            ) : null}

            <TouchableOpacity
              onPress={() => {
                // this.state.update ? this.updatePost() : this.addPost();
                this.checkAvailability();
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
                {/* {this.state.update ? 'Update Post' : 'Add Post'} */}
                Book slot
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
