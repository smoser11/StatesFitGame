import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../constants';

interface ControlPanelProps {
  onAnswer: (answer: boolean) => void;
  onHint: () => void;
  onReset: () => void;
  rotation: number;
  isAnswered: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onAnswer,
  onHint,
  onReset,
  rotation,
  isAnswered,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.rotationText}>
        Rotation: {Math.round(rotation)}°
      </Text>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.yesButton, isAnswered && styles.disabled]}
          onPress={() => onAnswer(true)}
          disabled={isAnswered}
        >
          <Text style={styles.buttonText}>YES, it fits!</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.noButton, isAnswered && styles.disabled]}
          onPress={() => onAnswer(false)}
          disabled={isAnswered}
        >
          <Text style={styles.buttonText}>NO, it doesn't</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.hintButton]}
          onPress={onHint}
        >
          <Text style={styles.buttonText}>Get Hint</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={onReset}
        >
          <Text style={styles.buttonText}>Reset Rotation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.WHITE,
  },
  rotationText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  yesButton: {
    backgroundColor: COLORS.BUTTON_YES,
  },
  noButton: {
    backgroundColor: COLORS.BUTTON_NO,
  },
  hintButton: {
    backgroundColor: COLORS.BUTTON_HINT,
  },
  resetButton: {
    backgroundColor: COLORS.BUTTON_RESET,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
});