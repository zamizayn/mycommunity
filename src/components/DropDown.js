import React, {Component} from 'react';
import {View, Dimensions, Image, Picker} from 'react-native';
var {height, width} = Dimensions.get('window');
import {Dropdown} from 'react-native-material-dropdown-v2-fixed';
import DropDown_icon from '../assets/svg/DropDown_icon.svg';

export default class DropDown extends Component {
  renderAccessory() {
    return (
      <View
        style={{
          top: height / 98,
          bottom: 0,
          right: 18,
          resizeMode: 'contain',
        }}>
        <DropDown_icon width="15" height="15" />
      </View>
    );
  }

  render() {
    const {onChange, pickerLeft, pickerWidth, ...otherprops} = this.props;
    const propwidth = this.props.width;
    let data = this.props.data;
    let pickerStyle = {
      marginTop: height / 7.8,
      marginLeft: width / 20,
      // marginRight:12,
      borderRadius: 8,
      paddingLeft: 8,
      width: width / 1.12,
      //  marginLeft:12
      zIndex: 999,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 2,
      backgroundColor: '#D3D3D3',
    };
    if (pickerWidth) {
      pickerStyle.width = width;
    }

    return this.props.multiline == false ? (
      <View
        style={{
          fontFamily: 'Rubik-Regular',
          backgroundColor: 'white',
          color: '#000000',
          width: '100%',
          height: height / 16,
          paddingLeft: width / 45,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {
          <Dropdown
            {...otherprops}
            value={
              data && data.length && this.props.value
                ? data.filter(obj => {
                    return obj.value == this.props.value;
                  })[0].label
                : ''
            }
            onChangeText={(value, index) => onChange(value, index)}
            data={data}
            containerStyle={{
              height: height / 16,
              width: '100%',
              // width: this.props.width,
              borderRadius: 12,
              // paddingLeft: width / 40,
            }}
            pickerStyle={pickerStyle}
            dropdownPosition={1}
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

              marginEnd: 6,
              marginStart: 6,
              justifyContent: 'center',
            }}
          />
        }
      </View>
    ) : (
      <View
        style={{
          fontFamily: 'Rubik-Regular',
          backgroundColor: 'white',
          color: '#000000',
          width: '100%',
          paddingLeft: width / 45,
          height: height / 16,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {
          <Dropdown
            {...otherprops}
            value={
              data && data.length && this.props.value
                ? data.filter(obj => {
                    return obj.value == this.props.value;
                  })[0].label
                : ''
            }
            onChangeText={(value, index) => onChange(value, index)}
            data={data}
            containerStyle={{
              height: height / 16,
              width: '100%',
              // width: this.props.width,
              borderRadius: 12,
              // paddingLeft: width / 40,
              // justifyContent: 'center',
              // alignItems: 'center',
            }}
            pickerStyle={pickerStyle}
            dropdownPosition={1}
            rippleInsets={{top: 0, bottom: 0}}
            shadeOpacity={0.5}
            dropdownOffset={{
              top: height / 70,
            }}
            flexWrap={'wrap'}
            // multiline={true}
            fontSize={width / 25}
            baseColor="#000000"
            inputContainerStyle={{borderBottomWidth: 0}}
            renderAccessory={this.renderAccessory}
            style={{
              color: '#000000',
              fontSize: width / 25,
              marginEnd: 6,
              marginStart: 6,
              justifyContent: 'center',
              // alignItems: 'center',
            }}
          />
        }
      </View>
    );
  }
}
