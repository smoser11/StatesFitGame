import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOARD_SIZE = Math.min(SCREEN_WIDTH - 40, 400);

// Simplified state shapes (normalized 0-100 coordinates)
const STATES_DATA = {
  wyoming: {
    name: 'Wyoming',
    shape: '20,20 80,20 80,60 20,60', // Rectangle
    area: 50,
    color: '#FF6B6B',
  },
  colorado: {
    name: 'Colorado', 
    shape: '25,25 75,25 75,65 25,65', // Rectangle, slightly smaller
    area: 45,
    color: '#4ECDC4',
  },
  texas: {
    name: 'Texas',
    shape: '10,20 70,20 80,30 80,50 70,70 40,80 20,80 10,60', // Rough Texas shape
    area: 100,
    color: '#45B7D1',
  },
  rhodeIsland: {
    name: 'Rhode Island',
    shape: '45,45 55,45 55,55 45,55', // Tiny square
    area: 5,
    color: '#96CEB4',
  },
  california: {
    name: 'California',
    shape: '30,10 40,15 35,50 30,80 20,75 25,40 20,20', // Tall irregular
    area: 70,
    color: '#DDA0DD',
  },
  montana: {
    name: 'Montana',
    shape: '15,15 85,15 85,45 15,45', // Wide rectangle
    area: 65,
    color: '#FFB347',
  },
  alaska: {
    name: 'Alaska',
    shape: '10,10 60,10 70,20 70,40 60,50 40,50 30,60 20,50 10,30', // Large irregular
    area: 120,
    color: '#87CEEB',
  },
};

