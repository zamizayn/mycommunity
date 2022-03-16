import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
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
} from 'native-base';
var {height, width} = Dimensions.get('window');
import BackBtn_white from '../assets/svg/BackBtn_white.svg';
import Newlabel from '../assets/svg/new_label.svg';
import Timegreen from '../assets/svg/time-green.svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import theme from '../config/styles.js';
import SearchBlackIcon from '../assets/svg/SearchBlackIcon.svg';
import Notification_icon_white from '../assets/svg/Notification_icon_white.svg';

import {AppColors} from '../Themes';
import MapView, {Marker} from 'react-native-maps';
import LocatioPinSvg from '../assets/svg/location-pin.svg';
import styles from '../config/styles.js';

export default class ProductDetail extends Component {
  constructor() {
    super();
    this.state = {
      colorSelected: '',
    };
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
          }}>
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
              Product
            </Title>
          </Body>
          <Right>
            <Button transparent>
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
            </Button>
          </Right>
        </Header>
        <Content>
          <View style={style.bannerWrap}>
            <View style={style.offerPercenWrap}>
              <Text style={[style.offerPercen, theme.fontMedium]}>30%</Text>
              <Text style={style.offerLabel}>off</Text>
            </View>
            {/* <View style={style.shareIcon}>
              <Icon
                name="share"
                style={{color: '#fff', fontSize: width / 15}}
              />
            </View> */}
            <Image
              source={require('../assets/images/bg1.jpeg')}
              style={{
                height: height / 4,
                width: width / 1,
                opacity: 0.5,
                backgroundColor: 'rgba(0.4,0.5,0.5,1.5)',
              }}
            />
            <View style={style.productTitle}>
              <View style={style.newShape}>
                <Newlabel height="25" width="60" />
              </View>
              <View style={{width: width / 1.3}}>
                <Text style={[style.productTitleCaption, theme.fontBold]}>
                  Brandix Manual Five Speed Gearbox Single-Speed Transmission
                  For Next-Gen Battery Electric Vehicles
                </Text>
              </View>
            </View>
          </View>
          <View style={style.thumbgrid}>
            <View style={style.thumbgridsingle}>
              <Image
                style={style.thumbImg}
                resizeMode="cover"
                source={require('../assets/images/Ad1.png')}
              />
            </View>
            <View style={style.thumbgridsingle}>
              <Image
                style={style.thumbImg}
                resizeMode="cover"
                source={require('../assets/images/Ad1.png')}
              />
            </View>
            <View style={style.thumbgridsingle}>
              <Image
                style={style.thumbImg}
                resizeMode="cover"
                source={require('../assets/images/Ad1.png')}
              />
            </View>
            <View style={style.thumbgridsingle}>
              <Image
                style={style.thumbImg}
                resizeMode="cover"
                source={require('../assets/images/Ad1.png')}
              />
            </View>
            <View style={style.thumbgridsingle}>
              <Image
                style={style.thumbImg}
                resizeMode="cover"
                source={require('../assets/images/Ad1.png')}
              />
            </View>
            <View style={style.thumbgridsingle}>
              <View style={style.lastthumbgridsingle}>
                <Text
                  style={[
                    {fontSize: width / 23, color: '#fff'},
                    theme.fontMedium,
                  ]}>
                  2+
                </Text>
              </View>
              <Image
                style={style.thumbImg}
                resizeMode="cover"
                source={require('../assets/images/Ad1.png')}
              />
            </View>
          </View>
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
              QAR 275.00
            </Text>
            <Text
              style={[
                {
                  textDecorationLine: 'line-through',
                  color: AppColors.fontColorGray,
                  fontSize: width / 26,
                },
                theme.fontMedium,
              ]}>
              {' '}
              QAR 275.00
            </Text>
            <View
              style={{
                marginLeft: 'auto',
                backgroundColor: '#B1EBB0',
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderWidth: 1,
                borderColor: '#B2EEB0',
                borderRadius: 10,
              }}>
              <Text
                style={[
                  {color: '#52934D', fontSize: width / 31},
                  theme.fontMedium,
                ]}>
                In Stock(25)
              </Text>
            </View>
          </View>
          <View style={[style.contacts, {alignItems: 'flex-end'}]}>
            <Timegreen height="15" width="15" />
            <Text
              style={[
                theme.fontMedium,
                {
                  marginLeft: 6,
                  marginRight: 6,
                  fontSize: width / 31,
                  color: '#686868',
                },
              ]}>
              Offer valid till 25 May
            </Text>
          </View>
          <View style={[style.contacts, {alignItems: 'flex-end'}]}>
            <Text
              style={[
                theme.fontMedium,
                {
                  marginLeft: 6,
                  marginRight: 6,
                  fontSize: width / 31,
                  color: '#686868',
                },
              ]}>
              10 reed points available
            </Text>
            <AntIcon
              name="exclamationcircleo"
              style={{color: '#AFAFAF', fontSize: width / 29}}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              style={[
                theme.fontBold,
                {
                  width: width / 1.12,
                  borderRadius: 30,
                  marginTop: width / 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#bd1d53',
                  height: width / 8,
                },
              ]}>
              <Text
                style={[
                  theme.fontBold,
                  {
                    color: '#FFFFFF',
                    fontSize: width / 20,
                    fontWeight: 'bold',
                  },
                ]}>
                Add to Cart
              </Text>
            </TouchableOpacity>
          </View>
          <View style={style.descrp}>
            <View>
              <Text
                style={[
                  theme.fontBold,
                  {fontSize: width / 22, marginBottom: height / 110},
                ]}>
                Brandix Manual Fice Speed Gearbox
              </Text>
              <Text style={[{fontSize: width / 32}]}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s,
              </Text>
            </View>
            <View style={{marginTop: height / 50}}>
              <Text style={[theme.fontBold, {fontSize: width / 27}]}>
                Key Features
              </Text>
              <View>
                <View style={{flexDirection: 'row', marginTop: height / 90}}>
                  <Text>{'\u2022'}</Text>
                  <Text
                    style={{
                      flex: 1,
                      paddingLeft: 5,
                      fontSize: width / 31,
                    }}>
                    Speed 750 RPM
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: height / 190}}>
                  <Text>{'\u2022'}</Text>
                  <Text
                    style={{
                      flex: 1,
                      paddingLeft: 5,
                      fontSize: width / 31,
                    }}>
                    Power Souce Cordless-Electric
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: height / 190}}>
                  <Text>{'\u2022'}</Text>
                  <Text
                    style={{
                      flex: 1,
                      paddingLeft: 5,
                      fontSize: width / 31,
                    }}>
                    Battery Cell Type : Lithium
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: height / 190}}>
                  <Text>{'\u2022'}</Text>
                  <Text
                    style={{
                      flex: 1,
                      paddingLeft: 5,
                      fontSize: width / 31,
                    }}>
                    Voltage : 20 Volts
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: height / 190}}>
                  <Text>{'\u2022'}</Text>
                  <Text
                    style={{
                      flex: 1,
                      paddingLeft: 5,
                      fontSize: width / 31,
                    }}>
                    Battery Capaciy : 2 Ah
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 24,
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
                        SKU
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 2,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontRegular, {fontSize: width / 29}]}>
                        140-234-234-B
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
                        Brand
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontRegular, {fontSize: width / 29}]}>
                        Brandix
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View
              style={{
                marginTop: height / 40,
                borderBottomWidth: 1,
                borderBottomColor: '#f0f0f0',
                paddingBottom: height / 30,
              }}>
              <Text style={[theme.fontBold, {fontSize: width / 27}]}>Size</Text>
              <View style={{flexDirection: 'row', marginTop: height / 60}}>
                <View
                  style={{
                    backgroundColor: '#eee',
                    paddingVertical: 6,

                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: '#E4E4E4',
                    width: 50,
                    justifyContent: 'center',
                    marginRight: width / 30,
                  }}>
                  <Text
                    style={[
                      theme.fontBold,
                      {fontSize: width / 21, color: '#000'},
                    ]}>
                    S
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#eee',
                    paddingVertical: 6,

                    alignItems: 'center',
                    borderWidth: 2,
                    width: 50,
                    borderColor: '#E4E4E4',
                    justifyContent: 'center',
                    marginRight: width / 30,
                  }}>
                  <Text
                    style={[
                      theme.fontBold,
                      {fontSize: width / 21, color: '#000'},
                    ]}>
                    M
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#eee',
                    paddingVertical: 6,

                    alignItems: 'center',
                    borderWidth: 2,
                    width: 50,
                    borderColor: '#E4E4E4',
                    justifyContent: 'center',
                    marginRight: width / 30,
                  }}>
                  <Text
                    style={[
                      theme.fontBold,
                      {fontSize: width / 21, color: '#000'},
                    ]}>
                    L
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#eee',
                    paddingVertical: 6,

                    alignItems: 'center',
                    borderWidth: 2,
                    width: 50,
                    borderColor: '#E4E4E4',
                    justifyContent: 'center',
                    marginRight: width / 30,
                  }}>
                  <Text
                    style={[
                      theme.fontBold,
                      {fontSize: width / 21, color: '#000'},
                    ]}>
                    XL
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: height / 40,
                borderBottomWidth: 1,
                borderBottomColor: '#f0f0f0',
                paddingBottom: height / 20,
              }}>
              <Text style={[theme.fontBold, {fontSize: width / 27}]}>
                Color
              </Text>
              <View style={{flexDirection: 'row', marginTop: height / 60}}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({colorSelected: 'white'});
                  }}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#CECECE',
                      backgroundColor: '#fff',
                      width: 38,
                      height: 38,
                      marginRight: width / 17,
                      borderRadius: 38 / 2,
                    }}>
                    {this.state.colorSelected == 'white' ? (
                      <View
                        style={{
                          position: 'absolute',
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          left: 0,
                          right: 0,
                          top: height / 120,
                        }}>
                        <FeatherIcon
                          style={{color: '#C1801C', fontSize: width / 16}}
                          name="check"
                        />
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({colorSelected: 'yellow'});
                  }}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#CECECE',
                      backgroundColor: '#FDD830',
                      width: 38,
                      height: 38,
                      marginRight: width / 17,
                      borderRadius: 38 / 2,
                    }}>
                    {this.state.colorSelected == 'yellow' ? (
                      <View
                        style={{
                          position: 'absolute',
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          left: 0,
                          right: 0,
                          top: height / 120,
                        }}>
                        <FeatherIcon
                          style={{color: '#C1801C', fontSize: width / 16}}
                          name="check"
                        />
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({colorSelected: 'red'});
                  }}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#CECECE',
                      backgroundColor: '#E43236',
                      width: 38,
                      height: 38,
                      marginRight: width / 17,
                      borderRadius: 38 / 2,
                    }}>
                    {this.state.colorSelected == 'red' ? (
                      <View
                        style={{
                          position: 'absolute',
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          left: 0,
                          right: 0,
                          top: height / 120,
                        }}>
                        <FeatherIcon
                          style={{color: '#C1801C', fontSize: width / 16}}
                          name="check"
                        />
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({colorSelected: 'blue'});
                  }}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#CECECE',
                      backgroundColor: '#2885EC',
                      width: 38,
                      height: 38,
                      marginRight: width / 17,
                      borderRadius: 38 / 2,
                    }}>
                    {this.state.colorSelected == 'blue' ? (
                      <View
                        style={{
                          position: 'absolute',
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          left: 0,
                          right: 0,
                          top: height / 120,
                        }}>
                        <FeatherIcon
                          style={{color: '#C1801C', fontSize: width / 16}}
                          name="check"
                        />
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[style.aboutContent, {marginTop: height / 40}]}>
              <Text style={[theme.fontBold, {fontSize: width / 25}]}>
                Description
              </Text>
              <Text
                style={[
                  theme.fontRegular,
                  {fontSize: width / 29, marginTop: 2, color: '#000'},
                ]}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book
              </Text>
            </View>
            <View style={[style.aboutContent, {marginTop: height / 40}]}>
              <Text style={[theme.fontBold, {fontSize: width / 25}]}>
                Specifications
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
                        Speed
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 2,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontRegular, {fontSize: width / 29}]}>
                        750 RPM
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
                        Power Source
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontRegular, {fontSize: width / 29}]}>
                        Cordless-Electric
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
                        Voltage
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontRegular, {fontSize: width / 29}]}>
                        20 Volts
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
                        Battery Capaciy
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontRegular, {fontSize: width / 29}]}>
                        2 Ah
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
                        Material
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontRegular, {fontSize: width / 29}]}>
                        Aluminium, Plastic
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
                        Power
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontRegular, {fontSize: width / 29}]}>
                        Electric
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={[style.aboutContent, {marginTop: height / 35}]}>
              <Text style={[theme.fontBold, {fontSize: width / 25}]}>
                Sold By
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height / 40,
                  borderWidth: 1,
                  borderColor: '#f3e1e7',
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
                    paddingLeft: 30,
                    maxWidth: width / 1.7,
                  }}>
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: 'red',
                      borderRadius: 50,
                      borderColor: '#bd1d53',
                    }}>
                    <Thumbnail
                      source={require('../assets/images/userpic.png')}
                      style={{
                        width: 52,
                        height: 52,
                      }}
                    />
                  </View>

                  <Text
                    style={[
                      theme.fontBold,
                      {paddingHorizontal: 10, marginRight: 15},
                    ]}>
                    Rocket Power Limited.
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
                    activeOpacity={0.8}>
                    <Text style={[theme.fontRegular, {color: '#fff'}]}>
                      Contact
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View>
              <View
                style={[
                  style.aboutContent,
                  {marginTop: height / 40, paddingBottom: height / 20},
                ]}>
                <View>
                  <Text
                    style={[
                      theme.fontBold,
                      {fontSize: width / 25, marginBottom: 10},
                    ]}>
                    Location Map
                  </Text>
                  <MapView
                    initialRegion={{
                      latitude: 37.78825,
                      longitude: -122.4324,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                    minHeight={100}>
                    <Marker
                      coordinate={{latitude: 37.78825, longitude: -122.4324}}
                    />
                  </MapView>

                  <View style={{marginTop: height / 40}}>
                    <Text
                      style={[
                        theme.fontBold,
                        {fontSize: width / 27, color: '#2885EC'},
                      ]}>
                      Terms & Conditions
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const style = StyleSheet.create({
  offerPercenWrap: {
    position: 'absolute',
    top: height / 66,
    width: 45,
    height: 45,
    left: width / 30,
    backgroundColor: '#ED1319',
    borderRadius: 45 / 2,
    zIndex: 1,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerPercen: {
    textAlign: 'center',
    fontSize: width / 24,
    color: '#fff',
  },
  offerLabel: {
    textAlign: 'center',
    fontSize: width / 31,
    color: '#fff',
  },
  shareIcon: {
    position: 'absolute',
    right: width / 18,
    top: height / 31,
    zIndex: 1,
  },
  productTitle: {
    position: 'absolute',
    bottom: height / 54,
    left: width / 30,
  },
  productTitleCaption: {
    fontSize: width / 26,
    color: '#fff',
  },
  thumbgrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: height / 66,

    marginLeft: 'auto',
    marginRight: 'auto',
    width: width / 1.1,
    alignItems: 'stretch',
  },
  thumbgridsingle: {},
  thumbImg: {
    width: width / 3.5,
    height: height / 11,
    margin: 3,
    marginBottom: 10,
  },
  lastthumbgridsingle: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.4)',
    zIndex: 1,
    width: width / 3.5,
    justifyContent: 'center',
    alignItems: 'center',
    height: height / 11,
    margin: 3,
    marginBottom: 10,
  },
  contacts: {
    flexDirection: 'row',
    // paddingLeft: width / 0,
    // paddingRight: width / 40,
    marginTop: height / 70,
    marginLeft: width / 25,
    marginRight: width / 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0eced',
    alignItems: 'center',
  },
  descrp: {
    marginLeft: width / 25,
    marginTop: height / 70,
    marginRight: width / 25,
  },
  cell: {
    paddingVertical: 10,
    paddingStart: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
