import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScoreDisplayProps {
  score: number;
  questionNumber: number;
  totalQuestions: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  questionNumber,
  totalQuestions,
}) => {
  const progress = (questionNumber / totalQuestions) * 100;
  
  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>
          Question {questionNumber} of {totalQuestions}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%` }
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  scoreContainer: {
    alignItems: 'flex-start',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  progressContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingLeft: 20,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  progressBar: {
    width: 150,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
});