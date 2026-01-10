import { generateQuestion, calculateScore, getHint } from '../src/utils/gameLogic';
import { StateData, Difficulty } from '../src/types';
import * as turf from '@turf/turf';

describe('Game Logic', () => {
  // Mock state data for testing
  const mockStates: StateData[] = [
    {
      name: 'Small State',
      abbreviation: 'SS',
      geometry: turf.polygon([[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]),
      area: 1000,
      bounds: { minX: 0, minY: 0, maxX: 1, maxY: 1 }
    },
    {
      name: 'Medium State',
      abbreviation: 'MS',
      geometry: turf.polygon([[[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]]]),
      area: 4000,
      bounds: { minX: 0, minY: 0, maxX: 2, maxY: 2 }
    },
    {
      name: 'Large State',
      abbreviation: 'LS',
      geometry: turf.polygon([[[0, 0], [5, 0], [5, 5], [0, 5], [0, 0]]]),
      area: 25000,
      bounds: { minX: 0, minY: 0, maxX: 5, maxY: 5 }
    }
  ];

  describe('generateQuestion', () => {
    it('should generate a valid question', () => {
      const question = generateQuestion(mockStates, 'medium');
      
      expect(question).toHaveProperty('stateA');
      expect(question).toHaveProperty('stateB');
      expect(question).toHaveProperty('correctAnswer');
      expect(typeof question.correctAnswer).toBe('boolean');
      expect(question.stateA).not.toBe(question.stateB);
    });

    it('should generate different questions for different difficulties', () => {
      const easyQuestion = generateQuestion(mockStates, 'easy');
      const hardQuestion = generateQuestion(mockStates, 'hard');
      
      expect(easyQuestion).toHaveProperty('stateA');
      expect(hardQuestion).toHaveProperty('stateA');
    });

    it('should avoid repeating questions', () => {
      const firstQuestion = generateQuestion(mockStates, 'medium');
      const secondQuestion = generateQuestion(mockStates, 'medium', [firstQuestion]);
      
      const firstPair = `${firstQuestion.stateA.name}-${firstQuestion.stateB.name}`;
      const secondPair = `${secondQuestion.stateA.name}-${secondQuestion.stateB.name}`;
      
      expect(firstPair).not.toBe(secondPair);
    });
  });

  describe('calculateScore', () => {
    it('should return 0 for incorrect answers', () => {
      const score = calculateScore(false, 5, 'medium');
      expect(score).toBe(0);
    });

    it('should return base score for correct answers', () => {
      const score = calculateScore(true, 10, 'medium');
      expect(score).toBeGreaterThan(0);
    });

    it('should give higher scores for harder difficulties', () => {
      const easyScore = calculateScore(true, 5, 'easy');
      const mediumScore = calculateScore(true, 5, 'medium');
      const hardScore = calculateScore(true, 5, 'hard');
      
      expect(hardScore).toBeGreaterThan(mediumScore);
      expect(mediumScore).toBeGreaterThan(easyScore);
    });

    it('should give time bonuses for quick answers', () => {
      const quickScore = calculateScore(true, 2, 'medium');
      const slowScore = calculateScore(true, 15, 'medium');
      
      expect(quickScore).toBeGreaterThan(slowScore);
    });
  });

  describe('getHint', () => {
    it('should provide a hint for small vs large states', () => {
      const question = {
        stateA: mockStates[0], // Small State
        stateB: mockStates[2], // Large State
        correctAnswer: true
      };
      
      const hint = getHint(question);
      expect(typeof hint).toBe('string');
      expect(hint.length).toBeGreaterThan(0);
    });

    it('should provide different hints based on area ratios', () => {
      const smallInLarge = {
        stateA: mockStates[0], // Small State
        stateB: mockStates[2], // Large State
        correctAnswer: true
      };
      
      const similarSizes = {
        stateA: mockStates[1], // Medium State
        stateB: mockStates[1], // Medium State (same)
        correctAnswer: true
      };
      
      const hintSmall = getHint(smallInLarge);
      const hintSimilar = getHint(similarSizes);
      
      expect(hintSmall).not.toBe(hintSimilar);
    });
  });
});