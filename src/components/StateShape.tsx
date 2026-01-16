import React from 'react';
import { Path } from 'react-native-svg';
import { Feature } from 'geojson';

interface StateShapeProps {
  geometry: Feature;
  fill: string;
  stroke: string;
  strokeWidth?: number;
  opacity?: number;
}

export const StateShape: React.FC<StateShapeProps> = ({
  geometry,
  fill,
  stroke,
  strokeWidth = 2,
  opacity = 1,
}) => {
  const geoJsonToPath = (geoGeometry: any): string => {
    try {
      if (!geoGeometry || !geoGeometry.coordinates) {
        return '';
      }

      // Handle MultiPolygon
      if (geoGeometry.type === 'MultiPolygon') {
        return geoGeometry.coordinates
          .map((polygon: number[][][]) => {
            return polygon
              .map((ring: number[][]) => {
                return ring.reduce((path: string, point: number[], index: number) => {
                  const command = index === 0 ? 'M' : 'L';
                  return `${path} ${command} ${point[0]} ${point[1]}`;
                }, '') + ' Z';
              })
              .join(' ');
          })
          .join(' ');
      }

      // Handle Polygon
      if (geoGeometry.type === 'Polygon') {
        return geoGeometry.coordinates
          .map((ring: number[][]) => {
            return ring.reduce((path: string, point: number[], index: number) => {
              const command = index === 0 ? 'M' : 'L';
              return `${path} ${command} ${point[0]} ${point[1]}`;
            }, '') + ' Z';
          })
          .join(' ');
      }

      return '';
    } catch (error) {
      console.error('Error converting GeoJSON to path:', error);
      return '';
    }
  };

  const pathData = geoJsonToPath(geometry.geometry);

  // Debug logging
  console.log('StateShape rendering:', {
    hasGeometry: !!geometry.geometry,
    pathData: pathData ? `${pathData.substring(0, 50)}...` : 'empty',
    fill,
    stroke
  });

  if (!pathData) {
    console.warn('No path data generated for state shape');
    return null;
  }

  return (
    <Path
      d={pathData}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      opacity={opacity}
    />
  );
};