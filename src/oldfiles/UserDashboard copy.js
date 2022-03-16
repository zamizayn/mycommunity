import {Content, Container, Card, CardItem} from 'native-base';
import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Mall_Icon from './assets/svg/Mall_Icon.svg';
import Job_Icon from './assets/svg/Job_Icon.svg';
import Properties_icon from './assets/svg/Properties_icon.svg';
import Vehicle_icon from './assets/svg/Vehicle_icon.svg';
import RightArrow from './assets/svg/RightArrow.svg';
import ProfilePic from './assets/svg/ProfilePic.svg';
import SearchBlackIcon from './assets/svg/SearchBlackIcon.svg';
import MenuIcon from './assets/svg/MenuIcon.svg';
import BestDealIcon from './assets/svg/BestDealIcon.svg';
import Services_icon from './assets/svg/Services_icon.svg';
import Shops_icon from './assets/svg/Shops_icon';
import Directory_icon from './assets/svg/Directory_icon.svg';
import News_icon from './assets/svg/News_icon.svg';
import Loader from '../components/Loader';
import {ApiHelper} from '../helpers/ApiHelper';
import {API} from '../config/api';
import moment from 'moment';
import {CONSTANTS} from '../config/constants';
import SeeMore from 'react-native-see-more-inline';
var {height, width} = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * width) / 100;
  return Math.round(value);
}

const slideHeight = height * 0.2;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = width;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;
const entryBorderRadius = 8;
const SLIDER_1_FIRST_ITEM = 1;

export default class UserDasboard extends Component {
  constructor() {
    super();
    this.state = {
      loader: false,
      newsArr1: {},
      newsArr2: {},
      feedArr: [],
      productArr: [],
      userRole:'',
      userdata:{}
    };
    this._renderItem = this._renderItem.bind(this);
  }
  componentDidMount() {
    this.state.userRole = this.props.route.params.userRole; 
    this.state.UserData =this.props.route.params.userData; 
    console.log("userRole >>", this.state.userRole)
    console.log("userdata >>", this.state.UserData)
    this.setState({loader: true});
    this.getLatestFeeds();
    this.fetchProductList();
    setTimeout(() => this.setState({loader: false}), 1000);
  }

  _renderItem = ({item, index}) => {
    return (
      <View style={style.cardWrapparent}>
        <Card style={style.cardWrap}>
          <CardItem cardBody style={style.cardBorder}>
            <Image source={item.title} style={style.cardImage} />
          </CardItem>
        </Card>
      </View>
    );
  };
  _handleTextReady = () => {
    // ...
  };

