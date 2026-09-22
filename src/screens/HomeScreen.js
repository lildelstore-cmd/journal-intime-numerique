import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getEntries, deleteEntry as deleteEntryStorage } from '../utils/storage';
import EntryCard from '../components/EntryCard';

export default function HomeScreen({ navigation }) {
  const { user, encryptionKey, logout } = useAuth();
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadEntries() {
    setLoading(true);
    const data = await getEntries(user.id, encryptionKey);
    // Tri par date décroissante (plus récent en premier)
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setEntries(data);
    setLoading(false);
  }

  // Recharge la liste chaque fois que l'écran redevient actif
  // (ex: après avoir ajouté une nouvelle entrée)
  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  function handleDelete(entry) {
    Alert.alert('Supprimer', `Supprimer l'entrée "${entry.title}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          const updated = await deleteEntryStorage(user.id, encryptionKey, entry.id);
          updated.sort((a, b) => new Date(b.date) - new Date(a.date));
          setEntries(updated);
        },
      },
    ]);
  }

  function handleLogout() {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnexion', onPress: logout },
    ]);
  }

  // Filtre simple: cherche dans le titre, le texte et les étiquettes
  const filtered = entries.filter((e) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    const inTitle = e.title.toLowerCase().includes(q);
    const inText = e.text.toLowerCase().includes(q);
    const inTags = (e.tags || []).some((t) => t.toLowerCase().includes(q));
    const inDate = new Date(e.date).toLocaleDateString('fr-FR').includes(q);
    return inTitle || inText || inTags || inDate;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Mon journal</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Rechercher (titre, texte, étiquette, date)"
        value={search}
        onChangeText={setSearch}
      />

      {!loading && filtered.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {search ? 'Aucune entrée ne correspond.' : 'Aucune entrée pour le moment.\nAppuyez sur + pour commencer.'}
          </Text>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <EntryCard
            entry={item}
            onPress={() => navigation.navigate('EntryDetail', { entry: item })}
            onDelete={() => handleDelete(item)}
          />
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEntry')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA', paddingHorizontal: 20, paddingTop: 8 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: { fontSize: 22, fontWeight: '700', color: '#2C3E50' },
  email: { fontSize: 12, color: '#95A5A6' },
  logout: { color: '#C0392B', fontWeight: '600' },
  search: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { textAlign: 'center', color: '#95A5A6', fontSize: 14, lineHeight: 20 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E67E22',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  fabText: { color: '#FFF', fontSize: 28, lineHeight: 30 },
});
