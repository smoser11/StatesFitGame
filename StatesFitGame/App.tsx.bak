// App.tsx - Replace entire file with this
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ React Native Web is Working!</Text>
      <Text style={styles.subtitle}>Counter: {count}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setCount(count + 1)}
      >
        <Text style={styles.buttonText}>Click Me!</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4ECDC4",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    color: "white",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#4ECDC4",
    fontSize: 18,
    fontWeight: "bold",
  },
});
