import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
  Linking,
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
  Tab,
  Tabs,
  TabHeading,
  Card,
  CardItem,
  Icon,
} from 'native-base';
var {height, width} = Dimensions.get('window');
import BackBtn_white from './assets/svg/BackBtn_white.svg';
import theme from './config/styles.js';
import SearchBlackIcon from './assets/svg/SearchBlackIcon.svg';
import Notification_icon_white from './assets/svg/Notification_icon_white.svg';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import PhoneSvg from './assets/svg/phone.svg';
import TagSvg from './assets/svg/Price_tag.svg';
import EmailSvg from './assets/svg/Email_icon.svg';
import LocatioPinSvg from './assets/svg/location-pin.svg';
import TimeSvg from './assets/images/time.svg';
import MapView, {Marker} from 'react-native-maps';
import {API} from './config/api';
import {ApiHelper} from './helpers/ApiHelper';
import Loader from './components/Loader';
import {CONSTANTS} from './config/constants';
import moment from 'moment';
import {AppColors} from './Themes';
import AsyncStorageHelper from './helpers/AsyncStorageHelper';
import RenderHtml from 'react-native-render-html';
import ImageView from 'react-native-image-viewing';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faWhatsapp} from '@fortawesome/free-brands-svg-icons';
export default class JobDetails extends Component {
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

  componentDidUpdate(oldProps) {
    console.log('old' + oldProps.route.params.id);

    const oldPropDataId = oldProps.route.params.id;
    console.log('NEWDATA' + oldPropDataId);
    if (oldProps.route.params.id != this.props.route.params.id) {
    
      this.getUserData();
      this.fetchQualifications();
      this.getJob(this.props.route.params.id);
     
    }
  }
  constructor() {
    console.log('constructor');
    super();
    this.state = {
      checked: false,
      activeSlide: 0,
      region: {},
      businessRegion: {},
      job: {},
      loader: false,
      tabIndex: 0,
      showContact: false,
      qualificationsRawList: [],
      qualifications: [],
      salaryType: '',
      employeeType: '',
      qualification: '',
      userRole: '',
      imageViewerImages: [],
      isImageViewerVisible: false,
    };
  }

 
  viewImage(url) {
    var urls = [{uri: url}];

    this.setState(
      {
        imageViewerImages: this.state.job.imageKey.map(c => ({
          uri: CONSTANTS.MEDIUM_IMG + c?.url,
        })),
      },
      () => {
        // console.log(this.state.imageViewerImages);
      },
    );
    this.setState(
      {
        // imageViewerImages: urls,
        isImageViewerVisible: true,
      },
      () => {
        // console.log(this.state.imageViewerImages);
      },
    );
  }

  async showContact() {
    const auth_user = await AsyncStorageHelper.getItem('ISUSER');
    // if (auth_user == 'user_exist') {
    this.setState({
      showContact: true,
      auth_user: auth_user,
    });
    // } else {
    //   this.props.navigation.navigate('Login');
    // }
  }

  componentDidMount() {
    console.log('hjkbjkhb');
    this.getUserData();
    this.fetchQualifications();
    const id = this.props.route.params.id;
    this.getJob(id);
  }
  async getUserData() {
    await ApiHelper.get(API.userData).then(res => {
      var dataLen = res.data.data;
      console.log('userDtaa' + dataLen.userRole);
      if (!this.state.update) {
        this.setState({
          userRole: dataLen.userRole,
        });
      }
    });
  }
  async fetchQualifications() {
    await ApiHelper.get(API.jobQualifications).then(res => {
      this.arrayholder = res.data.data;
      this.setState({
        qualifications: this.arrayholder.map(c => ({
          label: c.qualificationName,
          value: c.qualificationId,
        })),
        qualificationsRawList: res?.data?.data,
      });
    });
  }

  getQualificationName(id) {
    return this.state.qualificationsRawList.find(
      x => x.qualificationId === id + '',
    )?.qualificationName;
  }

