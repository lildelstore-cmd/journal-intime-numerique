import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { addEntry } from '../utils/storage';

const MOODS = [
  { key: 'heureux', emoji: '😊', label: 'Heureux' },
  { key: 'calme', emoji: '😌', label: 'Calme' },
  { key: 'motive', emoji: '💪', label: 'Motivé' },
  { key: 'neutre', emoji: '😐', label: 'Neutre' },
  { key: 'stresse', emoji: '😰', label: 'Stressé' },
  { key: 'triste', emoji: '😢', label: 'Triste' },
];

export default function AddEntryScreen({ navigation }) {
  const { user, encryptionKey } = useAuth();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [mood, setMood] = useState('neutre');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setError('');
    if (!title.trim()) {
      setError('Le titre est requis.');
      return;
    }
    if (!text.trim()) {
      setError('Le texte de l’entrée est requis.');
      return;
    }
    setSaving(true);
    const entry = {
      id: Date.now().toString(),
      title: title.trim(),
      text: text.trim(),
      date: new Date().toISOString(),
      mood,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    };
    try {
      await addEntry(user.id, encryptionKey, entry);
      navigation.goBack();
    } catch (e) {
      setError("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.title}>Nouvelle entrée</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Text style={styles.label}>Titre</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Titre de l'entrée" />

          <Text style={styles.label}>Humeur</Text>
          <View style={styles.moodRow}>
            {MOODS.map((m) => (
              <TouchableOpacity
                key={m.key}
                style={[styles.moodChip, mood === m.key && styles.moodChipActive]}
                onPress={() => setMood(m.key)}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={styles.moodLabel}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Étiquettes (séparées par des virgules)</Text>
          <TextInput
            style={styles.input}
            value={tagsInput}
            onChangeText={setTagsInput}
            placeholder="ex: famille, travail, école"
          />

          <Text style={styles.label}>Texte</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={text}
            onChangeText={setText}
            placeholder="Écrivez librement..."
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
            <Text style={styles.buttonText}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancel}>Annuler</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  title: { fontSize: 22, fontWeight: '700', color: '#2C3E50', marginBottom: 16 },
  label: { fontSize: 13, color: '#7F8C8D', marginBottom: 6, marginTop: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#DCDDE1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: { height: 160 },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap' },
  moodChip: {
    borderWidth: 1,
    borderColor: '#DCDDE1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  moodChipActive: { borderColor: '#E67E22', backgroundColor: '#FDEBD0' },
  moodEmoji: { fontSize: 18 },
  moodLabel: { fontSize: 10, color: '#7F8C8D', marginTop: 2 },
  button: {
    backgroundColor: '#E67E22',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  cancel: { color: '#7F8C8D', textAlign: 'center', marginTop: 16 },
  errorText: {
    color: '#C0392B',
    backgroundColor: '#FADBD8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
});
