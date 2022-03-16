import Axios from 'axios';
import Toast from 'react-native-simple-toast';
import AsyncStorageHelper from './AsyncStorageHelper';
import {
  StackActions,
  CommonActions,
  NavigationActions,
} from '@react-navigation/native';

export let ApiHelper = {
  // Api get function
  get: async (url, data = {}, tokenNeed = true, config = {}) => {
    let timeOffsetHeader = getTimezoneOffsetHeader();
    let authToken = '';
    if (tokenNeed) {
      let token = await AsyncStorageHelper.getItem('TOKEN');
      if (token) {
        authToken = token;
      }
    }
    if (authToken) {
      // console.log(authToken);
      return await Axios.get(url, {
        params: data,
        headers: {
          Authorization: `Bearer ${authToken}`,
          ...timeOffsetHeader,
        },
        ...config,
      }).catch(error => {
        // console.log('URl', url);
        handleError(error.response);
      });
    } else {
      return await Axios.get(url, {
        params: data,
        headers: {
          ...timeOffsetHeader,
        },
        ...config,
      }).catch(error => {
        // console.log('URl', url);
        handleError(error.response);
      });
    }
  },
  // Api post function
  post: async (url, data, tokenNeed = true, config = {}) => {
    let authToken = '';
    if (tokenNeed) {
      let token = await AsyncStorageHelper.getItem('TOKEN');
      if (token) {
        authToken = token;
      }
    }
    if (authToken) {
      return await Axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        ...config,
      }).catch(error => {
        handleError(error.response);
        throw error;
      });
    } else {
      return await Axios.post(url, data, {
        headers: {},
        ...config,
      }).catch(error => {
        handleError(error.response);
        throw error;
      });
    }
  },
  // Api put function
  put: async (url, data, tokenNeed = true, config = {}) => {
    let authToken = '';
    if (tokenNeed) {
      let token = await AsyncStorageHelper.getItem('TOKEN');
      if (token) {
        authToken = token;
      }
    }
    if (authToken) {
      return await Axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        ...config,
      }).catch(error => {
        handleError(error.response);
      });
    } else {
      return await Axios.put(url, data, {
        headers: {},
        ...config,
      }).catch(error => {
        handleError(error.response);
      });
    }
  },
  // Api patch function
  patch: async (url, data, tokenNeed = true, config = {}) => {
    let authToken = '';
    if (tokenNeed) {
      let token = await AsyncStorageHelper.getItem('TOKEN');
      if (token) {
        authToken = token;
      }
    }
    if (authToken) {
      return await Axios.patch(url, data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        ...config,
      }).catch(error => {
        handleError(error.response);
      });
    } else {
      return await Axios.patch(url, data, {
        headers: {},
        ...config,
      }).catch(error => {
        handleError(error.response);
      });
    }
  },
  // Api delete function
  delete: async (url, data = {}, tokenNeed = true, config = {}) => {
    let authToken = '';
    if (tokenNeed) {
      let token = await AsyncStorageHelper.getItem('TOKEN');
      if (token) {
        authToken = token;
      }
    }
    if (authToken) {
      return await Axios.delete(url, {
        params: data,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        ...config,
      }).catch(error => {
        handleError(error.response);
      });
    } else {
      return await Axios.delete(url, {
        params: data,
        headers: {},
        ...config,
      }).catch(error => {
        handleError(error.response);
      });
    }
  },
  // Api head function
  head: async (url, data, tokenNeed = true, config = {}) => {
    let authToken = '';
    if (tokenNeed) {
      let token = await AsyncStorageHelper.getItem('TOKEN');
      if (token) {
        authToken = token;
      }
    }
    if (authToken) {
      return await Axios.head(url, data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        ...config,
      }).catch(error => {
        handleError(error.response);
      });
    } else {
      return await Axios.head(url, data, {
        headers: {},
        ...config,
      }).catch(error => {
        handleError(error.response);
      });
    }
  },
  // Api put function
  form_put: async (url, data, tokenNeed = true, config = {}) => {
    let authToken = '';
    if (tokenNeed) {
      let token = await AsyncStorageHelper.getItem('TOKEN');
      if (token) {
        authToken = token;
      }
    }
    if (authToken) {
      return await Axios.put(url, data, {
        headers: {
          'Content-type': 'multipart/form-data',
          // "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${authToken}`,
        },
        ...config,
      }).catch(error => {
        // console.log('server error', error);
        handleError(error.response);
      });
    } else {
      return await Axios.put(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...config,
      }).catch(error => {
        handleError(error.response);
      });
    }
  },
  // Api post function
  form_post: async (url, data, tokenNeed = true, config = {}) => {
    let authToken = '';
    if (tokenNeed) {
      let token = await AsyncStorageHelper.getItem('TOKEN');
      if (token) {
        authToken = token;
      }
    }
    if (authToken) {
      return await Axios.post(url, data, {
        headers: {
          // Accept: "application/json",
          'Content-Type': 'multipart/form-data',
          // "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${authToken}`,
        },
        ...config,
      }).catch(error => {
        console.log(JSON.stringify(error));
        handleError(error.response);
      });
    } else {
      return await Axios.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...config,
      }).catch(error => {
        handleError(error.response);
      });
    }
  },
  // Api post function
  form_patch: async (url, data, tokenNeed = true, config = {}) => {
    let authToken = '';
    if (tokenNeed) {
      let token = await AsyncStorageHelper.getItem('TOKEN');
      if (token) {
        authToken = token;
      }
    }
    if (authToken) {
      return await Axios.patch(url, data, {
        headers: {
          // Accept: "application/json",
          'Content-Type': 'multipart/form-data',
          // "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${authToken}`,
        },
        ...config,
      }).catch(error => {
        console.log(JSON.stringify(error));
        handleError(error.response);
      });
    } else {
      return await Axios.patch(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...config,
      }).catch(error => {
        handleError(error.response);
      });
    }
  },
};

function handleError(error) {
  // console.log('msg in helper', error);
  if (error) {
    if (error?.status === 401 || error?.status === 403) {
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
      // props.navigation.dispatch(StackActions.replace('HomeMenu'));
      // props.navigation.closeDrawer();
      // props.navigation.navigate('WelcomePage');
    } else {
      let message = error?.data?.message;
      let data = error.data;
      if (message == 'Validation Error') {
        let errorMessages = error.data.data;
        errorMessages.map(c => {
          if (c.msg) {
            Toast.showWithGravity(c.msg, Toast.LONG, Toast.BOTTOM);
          }
          if (c.message) {
            Toast.showWithGravity(c.message, Toast.LONG, Toast.BOTTOM);
          }
        });
      } else if (message) {
        Toast.showWithGravity(message, Toast.LONG, Toast.BOTTOM);
      }
      // if ('data' in data && data.data.length) {
      //     if ('msg' in data[0]) {
      //         console.log("Data", data[0]);
      //         Toast.showWithGravity(
      //             data.data[0].msg,
      //             Toast.LONG,
      //             Toast.BOTTOM,
      //         );
      //     }
      // }
    }
  } else {
    Toast.showWithGravity(
      "Can't load data! Please check internet connection",
      Toast.LONG,
      Toast.BOTTOM,
    );
  }
}

function pad(value) {
  return value < 10 ? '0' + value : value;
}

function getTimezoneOffsetHeader(date) {
  var timezoneOffset = new Date().getTimezoneOffset();
  var sign = timezoneOffset > 0 ? '-' : '+';
  var offset = Math.abs(timezoneOffset);
  var hours = pad(Math.floor(offset / 60));
  var minutes = pad(offset % 60);
  return {timeOffset: sign + hours + ':' + minutes};
}
