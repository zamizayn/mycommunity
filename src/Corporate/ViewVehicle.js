import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
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
var { height, width } = Dimensions.get('window');
import BackBtn_white from '../assets/svg/BackBtn_white.svg';
import theme from '../config/styles.js';
import SearchBlackIcon from '../assets/svg/SearchBlackIcon.svg';
import Notification_icon_white from '../assets/svg/Notification_icon_white.svg';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import PhoneSvg from '../assets/svg/phone.svg';
import TagSvg from '../assets/svg/Price_tag.svg';
import EmailSvg from '../assets/svg/Email_icon.svg';
import LocatioPinSvg from '../assets/svg/location-pin.svg';
import TimeSvg from '../assets/images/time.svg';
import MapView, { Marker } from 'react-native-maps';
import { API } from '../config/api';
import { ApiHelper } from '../helpers/ApiHelper';
import Loader from '../components/Loader';
import { CONSTANTS } from '../config/constants';
import moment from 'moment';
import { AppColors } from '../Themes';
export default class Viewvehicle extends Component {
  furnitureStatuses = [{
    label: 'Furnished',
    value: 1
  }, {
    label: 'Semifurnished',
    value: 2
  }, {
    label: 'Unfurnished',
    value: 3
  }]
  constructor() {
    super();
    this.state = {
      checked: false,
      activeSlide: 0,
      entries: [
        { title: require('../assets/images/banner/banner1.jpg') },
        { title: require('../assets/images/banner/banner2.jpg') },
        { title: require('../assets/images/banner/banner3.jpg') },
      ],
      region: {
      },
      businessRegion: {

      },
      vehicle: {

      },
      loader: false,
      tabIndex: 0,
      vehicleCategories: [],
      categoryType: ''
    }
  }

  componentDidMount() {
    const id = this.props.route.params.id;
    this.getVehicle(id);
    // this.fetchCategoryList();
  }

  // async fetchCategoryList() {
  //   await ApiHelper.get(API.vehicleCategory).then(res => {
  //     this.arrayholder = res.data.data;
  //     this.setState({
  //       vehicleCategories: this.arrayholder.map(c => ({ label: c.name, value: c.code }))
  //     }, () => {
  //       this.getCategory();
  //     });
  //   });
  // }

  // async getCategory() {
  //   if ('category' in this.state.vehicle) {
  //     if (this.state.vehicleCategories.length) {
  //       const category = this.state.vehicleCategories.filter(it => it.value == this.state.vehicle.category);
  //       if (category.length) {
  //         this.setState({
  //           categoryType: category[0].label
  //         })
  //       }
  //     }
  //   }
  // }

  async getVehicle(id) {
    this.setState({
      loader: true,
    });
    await ApiHelper.get(API.vehicles + '/' + id )
      .then(res => {
        var data = res.data.data;  
        console.log("Vehcle", data)      ;
        let deltaObj = {};
        if ('lat' in data.mapDetails && data.mapDetails.lat) {
          deltaObj = this.deltaFrom(data.mapDetails.lat, data.mapDetails.lng, 1000);
        }
        this.setState(
          {
            vehicle: data,
            region: {
              latitude: data.mapDetails.lat,
              longitude: data.mapDetails.lng,
              latitudeDelta: 'latitudeDelta' in deltaObj ? deltaObj.latitudeDelta : 5,
              longitudeDelta: 'longitudeDelta' in deltaObj ? deltaObj.longitudeDelta : 0.03,
            },
            businessRegion: {
              latitude: data.mapDetails.lat,
              longitude: data.mapDetails.lng,
            },
            loader: false,
          }
        , () => {
          // this.getCategory();
        });
      })
      .catch(err => {
        this.setState({
          loader: false,
        });
        console.log(err);
      });
  }

  deltaFrom(lat, lon, distance) {
    distance = distance / 2
    const circumference = 40075
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000
    const angularDistance = distance / circumference

    const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
    const longitudeDelta = Math.abs(Math.atan2(
      Math.sin(angularDistance) * Math.cos(lat),
      Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)))

