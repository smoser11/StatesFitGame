import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GameContext } from '../context/GameContext';
import { Difficulty } from '../types';
import { COLORS, DIFFICULTY_SETTINGS } from '../constants';

type RootStackParamList = {
  Menu: undefined;
  Game: undefined;
  Result: undefined;
};

type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Menu'>;

export const MenuScreen: React.FC = () => {
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const { startNewGame } = useContext(GameContext);

  const handleStartGame = (difficulty: Difficulty) => {
    startNewGame(difficulty);
    navigation.navigate('Game');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Does This State Fit?</Text>
        <Text style={styles.subtitle}>
          Test your geography knowledge by figuring out if one US state can fit inside another!
        </Text>

        <View style={styles.difficultyContainer}>
          <Text style={styles.difficultyTitle}>Choose Difficulty:</Text>
          
          {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map((difficulty) => (
            <TouchableOpacity
              key={difficulty}
              style={[
                styles.difficultyButton,
                { backgroundColor: getDifficultyColor(difficulty) }
              ]}
              onPress={() => handleStartGame(difficulty)}
            >
              <Text style={styles.difficultyButtonText}>
                {DIFFICULTY_SETTINGS[difficulty].name}
              </Text>
              <Text style={styles.difficultyDescription}>
                {DIFFICULTY_SETTINGS[difficulty].description}
              </Text>
              <Text style={styles.difficultyScore}>
                Base Score: {DIFFICULTY_SETTINGS[difficulty].baseScore} points
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to Play:</Text>
          <Text style={styles.instruction}>• Rotate the orange state by dragging</Text>
          <Text style={styles.instruction}>• Decide if it fits completely inside the blue state</Text>
          <Text style={styles.instruction}>• Answer YES or NO</Text>
          <Text style={styles.instruction}>• Faster answers get bonus points!</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const getDifficultyColor = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case 'easy': return '#4CAF50';
    case 'medium': return '#FF9800';
    case 'hard': return '#f44336';
    default: return '#2196F3';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
    lineHeight: 24,
  },
  difficultyContainer: {
    marginBottom: 40,
  },
  difficultyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  difficultyButton: {
    padding: 20,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
  difficultyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: 5,
  },
  difficultyDescription: {
    fontSize: 14,
    color: COLORS.WHITE,
    opacity: 0.9,
    marginBottom: 5,
  },
  difficultyScore: {
    fontSize: 12,
    color: COLORS.WHITE,
    opacity: 0.8,
  },
  instructionsContainer: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 10,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 22,
  },
});