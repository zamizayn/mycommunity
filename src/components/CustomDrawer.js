// Custom Navigation Drawer / Sidebar with Image and Icon in Menu Options
// https://aboutreact.com/custom-navigation-drawer-sidebar-with-image-and-icon-in-menu-options/

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Linking,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  useIsDrawerOpen,
} from '@react-navigation/drawer';
import ProfilePic from '../assets/svg/ProfilePic.svg';
import MyCommunitylogo from '../assets/svg/MyCommunitylogo.svg';
import AsyncStorageHelper from '../helpers/AsyncStorageHelper';
var {height, width} = Dimensions.get('window');
const BASE_PATH =
  'https://raw.githubusercontent.com/AboutReact/sampleresource/master/';
const proileImage = 'react_logo.png';

import Logout_icon_white from '../assets/svg/menu/logout-icon-black.svg';
import {StackActions, CommonActions} from '@react-navigation/native';
import {CONSTANTS} from '../config/constants';
import Icon from '../../node_modules/react-native-vector-icons/SimpleLineIcons';
import {AppColors} from '../Themes';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faFacebook} from '@fortawesome/free-brands-svg-icons';
import {faLinkedin} from '@fortawesome/free-brands-svg-icons';
import {faInstagram} from '@fortawesome/free-brands-svg-icons';
import {faTwitter} from '@fortawesome/free-brands-svg-icons';

const CustomDrawer = props => {
  const initialUserData = {
    name: '',
    email: '',
    profilePic: '',
    userRole: '',
    username: '',
  };
  const [userData, setUserData] = useState(initialUserData);
  const [authUser, setAuthUser] = useState('no_user_exist');
  useEffect(() => {
    readData();
  }, []);
  const readData = async () => {
    try {
      const auth_user = await AsyncStorageHelper.getItem('ISUSER');
      const user_data = await AsyncStorageHelper.getItem('USERDATA');
      const parseUserData = JSON.parse(user_data);
      if (Object.keys(parseUserData).length && parseUserData.name !== '') {
        setAuthUser(auth_user);
        setUserData(JSON.parse(user_data));
      } else {
        setAuthUser('no_user_exist');
        setUserData(initialUserData);
      }
    } catch (e) {
      setAuthUser('no_user_exist');
      setUserData(initialUserData);
    }
  };
  const isDrawerOpen = useIsDrawerOpen();
  useEffect(() => {
    if (isDrawerOpen) {
      readData();
    }
  }, [isDrawerOpen]);

  const openUrl = url => {
    if (url) {
      Linking.canOpenURL(url)
        .then(() => {
          Linking.openURL(url).catch(() => {});
        })
        .catch(() => {});
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      {/*Top Large Image */}
      {authUser == 'user_exist' ? (
        <TouchableOpacity
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('UserDasboardMenu');
          }}
          activeOpacity={0.9}>
          <View
            style={{
              backgroundColor: '#F5F5F5',
              flexDirection: 'row',
              height: height / 5.5,
            }}>
            <View
              style={{
                marginStart: width / 22,
                alignSelf: 'center',
                width: 70,
                height: 70,
                borderRadius: 150 / 2,
                borderColor: AppColors.fontColorLight,
                borderWidth: 1,
                overflow: 'hidden',
                backgroundColor: '#f0f0f0',
              }}>
              {'profilePic' in userData && userData.profilePic != '' ? (
                <Image
                  source={{
                    uri: CONSTANTS.THUMBNAIL_IMG + userData.profilePic,
                  }}
                  style={{height: 70, width: 70}}
                />
              ) : (
                <ProfilePic height="70" width="70" />
              )}
            </View>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginStart: width / 38,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: width / 2.4,
                  paddingEnd: 12,
                  flexWrap: 'wrap',
                  color: '#bd1d53',
                  fontSize: width / 24,
                }}>
                {userData.name}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: width / 2.3,
                  paddingEnd: 12,
                  flexWrap: 'wrap',
                  color: '#bd1d53',
                  fontSize: width / 30,
                  marginStart: 6,
                }}>
                {userData.username}
              </Text>
            </View>
            <Icon
              style={{
                right: width / 15,
                top: height / 12,
                fontSize: width / 22,
                color: '#bd1d53',
              }}
              name="pencil"
            />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('Login');
          }}
          activeOpacity={0.9}>
          <View
            style={{
              backgroundColor: '#F5F5F5',
              flexDirection: 'row',
              height: height / 5.5,
            }}>
            <View style={{marginStart: width / 22, alignSelf: 'center'}}>
              <ProfilePic height="70" width="70" />
            </View>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginStart: width / 38,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: width / 2.4,
                  paddingEnd: 12,
                  flexWrap: 'wrap',
                  color: '#bd1d53',
                  fontSize: width / 24,
                }}>
                Guest User
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: width / 2.3,
                  paddingEnd: 12,
                  flexWrap: 'wrap',
                  color: '#bd1d53',
                  fontSize: width / 30,
                  marginStart: 6,
                }}>
                Sign In
              </Text>
            </View>
            <Image />
          </View>
        </TouchableOpacity>
      )}

      <DrawerContentScrollView {...props} style={{backgroundColor: '#F5F5F5'}}>
        <DrawerItemList {...props} />
        {authUser == 'user_exist' ? (
          <DrawerItem
            icon={() => <Logout_icon_white height="28" width="27" />}
            label="Sign Out"
            labelStyle={{
              color: 'black',
              marginStart: -12,
              fontSize: width / 25,
            }}
            onPress={() => {
              AsyncStorageHelper.removeItem('TOKEN');
              AsyncStorageHelper.storeItem('ISUSER', 'no_user_exist');
              AsyncStorageHelper.removeItem('USERDATA');
              AsyncStorageHelper.removeItem('USERROLE');
              props.navigation.dispatch(StackActions.replace('WelcomePage'));
              props.navigation.closeDrawer();
            }}
          />
        ) : null}
      </DrawerContentScrollView>

      <View
        style={{
          backgroundColor: '#F5F5F5',
          flexDirection: 'row',
          width: '100%',
          height: height / 8,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingStart: width / 24,
          paddingEnd: width / 24,
        }}>
        <TouchableOpacity
          onPress={() => {
            openUrl(
              'https://www.facebook.com/My-Community-Qatar-100792301883798',
            );
          }}>
          <FontAwesomeIcon icon={faFacebook} color={'#bd1d53'} size={30} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            openUrl('https://www.instagram.com/mycommunity.qatar/?hl=en');
          }}>
          <FontAwesomeIcon icon={faInstagram} color={'#bd1d53'} size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            openUrl('https://www.linkedin.com/company/my-community-qatar/');
          }}>
          <FontAwesomeIcon icon={faLinkedin} color={'#bd1d53'} size={30} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            openUrl('https://twitter.com/MycommunityQ');
          }}>
          <FontAwesomeIcon icon={faTwitter} color={'#bd1d53'} size={30} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    alignSelf: 'center',
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CustomDrawer;
