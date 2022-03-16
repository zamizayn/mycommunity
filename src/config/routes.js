import * as React from 'react';
import {useState, useEffect} from 'react';
import {Animated, Text, Button, Dimensions, View, Image} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AsyncStorageHelper from '../helpers/AsyncStorageHelper';

//Pages
import Home from '../Home';
import WelcomePage from '../WelcomePage';
import Categories from '../menu/Categories';
import CustomDrawer from '../components/CustomDrawer';
import CustomUserDrawer from '../components/CustomUserDrawer';
import SignUp from '../registration/Signup';
import OtpVerification from '../registration/OtpVerification';
import Login from '../Login';
import ForgotPassword from '../forgotPass/ForgotPassword';
import ForgotPassVerifyOtp from '../forgotPass/ForgotPassVerifyOtp';
import About from '../About';
import Contact from '../Contact';
import TermsandCondition from '../TermsandCondition';
import AroundMe from '../AroundMe';
import MyProperties from '../MyProperties';
import ListMyProperty from '../Corporate/ListMyProperty';
import ListMyAroundMe from '../Corporate/ListMyAroundMe';

//DIRECTORY
import ListDirectory from '../ListDirectory';

//User Profile
import UserDasboard from '../UserProfile/UserDashboard';
import ViewProfile from '../UserProfile/ViewProfile';
import EditProfile from '../UserProfile/EditProfile';
import ChangePassword from '../UserProfile/ChangePassword';
//Corporate
import AddBusiness from '../Corporate/AddBusiness';
import DirectoryDetail from '../DirectoryDetail';

import Home_icon_white from '../assets/svg/menu/home-icon-white.svg';
import Category_icon_white from '../assets/svg/menu/category-icon-white.svg';
import User_feed_icon_white from '../assets/svg/menu/user-feed-icon-white.svg';
import Mygallery_icon_white from '../assets/svg/menu/my-gallery-icon-white.svg';
import Notification_icon_white from '../assets/svg/menu/notification-icon-white.svg';
import Languages_icon_white from '../assets/svg/menu/languages-icon-white.svg';
import About_icon_white from '../assets/svg/menu/about-us-Icon-white.svg';
import Contact_icon_white from '../assets/svg/menu/contact-icon-white.svg';
import Terms_and_Conditions_icon_white from '../assets/svg/menu/terms-and-conditions-icon-white.svg';
import Settings_icon_white from '../assets/svg/menu/settings-icon-white.svg';
import {AppColors} from '../Themes';
import UserMenuTabs from '../Corporate/UserMenuTabs';
import AddProperty from '../Corporate/AddProperty';
import AddVehicle from '../Corporate/AddVehicle';
import ViewProperty from '../Corporate/ViewProperty';
import ListProperty from '../ListProperty';
import PropertyDetail from '../PropertyDetail';
import ListVehicles from '../ListVehicles';
import VehicleDetail from '../VehicleDetail';
import Viewvehicle from '../Corporate/ViewVehicle';
import AddService from '../Corporate/AddService';
import AddProduct from '../Corporate/AddProduct';
import ViewProduct from '../Corporate/ViewProduct';
import ListProducts from '../ListProducts';
import ProductDetails from '../ProductDetails';
import ViewService from '../Corporate/ViewService';
import ListServices from '../ListServices';
import ServiceDetails from '../ServiceDetails';
import AddJob from '../Corporate/AddJob';
import ViewJob from '../Corporate/ViewJob';
import MyFeeds from '../Corporate/MyFeeds';
import AddMyFeeds from '../Corporate/AddMyFeeds';
import ListJobs from '../ListJobs';
import JobDetails from '../JobDetails';
import JobsApplications from '../individual/JobsApplications';
import ApplyJob from '../ApplyJob';
import ListFeeds from '../ListFeeds';
import Notifications from '../menu/Notifications';
import ListMyDeals from '../ListMyDeals';
import MyDealsDetails from '../MyDealsDetails';
import ListMalls from '../ListMalls';
import MallDetails from '../MallDetails';
import ListNews from '../ListNews';
import NewsDetails from '../NewsDetails';
import MyCv from '../Corporate/MyCv';
import ContactForm from '../ContactForm';
import ShopDetails from '../ShopDetails';
import UserMenuTabsOther from '../OtherProfile/UserMenuTabs';

