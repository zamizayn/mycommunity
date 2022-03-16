import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  ToastAndroid,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
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
import DropDown from './components/DropDown';
import BackBtn_white from './assets/svg/BackBtn_white.svg';
import theme from './config/styles.js';
import Mall_Icon from './assets/svg/Mall_Icon.svg';
import PhoneSvg from './assets/svg/Phone_icon.svg';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMobile} from '@fortawesome/free-solid-svg-icons';
import {faMapPin} from '@fortawesome/free-solid-svg-icons';
import {faDirections} from '@fortawesome/free-solid-svg-icons';
import {faPhone} from '@fortawesome/free-solid-svg-icons';
import {faEye} from '@fortawesome/free-solid-svg-icons';
import {faWhatsapp} from '@fortawesome/free-brands-svg-icons';
import {faBuilding} from '@fortawesome/free-solid-svg-icons';
import {faTag} from '@fortawesome/free-solid-svg-icons';

import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import {ApiHelper} from './helpers/ApiHelper';
import {API} from './config/api';
import {CONSTANTS} from './config/constants';
import {AppColors} from './Themes';
import Map_Direction_Arrow from './assets/svg/Map_Direction_Arrow.svg';
// import Arabic_Restaurant from '../src/assets/svg/around_me_pins/Arabic_Restaurant.svg';
// import Asian_Restuarant from '../src/assets/svg/around_me_pins/Asian_Restuarant.svg';
// import Beauty_Saloon from '../src/assets/svg/around_me_pins/Beauty_Saloon.svg';
// import Clothing from '../src/assets/svg/around_me_pins/Clothing.svg';
// import Coffee_Tea from '../src/assets/svg/around_me_pins/Coffee_Tea.svg';
// import Home from '../src/assets/svg/around_me_pins/Home.svg';

import Hotel from '../src/assets/svg/pins/hotel.svg';
import Event from '../src/assets/svg/pins/event.svg';
import Shopping from '../src/assets/svg/pins/shopping.svg';
import Clothing from '../src/assets/svg/pins/clothing.svg';
import Toys from '../src/assets/svg/pins/toys.svg';
import Recovery from '../src/assets/svg/pins/recovery.svg';
import BeautySaloon from '../src/assets/svg/pins/beautysaloon.svg';
import Electric from '../src/assets/svg/pins/electric.svg';
import Gym from '../src/assets/svg/pins/gym.svg';
import Rentacar from '../src/assets/svg/pins/rentacar.svg';
import Placestovisit from '../src/assets/svg/pins/placetovisit.svg';
import ArabicRestaurant from '../src/assets/svg/pins/restuarant.svg';
import Opticals from '../src/assets/svg/pins/opticals.svg';
import Hospital from '../src/assets/svg/pins/hospital.svg';
import AsianRestaurant from '../src/assets/svg/pins/restuarant.svg';
import Coffee from '../src/assets/svg/pins/coffee.svg';
import {useDebouncedCallback} from 'use-debounce';
import {flexDirection} from 'styled-system';

// import MapView from './MapView';
// import appConfig from '../app.json';

const arabic_restaurant_gif = require('../src/assets/gif/around_me/Arabic-restaurant.gif');
const asian_restaurant_gif = require('../src/assets/gif/around_me/Asian-Restuarent.gif');
const beauty_saloon_gif = require('../src/assets/gif/around_me/Beauty-Saloon.gif');
const coffee_tea_gif = require('../src/assets/gif/around_me/Coffie-&-Tea.gif');
const electric_electrical_gif = require('../src/assets/gif/around_me/Electric--&-Electrical.gif');
const event_gif = require('../src/assets/gif/around_me/Event.gif');
const gym_gif = require('../src/assets/gif/around_me/Gym.gif');
const hospital_gif = require('../src/assets/gif/around_me/Hospital.gif');
const hotels_gif = require('../src/assets/gif/around_me/Hotels.gif');
const optical_gif = require('../src/assets/gif/around_me/Optical.gif');
const place_to_visit_gif = require('../src/assets/gif/around_me/Place-to-visit.gif');
const recovery_van_gif = require('../src/assets/gif/around_me/Recovery-Van.gif');
const rent_a_car_gif = require('../src/assets/gif/around_me/Rent-a-Car.gif');
const supermarket_gif = require('../src/assets/gif/around_me/Supermarket.gif');
const toy_shop_gif = require('../src/assets/gif/around_me/Toy-shop.gif');

