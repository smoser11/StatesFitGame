import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { GameState, GameQuestion, Difficulty } from '../types';
import { generateQuestion, calculateScore } from '../utils/gameLogic';
import { loadStatesData } from '../data/states';
import { GAME_CONSTANTS } from '../constants';

interface GameContextType {
  gameState: GameState;
  submitAnswer: (answer: boolean, timeSeconds: number) => void;
  nextQuestion: () => void;
  resetRotation: () => void;
  startNewGame: (difficulty: Difficulty) => void;
}

export const GameContext = createContext<GameContextType>({} as GameContextType);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: null,
    score: 0,
    questionNumber: 1,
    totalQuestions: GAME_CONSTANTS.TOTAL_QUESTIONS,
    isGameActive: false,
    userAnswer: null,
    rotation: 0,
  });
  
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [previousQuestions, setPreviousQuestions] = useState<GameQuestion[]>([]);
  const [statesData, setStatesData] = useState<any[]>([]);
  
  useEffect(() => {
    // Load states data on mount
    loadStatesData().then(data => {
      setStatesData(data);
    }).catch(error => {
      console.error('Failed to load states data:', error);
    });
  }, []);
  
  const startNewGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setPreviousQuestions([]);
    
    if (statesData.length > 0) {
      const firstQuestion = generateQuestion(statesData, selectedDifficulty);
      
      setGameState({
        currentQuestion: firstQuestion,
        score: 0,
        questionNumber: 1,
        totalQuestions: GAME_CONSTANTS.TOTAL_QUESTIONS,
        isGameActive: true,
        userAnswer: null,
        rotation: 0,
      });
    }
  };
  
  const submitAnswer = (answer: boolean, timeSeconds: number) => {
    if (!gameState.currentQuestion) return;
    
    const isCorrect = answer === gameState.currentQuestion.correctAnswer;
    const points = calculateScore(isCorrect, timeSeconds, difficulty);
    
    setGameState(prev => ({
      ...prev,
      userAnswer: answer,
      score: prev.score + points,
    }));
  };
  
  const nextQuestion = () => {
    if (gameState.questionNumber >= gameState.totalQuestions) {
      // Game over
      setGameState(prev => ({
        ...prev,
        isGameActive: false,
      }));
      return;
    }
    
    if (statesData.length > 0 && gameState.currentQuestion) {
      const newQuestion = generateQuestion(
        statesData,
        difficulty,
        [...previousQuestions, gameState.currentQuestion]
      );
      
      setPreviousQuestions(prev => [...prev, gameState.currentQuestion!]);
      
      setGameState(prev => ({
        ...prev,
        currentQuestion: newQuestion,
        questionNumber: prev.questionNumber + 1,
        userAnswer: null,
        rotation: 0,
      }));
    }
  };
  
  const resetRotation = () => {
    setGameState(prev => ({
      ...prev,
      rotation: 0,
    }));
  };
  
  return (
    <GameContext.Provider
      value={{
        gameState,
        submitAnswer,
        nextQuestion,
        resetRotation,
        startNewGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};