var {height, width} = Dimensions.get('window');
const BASE_PATH =
  'https://raw.githubusercontent.com/AboutReact/sampleresource/master/';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function HomeMenu() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContentOptions={{
        activeBackgroundColor: 'transparent',
        // activeTintColor: '#AA1A4A',
        itemStyle: {marginVertical: 1},
        labelStyle: {
          color: 'white',
          marginStart: -12,
          fontSize: width / 25,
        },
      }}
      drawerStyle={{
        width: width / 1.35,
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerIcon: ({focused, size}) => (
            <Home_icon_white height="28" width="27" />
          ),
        }}
      />
      <Drawer.Screen
        name="Categories"

        component={Categories}
        options={{
          drawerIcon: ({focused, size}) => (
            <Category_icon_white height="28" width="27" />
          ),
        }}
      />
      <Drawer.Screen
        name="User Feeds"
        component={ListFeeds}
        options={{
          drawerIcon: ({focused, size}) => (
            <User_feed_icon_white height="28" width="27" />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="My Gallery"
        component={Categories}
        options={{
          drawerIcon: ({focused, size}) => (
            <Mygallery_icon_white height="28" width="27" />
          ),
        }}
      /> */}
      <Drawer.Screen
        name="Notification"
        component={Notifications}
        options={{
          drawerIcon: ({focused, size}) => (
            <Notification_icon_white height="28" width="27" />
          ),
        }}
      />
      <Drawer.Screen
        name="Languages"
        component={Home}
        options={{
          drawerIcon: ({focused, size}) => (
            <Languages_icon_white height="28" width="27" />
          ),
        }}
      />
      <Drawer.Screen
        name="About Us"
        component={About}
        options={{
          drawerIcon: ({focused, size}) => (
            <About_icon_white height="28" width="27" />
          ),
        }}
      />
      <Drawer.Screen
        name="Contact Us"
        component={Contact}
        options={{
          drawerIcon: ({focused, size}) => (
            <Contact_icon_white height="28" width="27" />
          ),
        }}
      />
      <Drawer.Screen
        name="Terms & Conditions"
        component={TermsandCondition}
        options={{
          drawerIcon: ({focused, size}) => (
            <Terms_and_Conditions_icon_white height="28" width="27" />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="Settings"
        component={Home}
        options={{
          drawerIcon: ({focused, size}) => (
            <Settings_icon_white height="28" width="27" />
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
}

function UserDasboardMenu() {
  return (
    <Drawer.Navigator
      initialRouteName="UserDasboard"
      drawerContentOptions={{
        activeBackgroundColor: 'transparent',
        itemStyle: {marginVertical: 1},
        labelStyle: {
          fontFamily: 'Roboto-Medium',
          color: AppColors.fontColorDark,
          marginStart: -12,
          fontSize: width / 25,
        },
      }}
      drawerStyle={{
        width: width / 1.35,
      }}
      drawerContent={props => <CustomUserDrawer {...props} />}>
      <Drawer.Screen
        name="Dashboard"
        component={UserDasboard}
        options={{
          drawerIcon: ({focused, size}) => <Text height="28" width="27" />,
        }}
      />
      <Drawer.Screen
        name="Properties"
        component={UserMenuTabs}
        options={{
          drawerIcon: ({focused, size}) => <Text height="28" width="27" />,
        }}
        initialParams={{
          initialPage: 0,
        }}
      />
      <Drawer.Screen
        name="Vehicles"
        component={UserMenuTabs}
        options={{
          drawerIcon: ({focused, size}) => <Text height="28" width="27" />,
        }}
        initialParams={{
          initialPage: 1,
        }}
      />
      <Drawer.Screen
        name="Jobs"
        component={UserMenuTabs}
        options={{
          drawerIcon: ({focused, size}) => <Text height="28" width="27" />,
        }}
        initialParams={{
          initialPage: 2,
        }}
      />

      <Drawer.Screen
        name="Products"
        component={UserMenuTabs}
        options={{
          drawerIcon: ({focused, size}) => <Text height="28" width="27" />,
        }}
        initialParams={{
          initialPage: 3,
        }}
      />
      <Drawer.Screen
        name="Services"
        component={UserMenuTabs}
        options={{
          drawerIcon: ({focused, size}) => <Text height="28" width="27" />,
        }}
        initialParams={{
          initialPage: 4,
        }}
      />
      <Drawer.Screen
        name="My Feeds"
        component={MyFeeds}
        options={{
          drawerIcon: ({focused, size}) => <Text height="28" width="27" />,
        }}
      />
      {/* <Drawer.Screen
        name="My Sales"
        component={UserDasboard}
        options={{
          drawerIcon: ({focused, size}) => <Text height="28" width="27" />,
        }}
      /> */}
      <Drawer.Screen
        name="My Profile"
        component={ViewProfile}
        options={{
          drawerIcon: ({focused, size}) => <Text height="28" width="27" />,
        }}
      />
      <Drawer.Screen
        name="My Properties"
        component={ListMyProperty}
        options={{
          drawerIcon: ({focused, size}) => <Text height="28" width="27" />,
        }}
      />
      <Drawer.Screen
        name="Around me"
        component={ListMyAroundMe}
        options={{
          drawerIcon: ({focused, size}) => <Text height="28" width="27" />,
        }}
      />

      <Drawer.Screen
        name="My CV"
        component={MyCv}
        options={{
          drawerIcon: ({focused, size}) => <Text height="28" width="27" />,
        }}
      />
    </Drawer.Navigator>
  );
}

const Routes = () => {
  // const [authUser, setAuthUser] = useState('no_user_exist');
  // useEffect(() => {
  //   readData();
  // }, []);
  // const readData = async () => {
  //   try {
  //     const auth_user = await AsyncStorageHelper.getItem('ISUSER');
  //     setAuthUser(auth_user);
  //   } catch (e) {
  //     setAuthUser('no_user_exist');
  //   }
  // };
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {/* {authUser == 'user_exist' ? (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="HomeMenu" component={HomeMenu} />
        </>
      ) : (
        <>
          <Stack.Screen name="WelcomePage" component={WelcomePage} />
        </>
      )} */}
      <Stack.Screen name="WelcomePage" component={WelcomePage} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="HomeMenu" component={HomeMenu} />
      <Stack.Screen name="ListDirectory" component={ListDirectory} />
      <Stack.Screen name="ListProperty" component={ListProperty} />
      <Stack.Screen name="ListVehicles" component={ListVehicles} />
      <Stack.Screen name="ListServices" component={ListServices} />
      <Stack.Screen name="ListProducts" component={ListProducts} />
      <Stack.Screen name="ListJobs" component={ListJobs} />
      <Stack.Screen name="ListFeeds" component={ListFeeds} />
      <Stack.Screen name="ListMyDeals" component={ListMyDeals} />
      <Stack.Screen name="ListMalls" component={ListMalls} />
      <Stack.Screen name="ListNews" component={ListNews} />
      <Stack.Screen name="MallDetails" component={MallDetails} />
      <Stack.Screen name="ShopDetails" component={ShopDetails} />
      <Stack.Screen name="NewsDetails" component={NewsDetails} />
      <Stack.Screen name="DirectoryDetail" component={DirectoryDetail} />
      <Stack.Screen name="PropertyDetail" component={PropertyDetail} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetail} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="JobDetails" component={JobDetails} />
      <Stack.Screen name="MyDealsDetails" component={MyDealsDetails} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen
        name="ForgotPassVerifyOtp"
        component={ForgotPassVerifyOtp}
      />
      <Stack.Screen name="UserDasboard" component={UserDasboard} />
      <Stack.Screen name="UserDasboardMenu" component={UserDasboardMenu} />
      <Stack.Screen name="ViewProfile" component={ViewProfile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="AddBusiness" component={AddBusiness} />
      <Stack.Screen name="AddProperty" component={AddProperty} />
      <Stack.Screen name="AddMyFeeds" component={AddMyFeeds} />
      <Stack.Screen name="AddVehicle" component={AddVehicle} />
      <Stack.Screen name="AddService" component={AddService} />
      <Stack.Screen name="AddProduct" component={AddProduct} />
      <Stack.Screen name="AddJob" component={AddJob} />
      <Stack.Screen name="ViewProperty" component={ViewProperty} />
      <Stack.Screen name="ViewVehicle" component={Viewvehicle} />
      <Stack.Screen name="ViewProduct" component={ViewProduct} />
      <Stack.Screen name="ViewService" component={ViewService} />
      <Stack.Screen name="ViewJob" component={ViewJob} />
      <Stack.Screen name="ApplyJob" component={ApplyJob} />
      <Stack.Screen name="JobsApplications" component={JobsApplications} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="TermsandCondition" component={TermsandCondition} />
      <Stack.Screen name="AroundMe" component={AroundMe} />
      <Stack.Screen name="MyProperties" component={MyProperties} />
      <Stack.Screen name="ListMyProperty" component={ListMyProperty} />
      <Stack.Screen name="ListMyAroundMe" component={ListMyAroundMe} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="ContactForm" component={ContactForm} />
      <Stack.Screen name="UserMenuTabsOther" component={UserMenuTabsOther} />
    </Stack.Navigator>
  );
};

export default Routes;