const {height, width} = Dimensions.get('window');
export default function AroundMe({navigation}) {
  const [forceLocation, setForceLocation] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [locationDialog, setLocationDialog] = useState(true);
  const [significantChanges, setSignificantChanges] = useState(false);
  const [observing, setObserving] = useState(false);
  const [foregroundService, setForegroundService] = useState(false);
  const [useLocationManager, setUseLocationManager] = useState(false);
  // const [location, setLocation] = useState(null);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);

  // const [latitudeDelta, setLatitudeDelta] = useState(4);
  // const [longitudeDelta, setLongitudeDelta] = useState(0.05);
  const [latitudeDelta, setLatitudeDelta] = useState(0.03434761425455);
  const [longitudeDelta, setLongitudeDelta] = useState(0.02284269779920578);
  const [dragging, setDragging] = useState(false);

  const [aroundMeList, setAroundMeList] = useState([]);
  const [iconicProductList, setIconicProductList] = useState([]);
  const [loader, setLoader] = useState(false);

  const [selectedMarkerData, setSelectedMarkerData] = useState({});
  const [showMarkerModal, setShowMarkerModal] = useState(false);
  const [isSelectedMarkerPromotional, setIsSelectedPromotional] =
    useState(false);

  const categories = [
    '200',
    '201',
    '202',
    '208',
    '209',
    '230',
    '213',
    '232',
    '217',
    '231',
    '235',
    '224',
    '234',
    '233',
    '227',
    '228',
  ];

  const mapStyle = [
    {
      elementType: 'labels',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'administrative.land_parcel',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'administrative.neighborhood',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
  ];

  const [categoryList, setCategoryList] = useState([
    {label: 'Choose all category', value: ''},
    {label: 'Hotels', value: 200},
    {label: 'Events', value: 201},
    {label: 'Super market', value: 202},
    {label: 'Clothing', value: 208},
    {label: 'Toy shop', value: 209},
    {label: 'Recovery', value: 212},
    {label: 'Beauty salon', value: 213},
    {label: 'Electric and Electronic', value: 216},
    {label: 'Gym', value: 208},
    {label: 'Rent a car', value: 10},
    {label: 'Places to visit', value: 223},
    {label: 'Arabic restaurant', value: 224},
    {label: 'Optical', value: 225},
    {label: 'Hospital', value: 226},
    {label: 'Asian restaurant', value: 227},
    {label: 'Coffee & Tea', value: 228},
  ]);

  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);


  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
         
        </Text>
      );
    }
    return null;
  };
  const [selectedCategory, setSelectedCategory] = useState(200);

  const watchId = useRef(null);

  // const debouncedPanDragEnd = useDebouncedCallback(
  //   // function
  //   value => {
  //     console.log('debouncedPanDragEnd', JSON.stringify(value));
  //     setLatitude(value?.latitude);
  //     setLongitude(value?.longitude);
  //   },
  //   // delay in ms
  //   3000,
  // );

  const centerMap = locationCenter => {
    if (mapRef && locationCenter) {
      mapRef.current.animateToRegion(locationCenter);
    }
  };

  useEffect(() => {
    return () => {
      removeLocationUpdates();
    };
  }, [removeLocationUpdates]);

  useEffect(() => {
    console.log('getLocationUpdates');
    setAroundMeList([]);
    getLocationUpdates();
    // getAroundMe();
  }, []);

  // useEffect(() => {
  //   console.log('loc updated');
  //   setAroundMeList([]);
  //   getAroundMe();
  // }, [location, selectedCategory]);

  useEffect(() => {
    console.log('loc updated');
    setAroundMeList([]);
    getAroundMe(location);
  }, [location, selectedCategory]);

  useEffect(() => {
    console.log('loc new center');
    centerMap(location);
  }, [location]);

  const getAroundMe = async locationCurrent => {
    // let lati = parseFloat(location?.coords?.latitude) || parseFloat(0.0);
    // let longi = parseFloat(location?.coords?.longitude) || parseFloat(0.0);
    // let url = `around-me?latitude=${lati}&longitude=${longi}&categoryId=${selectedCategory}`;

    setSelectedMarkerData({});
    setShowMarkerModal(false);
    setIsSelectedPromotional(false);

    let lati = parseFloat(locationCurrent?.latitude) || parseFloat(0.0);
    let longi = parseFloat(locationCurrent?.longitude) || parseFloat(0.0);
    var url = `around-me?latitude=${lati}&longitude=${longi}`;
    if (selectedCategory !== 200) {
      url = url + `&categoryId=${selectedCategory}`;
    }

    console.log(API.baseUrl + url);

    await ApiHelper.get(API.baseUrl + url)
      .then(res => {
        // console.log('aroundmepromo', res.data.data.promotionData);
        var dataLen = res.data.data.promotionData;
        var aroundList = [];
        if (dataLen.length) {
          dataLen?.map((each, index) => {
            if (categories.indexOf(each?.category) > -1) {
              // console.log(each?.category);
              aroundList.push(each);
            }
          });

          setAroundMeList(aroundList);
        }
        // console.log('aroundmeicon', res?.data?.data?.iconicProductData);
        var iconicListData = res?.data?.data?.iconicProductData;
        var iconicList = [];
        if (iconicListData.length) {
          iconicListData?.map((each, index) => {
            if (categories.indexOf(each?.category) > -1) {
              console.log(each?.category);
              iconicList.push(each);
            }
          });
          setIconicProductList(iconicList);
        }
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
      });
  };

  const getMarkerIcon = (isBlinkingEnabled = false, category) => {
    // var src = '';
    var svgPin;
    // return hotels_gif;
    if (isBlinkingEnabled) {
      // return <Arabic_Restaurant height="26" width="28" />;
      // return require('./assets/svg/around_me_pins/Arabic_Restaurant.svg');
      // switch (category) {
      //   case '200': {
      //     src = hotels_gif;
      //     break;
      //   }
      //   case '201': {
      //     src = event_gif;
      //     break;
      //   }
      //   case '202': {
      //     src = supermarket_gif;
      //     break;
      //   }
      //   case '208': {
      //     src = beauty_saloon_gif;
      //     break;
      //   }
      //   case '209': {
      //     src = toy_shop_gif;
      //     break;
      //   }
      //   case '230': {
      //     src = recovery_van_gif;
      //     break;
      //   }
      //   case '213': {
      //     src = beauty_saloon_gif;
      //     break;
      //   }
      //   case '232': {
      //     src = electric_electrical_gif;
      //     break;
      //   }
      //   case '217': {
      //     src = gym_gif;
      //     break;
      //   }
      //   case '231': {
      //     src = rent_a_car_gif;
      //     break;
      //   }
      //   case '235': {
      //     src = place_to_visit_gif;
      //     break;
      //   }
      //   case '224': {
      //     src = arabic_restaurant_gif;
      //     break;
      //   }
      //   case '234': {
      //     src = optical_gif;
      //     break;
      //   }
      //   case '233': {
      //     src = hospital_gif;
      //     break;
      //   }
      //   case '227': {
      //     src = asian_restaurant_gif;
      //     break;
      //   }
      //   case '228': {
      //     src = coffee_tea_gif;
      //     break;
      //   }
      // }

      // return (
      //   <Image
      //     source={src}
      //     style={{width: 128, height: 128}}
      //     resizeMode="contain"
      //     resizeMethod="resize"
      //   />
      // );

      switch (category) {
        case '200': {
          svgPin = <Hotel height="36" width="40" />;
          break;
        }
        case '201': {
          svgPin = <Event height="36" width="40" />;
          break;
        }
        case '202': {
          svgPin = <Shopping height="36" width="40" />;
          break;
        }
        case '208': {
          svgPin = <Clothing height="36" width="40" />;
          break;
        }
        case '209': {
          svgPin = <Toys height="36" width="40" />;
          break;
        }
        case '230': {
          svgPin = <Recovery height="36" width="40" />;
          break;
        }
        case '213': {
          svgPin = <BeautySaloon height="36" width="40" />;
          break;
        }
        case '232': {
          svgPin = <Electric height="36" width="40" />;
          break;
        }
        case '217': {
          svgPin = <Gym height="36" width="40" />;
          break;
        }
        case '231': {
          svgPin = <Rentacar height="36" width="40" />;
          break;
        }
        case '235': {
          svgPin = <Placestovisit height="36" width="40" />;
          break;
        }
        case '224': {
          svgPin = <ArabicRestaurant height="36" width="40" />;
          break;
        }
        case '234': {
          svgPin = <Opticals height="36" width="40" />;
          break;
        }
        case '233': {
          svgPin = <Hospital height="36" width="40" />;
          break;
        }
        case '227': {
          svgPin = <AsianRestaurant height="36" width="40" />;
          break;
        }
        case '228': {
          svgPin = <Coffee height="36" width="40" />;
          break;
        }
        default: {
          console.log('unk');
          // svgPin = null;
          break;
        }
      }

      // return (
      //   <Image
      //     source={src}
      //     style={{width: 26, height: 28}}
      //     resizeMode="contain"
      //     resizeMethod="resize"
      //   />
      // );
      // return <Hotel height="26" width="28" />;

      // return src;
      return svgPin;
    } else {
      // switch (category) {
      //   case '200': {
      //     src = require('../src/assets/images/hoteol-pin.png');
      //     break;
      //   }
      //   case '201': {
      //     src = require('../src/assets/images/events-pin.png');
      //     break;
      //   }
      //   case '202': {
      //     src = require('../src/assets/images/shopping-pin.png');
      //     break;
      //   }
      //   case '208': {
      //     src = require('../src/assets/images/clothing-pin.png');
      //     break;
      //   }
      //   case '209': {
      //     src = require('../src/assets/images/toys-pin.png');
      //     break;
      //   }
      //   case '212': {
      //     src = require('../src/assets/images/recovery-van-pin.png');
      //     break;
      //   }
      //   case '213': {
      //     src = require('../src/assets/images/clothing-pin.png');
      //     break;
      //   }
      //   case '216': {
      //     src = require('../src/assets/images/electric-and-electronic-pin.png');
      //     break;
      //   }
      //   case '208': {
      //     src = require('../src/assets/images/gym-pin.png');
      //     break;
      //   }
      //   case '10': {
      //     src = require('../src/assets/images/rent-a-car-pin.png');
      //     break;
      //   }
      //   case '223': {
      //     src = require('../src/assets/images/place-to-visit-pin.png');
      //     break;
      //   }
      //   case '224': {
      //     src = require('../src/assets/images/restaurant-pin.png');
      //     break;
      //   }
      //   case '225': {
      //     src = require('../src/assets/images/optical-pin.png');
      //     break;
      //   }
      //   case '226': {
      //     src = require('../src/assets/images/hospital-pin.png');
      //     break;
      //   }
      //   case '227': {
      //     src = require('../src/assets/images/restaurant-pin.png');
      //     break;
      //   }
      //   case '228': {
      //     src = require('../src/assets/images/restaurant-pin.png');
      //     break;
      //   }
      //   // default: {
      //   //   return require('../src/assets/images/promotion-icon.png');
      //   // }
      // }

      switch (category) {
        case '200': {
          svgPin = <Hotel height="26" width="28" />;
          break;
        }
        case '201': {
          svgPin = <Event height="26" width="28" />;
          break;
        }
        case '202': {
          svgPin = <Shopping height="26" width="28" />;
          break;
        }
        case '208': {
          svgPin = <Clothing height="26" width="28" />;
          break;
        }
        case '209': {
          svgPin = <Toys height="26" width="28" />;
          break;
        }
        case '230': {
          svgPin = <Recovery height="26" width="28" />;
          break;
        }
        case '213': {
          svgPin = <BeautySaloon height="26" width="28" />;
          break;
        }
        case '232': {
          svgPin = <Electric height="26" width="28" />;
          break;
        }
        case '217': {
          svgPin = <Gym height="26" width="28" />;
          break;
        }
        case '231': {
          svgPin = <Rentacar height="26" width="28" />;
          break;
        }
        case '235': {
          svgPin = <Placestovisit height="26" width="28" />;
          break;
        }
        case '224': {
          svgPin = <ArabicRestaurant height="26" width="28" />;
          break;
        }
        case '234': {
          svgPin = <Opticals height="26" width="28" />;
          break;
        }
        case '233': {
          svgPin = <Hospital height="26" width="28" />;
          break;
        }
        case '227': {
          svgPin = <AsianRestaurant height="26" width="28" />;
          break;
        }
        case '228': {
          svgPin = <Coffee height="26" width="28" />;
          break;
        }
        default: {
          console.log('unk');
          // svgPin = null;
          break;
        }
      }

      // return (
      //   <Image
      //     source={src}
      //     style={{width: 26, height: 28}}
      //     resizeMode="contain"
      //     resizeMethod="resize"
      //   />
      // );
      // return <Hotel height="26" width="28" />;

      // return src;
      return svgPin;
    }
  };

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        'Turn on Location Services to allow MyCommunity to determine your location.',
        '',
        [
          {text: 'Go to Settings', onPress: openSetting},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        // setLocation(position);
        console.log(position);
        const locationCurrent = {
          latitude: parseFloat(position?.coords?.latitude) || parseFloat(0.0),
          longitude: parseFloat(position?.coords?.longitude) || parseFloat(0.0),

          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        };
        setLocation(locationCurrent);
        setLatitude(position?.coords?.latitude);
        setLongitude(position?.coords?.longitude);
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
        // setLocation(null);
        console.log(error);
        setLocation(null);
        setLatitude(null);
        setLongitude(null);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: highAccuracy,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: forceLocation,
        forceLocationManager: useLocationManager,
        showLocationDialog: locationDialog,
      },
    );
  };

  const getLocationUpdates = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    if (Platform.OS === 'android' && foregroundService) {
      await startForegroundService();
    }

    setObserving(true);

    watchId.current = Geolocation.watchPosition(
      position => {
        // setLocation(position);
        console.log(position);
        const locationCurrent = {
          latitude: parseFloat(position?.coords?.latitude) || parseFloat(0.0),
          longitude: parseFloat(position?.coords?.longitude) || parseFloat(0.0),

          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        };
        setLocation(locationCurrent);
        setLatitude(position?.coords?.latitude);
        setLongitude(position?.coords?.longitude);
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
        // setLocation(null);
        console.log(error);
        setLocation(null);
        setLatitude(null);
        setLongitude(null);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: highAccuracy,
        distanceFilter: 50,
        interval: 5000,
        fastestInterval: 5000,
        forceRequestLocation: forceLocation,
        forceLocationManager: useLocationManager,
        showLocationDialog: locationDialog,
        useSignificantChanges: significantChanges,
      },
    );
  };

  const removeLocationUpdates = useCallback(() => {
    if (watchId.current !== null) {
      stopForegroundService();
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
      setObserving(false);
    }
  }, [stopForegroundService]);

  const startForegroundService = async () => {
    if (Platform.Version >= 26) {
      await VIForegroundService.createNotificationChannel({
        id: 'locationChannel',
        name: 'Location Tracking Channel',
        description: 'Tracks location of user',
        enableVibration: false,
      });
    }

    return VIForegroundService.startService({
      channelId: 'locationChannel',
      id: 420,
      title: 'MyCommunity',
      text: 'Tracking location updates',
      icon: 'ic_launcher',
    });
  };

  const stopForegroundService = useCallback(() => {
    VIForegroundService.stopService().catch(err => err);
  }, []);

  let pickerStyle = {
    marginTop: height / 7.8,
    marginLeft: width / 20,
    // marginRight:12,
    borderRadius: 8,
    paddingLeft: 8,
    width: width / 1.17,
    //  marginLeft:12
  };

  const CustomCalloutView = ({details}) => {
    return (
      <View
        style={{
          width: '100%',
          minHeight: 200,
          alignItems: 'flex-start',
          flexDirection: 'row',
          backgroundColor: 'white',
          paddingStart: 12,
          paddingEnd: 12,
          paddingTop: 12,
          paddingBottom: 12,
        }}>
        <ScrollView
          style={{
            width: '100%',
            minHeight: 200,
            backgroundColor: 'white',
          }}>
          <View
            style={{
              width: '100%',
              minHeight: 200,
              alignItems: 'flex-start',
              flexDirection: 'row',
              backgroundColor: 'white',
            }}>
            <View
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                paddingStart: 12,
                paddingEnd: 12,
                flexDirection: 'column',
                flex: 1,
              }}>
              {details?.logoPic ? (
                <Image
                  style={{
                    width: 120,
                    height: 100,
                    resizeMode: 'cover',
                  }}
                  source={{
                    uri: CONSTANTS.IMAGE_URL_PREFIX + details?.logoPic,
                  }}
                />
              ) : (
                <Image
                  style={{
                    width: 120,
                    height: 100,
                    resizeMode: 'cover',
                    flex: 1,
                  }}
                  source={require('./assets/images/placeholder-img.png')}
                />
              )}

              <Text
                style={{
                  fontWeight: 'bold',
                  marginTop: 4,
                }}
                numberOfLines={1}>
                {details?.companyName}
              </Text>

              <Text style={{justifyContent: 'flex-start', marginTop: 4}}>
                {/* <PhoneSvg width={20} height={20} /> */}
                <FontAwesomeIcon icon={faMapPin} color={'#bd1d53'} />{' '}
                <Text> {details?.address}</Text>
              </Text>

              {details?.noOfRooms ? (
                <Text style={{justifyContent: 'flex-start', marginTop: 4}}>
                  <FontAwesomeIcon icon={faBuilding} color={'#bd1d53'} />{' '}
                  <Text style={{marginStart: 4}}> {details?.noOfRooms}</Text>
                </Text>
              ) : null}
              {details?.price ? (
                <Text style={{justifyContent: 'flex-start', marginTop: 4}}>
                  <FontAwesomeIcon icon={faTag} color={'#bd1d53'} />{' '}
                  <Text style={{marginStart: 4}}> {details?.price}</Text>
                </Text>
              ) : null}

              <TouchableOpacity
                onPress={() => {
                  // console.log('phone', details?.contactDetails?.contactNumber);

                  // onCalloutPress(details?.mapDetails);
                  onPhonePress(details);
                }}>
                <Text style={{justifyContent: 'flex-start', marginTop: 4}}>
                  {/* <PhoneSvg width={20} height={20} /> */}
                  <FontAwesomeIcon icon={faMobile} color={'#bd1d53'} />{' '}
                  <Text style={{color: '#007bff', marginStart: 4}}>
                    {' '}
                    {details?.contactDetails?.contactNumber}
                  </Text>
                </Text>
              </TouchableOpacity>
              {details?.description ? (
                <Text
                  style={{justifyContent: 'flex-start', marginTop: 4}}
                  numberOfLines={2}>
                  {details?.description}
                </Text>
              ) : null}
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    // console.log('phone', details?.contactDetails?.contactNumber);

                    onCalloutPress(details?.mapDetails);
                    // onPhonePress(details?.contactDetails?.contactNumber);
                  }}>
                  <FontAwesomeIcon
                    size={32}
                    icon={faDirections}
                    color={'#bd1d53'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    // console.log('phone', details?.contactDetails?.contactNumber);

                    // onCalloutPress(details?.mapDetails);
                    onPhonePress(details);
                  }}>
                  <FontAwesomeIcon size={32} icon={faPhone} color={'#bd1d53'} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    // console.log('phone', details?.contactDetails?.contactNumber);

                    // onCalloutPress(details?.mapDetails);
                    onWhatsappPress(details);
                  }}>
                  <FontAwesomeIcon
                    size={32}
                    icon={faWhatsapp}
                    color={'#bd1d53'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    // console.log('phone', details?.contactDetails?.contactNumber);

                    // onCalloutPress(details?.mapDetails);
                    onViewDetailsPress(details);
                  }}>
                  <FontAwesomeIcon size={32} icon={faEye} color={'#bd1d53'} />
                </TouchableOpacity>
              </View>
            </View>
            {/* <View>
          <Image
            source={{uri: 'https://facebook.github.io/react/logo-og.png'}}
            style={{width: 100, height: 100}}
          />
        </View> */}

            {/* <View
              style={{
                width: '45%',
                height: '100%',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                paddingStart: 12,
                paddingEnd: 12,
                paddingBottom: 12,
                paddingTop: 12,
                flexDirection: 'column',
              }}>
              <TouchableOpacity
                onPress={() => {
                  // console.log('direction', details?.mapDetails);

                  onCalloutPress(details?.mapDetails);
                }}>
                <Text
                  style={{
                    width: '100%',
                    height: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                  }}>

                  <View
                    style={{
                      width: '100%',
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignContent: 'center',
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: '#007bff',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center',
                      }}>
                      <Map_Direction_Arrow height="12" width="12" />
                    </View>

                    <Text style={{color: '#007bff', marginStart: 12}}>
                      Directions
                    </Text>
                  </View>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  // console.log('view now', details);

                  onViewDetailsPress(details);
                }}>
                <Text style={{color: '#007bff', marginStart: 12}}>
                  View Now
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </ScrollView>
      </View>
    );
  };

  const onCalloutPress = async mapDetails => {
    // console.log(mapDetails);
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${mapDetails?.lat},${mapDetails?.lng}`;
    const label = 'Map';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

  const onPhonePress = async details => {
    let phoneNumber = '';
    let phone = details?.contactDetails?.contactNumber
      ? details?.contactDetails?.contactNumber
      : details?.creatorBusinessDetails?.contactDetails?.contactNumber;

    if (phone) {
      if (Platform.OS === 'android') {
        phoneNumber = `tel:${phone}`;
      } else {
        phoneNumber = `telprompt:${phone}`;
      }

      Linking.openURL(phoneNumber);
    }
  };

  const onWhatsappPress = async details => {
    let phoneNumber = '';
    let phone = details?.contactDetails?.contactNumber
      ? details?.contactDetails?.contactNumber
      : details?.creatorBusinessDetails?.contactDetails?.contactNumber;
    if (phone) {
      Linking.openURL(
        'whatsapp://send?text=&phone=' +
          // CONSTANTS.COUNTRY_CODE_TEXT +
          phone,
      );
    }
  };

  const onViewDetailsPress = async details => {
    console.log('onViewDetailsPress');
    if (details?._id && !isSelectedMarkerPromotional) {
      navigation.navigate('DirectoryDetail', {
        id: details?._id,
      });
    } else {
      console.log('onViewDetailsPressPromo');
      navigation.navigate('MyDealsDetails', {
        id: details?._id,
      });
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* <MapView coords={location?.coords || null} /> */}

      {/* <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View>
          <View style={styles.option}>
            <Text>Enable High Accuracy</Text>
            <Switch onValueChange={setHighAccuracy} value={highAccuracy} />
          </View>

          {Platform.OS === 'ios' && (
            <View style={styles.option}>
              <Text>Use Significant Changes</Text>
              <Switch
                onValueChange={setSignificantChanges}
                value={significantChanges}
              />
            </View>
          )}

          {Platform.OS === 'android' && (
            <>
              <View style={styles.option}>
                <Text>Show Location Dialog</Text>
                <Switch
                  onValueChange={setLocationDialog}
                  value={locationDialog}
                />
              </View>
              <View style={styles.option}>
                <Text>Force Location Request</Text>
                <Switch
                  onValueChange={setForceLocation}
                  value={forceLocation}
                />
              </View>
              <View style={styles.option}>
                <Text>Use Location Manager</Text>
                <Switch
                  onValueChange={setUseLocationManager}
                  value={useLocationManager}
                />
              </View>
              <View style={styles.option}>
                <Text>Enable Foreground Service</Text>
                <Switch
                  onValueChange={setForegroundService}
                  value={foregroundService}
                />
              </View>
            </>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Get Location" onPress={getLocation} />
          <View style={styles.buttons}>
            <Button
              title="Start Observing"
              onPress={getLocationUpdates}
              disabled={observing}
            />
            <Button
              title="Stop Observing"
              onPress={removeLocationUpdates}
              disabled={!observing}
            />
          </View>
        </View>
        <View style={styles.result}>
          <Text>Latitude: {location?.coords?.latitude || ''}</Text>
          <Text>Longitude: {location?.coords?.longitude || ''}</Text>
          <Text>Heading: {location?.coords?.heading}</Text>
          <Text>Accuracy: {location?.coords?.accuracy}</Text>
          <Text>Altitude: {location?.coords?.altitude}</Text>
          <Text>Altitude Accuracy: {location?.coords?.altitudeAccuracy}</Text>
          <Text>Speed: {location?.coords?.speed}</Text>
          <Text>Provider: {location?.provider || ''}</Text>
          <Text>
            Timestamp:{' '}
            {location?.timestamp
              ? new Date(location.timestamp).toLocaleString()
              : ''}
          </Text>
        </View>
      </ScrollView> */}

      <Container>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: AppColors.primaryColor,
              height: height / 12,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                paddingStart: width / 20,
              }}
              onPress={() => {
                //  this.props.navigation.openDrawer()
                navigation.goBack('Home');
              }}>
              <BackBtn_white height="22" width="20" />
            </TouchableOpacity>

            <Text
              style={{
                color: 'white',
                marginStart: width / 22,
                fontSize: width / 22,
              }}>
              Around Me
            </Text>

            {/* <DropDown
              width={width / 1.32}
              placeholder="Choose Category *"
              placeholderTextColor="#808080"
              data={categoryList}
              // value={selectedCategory.value}
              multiline={false}
              onChange={(value, index) => {
                // this.setState(
                //   {
                //     categoryId: value,
                //   },
                //   () => {
                //     this.fetchSubCategoryList();
                //   },
                // );
              }}
            />
          </View> */}
          </View>

          {/* <View
            style={{
              backgroundColor: 'white',
              color: '#000000',
              height: height / 16,
              paddingLeft: width / 46,
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 12,
            }}>
            <DropDown
              data={categoryList}
              placeholder="Choose Category"
              placeholderTextColor="#808080"
              value={selectedCategory?.value}
              onChange={value => {
                // this.setState(
                //   {
                //     userType: value,
                //   },
                //   () => {
                //     if (value == 'Corporate') {
                //       this.setState({isCorporate: true});
                //     } else {
                //       this.setState({isCorporate: false});
                //     }
                //   },
                // );
                console.log(value);
                setSelectedCategory(value);
                // setAroundMeList([]);
                // getAroundMe();
              }}
              containerStyle={{
                height: height / 18,
                width: width / 1.32,
                // paddingLeft: width / 45,
                paddingRight: width / 45,
              }}
              pickerStyle={pickerStyle}
              dropdownPosition={0}
              rippleInsets={{top: 0, bottom: 0}}
              dropdownOffset={{
                top: height / 70,
              }}
              fontSize={width / 25}
              baseColor="#000000"
              inputContainerStyle={{borderBottomWidth: 0}}
              renderAccessory={this.renderAccessory}
              style={{
                color: '#000000',
                fontSize: width / 25,
                alignItems: 'center',
                alignSelf: 'center',
                fontWeight: 'bold',
              }}
            />
          </View> */}
          <View style={styles.dropContainer}>
        {/* {renderLabel()} */}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={categoryList}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
            setSelectedCategory(item.value);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />
      </View>

          <GooglePlacesAutocomplete
            placeholder="Choose a location in qatar"
            fetchDetails={true}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log(data, details);
              console.log(JSON.stringify(details.geometry.location));
              const location = {
                latitude:
                  parseFloat(details?.geometry?.location?.lat) ||
                  parseFloat(0.0),
                longitude:
                  parseFloat(details?.geometry?.location?.lng) ||
                  parseFloat(0.0),

                latitudeDelta: latitudeDelta,
                longitudeDelta: longitudeDelta,
              };
              setLocation(location);
              setLatitude(details?.geometry?.location?.lat);
              setLongitude(details?.geometry?.location?.lng);
            }}
            query={{
              key: CONSTANTS.MAP_KEY,
              language: 'en',
              components: 'country:qa|',
            }}
            styles={{
              textInputContainer: {
                backgroundColor: 'grey',
              },
              textInput: {
                height: 44,
                color: '#5d5d5d',
                fontSize: 16,
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
              listView: {
                zIndex: 999,
              },
            }}
          />
          {/* {location?.coords?.latitude && ( */}
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            customMapStyle={mapStyle}
            // minZoomLevel={8}
            // maxZoomLevel={17}
            // zoomControlEnabled
            // zoomEnabled
            cacheEnabled={false}
            mapType={'standard'}
            showsPointsOfInterest={false}
            // onPoiClick={e => {
            //   console.log('on Point Of Interest...'); // <------ add this
            // }}
            // showsUserLocation={true}
            // initialRegion={{
            //   latitude: location?.coords?.latitude || 0.0,
            //   longitude: location?.coords?.longitude || 0.0,
            // }}
            // region={{
            //   latitude: 8.72,
            //   longitude: 76.74,
            // }}
            scrollEnabled={Platform.OS === 'ios' ? false : true}
            // region={{
            //   // latitude:
            //   //   parseFloat(location?.coords?.latitude) || parseFloat(0.0),
            //   // longitude:
            //   //   parseFloat(location?.coords?.longitude) || parseFloat(0.0),

            //   latitude: parseFloat(latitude) || parseFloat(0.0),
            //   longitude: parseFloat(longitude) || parseFloat(0.0),

            //   latitudeDelta: latitudeDelta,
            //   longitudeDelta: longitudeDelta,
            // }}
            initialRegion={location}
            // onPanDrag={e => {
            //   // console.log(
            //   //   'onPanDrag',
            //   //   JSON.stringify(e.nativeEvent.coordinate),
            //   // );
            //   setDragging(true);
            // }}
            onRegionChangeComplete={region => {
              // console.log(' region', region);
              setLatitudeDelta(region?.latitudeDelta);
              setLongitudeDelta(region?.longitudeDelta);
              // if (dragging) {
              // setLatitude(region?.latitude);
              // setLongitude(region?.longitude);

              //   // debouncedPanDragEnd(region);
              //   setDragging(false);
              // }
            }}
            // animateToCoordinate
            // showsMyLocationButton
            onPress={e => {
              // console.log('map click');
              setSelectedMarkerData({});
              setShowMarkerModal(false);
              setIsSelectedPromotional(false);

              // console.log(JSON.stringify(e.nativeEvent));
              const locationPress = {
                latitude:
                  parseFloat(e.nativeEvent.coordinate.latitude) ||
                  parseFloat(0.0),
                longitude:
                  parseFloat(e.nativeEvent.coordinate.longitude) ||
                  parseFloat(0.0),

                latitudeDelta: latitudeDelta,
                longitudeDelta: longitudeDelta,
              };
              setLocation(locationPress);
              setLatitude(e.nativeEvent.coordinate.latitude);
              setLongitude(e.nativeEvent.coordinate.longitude);
            }}>
            <Marker
              coordinate={{
                // latitude:
                //   parseFloat(location?.coords?.latitude) || parseFloat(0.0),
                // longitude:
                //   parseFloat(location?.coords?.longitude) || parseFloat(0.0),

                latitude: parseFloat(latitude) || parseFloat(0.0),
                longitude: parseFloat(longitude) || parseFloat(0.0),
              }}
              // image={require('../src/assets/images/around_me.png')}

              title={'My Location'}
              description={''}>
              <Image
                source={require('../src/assets/images/around_me.png')}
                style={{width: 26, height: 28}}
                resizeMode="contain"
                resizeMethod="resize"
              />
            </Marker>

            {/* <Marker
              coordinate={{
                latitude:
                  parseFloat(location?.coords?.latitude) || parseFloat(0.0),
                longitude:
                  parseFloat(location?.coords?.longitude) || parseFloat(0.0),
              }}
              // image={require('../src/assets/images/around_me.png')}

              title={'My Location'}
              description={''}>
              <Image
                source={require('../src/assets/images/around_me.png')}
                style={{width: 26, height: 28}}
                resizeMode="contain"
                resizeMethod="resize"
              />
            </Marker> */}

            {/* <Marker
              coordinate={{
                latitude: 8.7249971,
                longitude: 76.7414921,
              }}
              image={getMarkerIcon(true, 200)}
              title={'Chinchu Stores'}
              description={''}>
              <Callout>
                <CustomCalloutView />
              </Callout>
            </Marker>
            <Marker
              coordinate={{
                latitude: 8.725463,
                longitude: 76.7405829,
              }}
              image={require('../src/assets/images/map-pin-business-centre.png')}
              title={'കർഷക മിത്ര. ജൈവ പച്ചക്കറി വിൽപ്പന കേന്ദ്രം'}
              description={''}
            /> */}
            {aroundMeList?.map((each, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(each.mapDetails.lat),
                  longitude: parseFloat(each.mapDetails.lng),
                }}
                // image={getMarkerIcon(each.isBlinkingEnabled, each.category)}
                // title={each.creatorBusinessDetails.name}
                // description={each.creatorBusinessDetails.desc}
                onPress={() => {
                  console.log('marker click');
                  setSelectedMarkerData(each);
                  setShowMarkerModal(true);
                  setIsSelectedPromotional(true);
                }}>
                {/* <Image
                  source={getMarkerIcon(each.isBlinkingEnabled, each.category)}
                  style={{width: 96, height: 96}}
                  resizeMode="contain"
                  resizeMethod="resize"
                /> */}

                {getMarkerIcon(each.isBlinkingEnabled, each.category)}
                {/* <Callout onPress={() => onCalloutPress(each.mapDetails)}>
                  <CustomCalloutView
                    details={each?.creatorBusinessDetails}
                    image={each?.imageKey}
                  />
                </Callout> */}
              </Marker>
            ))}
            {iconicProductList?.map((each, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(each.mapDetails.lat),
                  longitude: parseFloat(each.mapDetails.lng),
                }}
                // image={getMarkerIcon(each.isBlinkingEnabled, each.category)}
                // title={each.creatorBusinessDetails.name}
                // description={each.creatorBusinessDetails.desc}
                onPress={() => {
                  console.log('marker click');
                  setSelectedMarkerData(each);
                  setShowMarkerModal(true);
                  setIsSelectedPromotional(false);
                }}>
                {/* <Image
                  source={getMarkerIcon(each.isBlinkingEnabled, each.category)}
                  style={{width: 96, height: 96}}
                  resizeMode="contain"
                  resizeMethod="resize"
                /> */}

                {getMarkerIcon(each.isBlinkingEnabled, each.category)}
                {/* <Callout onPress={() => onCalloutPress(each.mapDetails)}>
                  <CustomCalloutView
                    details={each?.creatorBusinessDetails}
                    image={each?.imageKey}
                  />
                </Callout> */}
              </Marker>
            ))}
          </MapView>
          {/* )} */}

          {showMarkerModal && (
            <CustomCalloutView details={selectedMarkerData} />
          )}
        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 10,
    height: 10,
  },
  inputSearchStyle: {
    color:'black',
    height: 40,
    fontSize: 16,
  },
  dropContainer: {
    backgroundColor: 'white',
    padding: 10,
    width:'100%'
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },
  contentContainer: {
    padding: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  result: {
    borderWidth: 1,
    borderColor: '#666',
    width: '100%',
    padding: 10,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    // flex: 1,
    top: height / 12 + height / 18 + 12 + 60,
  },
  containerOuter: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
