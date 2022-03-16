import React, {Component} from 'react';
import {
  View,
  StatusBar,
  TextInput,
  Animated,
  Text,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import {AppColors} from '../Themes';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faImage} from '@fortawesome/free-solid-svg-icons';
import {faWhatsapp} from '@fortawesome/free-brands-svg-icons';

var {height, width} = Dimensions.get('window');
export default class FloatingLabelBorderInput extends Component {
  state = {
    isFocused: false,
  };

  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(
      this.props.value === '' ? 0 : 1,
    );
  }

  handleFocus = () => this.setState({isFocused: true});
  handleBlur = () => this.setState({isFocused: false});
  onFocusChange = () => {
    this.setState({isFocused: true});
  };
  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.props.value !== '' ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  render() {
    const {
      label,
      keyboard,
      textAlign,
      mandatory,
      leftFaIcon,
      returnType,
      ...props
    } = this.props;
    const labelStyle = {
      position: 'absolute',
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [height / 18, height / 50],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [15, 14],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#aaa', '#D72163'],
      }),
    };
    return (
      <View
        style={{
          //    width: this.props.width,
          flexDirection: 'row',
          borderRadius: 8,
          // borderColor:'#bd1d53',
          // borderWidth:this.state.isFocused ? 0.5 :0,
        }}>
        {/* <Image source={this.props.imageUri} style={{width:30,height:30,
   alignSelf:'center'
        }} /> */}
        {leftFaIcon ? leftFaIcon : null}
        <TextInput
          {...props}
          ref={this.props.refInner}
          keyboardType={keyboard}
          pointerEvents={'box-none'}
          returnKeytype={returnType}
          textAlign={textAlign}
          style={{
            fontSize: width / 25,
            color: AppColors.fontColorDark,
            width: this.props.width,
            flexWrap: 'wrap',
            borderColor: this.state.isFocused
              ? AppColors.primaryColor
              : AppColors.borderColor,
            borderWidth: this.state.isFocused ? 1 : 1,
            backgroundColor: this.state.isFocused
              ? 'white'
              : this.props.backgroundColor
              ? this.props.backgroundColor
              : 'white',
            borderRadius: 8,
            paddingStart: width / 24,
            opacity:
              typeof this.props.disabled !== 'undefined' && this.props.disabled
                ? 0.5
                : 1,
          }}
          selectionColor={'#bd1d53'}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
          placeholder={
            typeof this.props.placeholder !== 'undefined'
              ? this.props.placeholder
              : ''
          }
          editable={
            typeof this.props.disabled !== 'undefined'
              ? !this.props.disabled
              : true
          }
        />
      </View>
    );
  }
}
