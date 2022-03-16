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
  KeyboardAvoidingView,
  Modal,
  Pressable,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FloatingLabelInput from './components/FloatingLabelInput';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Dropdown} from 'react-native-element-dropdown';
import {faMobile} from '@fortawesome/free-solid-svg-icons';
import {faBuilding} from '@fortawesome/free-solid-svg-icons';
import {faTag} from '@fortawesome/free-solid-svg-icons';
import {faMapPin} from '@fortawesome/free-solid-svg-icons';
import {faDirections} from '@fortawesome/free-solid-svg-icons';
import {faPhone} from '@fortawesome/free-solid-svg-icons';
import {faEye} from '@fortawesome/free-solid-svg-icons';
import {faWhatsapp} from '@fortawesome/free-brands-svg-icons';

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
  Icon,
} from 'native-base';
import DropDown from './components/DropDown';
import BackBtn_white from './assets/svg/BackBtn_white.svg';
import theme from './config/styles.js';
import Mall_Icon from './assets/svg/Mall_Icon.svg';
import Promotion_Icon from './assets/svg/Promotion_Icon.svg';
import Map_Pin_Villa from './assets/svg/Map_Pin_Villa.svg';
import Map_Pin_Villa_Appartment from './assets/svg/Map_Pin_Villa_Appartment.svg';
import Map_Pin_Hotel from './assets/svg/Map_Pin_Hotel.svg';
import Map_Pin_Office_Space from './assets/svg/Map_Pin_Office_Space.svg';
import Map_Pin_Semi_Commercial_Villa from './assets/svg/Map_Pin_Semi_Commercial_Villa.svg';
import Map_Pin_Labour_Camp from './assets/svg/Map_Pin_Labour_Camp.svg';
import Map_Pin_Appartment from './assets/svg/Map_Pin_Appartment.svg';
import Map_Pin_For_Sale from './assets/svg/Map_Pin_For_Sale.svg';
import Map_Pin_Shared_Accomodation from './assets/svg/Map_Pin_Shared_Accomodation.svg';
import Map_Pin_Land from './assets/svg/Map_Pin_Land.svg';
import Map_Pin_Business_Center from './assets/svg/Map_Pin_Business_Center.svg';
import Map_Pin_Warehouse from './assets/svg/Map_Pin_Warehouse.svg';
import Map_Pin_Commercial_Villa from './assets/svg/Map_Pin_Commercial_Villa.svg';
import Map_Direction_Arrow from './assets/svg/Map_Direction_Arrow.svg';

import FilterSvg from './assets/svg/Filter_icon_white.svg';
import FilterResetSvg from './assets/svg/FilterResetWhite.svg';

import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  CalloutSubview,
} from 'react-native-maps';
import {ApiHelper} from './helpers/ApiHelper';
import {API} from './config/api';
import {CONSTANTS} from './config/constants';
import {AppColors} from './Themes';

// import MapView from './MapView';
// import appConfig from '../app.json';

const apartment_gif = require('./assets/gif/my_properties/Apartment.gif');
const villa_gif = require('./assets/gif/my_properties/Villa.gif');
const hotel_gif = require('./assets/gif/my_properties/Hotel.gif');
const sale_gif = require('./assets/gif/my_properties/Sale.gif');
const land_gif = require('./assets/gif/my_properties/Land.gif');
const commercial_villa_gif = require('./assets/gif/my_properties/Comercial-villa.gif');
const warehouse_gif = require('./assets/gif/my_properties/Warehouse.gif');
const villa_apartment_gif = require('./assets/gif/my_properties/Villa-Apartment.gif');
const business_gif = require('./assets/gif/my_properties/Business.gif');
const shared_acco_gif = require('./assets/gif/my_properties/Shared-acco.gif');
const camp_gif = require('./assets/gif/my_properties/Labour-camp.gif');
const office_gif = require('./assets/gif/my_properties/Office.gif');
const semi_commercial_villa_gif = require('./assets/gif/my_properties/Semi-Comercial-villa.gif');

