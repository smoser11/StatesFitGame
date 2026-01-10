import { canStateFitInside, getAreaRatio, findOptimalRotation } from '../src/utils/geometry';
import * as turf from '@turf/turf';

describe('Geometry Utils', () => {
  // Create mock state geometries for testing
  const smallSquare = turf.polygon([[
    [0, 0], [1, 0], [1, 1], [0, 1], [0, 0]
  ]]);
  
  const largeSquare = turf.polygon([[
    [0, 0], [3, 0], [3, 3], [0, 3], [0, 0]
  ]]);
  
  const rectangle = turf.polygon([[
    [0, 0], [2, 0], [2, 1], [0, 1], [0, 0]
  ]]);
  
  describe('canStateFitInside', () => {
    it('should return true when small shape fits inside large shape', () => {
      const result = canStateFitInside(smallSquare, largeSquare);
      expect(result).toBe(true);
    });
    
    it('should return false when large shape cannot fit inside small shape', () => {
      const result = canStateFitInside(largeSquare, smallSquare);
      expect(result).toBe(false);
    });
    
    it('should handle rotation parameter', () => {
      const result = canStateFitInside(smallSquare, largeSquare, 45);
      expect(result).toBe(true);
    });
    
    it('should handle invalid geometries gracefully', () => {
      const invalidGeometry = turf.polygon([[]]);
      const result = canStateFitInside(invalidGeometry, largeSquare);
      expect(result).toBe(false);
    });
  });
  
  describe('getAreaRatio', () => {
    it('should calculate correct area ratio', () => {
      const ratio = getAreaRatio(smallSquare, largeSquare);
      expect(ratio).toBeCloseTo(1/9, 2); // 1x1 square vs 3x3 square
    });
    
    it('should return 1 for identical shapes', () => {
      const ratio = getAreaRatio(smallSquare, smallSquare);
      expect(ratio).toBeCloseTo(1, 2);
    });
    
    it('should handle rectangle vs square', () => {
      const ratio = getAreaRatio(rectangle, largeSquare);
      expect(ratio).toBeCloseTo(2/9, 2); // 2x1 rectangle vs 3x3 square
    });
  });
  
  describe('findOptimalRotation', () => {
    it('should find that small square fits in large square', () => {
      const result = findOptimalRotation(smallSquare, largeSquare);
      expect(result.fits).toBe(true);
      expect(result.optimalRotation).toBeGreaterThanOrEqual(0);
      expect(result.optimalRotation).toBeLessThan(360);
    });
    
    it('should return false when shape cannot fit regardless of rotation', () => {
      const result = findOptimalRotation(largeSquare, smallSquare);
      expect(result.fits).toBe(false);
      expect(result.optimalRotation).toBe(0);
    });
    
    it('should find optimal rotation for rectangle in square', () => {
      const result = findOptimalRotation(rectangle, largeSquare);
      expect(result.fits).toBe(true);
    });
  });
});