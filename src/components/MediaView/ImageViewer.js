import React, { Component } from 'react';
import {
  StyleSheet,
  Modal,
  ActivityIndicator,
  View
} from 'react-native';
import ImageZoomViewer from 'react-native-image-zoom-viewer';

export default class ImageViewer extends Component {
  constructor(props) {
    super(props);
  }

  renderLoadingPoster() {
    return (
      <ActivityIndicator size="large" />
    )
  }

  render() {
    const {
      visible,
      url,
      onClose,
    } = this.props;
    let images = [];
    if (typeof url !== Array) {
      images.push({
        url: url
      })
    } else {
      images = url
    }

    return (
      <Modal
        visible={visible}
        onRequestClose={onClose}
      >
        <ImageZoomViewer imageUrls={images} loadingRender={this.renderLoadingPoster} enableSwipeDown={true} onSwipeDown={onClose} swipeDownThreshold={200} onCancel={onClose} />
      </Modal >
    );
  }
};
const styles = StyleSheet.create({
  buttonContainer: {
    right: 0,
    width: 85,
    bottom: 66,
    flexDirection: "row",
    position: "absolute",
    justifyContent: "space-evenly"
  },
  modalContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  buttonContainer: {
    flex: 1,
    right: 8,
    elevation: 10,
    alignSelf: "flex-end"
  },
  titleStyle: {
    top: 16,
    left: 16
  },
  videoStyle: {
    marginTop: 5,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent"
  },
  spinnerStyle: {
    marginTop: 72,
    alignSelf: "center",
    justifyContent: "center"
  }
});

