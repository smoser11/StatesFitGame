import * as turf from '@turf/turf';
import { Feature } from 'geojson';
import { StateData } from '../types';

/**
 * Calculate if state A can fit inside state B with rotation
 * Uses Mercator projection coordinates
 */
export const canStateFitInside = (
  stateA: Feature,
  stateB: Feature,
  rotation: number = 0
): boolean => {
  try {
    // Get centroids for rotation
    const centroidA = turf.centroid(stateA);
    
    // Rotate state A around its centroid
    const rotatedStateA = turf.transformRotate(
      stateA,
      rotation,
      { pivot: centroidA }
    );
    
    // Get all points from the rotated state A
    const pointsA = turf.explode(rotatedStateA);
    
    // Check if all points of rotated state A are within state B
    let allPointsInside = true;
    
    turf.featureEach(pointsA, (point: any) => {
      if (!turf.booleanPointInPolygon(point, stateB)) {
        allPointsInside = false;
      }
    });
    
    return allPointsInside;
  } catch (error) {
    console.error('Error in canStateFitInside:', error);
    return false;
  }
};

/**
 * Calculate the optimal rotation to fit state A into state B
 * Returns the rotation angle in degrees and whether it fits
 */
export const findOptimalRotation = (
  stateA: Feature,
  stateB: Feature
): { fits: boolean; optimalRotation: number } => {
  // Try rotations in 15-degree increments
  const rotationStep = 15;
  
  for (let rotation = 0; rotation < 360; rotation += rotationStep) {
    if (canStateFitInside(stateA, stateB, rotation)) {
      // Fine-tune the rotation
      for (let fineRotation = rotation - rotationStep; 
           fineRotation <= rotation + rotationStep; 
           fineRotation += 1) {
        if (canStateFitInside(stateA, stateB, fineRotation)) {
          return { fits: true, optimalRotation: fineRotation };
        }
      }
    }
  }
  
  return { fits: false, optimalRotation: 0 };
};

/**
 * Calculate the area ratio between two states
 */
export const getAreaRatio = (
  stateA: Feature,
  stateB: Feature
): number => {
  const areaA = turf.area(stateA);
  const areaB = turf.area(stateB);
  return areaA / areaB;
};

/**
 * Get bounding box for a state
 */
export const getBounds = (state: Feature) => {
  const bbox = turf.bbox(state);
  return {
    minX: bbox[0],
    minY: bbox[1],
    maxX: bbox[2],
    maxY: bbox[3]
  };
};

/**
 * Scale geometry to fit within viewport while maintaining aspect ratio
 * Converts geographic coordinates to SVG pixel coordinates
 */
export const scaleToViewport = (
  geometry: Feature,
  viewportWidth: number,
  viewportHeight: number,
  padding: number = 20
): { scaledGeometry: Feature; scale: number } => {
  const bounds = getBounds(geometry);
  const geoWidth = bounds.maxX - bounds.minX;
  const geoHeight = bounds.maxY - bounds.minY;

  const availableWidth = viewportWidth - (padding * 2);
  const availableHeight = viewportHeight - (padding * 2);

  const scaleX = availableWidth / geoWidth;
  const scaleY = availableHeight / geoHeight;
  const scale = Math.min(scaleX, scaleY);

  // Transform coordinates from geographic to pixel space
  const transformCoordinates = (coords: any[]): any[] => {
    if (typeof coords[0] === 'number') {
      // This is a point [x, y]
      const x = (coords[0] - bounds.minX) * scale + padding;
      const y = (coords[1] - bounds.minY) * scale + padding;
      return [x, y];
    }
    // This is an array of coordinates, recurse
    return coords.map(transformCoordinates);
  };

  // Deep clone and transform the geometry
  const transformedGeometry = JSON.parse(JSON.stringify(geometry));
  if (transformedGeometry.geometry && transformedGeometry.geometry.coordinates) {
    transformedGeometry.geometry.coordinates = transformCoordinates(
      transformedGeometry.geometry.coordinates
    );
  }

  return { scaledGeometry: transformedGeometry, scale };
};