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
import { mapToPixelSpace } from '../utils/coordinateMapper';
import { COLORS, SCREEN_DIMENSIONS } from '../constants';
import * as turf from '@turf/turf';

interface GameBoardProps {
  stateA: StateData;
  stateB: StateData;
  rotation: number;
  position: { x: number; y: number };
  interactionMode: 'move' | 'rotate';
  onRotationChange: (rotation: number) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  isAnswered: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const BOARD_HEIGHT = screenHeight * SCREEN_DIMENSIONS.BOARD_HEIGHT_RATIO;

export const GameBoard: React.FC<GameBoardProps> = ({
  stateA,
  stateB,
  rotation,
  position,
  interactionMode,
  onRotationChange,
  onPositionChange,
  isAnswered,
}) => {
  const rotationAnim = useRef(new Animated.Value(rotation)).current;
  const lastAngle = useRef(0);
  const lastPosition = useRef({ x: 0, y: 0 });

  // Pan responder for both rotation and move gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isAnswered,
      onMoveShouldSetPanResponder: () => !isAnswered,

      onPanResponderGrant: (evt, gestureState) => {
        if (interactionMode === 'rotate') {
          const { locationX, locationY } = evt.nativeEvent;
          const centerX = screenWidth / 2;
          const centerY = BOARD_HEIGHT / 2;

          lastAngle.current = Math.atan2(
            locationY - centerY,
            locationX - centerX
          ) * (180 / Math.PI);
        } else {
          // Store initial position for move mode
          lastPosition.current = { x: position.x, y: position.y };
        }
      },

      onPanResponderMove: (evt, gestureState) => {
        if (interactionMode === 'rotate') {
          const { locationX, locationY } = evt.nativeEvent;
          const centerX = screenWidth / 2;
          const centerY = BOARD_HEIGHT / 2;

          const currentAngle = Math.atan2(
            locationY - centerY,
            locationX - centerX
          ) * (180 / Math.PI);

          const deltaAngle = currentAngle - lastAngle.current;
          const newRotation = (rotation + deltaAngle + 360) % 360;

          onRotationChange(newRotation);
          lastAngle.current = currentAngle;
        } else {
          // Move mode - update position
          onPositionChange({
            x: lastPosition.current.x + gestureState.dx,
            y: lastPosition.current.y + gestureState.dy,
          });
        }
      },
    })
  ).current;
  
  // Scale states to fit viewport
  const { scaledGeometry: scaledStateA } = scaleToViewport(
    stateA.geometry,
    screenWidth * SCREEN_DIMENSIONS.STATE_A_SIZE_RATIO,
    BOARD_HEIGHT * SCREEN_DIMENSIONS.STATE_A_SIZE_RATIO,
    10
  );

  const { scaledGeometry: scaledStateB } = scaleToViewport(
    stateB.geometry,
    screenWidth * SCREEN_DIMENSIONS.STATE_B_SIZE_RATIO,
    BOARD_HEIGHT * SCREEN_DIMENSIONS.STATE_B_SIZE_RATIO,
    20
  );

  // Center the geometries in the viewport
  const centerGeometry = (geometry: any, centerX: number, centerY: number) => {
    const centroid = turf.centroid(geometry);
    const [currentX, currentY] = centroid.geometry.coordinates;
    const deltaX = centerX - currentX;
    const deltaY = centerY - currentY;

    return turf.transformTranslate(geometry, deltaX, deltaY);
  };

  const boardCenterX = screenWidth / 2;
  const boardCenterY = BOARD_HEIGHT / 2;

  const centeredStateB = centerGeometry(scaledStateB, boardCenterX, boardCenterY);
  const centeredStateA = centerGeometry(scaledStateA, boardCenterX, boardCenterY);

  // Rotate state A around its centroid (after scaling and centering)
  const centroidA = turf.centroid(centeredStateA);
  const rotatedStateA = turf.transformRotate(
    centeredStateA,
    rotation,
    { pivot: centroidA }
  );

  // Apply position offset after rotation
  const positionedStateA = turf.transformTranslate(
    rotatedStateA,
    position.x,
    position.y
  );

  // NOW map both states to pixel space for SVG rendering
  const pixelStateB = mapToPixelSpace(centeredStateB, screenWidth, BOARD_HEIGHT, 80);
  const pixelStateA = mapToPixelSpace(positionedStateA, screenWidth, BOARD_HEIGHT, 50);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Svg width={screenWidth} height={BOARD_HEIGHT} style={styles.svg}>
        {/* State B (target state) - rendered first as background */}
        <StateShape
          geometry={pixelStateB}
          fill={COLORS.STATE_B.FILL}
          stroke={COLORS.STATE_B.STROKE}
          strokeWidth={2}
        />

        {/* State A (state to fit) - rendered on top */}
        <G>
          <StateShape
            geometry={pixelStateA}
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