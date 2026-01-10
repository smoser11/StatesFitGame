import { StateData } from '../types';
import * as turf from '@turf/turf';
// import statesBoundariesData from './statesBoundaries.json';

export const loadStatesData = async (): Promise<StateData[]> => {
  try {
    // In a real implementation, you would load actual GeoJSON data for US states
    // For now, we'll create some sample geometries
    const sampleStates: StateData[] = [
      {
        name: 'Rhode Island',
        abbreviation: 'RI',
        geometry: turf.polygon([[
          [-71.8, 41.1], [-71.1, 41.1], [-71.1, 41.7], [-71.8, 41.7], [-71.8, 41.1]
        ]]),
        area: 4001,
        bounds: { minX: -71.8, minY: 41.1, maxX: -71.1, maxY: 41.7 }
      },
      {
        name: 'Delaware',
        abbreviation: 'DE',
        geometry: turf.polygon([[
          [-75.8, 38.4], [-75.0, 38.4], [-75.0, 39.8], [-75.8, 39.8], [-75.8, 38.4]
        ]]),
        area: 6446,
        bounds: { minX: -75.8, minY: 38.4, maxX: -75.0, maxY: 39.8 }
      },
      {
        name: 'Connecticut',
        abbreviation: 'CT',
        geometry: turf.polygon([[
          [-73.7, 40.9], [-71.8, 40.9], [-71.8, 42.1], [-73.7, 42.1], [-73.7, 40.9]
        ]]),
        area: 14357,
        bounds: { minX: -73.7, minY: 40.9, maxX: -71.8, maxY: 42.1 }
      },
      {
        name: 'New Jersey',
        abbreviation: 'NJ',
        geometry: turf.polygon([[
          [-75.6, 38.9], [-73.9, 38.9], [-73.9, 41.4], [-75.6, 41.4], [-75.6, 38.9]
        ]]),
        area: 22591,
        bounds: { minX: -75.6, minY: 38.9, maxX: -73.9, maxY: 41.4 }
      },
      {
        name: 'New Hampshire',
        abbreviation: 'NH',
        geometry: turf.polygon([[
          [-72.6, 42.7], [-70.6, 42.7], [-70.6, 45.3], [-72.6, 45.3], [-72.6, 42.7]
        ]]),
        area: 24214,
        bounds: { minX: -72.6, minY: 42.7, maxX: -70.6, maxY: 45.3 }
      },
      {
        name: 'Vermont',
        abbreviation: 'VT',
        geometry: turf.polygon([[
          [-73.4, 42.7], [-71.5, 42.7], [-71.5, 45.0], [-73.4, 45.0], [-73.4, 42.7]
        ]]),
        area: 24906,
        bounds: { minX: -73.4, minY: 42.7, maxX: -71.5, maxY: 45.0 }
      },
      {
        name: 'Massachusetts',
        abbreviation: 'MA',
        geometry: turf.polygon([[
          [-73.5, 41.2], [-69.9, 41.2], [-69.9, 42.9], [-73.5, 42.9], [-73.5, 41.2]
        ]]),
        area: 27336,
        bounds: { minX: -73.5, minY: 41.2, maxX: -69.9, maxY: 42.9 }
      },
      {
        name: 'Hawaii',
        abbreviation: 'HI',
        geometry: turf.polygon([[
          [-160.2, 18.9], [-154.8, 18.9], [-154.8, 22.2], [-160.2, 22.2], [-160.2, 18.9]
        ]]),
        area: 28313,
        bounds: { minX: -160.2, minY: 18.9, maxX: -154.8, maxY: 22.2 }
      },
      {
        name: 'Maryland',
        abbreviation: 'MD',
        geometry: turf.polygon([[
          [-79.5, 37.9], [-75.0, 37.9], [-75.0, 39.7], [-79.5, 39.7], [-79.5, 37.9]
        ]]),
        area: 32131,
        bounds: { minX: -79.5, minY: 37.9, maxX: -75.0, maxY: 39.7 }
      },
      {
        name: 'West Virginia',
        abbreviation: 'WV',
        geometry: turf.polygon([[
          [-82.6, 37.2], [-77.7, 37.2], [-77.7, 40.6], [-82.6, 40.6], [-82.6, 37.2]
        ]]),
        area: 62756,
        bounds: { minX: -82.6, minY: 37.2, maxX: -77.7, maxY: 40.6 }
      },
      {
        name: 'South Carolina',
        abbreviation: 'SC',
        geometry: turf.polygon([[
          [-83.4, 32.0], [-78.5, 32.0], [-78.5, 35.2], [-83.4, 35.2], [-83.4, 32.0]
        ]]),
        area: 82933,
        bounds: { minX: -83.4, minY: 32.0, maxX: -78.5, maxY: 35.2 }
      },
      {
        name: 'Maine',
        abbreviation: 'ME',
        geometry: turf.polygon([[
          [-71.1, 43.1], [-66.9, 43.1], [-66.9, 47.5], [-71.1, 47.5], [-71.1, 43.1]
        ]]),
        area: 91633,
        bounds: { minX: -71.1, minY: 43.1, maxX: -66.9, maxY: 47.5 }
      }
    ];

    return sampleStates;
  } catch (error) {
    console.error('Error loading states data:', error);
    return [];
  }
};

// Helper function to validate state data
export const validateStateData = (state: StateData): boolean => {
  return (
    typeof state.name === 'string' &&
    typeof state.abbreviation === 'string' &&
    state.geometry &&
    typeof state.area === 'number' &&
    state.bounds &&
    typeof state.bounds.minX === 'number' &&
    typeof state.bounds.minY === 'number' &&
    typeof state.bounds.maxX === 'number' &&
    typeof state.bounds.maxY === 'number'
  );
};