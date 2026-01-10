import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
  PanResponder,
  Animated,
} from "react-native";
import Svg, { Polygon, G, Circle, Text as SvgText } from "react-native-svg";
import { StatusBar } from "expo-status-bar";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BOARD_SIZE = Math.min(SCREEN_WIDTH - 40, 400);

// Updated state shapes with better visibility
const STATES_DATA = {
  wyoming: {
    name: "Wyoming",
    shape: "30,30 70,30 70,60 30,60",
    area: 50,
    color: "#FF6B6B",
  },
  colorado: {
    name: "Colorado",
    shape: "25,25 75,25 75,65 25,65",
    area: 45,
    color: "#4ECDC4",
  },
  texas: {
    name: "Texas",
    shape: "10,20 70,20 80,30 80,50 70,70 40,80 20,80 10,60",
    area: 100,
    color: "#45B7D1",
  },
  rhodeIsland: {
    name: "Rhode Island",
    shape: "42,42 58,42 58,58 42,58",
    area: 5,
    color: "#96CEB4",
  },
  california: {
    name: "California",
    shape: "30,10 40,15 35,50 30,80 20,75 25,40 20,20",
    area: 70,
    color: "#DDA0DD",
  },
  montana: {
    name: "Montana",
    shape: "15,25 85,25 85,55 15,55",
    area: 65,
    color: "#FFB347",
  },
  alaska: {
    name: "Alaska",
    shape: "10,10 60,10 70,20 70,40 60,50 40,50 30,60 20,50 10,30",
    area: 120,
    color: "#87CEEB",
  },
  vermont: {
    name: "Vermont",
    shape: "45,20 55,20 55,70 45,70",
    area: 8,
    color: "#98FB98",
  },
  delaware: {
    name: "Delaware",
    shape: "47,30 53,30 53,60 47,60",
    area: 6,
    color: "#DDA0DD",
  },
};

