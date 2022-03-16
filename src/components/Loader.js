import React, { Component } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View,
  Dimensions,
  Modal
} from 'react-native';
var { height, width } = Dimensions.get('window');

export default class Loader extends Component {

  render() {
    const { onBack } = this.props;
    return (
      <Modal
        animationType="none"        
        visible={this.props.visibility}
        transparent= { true } 
        onRequestClose={() => {
          if (onBack) {
            onBack();
          }
        }}
        >
        <View style={{  backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center', height: height, width: width }}>
          <ActivityIndicator size="large" color="#bd1d53" />
          <StatusBar barStyle="default" />
        </View>
      </Modal>
    );
  }

}