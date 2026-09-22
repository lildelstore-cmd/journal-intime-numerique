import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function SplashScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.logo}>📔</Text>
        <Text style={styles.title}>Journal Intime</Text>
        <Text style={styles.subtitle}>Numérique</Text>
        <Text style={styles.tagline}>Vos pensées, en sécurité.</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryButtonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.secondaryButtonText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2C3E50', justifyContent: 'space-between', padding: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { fontSize: 72, marginBottom: 16 },
  title: { fontSize: 30, fontWeight: '700', color: '#FFFFFF' },
  subtitle: { fontSize: 18, color: '#BDC3C7', marginBottom: 12 },
  tagline: { fontSize: 14, color: '#95A5A6', marginTop: 8 },
  buttons: { marginBottom: 24 },
  primaryButton: {
    backgroundColor: '#E67E22',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
