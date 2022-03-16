import React, {Component, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {AppColors} from '../Themes';
import BackBtn_white from '../assets/svg/BackBtn_white.svg';
import {backgroundColor, marginBottom, style} from 'styled-system';

var {height, width} = Dimensions.get('window');
export default class ViewUsers extends Component {
  Image_Http_URL = {
    uri: 'https://reactnativecode.com/wp-content/uploads/2017/05/react_thumb_install.png',
  };
  peoples = [
    {
      label: 'First User',
      value: 1,
    },
    {
      label: 'Second User',
      value: 2,
    },
    {
      label: 'Third User',
      value: 3,
    },
    {
      label: 'Fourth User',
      value: 3,
    },
    {
      label: 'Fifth User',
      value: 3,
    },
    {
      label: 'Sixth User',
      value: 3,
    },
    {
      label: 'Seventh User',
      value: 3,
    },
  ];

  render() {
    return (
      <View height={height}>
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
              this.props.navigation.goBack(null);
            }}>
            <BackBtn_white height="22" width="20" />
          </TouchableOpacity>

          <Text
            style={{
              color: 'white',
              marginStart: width / 22,
              fontSize: width / 22,
            }}>
            View Users
          </Text>
        </View>

        <FlatList
          scrollEnabled={true}
          height={height}
          showsVerticalScrollIndicator={true}
          data={this.peoples}
          renderItem={({item, index}) => (
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                borderRadius: 8,
                height: 50,
                padding: 10,
                alignItems: 'center',
                justifyContent: 'center',
                margin: 10,
                shadowColor: 'grey',
              }}>
              <Image
                style={styles.image}
                source={this.Image_Http_URL}
                resizeMode={'cover'} // <- needs to be "cover" for borderRadius to take effect on Android
              />
              <Text style={{flex: 4}}>{item.label}</Text>
              <TouchableOpacity
                style={{flex: 1}}
                onPress={() => this.unblock(index)}>
                <Text
                  style={{
                    color: AppColors.primaryColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  Unblock
                </Text>
              </TouchableOpacity>
            </View>
          )}></FlatList>
      </View>
    );
  }
  unblock(index) {
    console.log('clicked unblock' + index);
    // Alert.alert(
    //   'Confirm',
    //   'Do you want to unblock ' + this.peoples[index].label,
    //   [
    //     {
    //       text: 'Yes',
    //       onPress: () => {
    //         console.log('yes clicked');
    //       },
    //     },
    //     {
    //       text: 'No',
    //       onPress: () => {
    //         console.log('no clicked');
    //       },
    //     },
    //   ],
    // );
  }
}
const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 75,
    marginRight: 10,
  },
});
