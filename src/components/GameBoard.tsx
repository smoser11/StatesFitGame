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
  const lastAngle = useRef(0);
  
  // Pan responder for rotation gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const centerX = screenWidth / 2;
        const centerY = BOARD_HEIGHT / 2;
        
        lastAngle.current = Math.atan2(
          locationY - centerY,
          locationX - centerX
        ) * (180 / Math.PI);
      },
      
      onPanResponderMove: (evt) => {
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
  
  // Rotate state A around its centroid
  const centroidA = turf.centroid(centeredStateA);
  const rotatedStateA = turf.transformRotate(
    centeredStateA,
    rotation,
    { pivot: centroidA }
  );
  
  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Svg width={screenWidth} height={BOARD_HEIGHT} style={styles.svg}>
        {/* State B (target state) - rendered first as background */}
        <StateShape
          geometry={centeredStateB}
          fill={COLORS.STATE_B.FILL}
          stroke={COLORS.STATE_B.STROKE}
          strokeWidth={2}
        />
        
        {/* State A (state to fit) - rendered on top */}
        <G>
          <StateShape
            geometry={rotatedStateA}
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