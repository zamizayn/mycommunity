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

var {height, width} = Dimensions.get('window');
export default class FloatingLabelInput extends Component {
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
    const {label, keyboard, textAlign, mandatory, returnType, ...props} =
      this.props;
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
          backgroundColor: 'white',
          paddingLeft: width / 45,
          // width: this.props.width,
          flexDirection: 'row',
          // borderColor:'#bd1d53',
          // borderWidth:this.state.isFocused ? 0.5 :0,
          height: height / 16,
          borderRadius: 25,
        }}>
        {/* <Image source={this.props.imageUri} style={{width:30,height:30, 
   alignSelf:'center'
        }} /> */}
        <TextInput
          {...props}
          ref={this.props.refInner}
          keyboardType={keyboard}
          pointerEvents={'box-none'}
          returnKeytype={returnType}
          textAlign={textAlign}
          style={{
            // paddingLeft: width / 50,
            // paddingRight:width/20,
            fontSize: width / 25,
            color: '#000000',
            width: this.props.width,
            // borderColor: this.state.isFocused ? '#00C882' : '#C7C7C7',
          }}
          selectionColor={'#bd1d53'}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
        />
      </View>
    );
  }
}
