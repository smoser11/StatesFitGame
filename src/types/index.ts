import { Feature } from 'geojson';

export interface StateData {
  name: string;
  abbreviation: string;
  geometry: Feature;
  area: number; // in square kilometers
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
}

export interface GameQuestion {
  stateA: StateData; // State to fit
  stateB: StateData; // Target state
  correctAnswer: boolean;
}

export interface GameState {
  currentQuestion: GameQuestion | null;
  score: number;
  questionNumber: number;
  totalQuestions: number;
  isGameActive: boolean;
  userAnswer: boolean | null;
  rotation: number; // Current rotation of stateA in degrees
}

export type Difficulty = 'easy' | 'medium' | 'hard';