const {height, width} = Dimensions.get('window');
export default function MyProperties({navigation}) {
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
  const [loader, setLoader] = useState(false);

  const [selectedMarkerData, setSelectedMarkerData] = useState({});
  const [showMarkerModal, setShowMarkerModal] = useState(false);

  const [showAdvanceFilterModal, setShowAdvanceFilterModal] = useState(false);
  const [value, setValue] = useState(null);
  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value && (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
      </View>
    );
  };
  // const renderItem = () => {
  //   if (value || isFocus) {
  //     return (
  //       <Text style={[styles.label, isFocus && {color: 'blue'}]}>
  //         Dropdown label
  //       </Text>
  //     );
  //   }
  //   return null;
  // };

  const categoryIds = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
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

  const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
         
        </Text>
      );
    }
    return null;
  };

  const [categoryList, setCategoryList] = useState([
    {label: 'Choose all category', value: ''},
    {label: 'Villa', value: 1},
    {label: 'Apartment', value: 2},
    {label: 'Villa Apartment', value: 3},
    {label: 'Land', value: 7},
    {label: 'Hotel', value: 5},
    {label: 'Office Space', value: 6},
    {label: 'Shared Accomodation', value: 4},
    {label: 'Warehouse', value: 8},
    {label: 'Commercial Villa', value: 9},
    {label: 'Semi Commercial Villa', value: 10},
    {label: 'Business Centre', value: 11},
    {label: 'Labour Camp', value: 12},
    {label: 'For Sale', value: 13},
  ]);
  const [selectedCategory, setSelectedCategory] = useState(1);

  const watchId = useRef(null);

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
    getLocationsData();
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
    getAroundMe();
  }, [location, selectedCategory]);

  useEffect(() => {
    console.log('loc new center');
    centerMap(location);
  }, [location]);

  const getAroundMe = async () => {
    // let lati = parseFloat(location?.coords?.latitude) || parseFloat(0.0);
    // let longi = parseFloat(location?.coords?.longitude) || parseFloat(0.0);

    setSelectedMarkerData({});
    setShowMarkerModal(false);

    let lati = parseFloat(location?.latitude) || parseFloat(0.0);
    let longi = parseFloat(location?.longitude) || parseFloat(0.0);
    var url = `my-property?latitude=${lati}&longitude=${longi}`;
    if (selectedCategory !== 1) {
      url = url + `&categoryId=${selectedCategory}`;
    }

    if (dataState?.locationCode !== '') {
      url = url + `&location=${dataState?.locationCode}`;
    }
    if (dataState?.priceFrom !== '') {
      url = url + `&priceFrom=${dataState?.priceFrom}`;
    }
    if (dataState?.priceTo !== '') {
      url = url + `&priceTo=${dataState?.priceTo}`;
    }
    if (dataState?.roomCount !== '') {
      url = url + `&roomCount=${dataState?.roomCount}`;
    }
    if (dataState?.bathroomCount !== '') {
      url = url + `&bathroomCount=${dataState?.bathroomCount}`;
    }
    if (dataState?.deposit !== '') {
      url = url + `&deposit=${dataState?.deposit}`;
    }
    if (dataState?.furniture !== '') {
      url = url + `&furniture=${dataState?.furniture}`;
    }

    console.log(API.baseUrl + url);

    await ApiHelper.get(API.baseUrl + url)
      .then(res => {
        // console.log(res.data.data);
        var dataLen = res.data.data;
        var propertyList = [];
        if (dataLen.length) {
          dataLen?.map((each, index) => {
            // console.log('out: ' + each?.category);
            if (categoryIds.indexOf(each?.category) > -1) {
              // console.log(each?.category);
              propertyList.push(each);
            }
          });

          setAroundMeList(propertyList);
        }
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
      });
  };

  const getMarkerIcon = (isBlinkingEnabled = false, category) => {
    var src;

    if (isBlinkingEnabled) {
      // switch (category) {
      //   case '1': {
      //     src = villa_gif;
      //     break;
      //   }

      //   case '2': {
      //     src = apartment_gif;
      //     break;
      //   }
      //   case '3': {
      //     src = villa_apartment_gif;
      //     break;
      //   }
      //   case '7': {
      //     src = land_gif;
      //     break;
      //   }
      //   case '5': {
      //     src = hotel_gif;
      //     break;
      //   }
      //   case '6': {
      //     src = office_gif;
      //     break;
      //   }
      //   case '4': {
      //     src = shared_acco_gif;
      //     break;
      //   }
      //   case '8': {
      //     src = warehouse_gif;
      //     break;
      //   }
      //   case '9': {
      //     src = commercial_villa_gif;
      //     break;
      //   }
      //   case '10': {
      //     src = semi_commercial_villa_gif;
      //     break;
      //   }

      //   case '11': {
      //     src = business_gif;
      //     break;
      //   }
      //   case '12': {
      //     src = camp_gif;
      //     break;
      //   }
      //   case '13': {
      //     src = sale_gif;
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
        case '1': {
          src = <Map_Pin_Villa height="36" width="40" />;
          break;
        }

        case '2': {
          src = <Map_Pin_Appartment height="36" width="40" />;
          break;
        }
        case '3': {
          src = <Map_Pin_Villa_Appartment height="36" width="40" />;
          break;
        }
        case '7': {
          src = <Map_Pin_Land height="36" width="40" />;
          break;
        }
        case '5': {
          src = <Map_Pin_Hotel height="36" width="40" />;
          break;
        }
        case '6': {
          src = <Map_Pin_Office_Space height="36" width="40" />;
          break;
        }
        case '4': {
          src = <Map_Pin_Shared_Accomodation height="36" width="40" />;
          break;
        }
        case '8': {
          src = <Map_Pin_Warehouse height="36" width="40" />;
          break;
        }
        case '9': {
          src = <Map_Pin_Commercial_Villa height="36" width="40" />;
          break;
        }
        case '10': {
          src = <Map_Pin_Semi_Commercial_Villa height="36" width="40" />;
          break;
        }

        case '11': {
          src = <Map_Pin_Business_Center height="36" width="40" />;
          break;
        }
        case '12': {
          src = <Map_Pin_Labour_Camp height="36" width="40" />;
          break;
        }
        case '13': {
          src = <Map_Pin_For_Sale height="36" width="40" />;
          break;
        }

        // default: {
        //   return <Promotion_Icon height="26" width="28" />;
        // }
      }

      return src;
    } else {
      switch (category) {
        case '1': {
          src = <Map_Pin_Villa height="26" width="28" />;
          break;
        }

        case '2': {
          src = <Map_Pin_Appartment height="26" width="28" />;
          break;
        }
        case '3': {
          src = <Map_Pin_Villa_Appartment height="26" width="28" />;
          break;
        }
        case '7': {
          src = <Map_Pin_Land height="26" width="28" />;
          break;
        }
        case '5': {
          src = <Map_Pin_Hotel height="26" width="28" />;
          break;
        }
        case '6': {
          src = <Map_Pin_Office_Space height="26" width="28" />;
          break;
        }
        case '4': {
          src = <Map_Pin_Shared_Accomodation height="26" width="28" />;
          break;
        }
        case '8': {
          src = <Map_Pin_Warehouse height="26" width="28" />;
          break;
        }
        case '9': {
          src = <Map_Pin_Commercial_Villa height="26" width="28" />;
          break;
        }
        case '10': {
          src = <Map_Pin_Semi_Commercial_Villa height="26" width="28" />;
          break;
        }

        case '11': {
          src = <Map_Pin_Business_Center height="26" width="28" />;
          break;
        }
        case '12': {
          src = <Map_Pin_Labour_Camp height="26" width="28" />;
          break;
        }
        case '13': {
          src = <Map_Pin_For_Sale height="26" width="28" />;
          break;
        }

        // default: {
        //   return <Promotion_Icon height="26" width="28" />;
        // }
      }

      return src;
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
        console.log('loc' + position);
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
              {details?.imageKey ? (
                <Image
                  style={{
                    width: 120,
                    height: 100,
                    resizeMode: 'cover',
                    flex: 1,
                  }}
                  source={{
                    uri: CONSTANTS.IMAGE_URL_PREFIX + details?.imageKey,
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
                }}>
                {details?.name}
              </Text>

              <Text style={{justifyContent: 'center', marginTop: 4}}>
                {/* <PhoneSvg width={20} height={20} /> */}
                <FontAwesomeIcon icon={faMapPin} color={'#bd1d53'} />{' '}
                <Text>{details?.locationDetails?.locationName}</Text>
              </Text>

              {details?.noOfRooms ? (
                <Text>
                  <FontAwesomeIcon icon={faBuilding} color={'#bd1d53'} />{' '}
                  <Text style={{marginStart: 4}}> {details?.noOfRooms}</Text>
                </Text>
              ) : null}
              {details?.price ? (
                <Text>
                  <FontAwesomeIcon icon={faTag} color={'#bd1d53'} />{' '}
                  <Text style={{marginStart: 4}}> {details?.price}</Text>
                </Text>
              ) : null}
              <TouchableOpacity
                onPress={() => {
                  // console.log('phone', details?.contactDetails?.contactNumber);

                  // onCalloutPress(details?.mapDetails);
                  onPhonePress(details?.contactDetails?.contactNumber);
                }}>
                <Text>
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
                    // console.log(
                    //   'phone',
                    //   details?.contactDetails?.contactNumber,
                    // );

                    // onCalloutPress(details?.mapDetails);
                    onPhonePress(details?.contactDetails?.contactNumber);
                  }}>
                  <FontAwesomeIcon size={32} icon={faPhone} color={'#bd1d53'} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    // console.log('phone', details?.contactDetails?.contactNumber);

                    // onCalloutPress(details?.mapDetails);
                    onWhatsappPress(details?.contactDetails?.contactNumber);
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

  const onPhonePress = async phone => {
    let phoneNumber = '';

    if (phone) {
      if (Platform.OS === 'android') {
        phoneNumber = `tel:${phone}`;
      } else {
        phoneNumber = `telprompt:${phone}`;
      }

      Linking.openURL(phoneNumber);
    }
  };

  const onWhatsappPress = async phone => {
    let phoneNumber = '';

    if (phone) {
      Linking.openURL(
        'whatsapp://send?text=&phone=' +
          // CONSTANTS.COUNTRY_CODE_TEXT +
          phone,
      );
    }
  };

  const onViewDetailsPress = async details => {
    // console.log('onViewDetailsPress');
    if (details?._id) {
      navigation.navigate('PropertyDetail', {
        id: details?._id,
      });
    }
  };

  const furnitureStatuses = [
    {
      label: 'Furnished',
      value: 1,
    },
    {
      label: 'Semifurnished',
      value: 2,
    },
    {
      label: 'Unfurnished',
      value: 3,
    },
  ];

  const [dataState, setDataState] = useState({
    properties: [],
    loader: false,
    totalCount: 0,
    pageNo: 1,
    limit: 10,
    loading: false,
    searchKey: '',
    filterSearchKey: '',
    notifyRequired: false,
    filterVisible: false,
    propertyCategories: [],
    propertyCategory: '',
    filterCategory: '',
    locations: [],
    filterLocationCode: '',
    locationCode: '',
    priceFrom: '',
    filterPriceFrom: '',
    priceTo: '',
    filterPriceTo: '',
    roomCount: '',
    filterRoomCount: '',
    bathroomCount: '',
    filterBathroomCount: '',
    deposit: '',
    filterDeposite: '',
    furniture: '',
    filterFurniture: '',
    status: '',
    filterStatus: '',
    paginationLoading: false,
    filterData: false,
  });

  const closeFilterModal = save => {
    if (save) {
      setDataState({
        ...dataState,
        searchKey: dataState?.filterSearchKey,
        propertyCategory: dataState?.filterCategory,
        locationCode: dataState?.filterLocationCode,
        priceFrom: dataState?.filterPriceFrom,
        priceTo: dataState?.filterPriceTo,
        roomCount: dataState?.filterRoomCount,
        bathroomCount: dataState?.filterBathroomCount,
        deposit: dataState?.filterDeposite,
        furniture: dataState?.filterFurniture,
        pageNo: 1,
        loader: true,
        filterData: true,
        filterVisible: false,
      });
    } else {
      setDataState({
        ...dataState,
        filterVisible: false,
      });
    }
  };

  useEffect(() => {
    if (!dataState?.filterVisible) {
      getAroundMe();
    }
  }, [dataState?.filterVisible, dataState?.filterData]);

  const getLocationsData = async () => {
    await ApiHelper.get(API.locations)
      .then(res => {
        var dataLen = res.data.data;
        var len = dataLen.length;
        var locationList = [];
        for (let i = 0; i < len; i++) {
          let row = dataLen[i];
          let obj = {
            label: row.name,
            value: row.code,
          };
          locationList.push(obj);
        }
        setDataState({
          ...dataState,
          locations: locationList,
        });
      })
      .catch(err => {
        setDataState({
          ...dataState,
          loader: false,
        });
        console.log(err);
      });
  };

  const getFurniture = value => {
    const furniture = furnitureStatuses.filter(it => it.value == value);
    if (furniture.length) {
      return furniture[0].label;
    }
    return '';
  };

  const resetFilter = () => {
    setDataState({
      ...dataState,
      searchKey: '',
      filterSearchKey: '',
      propertyCategory: '',
      filterCategory: '',
      filterLocationCode: '',
      locationCode: '',
      priceFrom: '',
      filterPriceFrom: '',
      priceTo: '',
      filterPriceTo: '',
      roomCount: '',
      filterRoomCount: '',
      bathroomCount: '',
      filterBathroomCount: '',
      deposit: '',
      filterDeposite: '',
      furniture: '',
      filterFurniture: '',
      status: '',
      filterStatus: '',
      loader: true,
      pageNo: 1,
      filterData: false,
    });
  };

  const advanceFilterModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={dataState?.filterVisible}
        onRequestClose={() => {
          closeFilterModal(false);
        }}>
        <View style={{flex: 1, backgroundColor: '#fff'}}>
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
                  closeFilterModal(false);
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
                Advance Filter
              </Title>
            </Body>
            <Right>
              <Button
                transparent
                onPress={() => {
                  closeFilterModal(true);
                }}>
                <Icon
                  name="checkmark"
                  style={{fontSize: width / 12, color: '#fff'}}
                />
              </Button>
            </Right>
          </Header>

          <ScrollView
            contentContainerStyle={{
              paddingStart: width / 15,
              paddingEnd: width / 15,
            }}>
            {/* <View
              style={{
                flexDirection: 'row',
                marginTop: height / 30,
              }}>
              <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                Search Key
              </Text>
            </View> */}
            {/* <View
              style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                alignItems: 'center',
                width: width / 1.2,
                height: height / 15,
                marginBottom: width / 40,
                marginTop: height / 65,
                borderColor: '#BDBEBF',
                borderBottomWidth: 1,
              }}>
              <FloatingLabelInput
                width={width / 1.3}
                mandatory={false}
                value={dataState?.filterSearchKey}
                returnKeyType={'next'}
                placeholder="Search Key"
                placeholderTextColor={'#808B96'}
                onChangeText={value => {
                  setDataState(...dataState,{
                    filterSearchKey: value,
                  });
                }}
              />
            </View> */}
            {/* <View
              style={{
                flexDirection: 'row',
                marginTop: height / 30,
              }}>
              <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                Category
              </Text>
            </View>
            <View style={{marginTop: height / 80}}>
              <DropDown
                placeholder="Choose Category"
                placeholderTextColor="#808080"
                data={dataState?.propertyCategories}
                value={dataState?.filterCategory}
                containerStyle={{
                  width: null,
                  borderRadius: 8,
                  paddingStart: width / 60,
                  backgroundColor: '#fff',
                  borderBottomWidth: 1,
                  borderColor: '#BDBEBF',
                }}
                pickerStyle={pickerStyle}
                DropDownPosition={1}
                rippleInsets={{top: 0, bottom: 0}}
                DropDownOffset={{
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
                onChangeText={(value, index) => {
                  setDataState(
                    ...dataState,
                    {
                      filterCategory: value,
                    },
                    () => {
                      // console.log('usertype>', dataState?.countryId);
                    },
                  );
                }}
              />
            </View> */}
            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 30,
              }}>
              <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                Location
              </Text>
            </View>
            <View style={{marginTop: height / 80}}>
              {/* <DropDown
                placeholder="Choose Location"
                placeholderTextColor="#808080"
                data={dataState?.locations}
                value={dataState?.filterLocationCode}
                containerStyle={{
                  width: null,
                  borderRadius: 8,
                  paddingStart: width / 60,
                  backgroundColor: '#fff',
                  borderBottomWidth: 1,
                  borderColor: '#BDBEBF',
                }}
                pickerStyle={pickerStyle}
                DropDownPosition={1}
                rippleInsets={{top: 0, bottom: 0}}
                DropDownOffset={{
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
                onChange={(value, index) => {
                  setDataState({
                    ...dataState,
                    filterLocationCode: value,
                  });
                }}
              /> */}
              <View style={styles.dropContainer}>
                    <Dropdown
                      style={[
                        styles.dropdown,
                        isFocus && {borderColor: 'blue'},
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={dataState?.locations}
                value={dataState?.filterLocationCode}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocus ? 'Choose Location' : '...'}
                      searchPlaceholder="Search..."
                      onFocus={() => {
                        // this.setState({
                        //   isFocus: true,
                        // });
                        setIsFocus(true);
                      }}
                      onBlur={() => {
                        // this.setState({
                        //   isFocus: false,
                        // });
                        setIsFocus(false);
                      }}
                      onChange={item => {
                        setIsFocus(false);
                        setDataState({
                    ...dataState,
                    filterLocationCode: item.value,
                  });
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
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <View
                  style={{
                    marginTop: height / 30,
                    flexDirection: 'row',
                  }}>
                  <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                    Price From
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: width / 2.4,
                    height: height / 15,
                    marginBottom: width / 40,
                    marginTop: height / 65,
                    borderColor: '#BDBEBF',
                    borderBottomWidth: 1,
                  }}>
                  <FloatingLabelInput
                    keyboard="number-pad"
                    width={width / 1.3}
                    mandatory={false}
                    value={dataState?.filterPriceFrom}
                    returnKeyType={'next'}
                    placeholder="Amount"
                    placeholderTextColor={'#808B96'}
                    onChangeText={value => {
                      setDataState({
                        ...dataState,
                        filterPriceFrom: value,
                      });
                    }}
                  />
                </View>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: height / 30,
                  }}>
                  <Text style={[theme.fontMedium, {fontSize: width / 26}]}>
                    Price To
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: width / 2.4,
                    height: height / 15,
                    marginBottom: width / 40,
                    marginTop: height / 65,
                    borderColor: '#BDBEBF',
                    borderBottomWidth: 1,
                  }}>
                  <FloatingLabelInput
                    keyboard="number-pad"
                    width={width / 1.3}
                    mandatory={false}
                    value={dataState?.filterPriceTo}
                    returnKeyType={'next'}
                    placeholder="Amount"
                    placeholderTextColor={'#808B96'}
                    onChangeText={value => {
                      setDataState({
                        ...dataState,
                        filterPriceTo: value,
                      });
                    }}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: height / 30,
                  }}>
                  <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                    No. of Bedroom
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: width / 2.4,
                    height: height / 15,
                    marginBottom: width / 40,
                    marginTop: height / 65,
                    borderColor: '#BDBEBF',
                    borderBottomWidth: 1,
                  }}>
                  <FloatingLabelInput
                    keyboard="number-pad"
                    width={width / 1.3}
                    mandatory={false}
                    value={dataState?.filterRoomCount}
                    returnKeyType={'next'}
                    placeholder="No. of bedroom"
                    placeholderTextColor={'#808B96'}
                    onChangeText={value => {
                      setDataState({
                        ...dataState,
                        filterRoomCount: value,
                      });
                    }}
                  />
                </View>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: height / 30,
                  }}>
                  <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                    No. of Bathroom
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: width / 2.4,
                    height: height / 15,
                    marginBottom: width / 40,
                    marginTop: height / 65,
                    borderColor: '#BDBEBF',
                    borderBottomWidth: 1,
                  }}>
                  <FloatingLabelInput
                    keyboard="number-pad"
                    width={width / 1.3}
                    mandatory={false}
                    value={dataState?.filterBathroomCount}
                    returnKeyType={'next'}
                    placeholder="No. of bathroom"
                    placeholderTextColor={'#808B96'}
                    onChangeText={value => {
                      setDataState({
                        ...dataState,
                        filterBathroomCount: value,
                      });
                    }}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 30,
              }}>
              <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                Furniture Status
              </Text>
            </View>
            <View style={{marginTop: height / 75}}>
              {/* <DropDown
                placeholder="Select a status"
                placeholderTextColor="#808080"
                data={[
                  {
                    label: 'Furniture available',
                    value: 1,
                  },
                  {
                    label: 'No Furniture',
                    value: 0,
                  },
                ]}
                value={dataState?.filterFurniture}
                containerStyle={{
                  width: null,
                  borderRadius: 8,
                  paddingStart: width / 60,
                  backgroundColor: '#fff',
                  borderBottomWidth: 1,
                  borderColor: '#BDBEBF',
                }}
                pickerStyle={pickerStyle}
                DropDownPosition={1}
                rippleInsets={{top: 0, bottom: 0}}
                DropDownOffset={{
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
                onChange={value => {
                  setDataState({
                    ...dataState,
                    filterFurniture: value,
                  });
                }}
              /> */}
              <View style={styles.dropContainer}>
                    <Dropdown
                      style={[
                        styles.dropdown,
                        isFocus && {borderColor: 'blue'},
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={[
                  {
                    label: 'Furniture available',
                    value: 1,
                  },
                  {
                    label: 'No Furniture',
                    value: 0,
                  },
                ]}
                value={dataState?.filterFurniture}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocus ? 'Choose Furniture Status' : '...'}
                      searchPlaceholder="Search..."
                      onFocus={() => {
                        // this.setState({
                        //   isFocus: true,
                        // });
                        setIsFocus(true);
                      }}
                      onBlur={() => {
                        // this.setState({
                        //   isFocus: false,
                        // });
                        setIsFocus(false);
                      }}
                      onChange={item => {
                        setIsFocus(false);
                        setDataState({
                    ...dataState,
                    filterFurniture: item.value,
                  });
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
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: height / 30,
              }}>
              <Text style={[theme.fontBold, {fontSize: width / 26}]}>
                Deposite Status
              </Text>
            </View>
            <View style={{marginTop: height / 75}}>
              {/* <DropDown
                placeholder="Select a status"
                placeholderTextColor="#808080"
                data={[
                  {
                    label: 'Deposite required',
                    value: 1,
                  },
                  {
                    label: 'No Deposit',
                    value: 0,
                  },
                ]}
                value={dataState?.filterDeposite}
                containerStyle={{
                  width: null,
                  borderRadius: 8,
                  paddingStart: width / 60,
                  backgroundColor: '#fff',
                  borderBottomWidth: 1,
                  borderColor: '#BDBEBF',
                }}
                pickerStyle={pickerStyle}
                DropDownPosition={1}
                rippleInsets={{top: 0, bottom: 0}}
                DropDownOffset={{
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
                onChange={value => {
                  setDataState({
                    ...dataState,
                    filterDeposite: value,
                  });
                }}
              /> */}
              <View style={styles.dropContainer}>
                    <Dropdown
                      style={[
                        styles.dropdown,
                        isFocus && {borderColor: 'blue'},
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={[
                  {
                    label: 'Deposite required',
                    value: 1,
                  },
                  {
                    label: 'No Deposit',
                    value: 0,
                  },
                ]}
                value={dataState?.filterDeposite}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocus ? 'Choose Status' : '...'}
                      searchPlaceholder="Search..."
                      onFocus={() => {
                        // this.setState({
                        //   isFocus: true,
                        // });
                        setIsFocus(true);
                      }}
                      onBlur={() => {
                        // this.setState({
                        //   isFocus: false,
                        // });
                        setIsFocus(false);
                      }}
                      onChange={item => {
                        setIsFocus(false);
                        setDataState({
                    ...dataState,
                    filterDeposite: item.value,
                  });
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
            </View>

            <View>
              <View
                style={{
                  paddingTop: height / 20,
                  paddingBottom: height / 50,
                  marginBottom: height / 20,
                }}>
                <Button
                  block
                  rounded
                  style={{
                    backgroundColor: AppColors.primaryColor,
                    elevation: 0,
                  }}
                  onPress={() => {
                    closeFilterModal(true);
                    getAroundMe();
                  }}>
                  <Icon
                    name="checkmark"
                    style={{
                      fontSize: width / 18,
                      color: '#fff',
                    }}
                  />
                  <Text style={{color: 'white'}}>Apply Filter</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
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
              My Properties
            </Text>

            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{marginRight: width / 20}}
                onPress={() => {
                  resetFilter();
                }}>
                <FilterResetSvg width={22} height={22} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginRight: width / 20}}
                onPress={() => {
                  setDataState({
                    ...dataState,
                    filterVisible: true,
                  });
                }}>
                <FilterSvg width={22} height={22} />
              </TouchableOpacity>
            </View>

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
            /> */}
        
          </View>
          {advanceFilterModal()}
          {/* <View style={styles.container}>
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={category}
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
      </View> */}

          <View
            style={{
              backgroundColor: 'white',
              color: '#000000',
              // height: height / 16,
              // paddingLeft: width / 46,
              height: 50,
              width: '100%',
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 12,
            }}>
            {/* <DropDown
              data={categoryList}
              
              style={{
                height: 50,
                borderColor: 'gray',
                borderWidth: 0.5,
                borderRadius: 8,
                paddingHorizontal: 8,
              }}
              placeholder="Choose Category"
              placeholderTextColor="#808080"
              placeholderStyle={{
                borderRadius: 20,
              }}
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
                // height: height / 18,
                // width: width / 1.32,
                // paddingLeft: width / 45,
                // paddingRight: width / 45,
                borderRadius: 20,
                height: 50,
                width: '100%',
              }}
              pickerStyle={pickerStyle}
              dropdownPosition={0}
              rippleInsets={{top: 0, bottom: 0}}
              dropdownOffset={{
                top: height / 70,
              }}
              fontSize={width / 25}
              // baseColor="#000000"
              inputContainerStyle={{borderBottomWidth: 0}}
              renderAccessory={this.renderAccessory}
              // style={
              //   {
              //     // color: '#000000',
              //     // fontSize: width / 25,
              //     // alignItems: 'center',
              //     // alignSelf: 'center',
              //     // fontWeight: 'bold',
              //   }
              // }
            /> */}
            {/* <DropDown
              data={categoryList}
            /> */}
            {/* <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={categoryList}
        search
        maxHeight={300}
        containerStyle={{width: '100%',padding:width/45,borderColor: 'pink',}}
        width='100%'
        labelField="label"
        valueField="value"
        placeholder="Select Category"
        searchPlaceholder="Search..."
        value={selectedCategory?.value}
        onChange={item => {
          setValue(item.value);
          setSelectedCategory(item.value);
        }}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        )}
        renderItem={renderItem}
      /> */}

      <View style={styles.dropContainer}>
        {renderLabel()}
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

           
          </View>

          {/* <View
            style={{
              backgroundColor: 'white',
              color: '#000000',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 1,
              zIndex: 999,
              flexDirection: 'column',
              height: '100%',
              width: '100%',
            }}> */}

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
          {/* </View> */}
          {/* {location?.coords?.latitude && ( */}
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            customMapStyle={mapStyle}
            // minZoomLevel={8}
            // maxZoomLevel={16}
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
            //   //   // JSON.stringify(e.nativeEvent.coordinate),
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
              //   setDragging(false);
              // }
            }}
            // animateToCoordinate
            // showsMyLocationButton

            onPress={e => {
              // console.log('map click');
              setSelectedMarkerData({});
              setShowMarkerModal(false);
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
            {aroundMeList.map((each, index) => (
              <Marker
                onPress={() => {
                  console.log('marker click');
                  setSelectedMarkerData(each);
                  setShowMarkerModal(true);
                }}
                key={index}
                coordinate={{
                  latitude: parseFloat(each.mapDetails.lat),
                  longitude: parseFloat(each.mapDetails.lng),
                }}
                // image={getMarkerIcon(each.isBlinkingEnabled, each.category)}
                // title={each.creatorBusinessDetails.name}
                // description={each.creatorBusinessDetails.desc}
              >
                {/* <Image
                  source={getMarkerIcon(each.isBlinkingEnabled, each.category)}
                  style={{width: 26, height: 28}}
                  resizeMode="contain"
                  resizeMethod="resize"
                /> */}

                {getMarkerIcon(each.isBlinkingEnabled, each.category)}

                {/* <Callout
                  // onPress={() => {
                  //   //  onCalloutPress(each.mapDetails)
                  // }}
                  onPress={null}>
                  <CustomCalloutView details={each} />
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
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
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
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },
  contentContainer: {
    padding: 12,
  },
  dropContainer: {
    backgroundColor: 'white',
    padding: 16,
    width:'100%'
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
  giftCardImage: {
    height: width / 6,
    width: width / 6,
    justifyContent: 'center',
  },
});
