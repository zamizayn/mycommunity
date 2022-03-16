import React, {Component} from 'react';
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
import BackBtn_white from '../assets/svg/BackBtn_white.svg';
import theme from '../config/styles.js';
import SearchBlackIcon from '../assets/svg/SearchBlackIcon.svg';
import Notification_icon_white from '../assets/svg/Notification_icon_white.svg';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import PhoneSvg from '../assets/svg/phone.svg';
import TagSvg from '../assets/svg/Price_tag.svg';
import EmailSvg from '../assets/svg/Email_icon.svg';
import LocatioPinSvg from '../assets/svg/location-pin.svg';
import TimeSvg from '../assets/images/time.svg';
import MapView, {Marker} from 'react-native-maps';
import {API} from '../config/api';
import {ApiHelper} from '../helpers/ApiHelper';
import Loader from '../components/Loader';
import {CONSTANTS} from '../config/constants';
import moment from 'moment';
import {AppColors} from '../Themes';
import RenderHtml from 'react-native-render-html';
export default class BusinessInfo extends Component {
  constructor() {
    super();
    this.state = {
      checked: false,
      activeSlide: 0,
      region: {},
      businessRegion: {},
      product: {},
      loader: false,
      tabIndex: 0,
      userInfo: {},
      userDetails: {},
      businessData: {},
    };
  }