type StateKey = keyof typeof STATES_DATA;

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [stateA, setStateA] = useState<StateKey>('wyoming');
  const [stateB, setStateB] = useState<StateKey>('texas');
  const [rotation, setRotation] = useState(0);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setCurrentRound(1);
    generateNewQuestion();
  };

  const generateNewQuestion = () => {
    const stateKeys = Object.keys(STATES_DATA) as StateKey[];
    let randomStateA = stateKeys[Math.floor(Math.random() * stateKeys.length)];
    let randomStateB = stateKeys[Math.floor(Math.random() * stateKeys.length)];
    
    // Make sure they're different and create interesting comparisons
    while (randomStateB === randomStateA || 
           Math.abs(STATES_DATA[randomStateA].area - STATES_DATA[randomStateB].area) < 10) {
      randomStateB = stateKeys[Math.floor(Math.random() * stateKeys.length)];
    }
    
    setStateA(randomStateA);
    setStateB(randomStateB);
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 45) % 360);
  };

  const checkAnswer = (userSays: boolean) => {
    const areaA = STATES_DATA[stateA].area;
    const areaB = STATES_DATA[stateB].area;
    const actualAnswer = areaA <= areaB;
    
    const isCorrect = userSays === actualAnswer;
    
    if (isCorrect) {
      setScore(score + 10);
      Alert.alert(
        '✅ Correct!',
        `${STATES_DATA[stateA].name} (area: ${areaA}) ${actualAnswer ? 'CAN' : 'CANNOT'} fit in ${STATES_DATA[stateB].name} (area: ${areaB})`,
        [{ text: 'Next', onPress: nextRound }]
      );
    } else {
      Alert.alert(
        '❌ Wrong!',
        `${STATES_DATA[stateA].name} (area: ${areaA}) ${actualAnswer ? 'CAN' : 'CANNOT'} fit in ${STATES_DATA[stateB].name} (area: ${areaB})`,
        [{ text: 'Next', onPress: nextRound }]
      );
    }
  };

  const nextRound = () => {
    if (currentRound < 5) {
      setCurrentRound(currentRound + 1);
      generateNewQuestion();
    } else {
      Alert.alert(
        '🎮 Game Over!',
        `Final Score: ${score}/50\n${score >= 40 ? 'Excellent!' : score >= 30 ? 'Good job!' : 'Keep practicing!'}`,
        [{ text: 'Play Again', onPress: startGame }]
      );
      setGameStarted(false);
    }
  };

  if (!gameStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.menuContainer}>
          <Text style={styles.title}>🗺️ Does This State Fit?</Text>
          <Text style={styles.subtitle}>Test Your Geography Skills!</Text>
          
          <View style={styles.instructions}>
            <Text style={styles.instructionTitle}>How to Play:</Text>
            <Text style={styles.instructionText}>📍 You'll see two US states</Text>
            <Text style={styles.instructionText}>🔄 Rotate the orange state with the button</Text>
            <Text style={styles.instructionText}>🤔 Decide if it fits inside the blue state</Text>
            <Text style={styles.instructionText}>✅ Click YES or NO to answer</Text>
            <Text style={styles.instructionText}>🏆 Get 10 points for each correct answer!</Text>
          </View>
          
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
          
          <Text style={styles.version}>v1.0 - Simple Shapes Edition</Text>
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionText}>
          Can <Text style={{color: STATES_DATA[stateA].color, fontWeight: 'bold'}}>
            {STATES_DATA[stateA].name}
          </Text> fit inside <Text style={{color: STATES_DATA[stateB].color, fontWeight: 'bold'}}>
            {STATES_DATA[stateB].name}
          </Text>?
        </Text>
        <View style={styles.scoreContainer}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Round</Text>
            <Text style={styles.scoreValue}>{currentRound}/5</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
        </View>
      </View>

      <View style={styles.boardContainer}>
        <View style={styles.board}>
          <Svg width={BOARD_SIZE} height={BOARD_SIZE} style={styles.svg}>
            {/* State B (Target) - Background */}
            <Polygon
              points={STATES_DATA[stateB].shape}
              fill={STATES_DATA[stateB].color}
              fillOpacity={0.3}
              stroke={STATES_DATA[stateB].color}
              strokeWidth="2"
              scale={BOARD_SIZE / 100}
            />
            
            {/* State A (Moving) - Foreground with rotation */}
            <Polygon
              points={STATES_DATA[stateA].shape}
              fill={STATES_DATA[stateA].color}
              fillOpacity={0.7}
              stroke={STATES_DATA[stateA].color}
              strokeWidth="2"
              scale={BOARD_SIZE / 100}
              rotation={rotation}
              origin={`${BOARD_SIZE / 2}, ${BOARD_SIZE / 2}`}
            />
          </Svg>
        </View>
        
        {/* Labels */}
        <View style={styles.labelsContainer}>
          <View style={[styles.label, { backgroundColor: STATES_DATA[stateB].color + '40' }]}>
            <Text style={[styles.labelText, { color: STATES_DATA[stateB].color }]}>
              {STATES_DATA[stateB].name} (Target)
            </Text>
          </View>
          <View style={[styles.label, { backgroundColor: STATES_DATA[stateA].color + '40' }]}>
            <Text style={[styles.labelText, { color: STATES_DATA[stateA].color }]}>
              {STATES_DATA[stateA].name} (Rotating)
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.rotateButton} onPress={handleRotate}>
          <Text style={styles.rotateButtonText}>🔄 Rotate {rotation}°</Text>
        </TouchableOpacity>
        
        <View style={styles.answerButtons}>
          <TouchableOpacity
            style={[styles.answerButton, styles.yesButton]}
            onPress={() => checkAnswer(true)}
          >
            <Text style={styles.answerButtonText}>YES ✅</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.answerButton, styles.noButton]}
            onPress={() => checkAnswer(false)}
          >
            <Text style={styles.answerButtonText}>NO ❌</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.hintButton} onPress={() => {
          Alert.alert(
            '💡 Hint',
            `Compare the relative sizes:\n${STATES_DATA[stateA].name}: ${STATES_DATA[stateA].area} units\n${STATES_DATA[stateB].name}: ${STATES_DATA[stateB].area} units`,
            [{ text: 'OK' }]
          );
        }}>
          <Text style={styles.hintButtonText}>💡 Need a Hint?</Text>
        </TouchableOpacity>
      </View>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  instructions: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    maxWidth: 400,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  instructionText: {
    fontSize: 15,
    color: '#555',
    marginVertical: 5,
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  version: {
    marginTop: 30,
    color: '#999',
    fontSize: 12,
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  questionText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
    marginBottom: 15,
    lineHeight: 28,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#999',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  boardContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  board: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  svg: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    gap: 15,
  },
  label: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '600',
  },
  controls: {
    padding: 20,
  },
  rotateButton: {
    backgroundColor: '#45B7D1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  rotateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  answerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  answerButton: {
    flex: 1,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  yesButton: {
    backgroundColor: '#4CAF50',
  },
  noButton: {
    backgroundColor: '#f44336',
  },
  answerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hintButton: {
    marginTop: 15,
    padding: 12,
    alignItems: 'center',
  },
  hintButtonText: {
    color: '#666',
    fontSize: 16,
  },
});