  async getLatestFeeds() {
    await ApiHelper.get(API.userFeeds)
      .then(res => {
        var dataLen = res.data.data;
        var arr = [];
        for (let i = 0; i < 2; i++) {
          let row = dataLen[i];
          arr.push(row);
        }
        this.setState(
          {
            feedArr: arr,
            loader: false,
          },
          () => {
            console.log('feed arr', this.state.feedArr);
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

  async fetchProductList() {
    await ApiHelper.get(API.productList)
      .then(res => {
        var dataLen = res.data.data;
        var arrPdt = [];
        for (let i = 0; i < 2; i++) {
          let row = dataLen[i];
          arrPdt.push(row);
        }

        console.log('res prdct', res);
        // console.log('res>0', res.data.data[0]);
        // console.log('o user', res.data.data[0].userDetails.username)
        this.setState(
          {
            productArr: arrPdt,
            loader: false,
          },
          () => {
            console.log('feed arr', this.state.productArr);
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

  render() {
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
              //this.props.navigation.goBack(null);
            }}>
            <MenuIcon height="22" width="22" />
          </TouchableOpacity>

          <View
            style={{
              position: 'absolute',
              right: width / 22,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <SearchBlackIcon height="30" width="30" />
          </View>
        </View>
        <Loader visibility={this.state.loader} />

        {this.state.loader == false ? (
          <Content
          showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              backgroundColor: '#f1f1f1',
              paddingBottom: height / 60,
            }}>
            <Carousel
              layout={'default'}
              ref={c => {
                this._carousel = c;
              }}
              data={[
                {title: require('../src/assets/images/Ad2.jpeg')},
                {title: require('../src/assets/images/cover1.png')},
                {title: require('../src/assets/images/homeAd.png')},
              ]}
              renderItem={this._renderItem}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
              hasParallaxImages={true}
              inactiveSlideScale={1}
              inactiveSlideOpacity={0.7}
              loop={true}
              loopClonesPerSide={2}
              autoplay={true}
              autoplayDelay={500}
              autoplayInterval={2000}
              firstItem={SLIDER_1_FIRST_ITEM}
            />

            <View style={{marginStart: width / 22, marginEnd: width / 22}}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{
                  marginTop: height / 30,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    //justifyContent: 'space-between',
                  }}>
                  <View style={style.viewRoundContainer}>
                    <View style={style.viewRound}>
                      <BestDealIcon height="40" width="40" />
                    </View>
                    <Text style={style.viewRoundText}>Best Deals</Text>
                  </View>

                  <View style={style.viewRoundContainer}>
                    <View style={style.viewRound}>
                      <Mall_Icon height="40" width="40" />
                    </View>
                    <Text style={style.viewRoundText}>My Malls</Text>
                  </View>

                  <View style={style.viewRoundContainer}>
                    <View style={style.viewRound}>
                      <Job_Icon height="40" width="40" />
                    </View>
                    <Text style={style.viewRoundText}>Jobs</Text>
                  </View>

                  <View style={style.viewRoundContainer}>
                    <View style={style.viewRound}>
                      <Properties_icon height="40" width="40" />
                    </View>
                    <Text style={style.viewRoundText}>Properties</Text>
                  </View>

                  <View style={style.viewRoundContainer}>
                    <View style={style.viewRound}>
                      <Vehicle_icon height="40" width="40" />
                    </View>
                    <Text style={style.viewRoundText}>Vehicle</Text>
                  </View>
                  <View style={style.viewRoundContainer}>
                    <View style={style.viewRound}>
                      <Services_icon height="40" width="40" />
                    </View>
                    <Text style={style.viewRoundText}>Services</Text>
                  </View>

                  <View style={style.viewRoundContainer}>
                    <View style={style.viewRound}>
                      <Shops_icon height="40" width="40" />
                    </View>
                    <Text style={style.viewRoundText}>Shops</Text>
                  </View>

                  <View style={style.viewRoundContainer}>
                    <View style={style.viewRound}>
                      <Directory_icon height="40" width="40" />
                    </View>
                    <Text numberOfLines={2} style={style.viewRoundText}>
                      Business Directory
                    </Text>
                  </View>

                  <View style={style.viewRoundContainer}>
                    <View style={style.viewRound}>
                      <News_icon height="40" width="40" />
                    </View>
                    <Text numberOfLines={2} style={style.viewRoundText}>
                      News & Article
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </View>

            {/* ***** best deals */}
            <View
              style={{
                marginTop: height / 40,
                backgroundColor: '#bd1d53',
                height: height / 2.4,
              }}>
              <View
                style={{
                  marginStart: width / 22,
                  marginEnd: width / 22,
                  flexDirection: 'column',
                }}>
                <View style={{flexDirection: 'row', marginTop: height / 40}}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: width / 20,
                      fontWeight: 'bold',
                    }}>
                    Best Deals
                  </Text>
                  <TouchableOpacity style={{position: 'absolute', right: 0}}>
                    <Text style={{color: '#FFFFFF', fontWeight: 'bold'}}>
                      View All
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: height / 50,
                  }}>
                  {this.state.productArr.map((item, key) => (
                    console.log("img",  CONSTANTS.ORGINAL_IMG + item.imageKey,),
                    <View style={style.dealCard}>
                      {/* <View
                        style={{
                          height: height / 5,
                          backgroundColor: 'grey',
                          borderRadius: 12,
                        }}
                      /> */}

                             <Image  source={{
                            uri:
                              CONSTANTS.ORGINAL_IMG + item.imageKey,
                          }}
                          style={{  height: height / 5,
                            width:width/2.3,
                            borderRadius: 12,
                            backgroundColor:'#D0D0D0'
                          }}
                          />
                       
                      <View
                        style={{
                          height: width / 15,
                          width: width / 15,
                          borderRadius: width / 15 / 2,
                          backgroundColor: '#bd135d',
                          position: 'absolute',
                          right: 8,
                          top: height / 8,
                        }}>
                         
                        </View>

                      <Text
                        numberOfLines={1}
                        style={{
                          flexWrap: 'wrap',
                          fontSize: width / 34,
                          marginTop: width / 80,
                          // justifyContent: "center",
                          // alignSelf: "center",
                          marginStart: width / 28,
                        }}>
                        {item.name}
                      </Text>
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
                            color: '#bd1d53',
                            fontWeight: 'bold',
                          }}>
                            {item.bestDeal == true ?
                          "QAR "+item.offerPrice : "QAR "+ item.price}
                        </Text>
                        {item.bestDeal == true ?
                        <Text
                          style={{
                            color: '#0c6d3f',
                            fontSize: width / 34,
                            fontWeight: 'bold',
                            marginStart: width / 60,
                          }}>
                          {item.discountValue}% off
                        </Text>
                        :null}
                      </View>
                      {item.bestDeal == true ?
                      <Text
                        numberOfLines={1}
                        style={{
                          flexWrap: 'wrap',
                          fontSize: width / 34,
                          marginStart: width / 28,
                          textDecorationLine: 'line-through',
                          textDecorationStyle: 'solid',
                        }}>
                        QAR {item.actualPrice}
                      </Text>
                      :null}
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <Text style={{  marginTop: height / 30,
                marginStart: width / 22,fontSize:width/20,fontWeight:'bold'}}>Top Features</Text>
             
             <ScrollView
               horizontal={true}
               showsHorizontalScrollIndicator={false}
               style={{
                 marginTop: height / 70,
                 marginStart: width / 22,
               }}>
             <View
               style={{
                 flexDirection: 'row',
               }}>
               <View
                 style={{
                   backgroundColor: '#FFFFFF',
                   height: height / 9,
                   width: width / 3.5,
                   borderRadius: 15,
                   justifyContent: 'center',
                   marginEnd:width/50
                 }}>
                 <View
                   style={{
                     flexDirection: 'row',
                     marginStart: width / 24,
                     marginTop: height / 80,
                   }}>
                   <View style={{marginBottom: width / 70}}>
                     <Shops_icon height="40" width="40" />
                   </View>
                   <View style={{position: 'absolute', right: 8, top: 5}}>
                   <RightArrow height="10" width="20"/>
                   </View>
                 </View>
                 <Text
                   style={{
                     marginStart: width / 28,
                     fontWeight: 'bold',
                     fontSize: width / 32,
                   }}>
                   My Shops
                 </Text>
               </View>

               <View
                 style={{
                   backgroundColor: '#FFFFFF',
                   height: height / 9,
                   width: width / 3.5,
                   borderRadius: 15,
                   justifyContent: 'center',
                   marginEnd:width/50
                 }}>
                 <View
                   style={{
                     flexDirection: 'row',
                     marginStart: width / 24,
                     marginTop: height / 80,
                   }}>
                   <View style={{marginBottom: width / 70}}>
                     <Shops_icon height="40" width="40" />
                   </View>
                   <View style={{position: 'absolute', right: 8, top: 5}}>
                   <RightArrow height="10" width="20"/>
                   </View>
                 </View>
                 <Text
                   style={{
                     marginStart: width / 28,
                     fontWeight: 'bold',
                     fontSize: width / 32,
                   }}>
                   My Shops
                 </Text>
               </View>

               <View
                 style={{
                   backgroundColor: '#FFFFFF',
                   height: height / 9,
                   width: width / 3.5,
                   borderRadius: 15,
                   justifyContent: 'center',
                   marginEnd:width/50
                 }}>
                 <View
                   style={{
                     flexDirection: 'row',
                     marginStart: width / 24,
                     marginTop: height / 80,
                   }}>
                   <View style={{marginBottom: width / 70}}>
                     <Mall_Icon height="40" width="40" />
                   </View>
                   <View style={{position: 'absolute', right: 8, top: 5}}>
                     <RightArrow height="10" width="20"/>
                   </View>
                 </View>
                 <Text
                   style={{
                     marginStart: width / 28,
                     fontWeight: 'bold',
                     fontSize: width / 32,
                   }}>
                   My Malls
                 </Text>
               </View>
            
               <View
                 style={{
                   backgroundColor: '#FFFFFF',
                   height: height / 9,
                   width: width / 3.5,
                   borderRadius: 15,
                   justifyContent: 'center',
                   marginEnd:width/50
                 }}>
                 <View
                   style={{
                     flexDirection: 'row',
                     marginStart: width / 24,
                     marginTop: height / 80,
                   }}>
                   <View style={{marginBottom: width / 70}}>
                     <Shops_icon height="40" width="40" />
                   </View>
                   <View style={{position: 'absolute', right: 8, top: 5}}>
                   <RightArrow height="10" width="20"/>
                   </View>
                 </View>
                 <Text
                   style={{
                     marginStart: width / 28,
                     fontWeight: 'bold',
                     fontSize: width / 32,
                   }}>
                   My Shops
                 </Text>
               </View>

            
             </View>
             </ScrollView>
             

            <View
              style={{
                flexDirection: 'column',
                marginTop: height / 30,
                marginStart: width / 22,
                marginEnd: width / 22,
              }}>
         
              
              <View style={{flexDirection: 'row', marginTop: height / 40}}>
                <Text style={{fontSize:width/20,fontWeight:'bold'}}>Latest feeds</Text>
                <TouchableOpacity style={{position: 'absolute', right: 0}}>
                  <Text style={{fontSize:width/28,fontWeight:'bold'}}>View All</Text>
                </TouchableOpacity>
              </View>

              {this.state.feedArr.map(
                (item, key) => (
                  console.log(item.userDetails.name, 'ues'),
                  (
                    <Card
                      style={{
                        backgroundColor: '#FFFFFF',
                        //height: height / 1.8,
                        width: width / 1.1,
                        borderRadius: 2,
                        marginTop: height / 40,
                        // shadowOpacity: 0.5,
                        //elevation:0,
                        paddingBottom:width/33

                      }}>
                      <View
                        style={{
                          marginStart: width / 22,
                          marginTop: height / 30,
                          flexDirection: 'row',
                        }}>
                        <Image
                          source={{
                            uri:
                              CONSTANTS.SMALL_IMG + item.userDetails.profilePic,
                          }}
                          style={{width: 50, height: 50, borderRadius: 50 / 2}}
                        />
                        {/* <ProfilePic/> */}

                        <View
                          style={{
                            flexDirection: 'column',
                            marginStart: width / 30,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                          }}>
                          <Text style={{color: '#bd1d53'}}>
                            {item.userDetails.name}
                          </Text>
                          <Text style={{color: '#808080',fontSize:width/30}}>
                            {moment(item.updatedAt).format('d MMMM YYYY')}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={{position: 'absolute', right: width / 24}}>
                          <View style={{flexDirection: 'column'}}>
                            <View
                              style={{
                                backgroundColor: '#808080',
                                width: 6,
                                height: 6,
                                borderRadius: 6 / 2,
                                marginBottom: 3,
                              }}
                            />
                            <View
                              style={{
                                backgroundColor: '#808080',
                                width: 6,
                                height: 6,
                                borderRadius: 6 / 2,
                                marginBottom: 3,
                              }}
                            />
                            <View
                              style={{
                                backgroundColor: '#808080',
                                width: 6,
                                height: 6,
                                borderRadius: 6 / 2,
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          marginStart: width / 22,
                          marginEnd: width / 22,
                        }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            flexWrap: 'wrap',
                            fontSize: width / 27,
                            marginTop: height / 80,
                            marginBottom: height / 60,
                            fontWeight: 'bold',
                          }}>
                          Philosophy that address topic such as jhhijiw
                          jqhsijqsij qjsijs whijiqj
                        </Text>
                        <SeeMore numberOfLines={2}
                        seeMoreText='See All'
                        seeLessText='View less'
                        linkColor='#bd135d'
                       // linkPressedColor='green'
                        style={{ fontSize: width/30, fontWeight: '300',textAlign:'justify',color:'#262626' }}
                        >
                        Lorem ipsum dolor sit amet, in quo dolorum ponderum,
                            nam veri molestie constituto eu. Eum enim tantas
                            sadipscing ne, ut omnes malorum nostrum cum. Errem
                            populo qui ne, ea ipsum antiopam definitionem eos.
                            Lorem ipsum dolor sit amet, in quo dolorum ponderum,
                            nam veri molestie constituto eu. Eum enim tantas
                            sadipscing ne, ut omnes malorum nostrum cum. Errem
                            populo qui ne, ea ipsum antiopam definitionem eos.
</SeeMore>

                      
                      </View>
                      <Image
                        style={{
                          width: width / 1.1,
                          marginTop: height / 50,
                          height: height / 4,
                        }}
                        source={require('../src/assets/images/Ad1.png')}
                      />

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: height / 80,
                        }}>
                        <TouchableOpacity
                          style={{
                            width: width / 8,
                            height: height / 30,
                            backgroundColor: '#4267B2',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            borderColor: '#BEBEBE',
                            borderWidth: 1,
                          }}>
                          <Text
                            style={{
                              color: '#FFFFFF',
                              fontSize: width / 30,
                              fontWeight: 'bold',
                            }}>
                            Like
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            width: width / 8,
                            height: height / 30,
                            borderColor: '#BEBEBE',
                            justifyContent: 'center',
                            borderWidth: 1,
                            alignItems: 'center',
                            marginStart: width / 24,
                          }}>
                          <Text style={{color: 'black', fontSize: width / 30}}>
                            {item.likeCount}k
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Card>
                  )
                ),
              )}
            </View>
          </Content>
        ) : null}
      </Container>
    );
  }
}

const style = StyleSheet.create({
  viewRound: {
    width: width / 6.2,
    height: width / 6.2,
    borderRadius: width / 6.2 / 2,
    backgroundColor: 'white',
    borderColor: '#BEBEBE',
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewRoundText: {
    justifyContent: 'center',
    alignSelf: 'center',
    // marginTop: height / 80,
    fontSize: width / 33,
    color: 'black',
    textAlign: 'center',
    width: width / 6,
  },
  viewRoundContainer: {flexDirection: 'column', marginRight: width / 24},
  dealCard: {
    backgroundColor: '#FFFFFF',
    height: height / 3.5,
    width: width / 2.3,
    borderRadius: 12,
  },
  cardWrapparent: {
    paddingBottom: 10,
    alignItems: 'center',
  },
  cardImage: {
    height: 130,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    flex: 1,
    overflow: 'hidden',
    resizeMode: 'cover',
    width: itemWidth,
    borderRadius: entryBorderRadius,
  },
  cardWrap: {
    borderRadius: entryBorderRadius,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    width: itemWidth / 1.04,
    marginTop: height / 45,
    marginHorizontal: width / 30,
  },
  cardBorder: {
    borderRadius: entryBorderRadius,
    flex: 1,

    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
});
