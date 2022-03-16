import React from 'react';
import { Root } from 'native-base';
import { Animated, Text, View, StatusBar } from 'react-native';
import Routes from './config/routes';
import RoutesAuth from './config/routesauth';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import { useEffect, useState } from 'react';
import AsyncStorageHelper from './helpers/AsyncStorageHelper';
import { MenuProvider } from 'react-native-popup-menu';
import { AppColors } from './Themes';

const RootContainer = () => {
  useEffect(() => {
    readData();
    SplashScreen.hide();
  }, []);
  const [authUser, setAuthUser] = useState('no_user_exist');
  const [authPage, setAuthPage] = useState(false);
  const readData = async () => {
    try {
      const auth_user = await AsyncStorageHelper.getItem('ISUSER');
      setAuthUser(auth_user);
      setAuthPage(true)
    } catch (e) {
      setAuthUser('no_user_exist');
    }
  };
  return (
    <MenuProvider>
      <StatusBar backgroundColor={AppColors.primaryColor} barStyle='light-content' />
      <View style={{ flex: 1 }}>
        <NavigationContainer>
          {authPage ? (
            authUser == 'user_exist' ? (
              <RoutesAuth />
            ) : (
              <Routes />
            )
          ) : null}
        </NavigationContainer>
      </View>
    </MenuProvider>
  );
};

export default RootContainer;
