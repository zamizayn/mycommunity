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

import Logout_icon_white from '../assets/svg/menu/logout-icon-white.svg';
import {
  StackActions,
  CommonActions,
  NavigationActions,
} from '@react-navigation/native';
import {CONSTANTS} from '../config/constants';
import Icon from '../../node_modules/react-native-vector-icons/SimpleLineIcons';
import {AppColors} from '../Themes';

const CustomUserDrawer = props => {
  const initialUserData = {
    name: '',
    email: '',
    profilePic: '',
    userRole: '',
    username: '',
  };

  const {state, ...rest} = props;
  var newState = {...state};

  const [userData, setUserData] = useState(initialUserData);
  const [authUser, setAuthUser] = useState('no_user_exist');
  const [newStateDrawer, setNewStateDrawer] = useState(newState);

  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    readData();
  }, []);
  const readData = async () => {
    try {
      const auth_user = await AsyncStorageHelper.getItem('ISUSER');
      const user_data = await AsyncStorageHelper.getItem('USERDATA');
      //console.log("User Data", user_data);
      setAuthUser(auth_user);
      setUserData(JSON.parse(user_data));
    } catch (e) {
      setAuthUser('no_user_exist');
      setUserData(initialUserData);
    }
  };
  const isDrawerOpen = useIsDrawerOpen();

  const readUserRole = async () => {
    var userRole = false;
    try {
      userRole = await AsyncStorageHelper.getItem('USERROLE');
      console.log('userRole', userRole);
      setUserRole(userRole);
      return userRole;
    } catch (e) {
      return userRole;
    }
    // if (userRole === '2') {
    //   return true;
    // } else {
    //   return false;
    // }
  };

  // var userRole = readUserRole();
  // newState.routes = newState.routes.filter(item => item.name !== 'My Deals');

  useEffect(() => {
    var userRole = readUserRole();
    if (isDrawerOpen) {
      readData();
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    if (isDrawerOpen) {
      // console.log('isDrawerOpen', '!2:' + userRole);
      if (userRole !== '2') {
        // console.log('isDrawerOpen', '2: ' + userRole);
        newState.routes = newState.routes.filter(
          item => item.name !== 'My Deals',
        );

        newState.routes = newState.routes.filter(
          item => item.name !== 'Add My Deals',
        );

        newState.routes = newState.routes.filter(
          item => item.name !== 'Promotion Slot',
        );

        newState.routes = newState.routes.filter(
          item => item.name !== 'Refresh Slot',
        );

        setNewStateDrawer(newState);
      }
      // newState.routes = newState.routes.filter(
      //   item => item.name !== 'My Deals',
      // );
    }
  }, [userRole, isDrawerOpen]);
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
              backgroundColor: 'white',
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
                backgroundColor: 'white',
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
                  color: AppColors.primaryColor,
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
                  color: AppColors.fontColorDark,
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
                color: AppColors.primaryColor,
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
              backgroundColor: '#bd1d53',
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
                  color: 'white',
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
                  color: '#eae3e5',
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

      <DrawerContentScrollView {...props} style={{backgroundColor: '#f1f1f1'}}>
        <DrawerItem
          icon={() => <Text height="28" width="27" />}
          label="Home"
          labelStyle={{
            fontFamily: 'Roboto-Medium',
            color: AppColors.fontColorDark,
            marginStart: -12,
            fontSize: width / 25,
          }}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.dispatch(StackActions.replace('WelcomePage'));
            props.navigation.navigate('HomeMenu');
          }}
        />

        {/* <DrawerItemList {...props} /> */}
        <DrawerItemList state={newStateDrawer} {...rest} />
        {authUser == 'user_exist' ? (
          <DrawerItem
            style={{borderTopWidth: 1, borderColor: '#ddd'}}
            icon={() => <Text height="28" width="27" />}
            label="Sign Out"
            labelStyle={{
              fontFamily: 'Roboto-Medium',
              color: 'AppColors.fontColorDark',
              marginStart: -12,
              fontSize: width / 25,
            }}
            onPress={() => {
              AsyncStorageHelper.removeItem('TOKEN');
              AsyncStorageHelper.storeItem('ISUSER', 'no_user_exist');
              AsyncStorageHelper.removeItem('USERDATA');
              AsyncStorageHelper.removeItem('USERROLE');
              // props.navigation.dispatch(
              //   CommonActions.reset({
              //     index: 1,
              //     routes: [
              //       {
              //         name: 'HomeMenu'
              //       },
              //     ],
              //   }),
              // );
              props.navigation.dispatch(StackActions.replace('HomeMenu'));
              props.navigation.closeDrawer();
              props.navigation.navigate('WelcomePage');
            }}
          />
        ) : null}
      </DrawerContentScrollView>

      {/* <View
        style={{
          backgroundColor: 'yellow',
          flexDirection: 'row',
          width: '100%',
          height: height / 5.5,
        }}
      /> */}
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

export default CustomUserDrawer;
