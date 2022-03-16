import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Modal,
  Pressable,
  Image,
  StyleSheet,
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
} from 'native-base';
import BackBtn_white from '../assets/svg/BackBtn_white.svg';
import Icon from '../../node_modules/react-native-vector-icons/Ionicons';
import theme from '../config/styles.js';
import SearchBlackIcon from '../assets/svg/SearchBlackIcon.svg';
import Notification_icon_white from '../assets/svg/Notification_icon_white.svg';
import Filter_icon from '../assets/svg/FilterIcon.svg';
import Phone_icon from '../assets/svg/phone.svg';
import Email_icon from '../assets/svg/Email_icon.svg';
import Industry_icon from '../assets/svg/Industry_icon.svg';
import {Dropdown} from 'react-native-material-dropdown-v2-fixed';
import DropDown_icon from '../assets/svg/DropDown_icon.svg';
import {left} from 'styled-system';
import { CONSTANTS } from '../config/constants';
var {height, width} = Dimensions.get('window');
export default class FilterListDirectory extends Component {
  state = {
    modalVisible: false,
  };
  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

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
  render() {
    const {modalVisible} = this.state;
    let location = [
      {
        value: 'Oman',
      },
      {
        value: 'Dubai',
      },
    ];
    let propertytype = [
      {
        value: 'Villa',
      },
      {
        value: 'Inida',
      },
    ];
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
      <Container style={{backgroundColor: '#F0ECED'}}>
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
          <Body>
            <Title
              style={{
                color: 'white',
                paddingStart: width / 20,
                fontSize: width / 22,
              }}>
              Contact Us
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
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: '#F0ECED',
          }}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              this.setModalVisible(!modalVisible);
            }}>
            <View style={{flex: 1, backgroundColor: '#fff'}}>
              <Header
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#bd1d53',
                  height: height / 12,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
                androidStatusBarColor="grey"
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
                <Body>
                  <Title
                    style={{
                      color: 'white',

                      fontSize: width / 22,
                    }}>
                    Filter Search
                  </Title>
                </Body>
                <Right>
                  <Button transparent>
                    <Icon
                      name="checkmark"
                      style={{fontSize: width / 12, color: '#fff'}}
                    />
                  </Button>
                </Right>
              </Header>

              <View style={{paddingStart: width / 15, paddingEnd: width / 15}}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: height / 30,
                  }}>
                  <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                    Select Location
                  </Text>
                  <Text style={{color: '#000000', fontSize: width / 24}}>
                    *
                  </Text>
                </View>
                <View style={{marginTop: height / 80}}>
                  <Dropdown
                    placeholder="Choose Location"
                    placeholderTextColor="#808080"
                    data={location}
                    containerStyle={{
                      width: null,
                      borderRadius: 8,
                      paddingStart: width / 60,
                      backgroundColor: '#fff',
                      borderBottomWidth: 1,
                      borderColor: '#BDBEBF',
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
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: height / 30,
                  }}>
                  <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                    Select Location
                  </Text>
                  <Text style={{color: '#000000', fontSize: width / 24}}>
                    *
                  </Text>
                </View>
                <View style={{marginTop: height / 80}}>
                  <Dropdown
                    placeholder="Type of Property"
                    placeholderTextColor="#808080"
                    data={propertytype}
                    containerStyle={{
                      width: null,
                      borderRadius: 8,
                      paddingStart: width / 60,
                      backgroundColor: '#fff',
                      borderBottomWidth: 1,
                      borderColor: '#BDBEBF',
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
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: height / 30,
                  }}>
                  <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                    Price Range
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flex: 1}}>
                    <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                      No of Bedroom
                    </Text>
                   
                  </View>
                  <View style={{flex: 1}}>
                    <Text
                      style={[
                        theme.fontBold,
                        {fontSize: width / 26, textAlign: 'center'},
                      ]}>
                      No of Bathroom
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
          <Pressable onPress={() => this.setModalVisible(true)}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                flex: 1,
                width: null,
                paddingStart: width / 8,
                paddingEnd: width / 8,
                paddingTop: height / 50,
                paddingBottom: height / 50,
                flexDirection: 'row',
              }}>
              <View style={{marginRight: width / 50}}>
                <Filter_icon width="18" height="18" />
              </View>
              <Text style={{color: '#BC2055'}}>Filter</Text>
            </View>
          </Pressable>
          <View
            style={{
              paddingStart: width / 15,
              paddingEnd: width / 15,
            }}>
            <View style={{paddingVertical: height / 60}}>
              <Text
                style={[
                  theme.fontMedium,
                  {fontSize: width / 23, color: '#000'},
                ]}>
                50 Results Found
              </Text>
            </View>
            <View>
              <List>
                <ListItem
                  thumbnail
                  noBorder
                  style={{
                    marginLeft: 0,
                    backgroundColor: '#ffffff',
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                    marginBottom: height / 55,
                  }}>
                  <Left
                    style={{
                      paddingTop: 0,
                      marginTop: 0,
                    }}>
                    <Thumbnail
                      style={{
                        width: width / 2.9,
                        height: width / 2.7,
                        resizeMode: 'cover',
                        alignSelf: 'stretch',
                        borderRadius: 0,
                      }}
                      source={require('../assets/images/placeholder-img.png')}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        top: height / 60,
                        left: width / 30,
                        paddingHorizontal: width / 30,
                        paddingVertical: width / 60,
                        borderRadius: 30,
                        backgroundColor: '#24A259',
                      }}>
                      <Text
                        style={{
                          fontSize: width / 33,
                          color: '#fff',
                          lineHeight: width / 33,
                        }}>
                        Open
                      </Text>
                    </View>
                  </Left>
                  <Body
                    style={{
                      paddingTop: 0,
                      paddingBottom: 0,
                      marginTop: 10,
                      marginBottom: 10,
                    }}>
                    <Text
                      style={[
                        theme.fontMedium,
                        {fontSize: width / 27, color: '#000'},
                      ]}
                      numberOfLines={1}>
                      Rock Star Powers Ltd
                    </Text>
                    <Text
                      style={[
                        theme.fontMedium,
                        {fontSize: width / 32, color: '#747474'},
                      ]}
                      note
                      numberOfLines={1}>
                      at Doha
                    </Text>
                    <View style={{marginTop: height / 60}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: height / 90,
                        }}>
                        <Phone_icon width="15" height="15" />
                        <Text
                          style={[
                            theme.fontMedium,
                            {
                              fontSize: width / 32,
                              color: '#747474',
                              marginLeft: width / 40,
                            },
                          ]}>
                          {CONSTANTS.COUNTRY_CODE_TEXT} 1234 0986
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: height / 90,
                        }}>
                        <Email_icon width="15" height="15" />
                        <Text
                          style={[
                            theme.fontMedium,
                            {
                              fontSize: width / 32,
                              color: '#747474',
                              marginLeft: width / 40,
                            },
                          ]}>
                          mail@carcleaning.com
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: height / 90,
                        }}>
                        <Industry_icon width="15" height="15" />
                        <Text
                          style={[
                            theme.fontMedium,
                            {
                              fontSize: width / 32,
                              color: '#747474',
                              marginLeft: width / 40,
                            },
                          ]}>
                          Retail
                        </Text>
                      </View>
                      <View
                        style={{
                          position: 'absolute',
                          zIndex: 1,
                          bottom: 1,
                          right: width / 30,
                        }}>
                        <Text
                          style={[
                            theme.fontMedium,
                            {color: '#B7B7B7', fontSize: width / 32},
                          ]}>
                          1 Mar 2021
                        </Text>
                      </View>
                    </View>
                  </Body>
                </ListItem>
                <ListItem
                  thumbnail
                  noBorder
                  style={{
                    marginLeft: 0,
                    backgroundColor: '#ffffff',
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                    marginBottom: height / 55,
                  }}>
                  <Left
                    style={{
                      paddingTop: 0,
                      marginTop: 0,
                    }}>
                    <Thumbnail
                      style={{
                        width: width / 2.9,
                        height: width / 2.7,
                        resizeMode: 'cover',
                        alignSelf: 'stretch',
                        borderRadius: 0,
                      }}
                      source={require('../assets/images/placeholder-img.png')}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        top: height / 60,
                        left: width / 30,
                        paddingHorizontal: width / 30,
                        paddingVertical: width / 60,
                        borderRadius: 30,
                        backgroundColor: '#F5141A',
                      }}>
                      <Text
                        style={{
                          fontSize: width / 33,
                          color: '#fff',
                          lineHeight: width / 33,
                        }}>
                        Closed
                      </Text>
                    </View>
                  </Left>
                  <Body
                    style={{
                      paddingTop: 0,
                      paddingBottom: 0,
                      marginTop: 10,
                      marginBottom: 10,
                    }}>
                    <Text
                      style={[
                        theme.fontMedium,
                        {fontSize: width / 27, color: '#000'},
                      ]}
                      numberOfLines={1}>
                      Rock Star Powers Ltd
                    </Text>
                    <Text
                      style={[
                        theme.fontMedium,
                        {fontSize: width / 32, color: '#747474'},
                      ]}
                      note
                      numberOfLines={1}>
                      at Doha
                    </Text>
                    <View style={{marginTop: height / 60}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: height / 90,
                        }}>
                        <Phone_icon width="15" height="15" />
                        <Text
                          style={[
                            theme.fontMedium,
                            {
                              fontSize: width / 32,
                              color: '#747474',
                              marginLeft: width / 40,
                            },
                          ]}>
                          {CONSTANTS.COUNTRY_CODE_TEXT} 1234 0986
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: height / 90,
                        }}>
                        <Email_icon width="15" height="15" />
                        <Text
                          style={[
                            theme.fontMedium,
                            {
                              fontSize: width / 32,
                              color: '#747474',
                              marginLeft: width / 40,
                            },
                          ]}>
                          mail@carcleaning.com
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: height / 90,
                        }}>
                        <Industry_icon width="15" height="15" />
                        <Text
                          style={[
                            theme.fontMedium,
                            {
                              fontSize: width / 32,
                              color: '#747474',
                              marginLeft: width / 40,
                            },
                          ]}>
                          Retail
                        </Text>
                      </View>
                      <View
                        style={{
                          position: 'absolute',
                          zIndex: 1,
                          bottom: 1,
                          right: width / 30,
                        }}>
                        <Text
                          style={[
                            theme.fontMedium,
                            {color: '#B7B7B7', fontSize: width / 32},
                          ]}>
                          1 Mar 2021
                        </Text>
                      </View>
                    </View>
                  </Body>
                </ListItem>
              </List>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  modals: {
    backgroundColor: 'white',
    margin: 0, // This is the important style you need to set
    alignItems: undefined,
    justifyContent: undefined,
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    margin: 0,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