  async getJob(id) {
    console.log('##########' + id);
    this.setState({
      loader: true,
    });
    await ApiHelper.get(API.jobsSlug + id)
      .then(res => {
        var data = res.data.data;
        let deltaObj = {};
        if ('lat' in data.mapDetails && data.mapDetails.lat) {
          deltaObj = this.deltaFrom(
            data.mapDetails.lat,
            data.mapDetails.lng,
            1000,
          );
        }
        this.setState(
          {
            job: data,
            region: {
              latitude: data.mapDetails.lat,
              longitude: data.mapDetails.lng,
              latitudeDelta:
                'latitudeDelta' in deltaObj ? deltaObj.latitudeDelta : 5,
              longitudeDelta:
                'longitudeDelta' in deltaObj ? deltaObj.longitudeDelta : 0.03,
            },
            businessRegion: {
              latitude: data.mapDetails.lat,
              longitude: data.mapDetails.lng,
            },
            loader: false,
            salaryType: this.salaryTypeData
              .filter(item => item.value === data.salaryType)
              .map(item => item.label),
            employeeType: this.empTypeData
              .filter(item => item.value === data.employeeType)
              .map(item => item.label),
            qualification: this.state.qualifications
              .filter(item => item.value === data.qualification.toString())
              .map(item => item.label),
          },

          () => {
           
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

  getFurniture(value) {
    const furniture = this.furnitureStatuses.filter(it => it.value == value);
    if (furniture.length) {
      return furniture[0].label;
    }
    return '';
  }

  _renderItem = ({item, index}) => {
    return (
      <View style={style.cardWrapparent}>
        <Card style={style.cardWrap}>
          <CardItem cardBody style={style.cardBorder}>
            <TouchableOpacity
              onPress={() => {
                this.viewImage(CONSTANTS.MEDIUM_IMG + item?.url);
              }}>
              <Image
                source={{uri: CONSTANTS.MEDIUM_IMG + item.url}}
                style={style.cardImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </CardItem>
        </Card>
      </View>
    );
  };
  get pagination() {
    const {activeSlide} = this.state;
    return (
      <Pagination
        dotsLength={3}
        activeDotIndex={activeSlide}
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0)',
          position: 'absolute',
          top: 210,
          alignSelf: 'center',
          justifyContent: 'space-around',
          maxWidth: 100,
        }}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={1}
      />
    );
  }

  render() {
    return (
      <Container>
        <Header
          style={{
            flexDirection: 'row',
            backgroundColor: '#bd1d53',
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
                //  this.props.navigation.openDrawer()
                this.props.navigation.goBack(null);
              }}>
              <BackBtn_white height="22" width="20" />
            </Button>
          </Left>
          <Body style={{paddingStart: 0}}>
            <Title
              style={{
                color: 'white',
                paddingStart: 0,
                fontSize: width / 22,
              }}>
              Job Details
            </Title>
          </Body>
          <Right />
        </Header>
        <View
          style={{
            flex: 1,
          }}>
          <ScrollView
            style={{
              flex: 1,
            }}>
            {'imageKey' in this.state.job && this.state.job.imageKey.length ? (
              <View style={{marginTop: -6}}>
                <Carousel
                  layout={'default'}
                  ref={c => {
                    this._carousel = c;
                  }}
                  data={this.state.job.imageKey}
                  renderItem={this._renderItem}
                  sliderWidth={width}
                  itemWidth={width}
                  hasParallaxImages={true}
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={0.7}
                  loop={true}
                  loopClonesPerSide={this.state.job.imageKey.length}
                  autoplay={true}
                  autoplayDelay={500}
                  autoplayInterval={2000}
                  firstItem={1}
                  scrollEnabled={true}
                  onSnapToItem={index => this.setState({activeSlide: index})}
                />
                {this.pagination}
                <Text style={style.paginationCount}>
                  {this.state.activeSlide + 1}/{this.state.job.imageKey.length}
                </Text>
              </View>
            ) : null}
            <View style={[style.businessInfoContent]}>
              <Text style={[theme.fontBold, {fontSize: width / 23}]}>
                {this.state.job.name}
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
                {moment(this.state.job.createdAt).format('LL')}
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
                  {this.state.job.jobId}
                </Text>
              </Text>
            </View>
            <View style={[style.businessContactContent]}>
              {'salary' in this.state.job ? (
                <View style={[style.contacts, {alignItems: 'flex-end'}]}>
                  <Text
                    style={[
                      theme.fontBold,
                      {
                        marginLeft: 6,
                        marginRight: 6,
                        fontSize: width / 21,
                        color: AppColors.fontRed,
                      },
                    ]}>
                    QAR {this.state.job.salary}
                  </Text>
                  <Text>{this.state.salaryType} Salary</Text>
                </View>
              ) : null}
              {'locationDetails' in this.state.job &&
              this.state.job.locationDetails ? (
                <View style={style.contacts}>
                  <LocatioPinSvg width={20} height={20} />
                  <Text style={[theme.fontRegular, {marginLeft: 13}]}>
                    {this.state.job.locationDetails.locationName}
                  </Text>
                </View>
              ) : null}
              {'userDetails' in this.state.job ? (
                <View
                  style={{
                    flexDirection: 'row',
                    margin: 10,
                    borderWidth: 1,
                    borderColor: '#f3e1e7',
                    marginHorizontal: -width / 80,
                    marginBottom: 25,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRightWidth: 1,
                      paddingVertical: 6,
                      backgroundColor: '#fdf4f8',
                      borderColor: '#f3e1e7',
                      paddingHorizontal: 10,
                      maxWidth: width / 1.7,
                    }}>
                    {'profilePic' in this.state.job.userDetails ? (
                      <View
                        style={{
                          borderWidth: 2,
                          borderColor: 'red',
                          borderRadius: 50,
                          borderColor: '#bd1d53',
                        }}>
                        <Thumbnail
                          source={{
                            uri:
                              CONSTANTS.SMALL_IMG +
                              this.state.job.userDetails.profilePic,
                          }}
                          style={{
                            width: 52,
                            height: 52,
                          }}
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          borderWidth: 2,
                          borderColor: 'red',
                          borderRadius: 50,
                          borderColor: '#bd1d53',
                        }}>
                        <Thumbnail
                          source={require('./assets/images/userpic.png')}
                          style={{
                            width: 52,
                            height: 52,
                          }}
                        />
                      </View>
                    )}

                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('UserMenuTabsOther', {
                          initialPage: 3,
                          userId: this.state.job?.userDetails?._id,
                        });
                      }}>
                      <Text
                        style={[
                          theme.fontRegular,
                          {paddingHorizontal: 10, marginRight: 15},
                        ]}>
                        {this.state.job.userDetails.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#bd1d53',
                        paddingVertical: 4,
                        paddingHorizontal: 13,
                        borderRadius: 14,
                      }}
                      activeOpacity={0.8}
                      onPress={() => {
                        this.showContact();
                      }}>
                      <Text style={[theme.fontRegular, {color: '#fff'}]}>
                        Contact
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
              {/* {this.state.userRole == '1' ? (
                <View
                  style={{paddingTop: height / 90, paddingBottom: height / 50}}>
                  <Button
                    block
                    rounded
                    style={{backgroundColor: '#1973EA', elevation: 0}}
                    onPress={() => {
                      this.props.navigation.navigate('ApplyJob', {
                        id: this.state.job._id,
                        data: this.state.job,
                      });
                    }}>
                    <Text style={{color: 'white'}}>Apply Now</Text>
                  </Button>
                </View>
              ) : null} */}
            </View>

            {'description' in this.state.job && this.state.job.description ? (
              <View style={[style.aboutContent]}>
                <Text style={[theme.fontBold, {fontSize: width / 25}]}>
                  Job Description
                </Text>
                {/* <Text
                  style={[
                    theme.fontRegular,
                    {fontSize: width / 29, marginTop: 2, color: '#000'},
                  ]}>
                  {this.state.job.description}
                </Text> */}
                {/* <View style={{flexDirection: 'row', marginTop: height / 90}}>
                <Text>{'\u2022'}</Text>
                <Text style={{flex: 1, paddingLeft: 5, fontSize: width / 31}}>
                  Minimum of 3+ of years of experience in Node.js
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: height / 90}}>
                <Text>{'\u2022'}</Text>
                <Text style={{flex: 1, paddingLeft: 5, fontSize: width / 31}}>
                  Minimum of 3+ of years of experience in Node.js development
                </Text>
              </View> */}
                {/* <View style={{marginTop: height / 70}}>
                <Text
                  style={[
                    theme.fontMedium,
                    {fontSize: width / 30, color: '#1274E3'},
                  ]}>
                  READ MORE...
                </Text>
              </View> */}
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: this.state.job?.description,
                    // .replace(/\n/g, '')
                    // .replace(/<br>/g, '')
                    // .replace(/<br data-mce-fragment="1">/g, '')
                    // .replace(/<p> <\/p>/g, ''),
                  }}
                  // tagsStyles={tagsStyles}
                  // enableCSSInlineProcessing={false}
                  // ignoredDomTags={['<br>', '<meta>']}
                  // ignoredTags={['<br>', '<meta>']}
                  // enableExperimentalBRCollapsing={true}
                  // enableExperimentalGhostLinesPrevention={true}
                  // enableExperimentalMarginCollapsing={true}
                />
              </View>
            ) : null}

