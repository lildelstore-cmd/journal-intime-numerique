import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { deleteEntry as deleteEntryStorage } from '../utils/storage';

export default function EntryDetailScreen({ route, navigation }) {
  const { entry } = route.params;
  const { user, encryptionKey } = useAuth();

  const dateStr = new Date(entry.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  function handleDelete() {
    Alert.alert('Supprimer', `Supprimer l'entrée "${entry.title}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteEntryStorage(user.id, encryptionKey, entry.id);
          navigation.goBack();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.date}>{dateStr}</Text>
        <Text style={styles.title}>{entry.title}</Text>

        {entry.tags && entry.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {entry.tags.map((tag, i) => (
              <View key={i} style={styles.tagChip}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.text}>{entry.text}</Text>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Supprimer cette entrée</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  date: { fontSize: 12, color: '#95A5A6', textTransform: 'capitalize' },
  title: { fontSize: 24, fontWeight: '700', color: '#2C3E50', marginTop: 6, marginBottom: 10 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  tagChip: {
    backgroundColor: '#FDEBD0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: { fontSize: 11, color: '#B9770E' },
  text: { fontSize: 16, color: '#34495E', lineHeight: 24 },
  deleteButton: {
    marginTop: 32,
    borderWidth: 1,
    borderColor: '#C0392B',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteButtonText: { color: '#C0392B', fontWeight: '600' },
});