type StateKey = keyof typeof STATES_DATA;
type Difficulty = "easy" | "medium" | "hard";
type InteractionMode = "move" | "rotate";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [stateA, setStateA] = useState<StateKey>("wyoming");
  const [stateB, setStateB] = useState<StateKey>("texas");
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(
    null
  );
  const [isAnswered, setIsAnswered] = useState(false);
  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>("move");

  const lastGestureRef = useRef({ x: 0, y: 0 });
  const interactionModeRef = useRef(interactionMode);

  // Update ref whenever mode changes
  React.useEffect(() => {
    interactionModeRef.current = interactionMode;
  }, [interactionMode]);

  // Pan responder for move and rotate
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isAnswered,
      onMoveShouldSetPanResponder: () => !isAnswered,

      onPanResponderGrant: (evt) => {
        // Store initial position for move mode
        lastGestureRef.current = {
          x: position.x,
          y: position.y,
        };
      },

      onPanResponderMove: (evt, gestureState) => {
        // Use the ref to get current mode
        if (interactionModeRef.current === "move") {
          // Move the state
          setPosition({
            x: lastGestureRef.current.x + gestureState.dx,
            y: lastGestureRef.current.y + gestureState.dy,
          });
        } else {
          // Rotate the state - calculate angle from touch position to center
          const centerX = BOARD_SIZE / 2;
          const centerY = BOARD_SIZE / 2;
          const touchX = evt.nativeEvent.locationX;
          const touchY = evt.nativeEvent.locationY;

          const angle =
            Math.atan2(touchY - centerY, touchX - centerX) * (180 / Math.PI);

          setRotation((angle + 360) % 360);
        }
      },
    })
  ).current;

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
    setScore(0);
    setCurrentRound(1);
    generateNewQuestion(selectedDifficulty);
  };

  const generateNewQuestion = (diff: Difficulty) => {
    const stateKeys = Object.keys(STATES_DATA) as StateKey[];
    let randomStateA: StateKey;
    let randomStateB: StateKey;

    const getStatePair = (): [StateKey, StateKey] => {
      const small = stateKeys.filter((k) => STATES_DATA[k].area <= 20);
      const medium = stateKeys.filter(
        (k) => STATES_DATA[k].area > 20 && STATES_DATA[k].area <= 60
      );
      const large = stateKeys.filter((k) => STATES_DATA[k].area > 60);

      if (diff === "easy") {
        const smallState = small[Math.floor(Math.random() * small.length)];
        const largeState = large[Math.floor(Math.random() * large.length)];
        return Math.random() > 0.5
          ? [smallState, largeState]
          : [largeState, smallState];
      } else if (diff === "hard") {
        const category = Math.random() > 0.5 ? medium : large;
        const state1 = category[Math.floor(Math.random() * category.length)];
        let state2 = category[Math.floor(Math.random() * category.length)];
        while (state2 === state1) {
          state2 = category[Math.floor(Math.random() * category.length)];
        }
        return [state1, state2];
      } else {
        const state1 = stateKeys[Math.floor(Math.random() * stateKeys.length)];
        let state2 = stateKeys[Math.floor(Math.random() * stateKeys.length)];
        while (state2 === state1) {
          state2 = stateKeys[Math.floor(Math.random() * stateKeys.length)];
        }
        return [state1, state2];
      }
    };

    [randomStateA, randomStateB] = getStatePair();

    setStateA(randomStateA);
    setStateB(randomStateB);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setShowFeedback(null);
    setIsAnswered(false);
    setInteractionMode("move");
  };

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const checkAnswer = (userSays: boolean) => {
    if (isAnswered) return;

    const areaA = STATES_DATA[stateA].area;
    const areaB = STATES_DATA[stateB].area;
    const actualAnswer = areaA <= areaB;

    const isCorrect = userSays === actualAnswer;
    setIsAnswered(true);

    setShowFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      setScore(score + 10);
    }

    setTimeout(() => {
      if (currentRound < 5) {
        setCurrentRound(currentRound + 1);
        generateNewQuestion(difficulty);
      } else {
        Alert.alert(
          "🎮 Game Over!",
          `Final Score: ${isCorrect ? score + 10 : score}/50\n${
            score >= 40
              ? "🏆 Excellent!"
              : score >= 30
              ? "👏 Good job!"
              : score >= 20
              ? "💪 Keep practicing!"
              : "📚 Study your states!"
          }`,
          [{ text: "Play Again", onPress: () => setGameStarted(false) }]
        );
        setGameStarted(false);
      }
    }, 2000);
  };

  const scalePoints = (points: string, scale: number = 1) => {
    return points
      .split(" ")
      .map((point) => {
        const [x, y] = point.split(",").map(Number);
        return `${x * scale},${y * scale}`;
      })
      .join(" ");
  };

  if (!gameStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.menuContainer}>
          <Text style={styles.title}>🗺️ Does This State Fit?</Text>
          <Text style={styles.subtitle}>Test Your Geography Skills!</Text>

          <View style={styles.instructions}>
            <Text style={styles.instructionTitle}>How to Play:</Text>
            <Text style={styles.instructionText}>📍 Compare two US states</Text>
            <Text style={styles.instructionText}>
              ✋ Drag to move the state around
            </Text>
            <Text style={styles.instructionText}>
              🔄 Switch to rotate mode to spin it
            </Text>
            <Text style={styles.instructionText}>
              🤔 Position & rotate to see if it fits
            </Text>
            <Text style={styles.instructionText}>
              ✅ Click YES or NO to answer
            </Text>
          </View>

          <Text style={styles.difficultyTitle}>Choose Difficulty:</Text>

          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: "#4CAF50" }]}
            onPress={() => startGame("easy")}
          >
            <Text style={styles.startButtonText}>🟢 Easy</Text>
            <Text style={styles.difficultyDesc}>Obvious size differences</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: "#FF9800" }]}
            onPress={() => startGame("medium")}
          >
            <Text style={styles.startButtonText}>🟡 Medium</Text>
            <Text style={styles.difficultyDesc}>Mixed challenges</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: "#f44336" }]}
            onPress={() => startGame("hard")}
          >
            <Text style={styles.startButtonText}>🔴 Hard</Text>
            <Text style={styles.difficultyDesc}>Similar sizes</Text>
          </TouchableOpacity>

          <Text style={styles.version}>v1.2 - Move & Rotate</Text>
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionText}>
          Can{" "}
          <Text
            style={{ color: STATES_DATA[stateA].color, fontWeight: "bold" }}
          >
            {STATES_DATA[stateA].name}
          </Text>{" "}
          fit inside{" "}
          <Text
            style={{ color: STATES_DATA[stateB].color, fontWeight: "bold" }}
          >
            {STATES_DATA[stateB].name}
          </Text>
          ?
        </Text>
        <View style={styles.scoreContainer}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Difficulty</Text>
            <Text style={[styles.scoreValue, { fontSize: 16 }]}>
              {difficulty.toUpperCase()}
            </Text>
          </View>
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

      {/* Mode Toggle Buttons */}
      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            interactionMode === "move" && styles.modeButtonActive,
            isAnswered && styles.disabledButton,
          ]}
          onPress={() => setInteractionMode("move")}
          disabled={isAnswered}
        >
          <Text
            style={[
              styles.modeButtonText,
              interactionMode === "move" && styles.modeButtonTextActive,
            ]}
          >
            ✋ Move
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            interactionMode === "rotate" && styles.modeButtonActive,
            isAnswered && styles.disabledButton,
          ]}
          onPress={() => setInteractionMode("rotate")}
          disabled={isAnswered}
        >
          <Text
            style={[
              styles.modeButtonText,
              interactionMode === "rotate" && styles.modeButtonTextActive,
            ]}
          >
            🔄 Rotate
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            styles.resetButton,
            isAnswered && styles.disabledButton,
          ]}
          onPress={resetPosition}
          disabled={isAnswered}
        >
          <Text style={styles.modeButtonText}>🎯 Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.boardContainer} {...panResponder.panHandlers}>
        <View style={styles.board}>
          <Svg width={BOARD_SIZE} height={BOARD_SIZE} style={styles.svg}>
            {/* State B (Target) - Background */}
            <Polygon
              points={scalePoints(STATES_DATA[stateB].shape, BOARD_SIZE / 100)}
              fill={STATES_DATA[stateB].color}
              fillOpacity={0.3}
              stroke={STATES_DATA[stateB].color}
              strokeWidth="3"
            />

            {/* State A (Moving) - with position and rotation */}
            <G transform={`translate(${position.x}, ${position.y})`}>
              <G
                rotation={rotation.toString()}
                origin={`${BOARD_SIZE / 2}, ${BOARD_SIZE / 2}`}
              >
                <Polygon
                  points={scalePoints(
                    STATES_DATA[stateA].shape,
                    BOARD_SIZE / 100
                  )}
                  fill={STATES_DATA[stateA].color}
                  fillOpacity={0.7}
                  stroke={STATES_DATA[stateA].color}
                  strokeWidth="3"
                />
              </G>
            </G>

            {/* Feedback Overlay */}
            {showFeedback && (
              <G>
                <Circle
                  cx={BOARD_SIZE / 2}
                  cy={BOARD_SIZE / 2}
                  r={BOARD_SIZE / 3}
                  fill={showFeedback === "correct" ? "#4CAF50" : "#f44336"}
                  fillOpacity={0.3}
                />
                <SvgText
                  x={BOARD_SIZE / 2}
                  y={BOARD_SIZE / 2 + 20}
                  fontSize="60"
                  fill={showFeedback === "correct" ? "#4CAF50" : "#f44336"}
                  textAnchor="middle"
                >
                  {showFeedback === "correct" ? "✓" : "✗"}
                </SvgText>
              </G>
            )}
          </Svg>
        </View>

        {/* Labels */}
        <View style={styles.labelsContainer}>
          <View
            style={[
              styles.label,
              { backgroundColor: STATES_DATA[stateB].color + "40" },
            ]}
          >
            <Text
              style={[styles.labelText, { color: STATES_DATA[stateB].color }]}
            >
              {STATES_DATA[stateB].name} (Target)
            </Text>
          </View>
          <View
            style={[
              styles.label,
              { backgroundColor: STATES_DATA[stateA].color + "40" },
            ]}
          >
            <Text
              style={[styles.labelText, { color: STATES_DATA[stateA].color }]}
            >
              {STATES_DATA[stateA].name} (
              {interactionMode === "move" ? "Moving" : "Rotating"})
            </Text>
          </View>
        </View>

        <Text style={styles.dragHint}>
          {isAnswered
            ? "Next round coming..."
            : interactionMode === "move"
            ? "👆 Drag to move the state"
            : "👆 Drag to rotate the state"}
        </Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.answerButtons}>
          <TouchableOpacity
            style={[
              styles.answerButton,
              styles.yesButton,
              isAnswered && styles.disabledButton,
            ]}
            onPress={() => checkAnswer(true)}
            disabled={isAnswered}
          >
            <Text style={styles.answerButtonText}>YES ✅</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.answerButton,
              styles.noButton,
              isAnswered && styles.disabledButton,
            ]}
            onPress={() => checkAnswer(false)}
            disabled={isAnswered}
          >
            <Text style={styles.answerButtonText}>NO ❌</Text>
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  menuContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  instructions: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
    maxWidth: 400,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  instructionText: {
    fontSize: 15,
    color: "#555",
    marginVertical: 5,
    lineHeight: 22,
  },
  difficultyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginBottom: 15,
  },
  startButton: {
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    minWidth: 200,
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  difficultyDesc: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    marginTop: 2,
  },
  version: {
    marginTop: 30,
    color: "#999",
    fontSize: 12,
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  questionText: {
    fontSize: 20,
    textAlign: "center",
    color: "#333",
    marginBottom: 15,
    lineHeight: 28,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  scoreItem: {
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#999",
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  modeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  modeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
  },
  modeButtonActive: {
    backgroundColor: "#45B7D1",
    borderColor: "#45B7D1",
  },
  resetButton: {
    backgroundColor: "#FF9800",
    borderColor: "#FF9800",
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  modeButtonTextActive: {
    color: "white",
  },
  boardContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  board: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  svg: {
    backgroundColor: "white",
    borderRadius: 10,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "center",
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
    fontWeight: "600",
  },
  dragHint: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  controls: {
    padding: 20,
  },
  answerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  answerButton: {
    flex: 1,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  yesButton: {
    backgroundColor: "#4CAF50",
  },
  noButton: {
    backgroundColor: "#f44336",
  },
  answerButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
