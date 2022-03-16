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
  Icon,
} from 'native-base';
var {height, width} = Dimensions.get('window');
import BackBtn_white from './assets/svg/BackBtn_white.svg';
import theme from './config/styles.js';
import SearchBlackIcon from './assets/svg/SearchBlackIcon.svg';
import Notification_icon_white from './assets/svg/Notification_icon_white.svg';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import LocatioPinSvg from './assets/svg/location-pin.svg';
import MapView, {Marker} from 'react-native-maps';

import moment from 'moment';
import {AppColors} from './Themes';

export default class JobDetail extends Component {
  constructor() {
    super();
    this.state = {
      activeSlide: 0,
      vehicle: {},
      carouselItems: [
        {
          url: './assets/images/banner/banner1.jpg',
        },

        {
          url: './assets/images/banner/banner2.jpg',
        },
      ],
    };
  }
  _renderItem({item, index}) {
    return (
      <View style={style.cardWrapparent}>
        <Card style={style.cardWrap}>
          <CardItem cardBody style={style.cardBorder}>
            <Image
              source={require('./assets/images/banner/banner1.jpg')}
              style={style.cardImage}
              resizeMode="cover"
            />
          </CardItem>
        </Card>
      </View>
    );
  }
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
              Vehicles
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
        <View
          style={{
            flex: 1,
          }}>
          <ScrollView
            style={{
              flex: 1,
            }}>
            <Carousel
              layout={'default'}
              ref={ref => (this.carousel = ref)}
              data={this.state.carouselItems}
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
              renderItem={this._renderItem}
              onSnapToItem={index => this.setState({activeIndex: index})}
            />
            {this.pagination}
            <Text style={style.paginationCount}>
              {this.state.activeSlide + 1}/{3}
            </Text>
            <View style={[style.businessInfoContent]}>
              <Text style={[theme.fontBold, {fontSize: width / 23}]}>
                Node.js Senior Developer
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
                18 April
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
                  100986
                </Text>
              </Text>
            </View>
            <View style={[style.businessContactContent]}>
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
                  QAR 1500000.00
                </Text>
                <Text>Annual Salary</Text>
              </View>

              <View style={style.contacts}>
                <LocatioPinSvg width={20} height={20} />
                <Text style={[theme.fontRegular, {marginLeft: 13}]}>
                  Street No.1345, Round Port, Doha, Qatar
                </Text>
              </View>

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

                  <Text
                    style={[
                      theme.fontRegular,
                      {paddingHorizontal: 10, marginRight: 15},
                    ]}>
                    Star Consultant Ltd
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
              <View
                style={{paddingTop: height / 90, paddingBottom: height / 50}}>
                <Button
                  block
                  rounded
                  style={{backgroundColor: '#1973EA', elevation: 0}}>
                  <Text style={{color: 'white'}}>Apply Now</Text>
                </Button>
              </View>
            </View>
            <View style={[style.aboutContent]}>
              <Text style={[theme.fontBold, {fontSize: width / 25}]}>
                Job Description
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
              <View style={{flexDirection: 'row', marginTop: height / 90}}>
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
              </View>
              <View style={{marginTop: height / 70}}>
                <Text
                  style={[
                    theme.fontMedium,
                    {fontSize: width / 30, color: '#1274E3'},
                  ]}>
                  READ MORE...
                </Text>
              </View>
            </View>
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
                        IT/Technology
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
                        Software Development
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
                        Senior Developer
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
                        3 Years
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
                        B-Tech Computer Science or Information Technology
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
                      <Text>(Annually)</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View style={style.cell}>
                      <Text style={[theme.fontRegular, {fontSize: width / 29}]}>
                        QAR 1500000.00
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
                        Full Time
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{paddingTop: height / 30, paddingBottom: height / 50}}>
                <Button
                  block
                  rounded
                  style={{backgroundColor: '#1973EA', elevation: 0}}>
                  <Text style={{color: 'white'}}>Apply Now</Text>
                </Button>
              </View>
            </View>
            <View style={[style.aboutContent]}>
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
                  minHeight={200}>
                  <Marker
                    coordinate={{latitude: 37.78825, longitude: -122.4324}}
                  />
                </MapView>
              </View>
            </View>
          </ScrollView>
        </View>
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