    return {
      latitudeDelta,
      longitudeDelta,
    }
  }

  getFurniture(value) {
    const furniture = this.furnitureStatuses.filter(it => it.value == value);
    if (furniture.length) {
      return furniture[0].label;
    }
    return "";
  }

  _renderItem = ({ item, index }) => {
    return (
      <View style={style.cardWrapparent}>
        <Card style={style.cardWrap}>
          <CardItem cardBody style={style.cardBorder}>
            <Image source={{ uri: CONSTANTS.MEDIUM_IMG + item.url }} style={style.cardImage} resizeMode="cover" />
          </CardItem>
        </Card>
      </View>
    );
  };

  get pagination() {
    const { entries, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={entries.length}
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
          backgroundColor: 'rgba(255, 255, 255, 0.92)'
        }}
        inactiveDotStyle={{
          // Define styles for inactive dots here
        }}
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
                  backgroundColor: AppColors.primaryColor,
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
          <Body style={{ paddingStart: 0 }}>
            <Title
              style={{
                color: 'white',
                paddingStart: 0,
                fontSize: width / 22,
              }}>
              Vehicle
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
        <View style={{
          flex: 1,
        }}>
          <ScrollView style={{
            flex: 1,
          }}>
            {
              "imageFiles" in this.state.vehicle && this.state.vehicle.imageFiles.length ?
                <>
                  <Carousel
                    layout={'default'}
                    ref={c => {
                      this._carousel = c;
                    }}
                    data={this.state.vehicle.imageFiles}
                    renderItem={this._renderItem}
                    sliderWidth={width}
                    itemWidth={width}
                    hasParallaxImages={true}
                    inactiveSlideScale={1}
                    inactiveSlideOpacity={0.7}
                    loop={true}
                    loopClonesPerSide={2}
                    autoplay={true}
                    autoplayDelay={500}
                    autoplayInterval={2000}
                    firstItem={1}
                    scrollEnabled={false}
                    onSnapToItem={(index) => this.setState({ activeSlide: index })}
                  />
                  {this.pagination}
                  <Text style={style.paginationCount}>{this.state.activeSlide + 1}/{this.state.entries.length}</Text>
                </>
                : null
            }
            <View style={[style.businessInfoContent]}>
              <Text style={[theme.fontBold, { fontSize: width / 23 }]}>
                {this.state.vehicle.name}
              </Text>
              <Text style={[theme.fontRegular, { fontSize: width / 35, color: '#979797', marginTop: 0, marginBottom: 15 }]}>
                {
                  moment(this.state.vehicle.createdAt).format('LL')
                }
              </Text>
              <Text style={[{ color: AppColors.fontRed, fontSize: width / 30, marginBottom: 15 }]}>
                ID <Text style={[{ fontSize: width / 30, color: '#000' }]}>{this.state.vehicle.vehicleId}</Text>
              </Text>
            </View>
            <View style={[style.businessContactContent]}>
              {
                'price' in this.state.vehicle ?
                  <View style={style.contacts}>
                    <TagSvg width={20} height={20} />
                    <Text style={[theme.fontRegular, { marginLeft: 13, fontSize: width / 21, color: AppColors.fontRed }]}>QAR {this.state.vehicle.price}</Text>
                  </View>
                  : null
              }
              {
                'mapDetails' in this.state.vehicle && this.state.vehicle.mapDetails ?
                  <View style={style.contacts}>
                    <LocatioPinSvg width={20} height={20} />
                    <Text style={[theme.fontRegular, { marginLeft: 13 }]}>{this.state.vehicle.mapDetails.addressString}</Text>
                  </View>
                  : null
              }
              {
                'contactDetails' in this.state.vehicle && this.state.vehicle.contactDetails ?
                  <View style={[style.contacts, { borderBottomWidth: 0 }]}>
                    <TimeSvg width={20} height={20} />
                    <Text style={[theme.fontRegular, { marginLeft: 14 }]}>Contact Time: </Text>
                    <Text style={[theme.fontRegular, { fontStyle: 'italic' }]}>{this.state.vehicle.contactDetails.contactTimeFrom}</Text>
                    <Text style={[theme.fontRegular]}> to </Text>
                    <Text style={[theme.fontRegular, { fontStyle: 'italic' }]}>{this.state.vehicle.contactDetails.contactTimeTo}</Text>
                  </View>
                  : null
              }
              {/* {
                'userDetails' in this.state.vehicle ?
                  <View style={{
                    flexDirection: 'row',
                    margin: 10,
                    borderWidth: 1,
                    borderColor: '#f3e1e7',
                    marginHorizontal: - width / 80,
                    marginBottom: 25
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRightWidth: 1,
                      paddingVertical: 6,
                      backgroundColor: '#fdf4f8',
                      borderColor: '#f3e1e7',
                      paddingHorizontal: 10,
                      maxWidth: width / 1.7
                    }}>
                      {
                        'profilePic' in this.state.vehicle.userDetails ?
                          <View style={{
                            borderWidth: 2,
                            borderColor: 'red',
                            borderRadius: 50,
                            borderColor: '#bd1d53',
                          }}>
                            <Thumbnail source={{ uri: CONSTANTS.SMALL_IMG + this.state.vehicle.userDetails.profilePic }} style={{
                              width: 52,
                              height: 52
                            }} />
                          </View>
                          : <View style={{
                            borderWidth: 2,
                            borderColor: 'red',
                            borderRadius: 50,
                            borderColor: '#bd1d53',
                          }}>
                            <Thumbnail source={require('../assets/images/userpic.png')} style={{
                              width: 52,
                              height: 52
                            }} />
                          </View>
                      }
                      <Text style={[theme.fontRegular, { paddingHorizontal: 10, marginRight: 15 }]}>{this.state.vehicle.userDetails.name}</Text>
                    </View>
                    <View style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1
                    }}>
                      <TouchableOpacity style={{
                        backgroundColor: '#bd1d53',
                        paddingVertical: 4,
                        paddingHorizontal: 13,
                        borderRadius: 14
                      }}
                        activeOpacity={0.8}>
                        <Text style={[theme.fontRegular, { color: '#fff' }]}>Contact</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  : null
              } */}
            </View>
            <View style={[style.aboutContent]}>
              <Text style={[theme.fontBold, { fontSize: width / 25 }]}>
                Key Specification
              </Text>
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
                borderWidth: 1,
                borderBottomWidth: 0,
                borderColor: '#f0f0f0',
              }}>
                <View style={{
                  // width: width / 1.2,
                  flexDirection: 'row',
                  borderBottomColor: '#f0f0f0',
                  borderBottomWidth: 1,
                }}>
                  <View style={{
                    flex: 2
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29, color:'#3a3a3a' }]}>Category: </Text>
                    </View>
                  </View>
                  <View style={{
                    flex: 2,
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, theme.fontMedium, { fontSize: width / 29,color: '#696969' }]}>{this.state.vehicle.categoryName}</Text>
                    </View>
                  </View>
                </View>
                <View style={{
                  flexDirection: 'row',
                  borderBottomColor: '#f0f0f0',
                  borderBottomWidth: 1,
                  flex: 1
                }}>
                  <View style={{
                    flex: 1
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29, color:'#3a3a3a' }]}>Model:</Text>
                    </View>
                  </View>
                  <View style={{
                    flex: 1,
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29,color: '#696969' }]}>{this.state.vehicle.modelName}</Text>
                    </View>
                  </View>
                </View>
                <View style={{
                  flexDirection: 'row',
                  borderBottomColor: '#f0f0f0',
                  borderBottomWidth: 1,
                  flex: 1
                }}>
                  <View style={{
                    flex: 1
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29, color:'#3a3a3a' }]}>Trim:</Text>
                    </View>
                  </View>
                  <View style={{
                    flex: 1,
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29,color: '#696969' }]}>{this.state.vehicle.trimName}</Text>
                    </View>
                  </View>
                </View>
                <View style={{
                  flexDirection: 'row',
                  borderBottomColor: '#f0f0f0',
                  borderBottomWidth: 1,
                  flex: 1
                }}>
                  <View style={{
                    flex: 1
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29, color:'#3a3a3a' }]}>Year:</Text>
                    </View>
                  </View>
                  <View style={{
                    flex: 1,
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29,color: '#696969' }]}>{this.state.vehicle.year}</Text>
                    </View>
                  </View>
                </View>
                <View style={{
                  flexDirection: 'row',
                  borderBottomColor: '#f0f0f0',
                  borderBottomWidth: 1,
                  flex: 1
                }}>
                  <View style={{
                    flex: 1
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29, color:'#3a3a3a' }]}>Milege:</Text>
                    </View>
                  </View>
                  <View style={{
                    flex: 1,
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29,color: '#696969' }]}>{this.state.vehicle.mileage}</Text>
                    </View>
                  </View>
                </View>
                <View style={{
                  flexDirection: 'row',
                  borderBottomColor: '#f0f0f0',
                  borderBottomWidth: 1,
                  flex: 1
                }}>
                  <View style={{
                    flex: 1
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29, color:'#3a3a3a' }]}>Transmission:</Text>
                    </View>
                  </View>
                  <View style={{
                    flex: 1,
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29,color: '#696969' }]}>{this.state.vehicle.transmissionName}</Text>
                    </View>
                  </View>
                </View>
                <View style={{
                  flexDirection: 'row',
                  borderBottomColor: '#f0f0f0',
                  borderBottomWidth: 1,
                  flex: 1
                }}>
                  <View style={{
                    flex: 1
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29, color:'#3a3a3a' }]}>Colour:</Text>
                    </View>
                  </View>
                  <View style={{
                    flex: 1,
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29,color: '#696969' }]}>{this.state.vehicle.colorName}</Text>
                    </View>
                  </View>
                </View>
                <View style={{
                  flexDirection: 'row',
                  borderBottomColor: '#f0f0f0',
                  borderBottomWidth: 1,
                  flex: 1
                }}>
                  <View style={{
                    flex: 1
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29, color:'#3a3a3a' }]}>Fuel Type:</Text>
                    </View>
                  </View>
                  <View style={{
                    flex: 1,
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29,color: '#696969' }]}>{this.state.vehicle.fuelTypeName}</Text>
                    </View>
                  </View>
                </View>
                <View style={{
                  flexDirection: 'row',
                  borderBottomColor: '#f0f0f0',
                  borderBottomWidth: 1,
                  flex: 1
                }}>
                  <View style={{
                    flex: 1
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29, color:'#3a3a3a' }]}>Service History:</Text>
                    </View>
                  </View>
                  <View style={{
                    flex: 1,
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29 ,color: '#696969'}]}>{this.state.vehicle.serviceHistory == '1' ? 'Available' : 'Not Avaialable'}</Text>
                    </View>
                  </View>
                </View>
                <View style={{
                  flexDirection: 'row',
                  borderBottomColor: '#f0f0f0',
                  borderBottomWidth: 1,
                  flex: 1
                }}>
                  <View style={{
                    flex: 1
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29, color:'#3a3a3a' }]}>Condition:</Text>
                    </View>
                  </View>
                  <View style={{
                    flex: 1,
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29,color: '#696969' }]}>{this.state.vehicle.condition}</Text>
                    </View>
                  </View>
                </View>
                <View style={{
                  flexDirection: 'row',
                  borderBottomColor: '#f0f0f0',
                  borderBottomWidth: 1,
                  flex: 1
                }}>
                  <View style={{
                    flex: 1
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29, color:'#3a3a3a' }]}>No. of Doors:</Text>
                    </View>
                  </View>
                  <View style={{
                    flex: 1,
                  }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontMedium, { fontSize: width / 29,color: '#696969' }]}>{this.state.vehicle.noOfDoors}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {
              'description' in this.state.vehicle && this.state.vehicle.description ?
                <View style={[style.aboutContent]}>
                  <Text style={[theme.fontBold, { fontSize: width / 25 }]}>
                    Description
                  </Text>
                  <Text style={[theme.fontRegular, { fontSize: width / 29, marginTop: 2, color: '#9a9a9a' }]}>
                    {this.state.vehicle.description}
                  </Text>
                </View>
                : null
            }
            {
              'latitude' in this.state.region ?
                <View style={[style.aboutContent]}>
                  <View>
                    <Text style={[theme.fontBold, { fontSize: width / 25, marginBottom: 10 }]}>
                      Location Map
                    </Text>
                    <MapView initialRegion={this.state.region} minHeight={200}>
                      <Marker
                        coordinate={this.state.businessRegion}
                      />
                    </MapView>
                  </View>
                </View>
                : null
            }
          </ScrollView>
        </View>
        <Loader visibility={this.state.loader} />
      </Container>
    );
  }
}

const style = StyleSheet.create({
  cardWrapparent: {
  },
  cardImage: {
    height: 270,
    overflow: 'hidden',
    resizeMode: 'cover',
    width: width,
  },
  cardWrap: {
    width: width,
  },
  cardBorder: {
  },
  businessInfoContent: {
    marginTop: 14,
    paddingHorizontal: width / 20,
    borderBottomWidth: 5,
    borderBottomColor: '#f0eced'
  },
  businessContactContent: {
    paddingHorizontal: width / 20,
    borderBottomWidth: 5,
    borderBottomColor: '#f0eced'
  },
  paginationCount: {
    color: '#fff',
    position: 'absolute',
    top: 233,
    right: 10,
    alignSelf: 'flex-end'
  },
  contacts: {
    flexDirection: 'row',
    paddingLeft: width / 40,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0eced',
    alignItems: 'center'
  },
  aboutContent: {
    paddingHorizontal: width / 20,
    paddingVertical: 15,
    borderBottomWidth: 5,
    borderBottomColor: '#f0eced'
  },
  workingContent: {
    paddingHorizontal: width / 20,
    paddingVertical: 15
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center'
  }
})
