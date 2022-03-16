import React, {Component} from 'react';
import {View, Dimensions, Image, Picker} from 'react-native';
var {height, width} = Dimensions.get('window');
import {Dropdown} from 'react-native-material-dropdown-v2-fixed';
import DropDown_icon from '../assets/svg/DropDown_icon.svg';
import { AppColors } from '../Themes';

export default class DropDownBorder extends Component {
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
      width: width / 1.17,
      //  marginLeft:12
    };
    if (pickerWidth) {
      pickerStyle['width'] = pickerWidth;
    }

    return  (
 
      <View
        style={{
         borderWidth:1,
         borderColor:AppColors.borderColor,
          backgroundColor: AppColors.bgColorPages,
          color: AppColors.fontColorDark,
          //paddingLeft: width / 45,
          height: height / 14,
          borderRadius: 8,
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
              height: height / 18,
              width: this.props.width,
              // borderRadius: 12,
              // paddingLeft: width / 40,
            }}
            pickerStyle={pickerStyle}
            dropdownPosition={1}
            rippleInsets={{top: 0, bottom: 0}}
            dropdownOffset={{
              top: height / 70,
            }}
            flexWrap={'wrap'}
            multiline={true}
            fontSize={width / 25}
            baseColor={AppColors.fontColorDark}
            inputContainerStyle={{borderBottomWidth: 0}}
            renderAccessory={this.renderAccessory}
            style={{
              color: AppColors.fontColorDark,
              fontSize: width / 25,
              marginTop: -4,
              marginEnd: 20,
             
            }}
          />
        }
      </View>
    );
  }
}
