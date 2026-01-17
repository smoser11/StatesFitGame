import { Feature } from 'geojson';
import * as turf from '@turf/turf';

/**
 * Maps geographic coordinates to SVG pixel space
 * This ensures all coordinates are positive and within the viewport
 */
export const mapToPixelSpace = (
  geometry: Feature,
  viewportWidth: number,
  viewportHeight: number,
  padding: number = 20
): Feature => {
  // Get bounding box in geographic coordinates
  const bbox = turf.bbox(geometry);
  const [minX, minY, maxX, maxY] = bbox;

  const geoWidth = maxX - minX;
  const geoHeight = maxY - minY;

  // Calculate scale to fit in viewport
  const availableWidth = viewportWidth - (padding * 2);
  const availableHeight = viewportHeight - (padding * 2);

  const scaleX = availableWidth / geoWidth;
  const scaleY = availableHeight / geoHeight;
  const scale = Math.min(scaleX, scaleY);

  // Transform function to convert coordinates
  const transformCoords = (coords: any): any => {
    if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      // This is a [lon, lat] point - convert to pixel space
      const pixelX = (coords[0] - minX) * scale + padding;
      const pixelY = (coords[1] - minY) * scale + padding;
      return [pixelX, pixelY];
    }
    // Recursively transform arrays of coordinates
    return coords.map(transformCoords);
  };

  // Clone and transform the geometry
  const result = JSON.parse(JSON.stringify(geometry));
  if (result.geometry && result.geometry.coordinates) {
    result.geometry.coordinates = transformCoords(result.geometry.coordinates);
  }

  return result;
};