            <View style={[style.aboutContent]}>
              <Text style={[theme.fontBold, {fontSize: width / 25}]}>
                Job Specifications
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                  borderWidth: 1,
                  borderBottomWidth: 0,
                  borderColor: '#f0f0f0',
                }}>
                <View
                  style={{
                    // width: width / 1.2,
                    flexDirection: 'row',
                    borderBottomColor: '#f0f0f0',
                    borderBottomWidth: 1,
                  }}>
                  <View
                    style={{
                      flex: 2,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, {fontSize: width / 29}]}>
                        Job Category
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 2,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontRegular, {fontSize: width / 29}]}>
                        {this.state.job.categoryName}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: '#f0f0f0',
                    borderBottomWidth: 1,
                    flex: 1,
                  }}>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, {fontSize: width / 29}]}>
                        Job Sub Category
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontRegular, {fontSize: width / 29}]}>
                        {this.state.job.subCategoryName}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: '#f0f0f0',
                    borderBottomWidth: 1,
                    flex: 1,
                  }}>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, {fontSize: width / 29}]}>
                        Designation
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontRegular, {fontSize: width / 29}]}>
                        {this.state.job.designation}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: '#f0f0f0',
                    borderBottomWidth: 1,
                    flex: 1,
                  }}>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, {fontSize: width / 29}]}>
                        Year of Exp
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontRegular, {fontSize: width / 29}]}>
                        {this.state.job.experience}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: '#f0f0f0',
                    borderBottomWidth: 1,
                    flex: 1,
                  }}>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, {fontSize: width / 29}]}>
                        Qualification
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontRegular, {fontSize: width / 29}]}>
                        {this.getQualificationName(
                          this.state.job.qualification,
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: '#f0f0f0',
                    borderBottomWidth: 1,
                    flex: 1,
                  }}>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, {fontSize: width / 29}]}>
                        Salary
                      </Text>
                      <Text>({this.state.job?.salaryType})</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontRegular, {fontSize: width / 29}]}>
                        QAR {this.state.job.salary}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: '#f0f0f0',
                    borderBottomWidth: 1,
                    flex: 1,
                  }}>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, {fontSize: width / 29}]}>
                        Employee Type
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontRegular, {fontSize: width / 29}]}>
                        {this.state.job?.employeeType}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {this.state.userRole == '1' ? (
                <View
                  style={{paddingTop: height / 30, paddingBottom: height / 50}}>
                  <Button
                    block
                    rounded
                    style={{backgroundColor: '#1973EA', elevation: 0}}
                    onPress={() => {
                      this.props.navigation.navigate('ApplyJob', {
                        id: this.state.job._id,
                        data: this.state.job,
                      });
                    }}>
                    <Text style={{color: 'white'}}>Apply Now</Text>
                  </Button>
                </View>
              ) : null}
            </View>
            {'latitude' in this.state.region ? (
              <View style={[style.aboutContent]}>
                <View>
                  <Text
                    style={[
                      theme.fontBold,
                      {fontSize: width / 25, marginBottom: 10},
                    ]}>
                    Location Map
                  </Text>
                  <MapView initialRegion={this.state.region} minHeight={200}>
                    <Marker coordinate={this.state.businessRegion} />
                  </MapView>
                </View>
              </View>
            ) : null}
          </ScrollView>
        </View>

        <Loader visibility={this.state.loader} />
        <Modal
          visible={this.state.showContact}
          animationType="slide"
          transparent={true}
          backgroundColor="#fff"
          onRequestClose={() => {
            this.setState({
              showContact: false,
            });
          }}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            enabled>
            {this.state.auth_user == 'user_exist' ? (
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
                {'contactDetails' in this.state.job ? (
                  <View
                    style={{
                      backgroundColor: '#fff',
                      width: '90%',
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: '#fff',
                      paddingBottom: 25,
                      paddingTop: 5,
                      paddingHorizontal: width / 17,
                    }}>
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        right: 5,
                        top: 5,
                        padding: 6,
                        backgroundColor: AppColors.fontColorLight,
                        borderRadius: 50,
                      }}
                      activeOpacity={0.8}
                      onPress={() => {
                        this.setState({
                          showContact: false,
                        });
                      }}>
                      <Icon
                        style={{color: '#737373', fontSize: 14}}
                        name="close"
                        type="Ionicons"
                        onPress={() => {
                          this.setState({
                            showContact: false,
                          });
                        }}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: width / 20,
                        color: 'black',
                        fontFamily: 'Roboto-Bold',
                        marginTop: 20,
                        marginBottom: 20,
                      }}>
                      {/* {this.state.job.userId.name} */}
                      Contact Information
                    </Text>
                    <View
                      style={{
                        paddingHorizontal: 5,
                      }}>
                      <View
                        style={{
                          marginTop: 10,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Roboto-Regular',
                            color: '#737373',
                            fontSize: 12,
                          }}>
                          Name
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Roboto-Medium',
                            color: '#5f5f5f',
                            marginTop: 2,
                            fontSize: 16,
                          }}
                          selectable>
                          {this.state.job.contactDetails.contactName}
                        </Text>
                      </View>
                      <View
                        style={{
                          marginTop: 10,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Roboto-Regular',
                            color: '#737373',
                            fontSize: 12,
                          }}>
                          Phone
                        </Text>

                        <View
                          style={{
                            marginTop: 5,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              Linking.openURL(
                                'tel:' +
                                  CONSTANTS.COUNTRY_CODE_TEXT +
                                  this.state.job.contactDetails.contactNumber,
                              )
                            }
                            title={
                              CONSTANTS.COUNTRY_CODE_TEXT +
                              this.state.job.contactDetails.contactNumber
                            }>
                            <Text
                              style={{
                                fontFamily: 'Roboto-Medium',
                                color: '#5f5f5f',
                                marginTop: 2,
                                fontSize: 16,
                              }}
                              selectable>
                              {CONSTANTS.COUNTRY_CODE_TEXT}{' '}
                              {this.state.job.contactDetails.contactNumber}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              Linking.openURL(
                                'whatsapp://send?text=&phone=' +
                                  CONSTANTS.COUNTRY_CODE_TEXT +
                                  this.state.job.contactDetails.contactNumber,
                              );
                            }}>
                            <FontAwesomeIcon
                              icon={faWhatsapp}
                              color={'#bd1d53'}
                              size={30}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View
                        style={{
                          marginTop: 10,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Roboto-Regular',
                            color: '#737373',
                            fontSize: 12,
                          }}>
                          Email ID
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            Linking.openURL(
                              'mailto:' +
                                this.state.job.contactDetails.contactEmail,
                            )
                          }
                          title={this.state.job.contactDetails.contactEmail}>
                          <Text
                            style={{
                              fontFamily: 'Roboto-Medium',
                              color: '#5f5f5f',
                              marginTop: 2,
                              fontSize: 16,
                            }}
                            selectable>
                            {this.state.job.contactDetails.contactEmail}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 30,
                      }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#bd1d53',
                          paddingVertical: 10,
                          paddingHorizontal: 25,
                          borderRadius: 25,
                        }}
                        activeOpacity={0.8}
                        onPress={() => {
                          this.setState({
                            showContact: false,
                          });
                        }}>
                        <Text style={[theme.fontRegular, {color: '#fff'}]}>
                          Ok
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
              </View>
            ) : (
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
                    width: '90%',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#fff',
                    paddingBottom: 25,
                    paddingTop: 5,
                    paddingHorizontal: width / 17,
                  }}>
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: 5,
                      top: 5,
                      padding: 6,
                      backgroundColor: AppColors.fontColorLight,
                      borderRadius: 50,
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                      this.setState({
                        showContact: false,
                      });
                    }}>
                    <Icon
                      style={{color: '#737373', fontSize: 14}}
                      name="close"
                      type="Ionicons"
                      onPress={() => {
                        this.setState({
                          showContact: false,
                        });
                      }}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: width / 25,
                        color: 'black',
                        fontFamily: 'Roboto-bold',
                        marginTop: 70,
                        marginBottom: 25,
                      }}>
                      Please login to view contact details
                    </Text>

                    <TouchableOpacity
                      style={{
                        backgroundColor: '#bd1d53',
                        paddingVertical: 10,
                        paddingHorizontal: 25,
                        borderRadius: 25,
                      }}
                      activeOpacity={0.8}
                      onPress={() => {
                        this.setState({
                          showContact: false,
                        });
                        this.props.navigation.navigate('Login');
                      }}>
                      <Text style={[theme.fontRegular, {color: '#fff'}]}>
                        Log In
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </KeyboardAvoidingView>
        </Modal>

        <ImageView
          images={this.state.imageViewerImages}
          imageIndex={0}
          visible={this.state.isImageViewerVisible}
          onRequestClose={() => {
            this.setState({isImageViewerVisible: false});
          }}
        />
      </Container>
    );
  }
}

const style = StyleSheet.create({
  cardWrapparent: {},
  cardImage: {
    height: 270,
    overflow: 'hidden',
    resizeMode: 'cover',
    width: width,
  },
  cardWrap: {
    width: width,
  },
  cardBorder: {},
  businessInfoContent: {
    marginTop: 14,
    paddingHorizontal: width / 20,
    borderBottomWidth: 5,
    borderBottomColor: '#f0eced',
  },
  businessContactContent: {
    paddingHorizontal: width / 20,
    borderBottomWidth: 5,
    borderBottomColor: '#f0eced',
  },
  paginationCount: {
    color: '#fff',
    position: 'absolute',
    top: 233,
    right: 10,
    alignSelf: 'flex-end',
  },
  contacts: {
    flexDirection: 'row',
    paddingLeft: width / 40,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0eced',
    alignItems: 'center',
  },
  aboutContent: {
    paddingHorizontal: width / 20,
    paddingVertical: 15,
    borderBottomWidth: 5,
    borderBottomColor: '#f0eced',
  },
  workingContent: {
    paddingHorizontal: width / 20,
    paddingVertical: 15,
  },
  cell: {
    paddingVertical: 10,
    paddingStart: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
