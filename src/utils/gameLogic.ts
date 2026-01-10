import { StateData, GameQuestion, Difficulty } from '../types';
import { findOptimalRotation, getAreaRatio } from './geometry';

/**
 * Generate a game question based on difficulty
 */
export const generateQuestion = (
  states: StateData[],
  difficulty: Difficulty,
  previousQuestions: GameQuestion[] = []
): GameQuestion => {
  // Filter out previously used state pairs
  const usedPairs = new Set(
    previousQuestions.map(q => `${q.stateA.name}-${q.stateB.name}`)
  );
  
  let stateA: StateData;
  let stateB: StateData;
  let correctAnswer: boolean;
  
  // Difficulty affects the area ratio threshold
  const difficultyThresholds = {
    easy: { min: 0.1, max: 0.3 }, // Very obvious size differences
    medium: { min: 0.3, max: 0.7 }, // Moderate size differences
    hard: { min: 0.6, max: 0.95 } // Similar sizes, harder to judge
  };
  
  const threshold = difficultyThresholds[difficulty];
  
  do {
    // Randomly select two different states
    const indices = getTwoRandomIndices(states.length);
    stateA = states[indices[0]];
    stateB = states[indices[1]];
    
    // Check if this pair was already used
    const pairKey = `${stateA.name}-${stateB.name}`;
    if (usedPairs.has(pairKey)) continue;
    
    // Calculate area ratio
    const areaRatio = getAreaRatio(stateA.geometry, stateB.geometry);
    
    // For easy/medium, ensure clear size differences
    // For hard, make it more ambiguous
    if (difficulty === 'hard') {
      // Include some that barely fit or barely don't fit
      if (areaRatio >= threshold.min && areaRatio <= threshold.max) {
        break;
      }
    } else {
      // For easier difficulties, use clearer examples
      if (areaRatio >= threshold.min && areaRatio <= threshold.max) {
        break;
      }
    }
  } while (true);
  
  // Determine the correct answer
  const { fits } = findOptimalRotation(stateA.geometry, stateB.geometry);
  correctAnswer = fits;
  
  // Sometimes flip the question to make "No" the correct answer
  if (Math.random() > 0.5 && !correctAnswer) {
    // Swap states if the answer would be no
    [stateA, stateB] = [stateB, stateA];
    correctAnswer = !correctAnswer;
  }
  
  return {
    stateA,
    stateB,
    correctAnswer
  };
};

/**
 * Get two different random indices
 */
const getTwoRandomIndices = (length: number): [number, number] => {
  const first = Math.floor(Math.random() * length);
  let second = Math.floor(Math.random() * length);
  while (second === first) {
    second = Math.floor(Math.random() * length);
  }
  return [first, second];
};

/**
 * Calculate score based on answer speed and accuracy
 */
export const calculateScore = (
  isCorrect: boolean,
  timeSeconds: number,
  difficulty: Difficulty
): number => {
  if (!isCorrect) return 0;
  
  const baseScore = {
    easy: 100,
    medium: 200,
    hard: 300
  }[difficulty];
  
  // Bonus for quick answers (under 10 seconds)
  const timeBonus = Math.max(0, 100 - (timeSeconds * 10));
  
  return baseScore + Math.floor(timeBonus);
};

/**
 * Get a hint for the current question
 */
export const getHint = (question: GameQuestion): string => {
  const areaRatio = getAreaRatio(
    question.stateA.geometry,
    question.stateB.geometry
  );
  
  if (areaRatio < 0.3) {
    return `${question.stateA.name} is much smaller than ${question.stateB.name}`;
  } else if (areaRatio > 1.5) {
    return `${question.stateA.name} is larger than ${question.stateB.name}`;
  } else {
    return `The states are relatively similar in size. Try rotating to find the best fit!`;
  }
};