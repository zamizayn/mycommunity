import { View } from 'native-base';
import React, { Component } from 'react';
import {
  Modal,
  StyleSheet,
  Dimensions,
  Text,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import Video from 'react-native-video';
import VideoIcon from 'react-native-vector-icons/FontAwesome5'; // and this
import { Slider } from 'react-native-elements';
import Orientation from 'react-native-orientation';
// import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';
import { Button } from 'native-base';
import BackBtn_white from '../../assets/svg/BackBtn_white.svg';

var { height, width } = Dimensions.get('window');

export default class VideoViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      duration: 0.1,
      paused: false,
      overlay: false,
      fullscreen: false,
      modalLoading: true
    }
  }

  componentDidMount() {
  }

  lastTap = null;

  handleDoubleTap = (doubleTapCallback, singleTapCallback) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (this.lastTap && now - this.lastTap < DOUBLE_PRESS_DELAY) {
      clearTimeout(this.timer);
      doubleTapCallback();
    } else {
      this.lastTap = now;
      this.timer = setTimeout(() => {
        singleTapCallback();
      }, DOUBLE_PRESS_DELAY);
    }
  };

  getTime = t => {
    const digit = n => (n < 10 ? `0${n}` : `${n}`);
    // const t = Math.round(time);
    const sec = digit(Math.floor(t % 60));
    const min = digit(Math.floor((t / 60) % 60));
    const hr = digit(Math.floor((t / 3600) % 60));
    return hr + ':' + min + ':' + sec; // this will convert sec to timer string
    // 33 -> 00:00:33
    // this is done here
    // ok now the theme is good to look
  };
  onBuffer = ({ isBuffering }) => {
    this.setState({ opacity: isBuffering ? 1 : 0 });
  };

  onLoadStart = () => {
    console.log("On load start");
    this.setState({
      modalLoading: true
    })
  };

  load = ({ duration }) => {
    console.log("On Load");
    this.setState({
      duration,
      opacity: 0,
      modalLoading: false
    }); // now here the duration is update on load video
  }

  progress = ({ currentTime }) => {
    this.setState({ currentTime });
  }; // here the current time is upated

  backward = () => {
    this.video.seek(this.state.currentTime - 5);
    clearTimeout(this.overlayTimer);
    this.overlayTimer = setTimeout(() => this.setState({ overlay: false }), 6000);
  };
  forward = () => {
    this.video.seek(this.state.currentTime + 5); // here the video is seek to 5 sec forward
    clearTimeout(this.overlayTimer);
    this.overlayTimer = setTimeout(() => this.setState({ overlay: false }), 6000);
  };

  onslide = slide => {
    this.video.seek(slide * this.state.duration); // here the upation is maked for video seeking
    clearTimeout(this.overlayTimer);
    this.overlayTimer = setTimeout(() => this.setState({ overlay: false }), 6000);
  };

  fullscreen = () => {
    const { fullscreen } = this.state;
    if (fullscreen) {
      Orientation.lockToPortrait();
    } else {
      Orientation.lockToLandscape();
    }
    this.setState({ fullscreen: !fullscreen });
  };

  youtubeSeekLeft = () => {
    const { currentTime } = this.state;
    this.handleDoubleTap(
      () => {
        this.video.seek(currentTime - 5);
      },
      () => {
        this.setState({ overlay: true });
        this.overlayTimer = setTimeout(
          () => this.setState({ overlay: false }),
          6000,
        );
      },
    );
  };
  youtubeSeekRight = () => {
    const { currentTime } = this.state;
    this.handleDoubleTap(
      () => {
        // this fn is used to detect the double tap first callback
        this.video.seek(currentTime + 5);
      },
      () => {
        this.setState({ overlay: true });
        this.overlayTimer = setTimeout(
          () => this.setState({ overlay: false }),
          6000,
        );
      },
    );
  };

  render() {
    const {
      visible,
      url,
      onClose,
      audioOnly
    } = this.props;
    const { currentTime, duration, paused, overlay, fullscreen } = this.state;
    return (
      visible ?
        StatusBar.setHidden(true, 'none')
        : StatusBar.setHidden(false, 'none'),
      // visible && !audioOnly ?
      //   hideNavigationBar()
      //   : showNavigationBar(),
      <Modal
        visible={visible}
        onRequestClose={() => {
          if (fullscreen) {
            this.setState({ fullscreen: !fullscreen });
            Orientation.lockToPortrait();
          } else {
            // showNavigationBar();
            StatusBar.setHidden(false, 'none');
            onClose();
          }
        }}
        backdropOpacity={0.5}
        backdropColor="black"
        animationIn="fadeIn"
        animationOut="fadeOut"
        statusBarTranslucent={true}
      >
        <Button
          transparent
          onPress={() => {
            Orientation.lockToPortrait();
            onClose()
          }}
          style={{
            position: 'absolute',
            right: 10,
            top: 20,
            paddingHorizontal: width / 41.4,
            zIndex: 100
          }}>
          <BackBtn_white height="22" width="20" />
        </Button>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: '#000',
        }}>
          {
            this.state.modalLoading ?
              <ActivityIndicator size="large" />
              : null
          }
          <Video source={{ uri: url }}              // Callback when video cannot be loaded
            style={style.backgroundVideo}
            resizeMode={"contain"}
            bufferConfig={{
              minBufferMs: 15000,
              maxBufferMs: 50000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000,
            }}
            // poster={}
            posterResizeMode="contain"
            allowsExternalPlayback={true}
            rate={1.0}
            fullscreenOrientation={'all'}
            fullscreenAutorotate={true}
            onBuffer={this.onBuffer} // Callback when remote video is buffering
            onError={this.videoError} // Callback when video cannot be loaded
            //maxBitRate={2000000} // 2 megabits
            fullscreen={fullscreen}
            paused={paused}
            ref={ref => {
              this.video = ref;
            }}
            onEnd={() => {
              this.video.seek(0);
              this.setState({
                paused: true
              });
            }}
            resizeMode="contain"
            onLoadStart={this.onLoadStart}
            onLoad={this.load}
            onProgress={this.progress}
            onReadyForDisplay={() => {
            }}
          />
          <View style={style.overlay}>
            {/* now we can remove this not */}
            {/* {audioOnly || overlay ? ( */}
            <View style={{ ...style.overlaySet, backgroundColor: '#0006', }}>
              {/* <View style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: 'center'
                }}>
                  <View style={{
                    flexDirection: 'row'
                  }}> */}
              <VideoIcon
                name="backward"
                style={style.icon}
                onPress={this.backward}
              />
              <VideoIcon
                name={paused ? 'play' : 'pause'}
                style={style.icon}
                onPress={() => this.setState({ paused: !paused })}
              />
              <VideoIcon
                name="forward"
                style={style.icon}
                onPress={this.forward}
              />
              {/* </View>

                </View> */}
              <View style={style.sliderCont}>
                <View style={style.timer}>
                  <Text style={{ color: 'white' }}>
                    {this.getTime(currentTime)}
                  </Text>
                  <View style={{ color: 'white', width: width / 4.5, justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Text style={{ color: '#fff' }}>
                      {this.getTime(duration)}
                    </Text>
                    {
                      !audioOnly
                        ?
                        <TouchableWithoutFeedback
                          onPress={this.fullscreen}>
                          <Text style={{ color: '#fff', fontSize: 20 }}>
                            <VideoIcon
                              name={fullscreen ? 'compress' : 'expand'}
                              style={{ fontSize: 20 }}
                            />
                          </Text>
                        </TouchableWithoutFeedback>
                        : null
                    }

                  </View>
                </View>
                <Slider
                trackStyle={{ height: 5 }}
                thumbStyle={{ height: 20, width: 20 }}
                  // we want to add some param here
                  maximumTrackTintColor="white"
                  minimumTrackTintColor="white"
                  thumbTintColor="white" // now the slider and the time will work
                  value={currentTime / duration} // slier input is 0 - 1 only so we want to convert sec to 0 - 1
                  onValueChange={this.onslide}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal >
    );
  }
};

const style = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlaySet: {
    flex: 1,
    flexDirection: 'row',
  },
  icon: {
    height: 30,
    alignSelf: 'center',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 25,
  },
  sliderCont: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  timer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  video: { width, height: width * 0.6, backgroundColor: 'black' },
});

