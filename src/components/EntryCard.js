import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MOOD_EMOJIS = {
  heureux: '😊',
  triste: '😢',
  stresse: '😰',
  calme: '😌',
  motive: '💪',
  neutre: '😐',
};

export default function EntryCard({ entry, onPress, onDelete }) {
  const dateStr = new Date(entry.date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={1}>
          {MOOD_EMOJIS[entry.mood] ? MOOD_EMOJIS[entry.mood] + ' ' : ''}
          {entry.title}
        </Text>
        <TouchableOpacity onPress={onDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.date}>{dateStr}</Text>
      <Text style={styles.preview} numberOfLines={2}>
        {entry.text}
      </Text>
      {entry.tags && entry.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {entry.tags.map((tag, i) => (
            <View key={i} style={styles.tagChip}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: '#2C3E50', flex: 1, marginRight: 8 },
  deleteIcon: { fontSize: 16 },
  date: { fontSize: 12, color: '#95A5A6', marginTop: 2 },
  preview: { fontSize: 14, color: '#34495E', marginTop: 8 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  tagChip: {
    backgroundColor: '#FDEBD0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: { fontSize: 11, color: '#B9770E' },
});
