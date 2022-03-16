import { API } from '../config/api';
import AsyncStorageHelper from './AsyncStorageHelper';
import ImagePicker from 'react-native-image-crop-picker';
import Axios from 'axios';
import { PermissionsAndroid } from 'react-native';
import Toast from 'react-native-simple-toast';
/*****************************
 * READ ME
 * 
 * File Options : {
 * 
 *  title : "Title of the picker for select file"  [required]
 * 
 *  type : "Type of the media you want to pick , file picker media types" ['photo', 'video']
 * 
 *  width: "Image resizing width for cropper"
 * 
 *  height: "Image resizing height for cropper"
 * 
 *  crop: "Disable or enable crop, default enabled"
 * 
 *  upload: "Disable or enable file uploading, default enabled"
 * 
 *  self: "Pass calling class object instance, used for setting state variable such as 'dataState' and 'progressState"
 * 
 *  dataState: "State variable to set the picker data"
 *  
 *  progressState: "State variable for return downloading progress"
 * 
 *  thumb: "Create thumb if file type is video, boolean, default true"
 * 
 * }
 * 
 ****************************/
export default class FileUpload {

  // Upload Function
  static async upload(response, fileOptions = {}) {
    let token = await AsyncStorageHelper.getItem('TOKEN');
    let body = new FormData();
    body.append('file', response);
    if ('num_thumb' in fileOptions) {
      body.append('num_thumb', fileOptions.num_thumb);
    }
    if ('size' in fileOptions) {
      body.append('size', fileOptions.size);
    }
    if ('type' in fileOptions) {
      body.append('type', fileOptions.type);
    }
    try {
      let d = await Axios.post(API.fileUpload, body, {
        headers: {
          "Content-type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
        onUploadProgress: function (progressEvent) {
          if ('progressState' in fileOptions) {
            let stateObj = {};
            stateObj[fileOptions.progressState] = progressEvent.loaded / progressEvent.total;
            fileOptions.self.setState(stateObj);
          }
        }
      });
      return d.data;
    } catch (e) {
    }
  }

  // Cropper
  static async openCropper(path, width = 300, height = 300) {
    console.log("arguments", arguments);
    let cropData = await ImagePicker.openCropper({
      path: path,
      width: width,
      height: height
    });
    console.log("open cropper", cropData);
    return cropData;
  }

  // File picker
  static async filePicker(fileOptions) {
    // const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    // let granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
   // if (granted === PermissionsAndroid.RESULTS.GRANTED) {

      // File picker options 
      const options = {
        title: fileOptions.title,
        mediaType: fileOptions.type
      };

      // Try catch error
      try {
        // Open file picker
        let data = await ImagePicker.openPicker(options);
        // Check picker has success response
        if ('path' in data) {
          // Check picker file type
          if (data.mime.startsWith("image")) {
            // Check crop option disabled by passing fileOptions.crop = false
            if ('crop' in fileOptions && !fileOptions.crop) {
              data['fileType'] = 'photo';

              // Set state var to remove the lag of upload api to get picker data
              if ('self' in fileOptions && 'dataState' in fileOptions) {
                let stateObj = {};
                stateObj[fileOptions.dataState] = data;
                fileOptions.self.setState(stateObj);
              }

              // Check upload option disabled by passing fileOptions.upload = false
              if ('upload' in fileOptions && !fileOptions.upload) {
                data['filename'] = data.path.replace(/^.*[\\\/]/, '');
                return data;
              } else {
                //  File upload api call
                let uploadData = await this.upload({
                  uri: data.path,
                  type: data.mime,
                  name: data.path.replace(/^.*[\\\/]/, '')
                }, fileOptions);

                return { ...uploadData, ...data };
              }
            } else {
              // Image cropper
              console.log("Image cropper");
              let cropData = await this.openCropper(data.path, fileOptions.width, fileOptions.height);
              console.log("Cropper data", cropData);
              cropData['fileType'] = 'photo';
              // Set state var to remove the lag of upload api to get picker data
              if ('self' in fileOptions && 'dataState' in fileOptions) {
                let stateObj = {};
                stateObj[fileOptions.dataState] = cropData;
                fileOptions.self.setState(stateObj);
              }

              if ('upload' in fileOptions && !fileOptions.upload) {
                cropData['filename'] = data.path.replace(/^.*[\\\/]/, '');
                return cropData;
              } else {
                //  File upload api call
                let uploadData = await this.upload({
                  uri: cropData.path,
                  type: cropData.mime,
                  name: cropData.path.replace(/^.*[\\\/]/, '')
                }, fileOptions);
                return { ...uploadData, ...cropData };
              }
            }
          } else {

            // Set state var to remove the lag of upload api to get picker data
            data['fileType'] = 'video';
            if ('self' in fileOptions && 'dataState' in fileOptions) {
              let stateObj = {};
              stateObj[fileOptions.dataState] = data;
              fileOptions.self.setState(stateObj);
            }

            // if video thumb has to create
            // if ('thumb' in fileOptions && !fileOptions.thumb) {
            //   data['thumb'] = '';
            // } else {
            //   console.log('creating thumb'); 
            //   try {
            //     data['thumb'] = await VideoThumbnail.get(data.path);            
            //   } catch (e) {
            //     console.log('Thumb error', e); 
            //   }

            // }

            // If need to upload file
            if ('upload' in fileOptions && !fileOptions.upload) {
              data['filename'] = data.path.replace(/^.*[\\\/]/, '');
              return data;
            } else {
              //  File upload api call
              console.log('upload data', {
                uri: data.path,
                type: data.mime,
                name: data.path.replace(/^.*[\\\/]/, '')
              });

              let uploadData = await this.upload({
                uri: data.path,
                type: data.mime,
                name: data.path.replace(/^.*[\\\/]/, '')
              }, fileOptions);
              return { ...uploadData, ...data };
            }
          }
        }
      } catch (err) {
      }
    // } else {
    //   Toast.showWithGravity('No file storage permission, Please allow the permission to go ahead', Toast.SHORT, Toast.BOTTOM);
    //   return;
    // }
  }
}