import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import { GameProvider } from './src/context/GameContext';
import { MenuScreen } from './src/screens/MenuScreen';
import { GameScreen } from './src/screens/GameScreen';
import { ResultScreen } from './src/screens/ResultScreen';

const Stack = createStackNavigator();

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong!</Text>
          <Text style={styles.errorDetail}>{String(this.state.error)}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  console.log('App component rendering...');

  return (
    <ErrorBoundary>
      <GameProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Menu">
            <Stack.Screen
              name="Menu"
              component={MenuScreen}
              options={{ title: 'Does This State Fit?' }}
            />
            <Stack.Screen
              name="Game"
              component={GameScreen}
              options={{ title: 'Game' }}
            />
            <Stack.Screen
              name="Result"
              component={ResultScreen}
              options={{ title: 'Results' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GameProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
