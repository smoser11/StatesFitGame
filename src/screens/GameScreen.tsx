import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GameBoard } from '../components/GameBoard';
import { ControlPanel } from '../components/ControlPanel';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { GameContext } from '../context/GameContext';
import { getHint } from '../utils/gameLogic';
import { COLORS } from '../constants';

type RootStackParamList = {
  Menu: undefined;
  Game: undefined;
  Result: undefined;
};

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;

export const GameScreen: React.FC = () => {
  const navigation = useNavigation<GameScreenNavigationProp>();
  const {
    gameState,
    submitAnswer,
    nextQuestion,
    resetRotation,
  } = useContext(GameContext);
  
  const [rotation, setRotation] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  
  useEffect(() => {
    // Reset when new question loads
    setRotation(0);
    setIsAnswered(false);
    setStartTime(Date.now());
  }, [gameState.currentQuestion]);
  
  useEffect(() => {
    // Check if game is over
    if (!gameState.isGameActive && gameState.questionNumber > gameState.totalQuestions) {
      navigation.navigate('Result');
    }
  }, [gameState.isGameActive, gameState.questionNumber, navigation]);
  
  const handleAnswer = (answer: boolean) => {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    submitAnswer(answer, timeElapsed);
    setIsAnswered(true);
    
    // Show result
    const isCorrect = answer === gameState.currentQuestion?.correctAnswer;
    Alert.alert(
      isCorrect ? '✅ Correct!' : '❌ Wrong!',
      isCorrect 
        ? `Yes, ${gameState.currentQuestion?.stateA.name} ${
            gameState.currentQuestion?.correctAnswer ? 'does' : "doesn't"
          } fit in ${gameState.currentQuestion?.stateB.name}!`
        : `Actually, ${gameState.currentQuestion?.stateA.name} ${
            gameState.currentQuestion?.correctAnswer ? 'does' : "doesn't"
          } fit in ${gameState.currentQuestion?.stateB.name}.`,
      [
        {
          text: 'Next Question',
          onPress: () => nextQuestion(),
        },
      ]
    );
  };
  
  const handleHint = () => {
    if (gameState.currentQuestion) {
      const hint = getHint(gameState.currentQuestion);
      Alert.alert('Hint', hint);
    }
  };
  
  const handleReset = () => {
    setRotation(0);
    resetRotation();
  };
  
  if (!gameState.currentQuestion) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading question...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionText}>
          Does {gameState.currentQuestion.stateA.name} fit inside{' '}
          {gameState.currentQuestion.stateB.name}?
        </Text>
        <ScoreDisplay
          score={gameState.score}
          questionNumber={gameState.questionNumber}
          totalQuestions={gameState.totalQuestions}
        />
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionText}>
          🔵 Blue = {gameState.currentQuestion.stateB.name} (target) | 🟠 Orange = {gameState.currentQuestion.stateA.name} (drag to rotate)
        </Text>
      </View>

      <GameBoard
        stateA={gameState.currentQuestion.stateA}
        stateB={gameState.currentQuestion.stateB}
        rotation={rotation}
        onRotationChange={setRotation}
      />

      <ControlPanel
        onAnswer={handleAnswer}
        onHint={handleHint}
        onReset={handleReset}
        rotation={rotation}
        isAnswered={isAnswered}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  instructionsContainer: {
    padding: 10,
    backgroundColor: '#fffbea',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
});