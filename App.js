import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RecipeProvider } from './src/context/RecipeContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <RecipeProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </RecipeProvider>
    </SafeAreaProvider>
  );
}
