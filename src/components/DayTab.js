import React, { Component } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
var { height, width } = Dimensions.get('window');
import CheckBox from '../assets/svg/CheckBox.svg';
import { Item, Input, ListItem, Body } from 'native-base';
import theme from '../config/styles.js';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default class DayTab extends Component {
  constructor() {
    super();
    this.state = {
      isClosed: false,
      fromPicker: false,
      toPicker: false
    };
  }

  componentDidMount() {
    if (this.props.update && this.props.fromTime == "" && this.props.toTime == "") {
      this.setState({
        isClosed: true
      })
    }
  }

  render() {
    return (
      <View style={{ marginStart: width / 15, marginEnd: width / 15 }}>
        <View style={{ marginTop: height / 70, flexDirection: 'row' }}>
          <View style={{ marginEnd: width / 40, flex: 1 }}>
            <Item
              regular
              style={{
                paddingRight: width / 45,
                paddingLeft: width / 40,
                backgroundColor: 'white',
                borderRadius: 8,
                borderColor: '#D4D4D5',
                borderWidth: 2,
              }}
              onPress={() => {
                this.setState({
                  fromPicker: true
                })
              }}>
              <Image source={require('../assets/images/time.png')} />
              <Input
                disabled
                placeholder="From Time"
                value={this.props.fromTime}
                style={{
                  fontSize: width / 25,
                  color: '#000000',
                  textAlign: 'right',
                }}
              />
            </Item>
            <DateTimePickerModal
              style={{
                width: 0,
                height: 0,
                borderWidth: 0,
                borderColor: 'white',
              }}              
              isVisible={this.state.fromPicker}
              mode="time"
              onConfirm={(time) => {
                this.setState({
                  fromPicker: false
                });
                this.props.onFromConfirm(time);
              }}
              onCancel={() => {
                this.setState({
                  fromPicker: false
                });
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Item
              regular
              style={{
                paddingRight: width / 45,
                paddingLeft: width / 40,
                backgroundColor: 'white',
                borderRadius: 8,
                borderColor: '#D4D4D5',
                borderWidth: 2,
              }}
              onPress={() => {
                this.setState({
                  toPicker: true
                })
              }}>
              <Image source={require('../assets/images/time.png')} />
              <Input
                disabled
                placeholder="To Time"
                value={this.props.toTime}
                style={{
                  fontSize: width / 25,
                  color: '#000000',
                  textAlign: 'right',
                }}
              />
            </Item>
            <DateTimePickerModal
              isVisible={this.state.toPicker}
              mode="time"
              onConfirm={(time) => {
                this.setState({
                  toPicker: false
                });
                this.props.onToConfirm(time);
              }}
              onCancel={() => {
                this.setState({
                  toPicker: false
                });
              }}
            />
          </View>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: height / 50,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ isClosed: !this.state.isClosed });
              }}
              style={{
                backgroundColor: 'white',
                height: 20,
                width: 20,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 4,
              }}>
              {this.state.isClosed ? <CheckBox /> : null}
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ isClosed: !this.state.isClosed });
                  this.props.onClose();
                }}>
                <Text
                  style={[
                    theme.fontRegular,
                    {
                      alignSelf: 'center',
                      color: '#5D5C5D',
                      fontSize: width / 29,
                      marginStart: width / 40,
                    },
                  ]}>
                  Closed
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
