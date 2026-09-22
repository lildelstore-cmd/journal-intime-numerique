import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData, decryptData } from './security';

const USERS_KEY = '@journal_users';
const ENTRIES_PREFIX = '@journal_entries_'; // + userId

/* ---------- Utilisateurs ---------- */

export async function getAllUsers() {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function findUserByEmail(email) {
  const users = await getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function createUser(user) {
  const users = await getAllUsers();
  users.push(user);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/* ---------- Entrées de journal (chiffrées) ---------- */

// `key` = clé de chiffrement dérivée du mot de passe, gardée en mémoire
// pendant la session (voir AuthContext). Rien n'est jamais stocké en clair.

export async function getEntries(userId, key) {
  const raw = await AsyncStorage.getItem(ENTRIES_PREFIX + userId);
  if (!raw) return [];
  const decrypted = decryptData(raw, key);
  return decrypted || [];
}

export async function saveEntries(userId, key, entries) {
  const cipher = encryptData(entries, key);
  await AsyncStorage.setItem(ENTRIES_PREFIX + userId, cipher);
}

export async function addEntry(userId, key, entry) {
  const entries = await getEntries(userId, key);
  entries.unshift(entry); // plus récent en premier
  await saveEntries(userId, key, entries);
  return entries;
}

export async function deleteEntry(userId, key, entryId) {
  const entries = await getEntries(userId, key);
  const filtered = entries.filter((e) => e.id !== entryId);
  await saveEntries(userId, key, filtered);
  return filtered;
}
