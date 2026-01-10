import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GameProvider } from './src/context/GameContext';
import { MenuScreen } from './src/screens/MenuScreen';
import { GameScreen } from './src/screens/GameScreen';
import { ResultScreen } from './src/screens/ResultScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
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
  );
}