  componentDidMount() {
    // const id = this.props.route.params?.id;
    // this.getProduct(id);
    console.log('userId', this.props.userId);
    this.getUserInfo(this.props?.userId);
  }
  async getUserInfo(id) {
    this.setState({
      loader: true,
    });
    await ApiHelper.get(API.users + id + '/public')
      .then(res => {
        var data = res.data.data;
        console.log('userinfo : ', data);
        let deltaObj = {};
        if (
          'lat' in data?.businessDetals?.mapDetails &&
          data?.businessDetals?.mapDetails.lat
        ) {
          deltaObj = this.deltaFrom(
            data?.businessDetals?.mapDetails.lat,
            data?.businessDetals?.mapDetails.lng,
            1000,
          );
        }
        this.setState(
          {
            // product: data,
            region: {
              latitude: data?.businessDetals?.mapDetails.lat,
              longitude: data?.businessDetals?.mapDetails.lng,
              latitudeDelta:
                'latitudeDelta' in deltaObj ? deltaObj.latitudeDelta : 5,
              longitudeDelta:
                'longitudeDelta' in deltaObj ? deltaObj.longitudeDelta : 0.03,
            },
            businessRegion: {
              latitude: data?.businessDetals?.mapDetails.lat,
              longitude: data?.businessDetals?.mapDetails.lng,
            },
            userInfo: data?.businessDetals,
            userDetails: data?.userDetails,
            businessData: data?.businessDetals,
            loader: false,
          },
          () => {},
        );
      })
      .catch(err => {
        this.setState({
          loader: false,
        });
        console.log(err);
      });
  }
  async getProduct(id) {
    this.setState({
      loader: true,
    });
    await ApiHelper.get(API.products + '/' + id)
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
            product: data,
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
          },
          () => {},
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
            <Image
              source={{uri: CONSTANTS.MEDIUM_IMG + item.url}}
              style={style.cardImage}
              resizeMode="cover"
            />
          </CardItem>
        </Card>
      </View>
    );
  };

  // get pagination() {
  //   const {activeSlide} = this.state;
  //   return (
  //     <Pagination
  //       dotsLength={this.state.product.imageFiles.length}
  //       activeDotIndex={activeSlide}
  //       containerStyle={{
  //         backgroundColor: 'rgba(0, 0, 0, 0)',
  //         position: 'absolute',
  //         top: 210,
  //         alignSelf: 'center',
  //       }}
  //       dotStyle={{
  //         width: 8,
  //         height: 8,
  //         borderRadius: 5,
  //         marginHorizontal: 8,
  //         backgroundColor: 'rgba(255, 255, 255, 0.92)',
  //       }}
  //       inactiveDotStyle={
  //         {
  //           // Define styles for inactive dots here
  //         }
  //       }
  //       inactiveDotOpacity={0.4}
  //       inactiveDotScale={0.6}
  //     />
  //   );
  // }

  render() {
    return (
      <Container>
        <View
          style={{
            flex: 1,
          }}>
          <Tab
            heading={
              <TabHeading style={{backgroundColor: '#fff'}}>
                <Text
                  style={[
                    this.state.tabIndex == 0
                      ? theme.fontBold
                      : theme.fontRegular,
                    {fontSize: width / 29},
                  ]}>
                  Business Info
                </Text>
              </TabHeading>
            }>
            <ScrollView>
              {'imageFiles' in this.state?.userInfo &&
              this.state?.userInfo?.imageFiles.length ? (
                <View style={{marginTop: -6}}>
                  <Carousel
                    layout={'default'}
                    ref={c => {
                      this._carousel = c;
                    }}
                    data={this.state?.userInfo?.imageFiles}
                    renderItem={this._renderItem}
                    sliderWidth={width}
                    itemWidth={width}
                    hasParallaxImages={true}
                    inactiveSlideScale={1}
                    inactiveSlideOpacity={0.7}
                    loop={true}
                    loopClonesPerSide={this.state?.userInfo?.imageFiles.length}
                    autoplay={true}
                    autoplayDelay={500}
                    autoplayInterval={2000}
                    scrollEnabled={true}
                    onSnapToItem={index => this.setState({activeSlide: index})}
                  />
                  {this.pagination}
                  <Text style={style.paginationCount}>
                    {this.state.activeSlide + 1}/
                    {this.state?.userInfo?.imageFiles.length}
                  </Text>
                </View>
              ) : null}
              <View style={[style.businessInfoContent]}>
                {'userDetails' in this.state?.userInfo ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      margin: 10,
                      borderWidth: 0,
                      borderColor: '#f3e1e7',
                      marginHorizontal: -width / 80,
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
                      {'profilePic' in this.state?.userInfo?.userDetails ? (
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
                                this.state?.userInfo.userDetails.profilePic,
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
                            source={require('.././assets/images/userpic.png')}
                            style={{
                              width: 52,
                              height: 52,
                            }}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                ) : null}
                <Text style={[theme.fontBold, {fontSize: width / 23}]}>
                  {this.state?.userInfo?.companyName}
                </Text>
                {'locationDetails' in this.state?.userInfo ? (
                  <Text style={[theme.fontRegular, {fontSize: width / 33}]}>
                    At {this.state?.userInfo?.mapDetails?.addressString}
                  </Text>
                ) : null}
                <Text
                  style={[
                    theme.fontRegular,
                    {
                      fontSize: width / 35,
                      color: '#979797',
                      marginTop: 13,
                      marginBottom: 30,
                    },
                  ]}>
                  {moment(this.state?.userInfo?.createdAt).format('LL')}
                </Text>
              </View>

              <View style={[style.businessContactContent]}>
                {'contactDetails' in this.state?.userInfo &&
                this.state?.userInfo?.contactDetails?.contactNumber ? (
                  <View style={style.contacts}>
                    <PhoneSvg width={20} height={20} />
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          'tel:' +
                            this.state?.userInfo.contactDetails.contactNumber,
                        )
                      }
                      title={
                        this.state?.userInfo?.contactDetails?.contactNumber
                      }>
                      <Text style={[theme.fontRegular, {marginLeft: 13}]}>
                        {this.state?.userInfo?.contactDetails?.contactNumber}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
                {'email' in this.state?.userInfo &&
                this.state?.userInfo.email ? (
                  <View style={style.contacts}>
                    <EmailSvg width={20} height={20} />
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL('mailto:' + this.state?.userInfo?.email)
                      }
                      title={this.state?.userInfo?.email}>
                      <Text style={[theme.fontRegular, {marginLeft: 13}]}>
                        {this.state?.userInfo?.email}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
                {'website' in this.state?.userInfo &&
                this.state?.userInfo?.website ? (
                  <View style={style.contacts}>
                    <Icon
                      name="globe"
                      type="Octicons"
                      style={{
                        fontSize: 20,
                        color: '#bd1d53',
                      }}
                    />
                    <Text style={[theme.fontRegular, {marginLeft: 13}]}>
                      {this.state?.userInfo?.website}
                    </Text>
                  </View>
                ) : null}
                {'address' in this.state?.userInfo &&
                this.state?.userInfo?.address ? (
                  <View style={style.contacts}>
                    <LocatioPinSvg width={20} height={20} />
                    <Text style={[theme.fontRegular, {marginLeft: 13}]}>
                      {this.state?.userInfo?.address}
                    </Text>
                  </View>
                ) : null}
                {/* {'userDetails' in this.state?.userInfo ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      margin: 10,
                      borderWidth: 1,
                      borderColor: '#f3e1e7',
                      marginHorizontal: -width / 80,
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
                      {'profilePic' in this.state?.userInfo?.userDetails ? (
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
                                this.state?.userInfo.userDetails.profilePic,
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
                            source={require('.././assets/images/userpic.png')}
                            style={{
                              width: 52,
                              height: 52,
                            }}
                          />
                        </View>
                      )}
                      <Text
                        style={[
                          theme.fontRegular,
                          {paddingHorizontal: 10, marginRight: 15},
                        ]}>
                        {this.state?.userInfo?.userDetails.name}
                      </Text>
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
                        onPress={() => this.showContact()}>
                        <Text style={[theme.fontRegular, {color: '#fff'}]}>
                          Contact
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null} */}
              </View>
              {'description' in this.state?.userInfo &&
              this.state?.userInfo?.description ? (
                <View style={[style.aboutContent]}>
                  <Text style={[theme.fontBold, {fontSize: width / 25}]}>
                    About Us
                  </Text>
                  {/* <Text
                    style={[
                      theme.fontRegular,
                      {fontSize: width / 29, marginTop: 2, color: '#9a9a9a'},
                    ]}>
                    {this.state?.userInfo?.description}
                  </Text> */}
                  <RenderHtml
                    contentWidth={width}
                    source={{
                      html: this.state?.userInfo?.description,
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
              {'specializedIn' in this.state?.userInfo &&
              this.state?.userInfo?.specializedIn ? (
                <View style={[style.aboutContent]}>
                  <Text style={[theme.fontBold, {fontSize: width / 25}]}>
                    Specialized
                  </Text>
                  {/* <Text
                    style={[
                      theme.fontRegular,
                      {fontSize: width / 29, marginTop: 2, color: '#9a9a9a'},
                    ]}>
                    {this.state?.userInfo?.specializedIn}
                  </Text> */}
                  <RenderHtml
                    contentWidth={width}
                    source={{
                      html: this.state?.userInfo?.specializedIn,
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
              {this.state?.userInfo?.businessCategoryName ||
              this.state?.userInfo?.businessSubCategoryName ||
              this.state.industryType ? (
                <View style={[style.aboutContent]}>
                  {this.state?.userInfo?.businessCategoryName ? (
                    <View
                      style={{
                        marginBottom: 20,
                      }}>
                      <Text style={[theme.fontBold, {fontSize: width / 25}]}>
                        Category
                      </Text>
                      <TouchableOpacity
                        style={{
                          paddingVertical: 4,
                          paddingHorizontal: 18,
                          borderRadius: 14,
                          alignSelf: 'flex-start',
                          borderWidth: 1,
                          borderColor: '#efefef',
                          marginTop: 8,
                        }}>
                        <Text
                          style={[theme.fontRegular, {fontSize: width / 30}]}>
                          {this.state?.userInfo.businessCategoryName}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  {this.state?.userInfo?.businessSubCategoryName.length ? (
                    <>
                      <Text
                        style={[
                          theme.fontBold,
                          {fontSize: width / 25, color: '#000'},
                        ]}>
                        Subcategories
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          marginBottom: 20,
                        }}>
                        {this.state?.userInfo?.businessSubCategoryName.map(
                          sub => {
                            return (
                              <TouchableOpacity
                                style={{
                                  paddingVertical: 4,
                                  paddingHorizontal: 18,
                                  borderRadius: 14,
                                  alignSelf: 'flex-start',
                                  borderWidth: 1,
                                  borderColor: '#efefef',
                                  marginTop: 8,
                                  marginRight: width / 30,
                                }}>
                                <Text
                                  style={[
                                    theme.fontRegular,
                                    {fontSize: width / 30},
                                  ]}>
                                  {sub};
                                </Text>
                              </TouchableOpacity>
                            );
                          },
                        )}
                      </View>
                    </>
                  ) : null}
                  {this.state?.userInfo?.industryType ? (
                    <>
                      <Text
                        style={[
                          theme.fontBold,
                          {fontSize: width / 25, color: '#000'},
                        ]}>
                        Industry Type
                      </Text>
                      <Text
                        style={[
                          theme.fontRegular,
                          {fontSize: width / 30, marginTop: 3},
                        ]}
                      />
                    </>
                  ) : null}
                </View>
              ) : null}
              {'awardImages' in this.state?.userInfo &&
              this.state?.userInfo?.awardImages.length ? (
                <View style={[style.aboutContent]}>
                  <View
                    style={{
                      marginBottom: 10,
                    }}>
                    <Text
                      style={[
                        theme.fontBold,
                        {fontSize: width / 25, marginBottom: 10},
                      ]}>
                      Awards & Certificate
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                      }}>
                      {this.state?.userInfo?.awardImages.map(awIm => {
                        return (
                          <Image
                            source={{uri: CONSTANTS.MEDIUM_IMG + awIm.url}}
                            style={{
                              width: width / 2.4,
                              height: 130,
                            }}
                            resizeMode="contain"
                          />
                        );
                      })}
                    </View>
                  </View>
                </View>
              ) : null}

              <View style={[style.workingContent]}>
                <Text style={[theme.fontBold, {fontSize: width / 25}]}>
                  Working Hours
                </Text>
                {'workingHours' in this.state.businessData &&
                this.state.businessData.workingHours.length ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <View
                      style={{
                        width: width / 1.2,
                        borderWidth: 1,
                        borderColor: '#f0f0f0',
                        flexDirection: 'row',
                      }}>
                      <View
                        style={{
                          flex: 2,
                        }}>
                        <View style={style.cell}>
                          <Text
                            style={[theme.fontMedium, {fontSize: width / 29}]}>
                            Days
                          </Text>
                        </View>
                        {this.state.businessData.workingHours.map(dayObj => {
                          return (
                            <View style={style.cell}>
                              <Text
                                style={[
                                  theme.fontRegular,
                                  {fontSize: width / 31},
                                ]}>
                                {dayObj.day}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                      <View
                        style={{
                          flex: 2,
                        }}>
                        <View style={style.cell}>
                          <Text
                            style={[theme.fontMedium, {fontSize: width / 29}]}>
                            Start Time
                          </Text>
                        </View>
                        {this.state.businessData.workingHours.map(dayObj => {
                          const hours = dayObj.hours;
                          if (hours == '' || hours == '-') {
                            return (
                              <View style={style.cell}>
                                <Text
                                  style={[
                                    theme.fontMedium,
                                    {fontSize: width / 31, color: '#bd1d53'},
                                  ]}>
                                  Closed
                                </Text>
                              </View>
                            );
                          } else {
                            const hourSplit = hours.split('-');
                            return (
                              <View style={style.cell}>
                                <TimeSvg width={14} height={14} />
                                <Text
                                  style={[
                                    theme.fontMedium,
                                    {
                                      fontSize: width / 31,
                                      marginLeft: 4,
                                      color: '#909090',
                                    },
                                  ]}>
                                  {hourSplit[0]}
                                </Text>
                              </View>
                            );
                          }
                        })}
                      </View>
                      <View
                        style={{
                          flex: 2,
                        }}>
                        <View style={style.cell}>
                          <Text
                            style={[theme.fontMedium, {fontSize: width / 29}]}>
                            End Time
                          </Text>
                        </View>
                        {this.state.businessData.workingHours.map(dayObj => {
                          const hours = dayObj.hours;
                          if (hours == '' || hours == '-') {
                            return (
                              <View style={style.cell}>
                                <Text
                                  style={[
                                    theme.fontMedium,
                                    {
                                      fontSize: width / 31,
                                      marginLeft: 4,
                                      color: '#909090',
                                    },
                                  ]}
                                />
                              </View>
                            );
                          } else {
                            const hourSplit = hours.split('-');
                            return (
                              <View style={style.cell}>
                                <TimeSvg width={14} height={14} />
                                <Text
                                  style={[
                                    theme.fontMedium,
                                    {
                                      fontSize: width / 31,
                                      marginLeft: 4,
                                      color: '#909090',
                                    },
                                  ]}>
                                  {hourSplit.length == 2 ? hourSplit[1] : ''}
                                </Text>
                              </View>
                            );
                          }
                        })}
                      </View>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <Text style={[theme.fontRegular, {fontSize: width / 29}]}>
                      Working hours not given
                    </Text>
                  </View>
                )}
              </View>
              {'mapDetails' in this.state?.businessData &&
              Object.keys(this.state?.businessData?.mapDetails).length &&
              'latitude' in this.state.region &&
              'longitude' in this.state.region ? (
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
          </Tab>
        </View>
        <Loader visibility={this.state.loader} />
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
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
});
