import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddEntryScreen from './src/screens/AddEntryScreen';
import EntryDetailScreen from './src/screens/EntryDetailScreen';

const Stack = createNativeStackNavigator();

// Pile de navigation "publique" — accessible uniquement si l'utilisateur
// n'est PAS connecté.
function PublicStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

// Pile de navigation "protégée" — accessible uniquement APRÈS authentification.
// C'est ici que se joue la protection des routes exigée par le cahier des
// charges : tant que `user` est null (voir AuthContext), il est
// impossible d'atteindre ces écrans, quel que soit ce que fait l'utilisateur.
function PrivateStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#2C3E50' }, headerTintColor: '#FFF' }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddEntry" component={AddEntryScreen} options={{ title: 'Nouvelle entrée' }} />
      <Stack.Screen name="EntryDetail" component={EntryDetailScreen} options={{ title: 'Entrée' }} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      {user ? <PrivateStack /> : <PublicStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AuthProvider>
  );
}
