import React from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';

const AnimatedView = Animated.createAnimatedComponent(View);

CustomLabel.defaultProps = {
  leftDiff: 0,
};

const width = 50;
const pointerWidth = width * 0.47;

function LabelBase(props) {
  const {position, value, leftDiff, pressed} = props;
  const scaleValue = React.useRef(new Animated.Value(0.1)); // Behaves oddly if set to 0
  const cachedPressed = React.useRef(pressed);

  React.useEffect(() => {
    Animated.timing(scaleValue.current, {
      toValue: pressed ? 1 : 0.1,
      duration: 200,
      delay: pressed ? 0 : 2000,
      useNativeDriver: false,
    }).start();
    cachedPressed.current = pressed;
  }, [pressed]);

  return (
    Number.isFinite(position) &&
    Number.isFinite(value) && (
      <View
        style={[
          styles.sliderLabel,
          {
            left: position - width / 2,
          },
        ]}>
        <View style={styles.pointer} />
        <Text style={styles.sliderLabelText}>QAR {value}</Text>
      </View>
    )
  );
}

export default function CustomLabel(props) {
  const {
    leftDiff,
    oneMarkerValue,
    twoMarkerValue,
    oneMarkerLeftPosition,
    twoMarkerLeftPosition,
    oneMarkerPressed,
    twoMarkerPressed,
  } = props;

  return (
    <View style={styles.parentView}>
      <LabelBase
        position={oneMarkerLeftPosition}
        value={oneMarkerValue}
        leftDiff={leftDiff}
        pressed={oneMarkerPressed}
      />
      <LabelBase
        position={twoMarkerLeftPosition}
        value={twoMarkerValue}
        leftDiff={leftDiff}
        pressed={twoMarkerPressed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  parentView: {
    position: 'relative',
  },
  sliderLabel: {
    position: 'absolute',
    justifyContent: 'center',
    bottom: '100%',
    width: width,
    height: width,
  },
  sliderLabelText: {
    textAlign: 'center',
    lineHeight: 86,

    backgroundColor: 'transparent',
    flex: 1,
    fontSize: 13,
    color: '#000',
  },
  //   pointer: {
  //     position: 'absolute',
  //     bottom: -pointerWidth / 4,
  //     left: (width - pointerWidth) / 2,
  //     transform: [{ rotate: '45deg' }],
  //     width: pointerWidth,
  //     height: pointerWidth,
  //     backgroundColor: '#999',
  //   },
});
