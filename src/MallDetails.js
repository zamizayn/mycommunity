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
  Platform,
  FlatList,
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

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faGlobe} from '@fortawesome/free-solid-svg-icons';
import {faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {faWhatsapp} from '@fortawesome/free-brands-svg-icons';

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
import ImageView from 'react-native-image-viewing';
export default class MallDetails extends Component {
  constructor() {
    super();
    this.state = {
      checked: false,
      activeSlide: 0,
      region: {},
      businessRegion: {},
      service: {},
      loader: false,
      tabIndex: 0,
      showContact: false,
      shops: [],
      imageViewerImages: [],
      isImageViewerVisible: false,
    };
  }

  viewImage(url) {
    var urls = [{uri: url}];

    this.setState(
      {
        imageViewerImages: this.state.service.imageFiles.map(c => ({
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
    const id = this.props.route.params.id;
    const slug = this.props.route.params.slug;
    this.getService(slug);
    this.getShops(id);
  }

  async getService(slug) {
    this.setState({
      loader: true,
    });
    await ApiHelper.get(API.mallDetails + slug)
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
            service: data,
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

  async getShops(id) {
    this.setState({
      loader: true,
    });
    await ApiHelper.get(API.shopsInMall + id)
      .then(res => {
        this.setState({
          loader: false,
        });
        if (res?.data?.data) {
          this.setState({
            shops: res?.data?.data,
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

  getOrdinal(n) {
    let ord = ['st', 'nd', 'rd'];
    let exceptions = [11, 12, 13];
    let nth =
      ord[(n % 10) - 1] == undefined || exceptions.includes(n % 100)
        ? 'th'
        : ord[(n % 10) - 1];
    return n + nth;
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
        dotsLength={this.state.service.imageFiles.length}
        activeDotIndex={activeSlide}
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0)',
          position: 'absolute',
          top: 210,
          alignSelf: 'center',
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
        inactiveDotScale={0.6}
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
              Mall Details
            </Title>
          </Body>
          <Right>
            {/* <Button transparent>
              <SearchBlackIcon height="40" width="40" />
            </Button>

            <Button transparent>
              <Badge
                style={{
                  position: 'absolute',
                  backgroundColor: 'white',
                  width: 17,
                  height: 17,
                  borderRadius: 17 / 2,
                  right: width / 40,
                  top: height / 80,
                  margin: 0,
                  padding: 0,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}>
                <Text
                  style={[
                    theme.fontBold,
                    {
                      fontSize: width / 28,
                      lineHeight: height / 40,

                      color: '#BC1D54',
                    },
                  ]}>
                  2
                </Text>
              </Badge>
              <Notification_icon_white height="30" width="30" />
            </Button> */}
          </Right>
        </Header>
        <View
          style={{
            flex: 1,
          }}>
          <ScrollView
            style={{
              flex: 1,
            }}>
            {'imageFiles' in this.state.service &&
            this.state.service.imageFiles.length ? (
              <View style={{marginTop: -6}}>
                <Carousel
                  layout={'default'}
                  ref={c => {
                    this._carousel = c;
                  }}
                  data={this.state.service.imageFiles}
                  renderItem={this._renderItem}
                  sliderWidth={width}
                  itemWidth={width}
                  hasParallaxImages={true}
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={0.7}
                  loop={true}
                  loopClonesPerSide={this.state.service.imageFiles.length}
                  autoplay={true}
                  autoplayDelay={500}
                  autoplayInterval={2000}
                  firstItem={1}
                  scrollEnabled={true}
                  onSnapToItem={index => this.setState({activeSlide: index})}
                />
                {this.pagination}
                <Text style={style.paginationCount}>
                  {this.state.activeSlide + 1}/
                  {this.state.service.imageFiles.length}
                </Text>
              </View>
            ) : null}
            <View style={[style.businessInfoContent]}>
              <Text style={[theme.fontBold, {fontSize: width / 23}]}>
                {this.state.service.title}
              </Text>
              <Text
                style={[
                  theme.fontRegular,
                  {
                    fontSize: width / 35,
                    color: '#979797',
                    marginTop: 0,
                    marginBottom: 15,
                  },
                ]}>
                {moment(this.state.service.createdAt).format('LL')}
              </Text>
              {/* <Text
                style={[
                  {
                    color: AppColors.fontRed,
                    fontSize: width / 30,
                    marginBottom: 15,
                  },
                ]}>
                Promotion ID: {this.state.service.promotionId}
                <Text style={[{fontSize: width / 30, color: '#000'}]}>
                  {this.state.service.serviceId}
                </Text>
              </Text> */}
            </View>

            {/* <View style={[style.businessInfoContent]}>
              <Text style={[theme.fontBold, {fontSize: width / 23}]}>
                Offer valid from
              </Text>
              <Text
                style={[
                  theme.fontRegular,
                  {
                    fontSize: width / 35,
                    color: '#979797',
                    marginTop: 0,
                    marginBottom: 15,
                  },
                ]}>
                {moment(this.state.service.startDateTime).format(
                  'MMMM DD, YYYY hh:mm a',
                )}
                {' to '}
                {moment(this.state.service.endDateTime).format(
                  'MMMM DD, YYYY hh:mm a',
                )}
              </Text>
            </View> */}
            <View style={[style.businessContactContent]}>
              {!this.state.service.bestDeal && 'price' in this.state.service ? (
                <View style={style.contacts}>
                  <TagSvg width={20} height={20} />
                  <Text
                    style={[
                      theme.fontRegular,
                      {
                        marginLeft: 13,
                        fontSize: width / 21,
                        color: AppColors.fontRed,
                      },
                    ]}>
                    QAR {this.state.service.price}
                  </Text>
                </View>
              ) : null}
              {this.state.service.bestDeal &&
              'actualPrice' in this.state.service ? (
                <View style={style.contacts}>
                  <TagSvg width={20} height={20} />
                  <Text
                    style={[
                      theme.fontRegular,
                      {
                        marginLeft: 13,
                        fontSize: width / 21,
                        color: AppColors.fontRed,
                      },
                    ]}>
                    QAR
                  </Text>
                  <Text
                    style={[
                      theme.fontRegular,
                      {
                        marginLeft: 5,
                        fontSize: width / 21,
                        color: AppColors.fontRed,
                        textDecorationLine: 'line-through',
                      },
                    ]}>
                    {this.state.service.actualPrice}
                  </Text>
                  <Text
                    style={[
                      theme.fontRegular,
                      {
                        marginLeft: 5,
                        fontSize: width / 21,
                        color: AppColors.fontRed,
                      },
                    ]}>
                    {this.state.service.offerPrice}
                  </Text>
                  <Text
                    style={[
                      theme.fontRegular,
                      {marginLeft: 3, fontSize: width / 21, color: '#5dc25a'},
                    ]}>
                    ({this.state.service.discountValue}%)
                  </Text>
                </View>
              ) : null}
              {'locationDetails' in this.state.service &&
              this.state.service.locationDetails ? (
                <View style={style.contacts}>
                  <LocatioPinSvg width={20} height={20} />
                  <Text style={[theme.fontRegular, {marginLeft: 13}]}>
                    {this.state.service.locationDetails.locationName}
                  </Text>
                </View>
              ) : null}

              {this.state.service?.phoneNumber ? (
                <View style={style.contacts}>
                  <FontAwesomeIcon icon={faWhatsapp} color={'#bd1d53'} />
                  <Text style={[theme.fontRegular, {marginLeft: 13}]}>
                    {this.state.service?.phoneNumber}
                  </Text>
                </View>
              ) : null}
              {this.state.service?.website ? (
                <View style={style.contacts}>
                  <FontAwesomeIcon icon={faGlobe} color={'#bd1d53'} />
                  <Text style={[theme.fontRegular, {marginLeft: 13}]}>
                    {this.state.service?.website}
                  </Text>
                </View>
              ) : null}

              {this.state.service?.email ? (
                <View style={style.contacts}>
                  <FontAwesomeIcon icon={faEnvelope} color={'#bd1d53'} />
                  <Text style={[theme.fontRegular, {marginLeft: 13}]}>
                    {this.state.service?.email}
                  </Text>
                </View>
              ) : null}

              {this.state.service?.shopCount ? (
                <View style={style.contacts}>
                  <Text>
                    <Text style={[theme.fontRegular, {marginLeft: 13}]}>
                      Shops (Number of shops){': '}
                    </Text>
                    <Text style={[theme.fontRegular, {marginLeft: 13}]}>
                      {this.state.service?.shopCount}
                    </Text>
                  </Text>
                </View>
              ) : null}

              {this.state.service?.status ? (
                <View style={style.contacts}>
                  <Text>
                    <Text style={[theme.fontRegular, {marginLeft: 13}]}>
                      Status :{' '}
                    </Text>
                    <Text
                      style={[
                        theme.fontRegular,
                        {marginLeft: 13, color: '#28a745'},
                      ]}>
                      {this.state.service?.status ? 'open' : 'closed'}
                    </Text>
                  </Text>
                </View>
              ) : null}

              {'contactDetails' in this.state.service &&
              this.state.service.contactDetails ? (
                <View style={style.contacts}>
                  <TimeSvg width={20} height={20} />
                  <Text style={[theme.fontRegular, {marginLeft: 14}]}>
                    Contact Time:{' '}
                  </Text>
                  <Text style={[theme.fontRegular, {fontStyle: 'italic'}]}>
                    {this.state.service.contactDetails.contactTimeFrom}
                  </Text>
                  <Text style={[theme.fontRegular]}> to </Text>
                  <Text style={[theme.fontRegular, {fontStyle: 'italic'}]}>
                    {this.state.service.contactDetails.contactTimeTo}
                  </Text>
                </View>
              ) : null}
              {'userDetails' in this.state.service ? (
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
                    {'profilePic' in this.state.service.userDetails ? (
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
                              this.state.service.userDetails.profilePic,
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
                          initialPage: 5,
                          userId: this.state.service?.userDetails?._id,
                        });
                      }}>
                      <Text
                        style={[
                          theme.fontRegular,
                          {paddingHorizontal: 10, marginRight: 15},
                        ]}>
                        {this.state.service.userDetails.name}
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
            </View>
            {'categoryName' in this.state.service &&
            this.state.service.categoryName ? (
              <View style={[style.aboutContent]}>
                <Text style={[theme.fontBold, {fontSize: width / 25}]}>
                  Details of service
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
                        <Text
                          style={[
                            theme.fontMedium,
                            {fontSize: width / 29, color: '#3a3a3a'},
                          ]}>
                          Category Name:{' '}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 2,
                      }}>
                      <View style={style.cell}>
                        <Text
                          style={[
                            theme.fontMedium,
                            {fontSize: width / 29, color: '#696969'},
                          ]}>
                          {this.state.service.categoryName}
                        </Text>
                      </View>
                    </View>
                  </View>
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
                        <Text
                          style={[
                            theme.fontMedium,
                            {fontSize: width / 29, color: '#3a3a3a'},
                          ]}>
                          Sub Category Name:{' '}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 2,
                      }}>
                      <View style={style.cell}>
                        <Text
                          style={[
                            theme.fontMedium,
                            {fontSize: width / 29, color: '#696969'},
                          ]}>
                          {this.state.service.subCategoryName}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ) : null}
            {'description' in this.state.service &&
            this.state.service.description ? (
              <View style={[style.aboutContent]}>
                <Text style={[theme.fontBold, {fontSize: width / 25}]}>
                  About shop
                </Text>
                <Text
                  style={[
                    theme.fontRegular,
                    {fontSize: width / 29, marginTop: 2, color: '#9a9a9a'},
                  ]}>
                  {this.state.service.description}
                </Text>
              </View>
            ) : null}
            {/* {
              'description' in this.state.service && this.state.service.description ?
                <View style={[style.aboutContent]}>
                  <Text style={[theme.fontBold, { fontSize: width / 25 }]}>
                    Description
                  </Text>
                  <Text style={[theme.fontRegular, { fontSize: width / 29, marginTop: 2, color: '#9a9a9a' }]}>
                    {this.state.service.description}
                  </Text>
                </View>
                : null
            } */}
            {'mapDetails' in this.state.service &&
            this.state.service.mapDetails ? (
              <View style={[style.aboutContent]}>
                <Text style={[theme.fontBold, {fontSize: width / 25}]}>
                  Address
                </Text>
                <Text
                  style={[
                    theme.fontRegular,
                    {fontSize: width / 29, marginTop: 2, color: '#9a9a9a'},
                  ]}>
                  {this.state.service.mapDetails.addressString}
                </Text>
              </View>
            ) : null}

            {this.state?.shops ? (
              <View style={[style.aboutContent]}>
                <Text style={[theme.fontBold, {fontSize: width / 25}]}>
                  Shops
                </Text>

                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: height / 50,
                    }}>
                    {this.state?.shops?.length
                      ? this.state?.shops?.map((item, index) =>
                          item ? (
                            <View key={index} style={style.shopCard}>
                              <TouchableOpacity
                                onPress={() => {
                                  this.props.navigation.navigate(
                                    'ShopDetails',
                                    {
                                      id: item._id,
                                      slug: item?.slug,
                                    },
                                  );
                                }}>
                                <Image
                                  source={{
                                    uri:
                                      CONSTANTS.IMAGE_URL_PREFIX +
                                      item?.logoImage,
                                  }}
                                  style={{
                                    height: height / 5,
                                    width: width / 2.3,
                                    borderRadius: 12,
                                    backgroundColor: '#D0D0D0',
                                  }}
                                  resizeMode="cover"
                                />

                                <Text
                                  numberOfLines={1}
                                  style={{
                                    flexWrap: 'wrap',
                                    fontSize: width / 34,
                                    marginTop: width / 80,
                                    // justifyContent: "center",
                                    // alignSelf: "center",
                                    marginStart: width / 28,
                                    color: '#007bff',
                                    fontWeight: 'bold',
                                  }}>
                                  {item.name}
                                </Text>

                                {item?.floorNo ? (
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      marginTop: width / 80,
                                      marginStart: width / 28,
                                    }}>
                                    <Text
                                      numberOfLines={1}
                                      style={{
                                        flexWrap: 'wrap',
                                        fontSize: width / 34,
                                        color: '#007bff',
                                      }}>
                                      {this.getOrdinal(item?.floorNo) +
                                        ' Floor'}
                                    </Text>
                                  </View>
                                ) : null}

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    width: width / 8,
                                    height: width / 18,
                                    backgroundColor: '#28a745',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: width / 80,
                                    marginStart: width / 28,
                                  }}>
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      flexWrap: 'wrap',
                                      fontSize: width / 34,
                                      color: '#ffffff',
                                    }}>
                                    Open
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          ) : null,
                        )
                      : null}
                  </View>
                </ScrollView>
              </View>
            ) : null}

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
            {/* {this.state.auth_user == 'user_exist' ? ( */}
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
              {'contactDetails' in this.state.service ? (
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
                    {/* {this.state.service.userId.name} */}
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
                        {this.state.service.contactDetails.contactName}
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
                                this.state.service.contactDetails.contactNumber,
                            )
                          }
                          title={
                            CONSTANTS.COUNTRY_CODE_TEXT +
                            this.state.service.contactDetails.contactNumber
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
                            {this.state.service.contactDetails.contactNumber}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            Linking.openURL(
                              'whatsapp://send?text=&phone=' +
                                CONSTANTS.COUNTRY_CODE_TEXT +
                                this.state.service.contactDetails.contactNumber,
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
                              this.state.service.contactDetails.contactEmail,
                          )
                        }
                        title={this.state.service.contactDetails.contactEmail}>
                        <Text
                          style={{
                            fontFamily: 'Roboto-Medium',
                            color: '#5f5f5f',
                            marginTop: 2,
                            fontSize: 16,
                          }}
                          selectable>
                          {this.state.service.contactDetails.contactEmail}
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
            {/* ) : (
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
            )} */}
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
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  shopCard: {
    backgroundColor: '#FFFFFF',
    height: height / 3.5,
    width: width / 2.3,
    borderRadius: 12,
    marginEnd: width / 70,
    marginStart: width / 70,
  },
});
