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
import { COLORS } from '../constants';

type RootStackParamList = {
  Menu: undefined;
  Game: undefined;
  Result: undefined;
};

type ResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Result'>;

export const ResultScreen: React.FC = () => {
  const navigation = useNavigation<ResultScreenNavigationProp>();
  const { gameState } = useContext(GameContext);

  const getScoreRating = (score: number): { rating: string; color: string; message: string } => {
    if (score >= 2000) {
      return {
        rating: 'Excellent!',
        color: '#4CAF50',
        message: 'You\'re a geography master!'
      };
    } else if (score >= 1500) {
      return {
        rating: 'Great!',
        color: '#8BC34A',
        message: 'Impressive knowledge of US states!'
      };
    } else if (score >= 1000) {
      return {
        rating: 'Good',
        color: '#FF9800',
        message: 'Not bad! Keep practicing.'
      };
    } else if (score >= 500) {
      return {
        rating: 'Okay',
        color: '#FF5722',
        message: 'Room for improvement!'
      };
    } else {
      return {
        rating: 'Try Again',
        color: '#f44336',
        message: 'Practice makes perfect!'
      };
    }
  };

  const { rating, color, message } = getScoreRating(gameState.score);
  const accuracy = Math.round((gameState.score > 0 ? 1 : 0) * 100); // Simplified accuracy calculation

  const handlePlayAgain = () => {
    navigation.navigate('Menu');
  };

  const handleBackToMenu = () => {
    navigation.navigate('Menu');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Game Complete!</Text>
        
        <View style={[styles.scoreContainer, { borderColor: color }]}>
          <Text style={[styles.scoreText, { color }]}>
            {gameState.score.toLocaleString()}
          </Text>
          <Text style={styles.pointsText}>POINTS</Text>
        </View>

        <Text style={[styles.rating, { color }]}>{rating}</Text>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Questions Answered:</Text>
            <Text style={styles.statValue}>{gameState.totalQuestions}</Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Accuracy:</Text>
            <Text style={styles.statValue}>{accuracy}%</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.playAgainButton]}
            onPress={handlePlayAgain}
          >
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.menuButton]}
            onPress={handleBackToMenu}
          >
            <Text style={styles.buttonText}>Back to Menu</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Tips for Better Scores:</Text>
          <Text style={styles.tip}>• Answer quickly for time bonuses</Text>
          <Text style={styles.tip}>• Use rotation to test different orientations</Text>
          <Text style={styles.tip}>• Consider relative state sizes</Text>
          <Text style={styles.tip}>• Use hints when you're unsure</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  scoreContainer: {
    alignItems: 'center',
    padding: 30,
    borderWidth: 3,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 5,
  },
  rating: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  statsContainer: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 30,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  playAgainButton: {
    backgroundColor: COLORS.BUTTON_YES,
  },
  menuButton: {
    backgroundColor: COLORS.BUTTON_HINT,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  tipsContainer: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 10,
    width: '100%',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  tip: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});