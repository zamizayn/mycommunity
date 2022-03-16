// import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AsyncStorageHelper {
  
  static async getItem(key) {
    try {
      return await AsyncStorage.getItem(key); 
    } catch (error) {
      // console.log('')
      // Error retrieving data
    }
  }

  static async storeItem(key, item) {
    // console.log("key", key)
    try {
      await AsyncStorage.setItem(key, item);
     
    } catch (error) {
      // Error saving data
    }
  }
  static async setItem(key, item) {
    // console.log("key", key)
    try {
      await AsyncStorage.setItem(key, item);
     
    } catch (error) {
      // Error saving data
    }
  }

  static async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      // Error saving data
    }
  }

}