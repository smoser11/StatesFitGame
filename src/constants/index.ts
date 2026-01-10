export const GAME_CONSTANTS = {
  TOTAL_QUESTIONS: 10,
  ROTATION_STEP: 15,
  FINE_ROTATION_STEP: 1,
  DEFAULT_PADDING: 20,
  TIME_BONUS_THRESHOLD: 10, // seconds
  MAX_TIME_BONUS: 100,
};

export const COLORS = {
  STATE_A: {
    FILL: 'rgba(250, 150, 100, 0.5)',
    STROKE: 'rgb(250, 150, 100)',
  },
  STATE_B: {
    FILL: 'rgba(100, 150, 250, 0.3)',
    STROKE: 'rgb(100, 150, 250)',
  },
  BACKGROUND: '#f0f0f0',
  WHITE: '#ffffff',
  BUTTON_YES: '#4CAF50',
  BUTTON_NO: '#f44336',
  BUTTON_HINT: '#2196F3',
  BUTTON_RESET: '#FF9800',
};

export const DIFFICULTY_SETTINGS = {
  easy: {
    name: 'Easy',
    areaRatioRange: { min: 0.1, max: 0.3 },
    baseScore: 100,
    description: 'Very obvious size differences',
  },
  medium: {
    name: 'Medium', 
    areaRatioRange: { min: 0.3, max: 0.7 },
    baseScore: 200,
    description: 'Moderate size differences',
  },
  hard: {
    name: 'Hard',
    areaRatioRange: { min: 0.6, max: 0.95 },
    baseScore: 300,
    description: 'Similar sizes, harder to judge',
  },
};

export const SCREEN_DIMENSIONS = {
  BOARD_HEIGHT_RATIO: 0.5,
  STATE_A_SIZE_RATIO: 0.4,
  STATE_B_SIZE_RATIO: 0.8,
};