import { Button, View } from 'native-base';
import React, { Component } from 'react';
import { Image } from 'react-native';
import { Text } from 'react-native';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StyleSheet
} from 'react-native';
import Pdf from 'react-native-pdf';
var { height, width } = Dimensions.get('window');

export default class PdfViewer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      visible,
      url,
      onClose,
    } = this.props;

    return (
      <Modal
        visible={visible}
        onRequestClose={onClose}
      >
        <Button
          transparent
          onPress={onClose}          
          style={{
            position: 'absolute',
            right: 0,
            top: 15,
            paddingHorizontal: width / 41.4,
            zIndex: 100
          }}>
          <Image source={require('../../assets/icon/backarrow.png')} />
        </Button>
        <View style={styles.container}>
          <Pdf
            source={{ uri: url, cache: true }}
            style={styles.pdf}
            activityIndicator={<ActivityIndicator size="large" color="#0000ff" />}
          />
        </View>
      </Modal >
    );
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: '#000'
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width
  }
});