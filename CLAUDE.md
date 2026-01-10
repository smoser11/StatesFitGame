# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StatesFitGame is a React Native mobile game built with Expo SDK 53.0.22 and TypeScript. Players determine if one U.S. state can fit inside another by rotating and comparing their geographic shapes using real geometric calculations.

## Development Commands

```bash
# Start development server
npm start

# Run on specific platforms
npm run android
npm run ios  
npm run web

# Run tests
npm test
```

## Architecture

### Core Stack
- React Native 0.79.6 with React 19.0.0
- Expo SDK ~53.0.22 for cross-platform development
- TypeScript 5.8.3 with strict mode enabled
- @react-navigation for screen navigation

### Key Dependencies
- **@turf/turf**: Geospatial analysis library for geometric calculations
- **react-native-svg**: Vector graphics rendering for state shapes
- **react-native-gesture-handler**: Touch interactions for rotation
- **react-native-reanimated**: Smooth animations

### Navigation Flow
1. **MenuScreen** - Game start/difficulty selection
2. **GameScreen** - Main gameplay with interactive state shapes  
3. **ResultScreen** - Score display and completion

### State Management
- **GameContext** (React Context + useState) manages global game state
- Centralized state includes: current question, score, progress, user answers, rotation angle

### Core Components

**GameBoard.tsx**: Interactive SVG canvas handling touch gestures and geometric transformations using Turf.js

**StateShape.tsx**: SVG path rendering from GeoJSON coordinates

**Game Logic (utils/gameLogic.ts)**: 
- Difficulty-based question generation with area ratio thresholds
- Time-based scoring with difficulty multipliers
- Hint system based on comparative state sizes

**Geometry Utilities (utils/geometry.ts)**:
- Spatial containment using point-in-polygon tests
- Optimal rotation finding through iterative testing
- Viewport scaling and coordinate transformations

### Data Structure
States are represented as:
```typescript
interface StateData {
  name: string;
  abbreviation: string;
  geometry: Feature;      // GeoJSON Feature
  area: number;           // Square kilometers  
  bounds: BoundingBox;    // Min/max coordinates
}
```

### Testing
- Jest-based unit tests in `__tests__/` directory
- Coverage for game logic, geometry calculations, and question generation
- Mock data structures for isolated testing

### Configuration
- **app.json**: Expo configuration for cross-platform settings
- **tsconfig.json**: Extends Expo base config with strict mode
- Uses Expo defaults for Babel/Metro (no custom configuration)