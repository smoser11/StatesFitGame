import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import Svg, { G } from 'react-native-svg';
import { StateData } from '../types';
import { StateShape } from './StateShape';
import { scaleToViewport } from '../utils/geometry';
import { COLORS, SCREEN_DIMENSIONS } from '../constants';
import * as turf from '@turf/turf';

interface GameBoardProps {
  stateA: StateData;
  stateB: StateData;
  rotation: number;
  onRotationChange: (rotation: number) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const BOARD_HEIGHT = screenHeight * SCREEN_DIMENSIONS.BOARD_HEIGHT_RATIO;

export const GameBoard: React.FC<GameBoardProps> = ({
  stateA,
  stateB,
  rotation,
  onRotationChange,
}) => {
  const rotationAnim = useRef(new Animated.Value(rotation)).current;
  const startRotation = useRef(0);
  const startAngle = useRef(0);

  // Pan responder for rotation gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const centerX = screenWidth / 2;
        const centerY = BOARD_HEIGHT / 2;

        // Store the initial angle and rotation
        startAngle.current = Math.atan2(
          locationY - centerY,
          locationX - centerX
        ) * (180 / Math.PI);
        startRotation.current = rotation;
      },

      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const centerX = screenWidth / 2;
        const centerY = BOARD_HEIGHT / 2;

        // Calculate current angle
        const currentAngle = Math.atan2(
          locationY - centerY,
          locationX - centerX
        ) * (180 / Math.PI);

        // Calculate total rotation from start
        let deltaAngle = currentAngle - startAngle.current;

        // Handle angle wrapping around -180/180
        if (deltaAngle > 180) deltaAngle -= 360;
        if (deltaAngle < -180) deltaAngle += 360;

        // Update rotation
        const newRotation = (startRotation.current + deltaAngle + 360) % 360;
        onRotationChange(newRotation);
      },
    })
  ).current;
  
  // Rotate state A BEFORE converting to pixel coordinates
  const centroidA = turf.centroid(stateA.geometry);
  const rotatedStateAGeo = turf.transformRotate(
    stateA.geometry,
    rotation,
    { pivot: centroidA }
  );

  // Now convert both states to pixel coordinates
  const { scaledGeometry: scaledStateA } = scaleToViewport(
    rotatedStateAGeo,
    screenWidth,
    BOARD_HEIGHT,
    50
  );

  const { scaledGeometry: scaledStateB } = scaleToViewport(
    stateB.geometry,
    screenWidth,
    BOARD_HEIGHT,
    80
  );
  
  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Svg width={screenWidth} height={BOARD_HEIGHT} style={styles.svg}>
        {/* State B (target state) - rendered first as background */}
        <StateShape
          geometry={scaledStateB}
          fill={COLORS.STATE_B.FILL}
          stroke={COLORS.STATE_B.STROKE}
          strokeWidth={2}
        />

        {/* State A (state to fit) - rendered on top */}
        <G>
          <StateShape
            geometry={scaledStateA}
            fill={COLORS.STATE_A.FILL}
            stroke={COLORS.STATE_A.STROKE}
            strokeWidth={2}
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: BOARD_HEIGHT,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 10,
    overflow: 'hidden',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});