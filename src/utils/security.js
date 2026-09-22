import 'react-native-get-random-values';
import CryptoJS from 'crypto-js';

/**
 * Module de sécurité de l'application.
 *
 * Bonnes pratiques appliquées :
 * 1. Les mots de passe ne sont JAMAIS stockés en clair. On stocke un sel
 *    aléatoire (unique par utilisateur) + le hash SHA-256 du mot de passe
 *    concaténé avec ce sel (technique "salted hash").
 * 2. Les entrées du journal sont chiffrées (AES) avant d'être écrites dans
 *    AsyncStorage. La clé de chiffrement est dérivée du mot de passe de
 *    l'utilisateur au moment de la connexion et n'est JAMAIS persistée sur
 *    le disque : elle vit uniquement en mémoire (React Context) pendant la
 *    session. Si quelqu'un accède au stockage brut du téléphone, il ne
 *    trouve que du texte chiffré illisible.
 */

// Génère un sel aléatoire de 16 octets encodé en hexadécimal
export function generateSalt() {
  return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
}

// Hash SHA-256 du mot de passe + sel
export function hashPassword(password, salt) {
  return CryptoJS.SHA256(password + salt).toString(CryptoJS.enc.Hex);
}

// Dérive une clé de chiffrement stable à partir du mot de passe + sel
// (PBKDF2 = plus robuste qu'un simple hash pour dériver une clé)
export function deriveEncryptionKey(password, salt) {
  return CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32, iterations: 1000 }).toString(
    CryptoJS.enc.Hex
  );
}

// Chiffre un objet JS (le convertit en JSON puis en AES)
export function encryptData(data, key) {
  const json = JSON.stringify(data);
  return CryptoJS.AES.encrypt(json, key).toString();
}

// Déchiffre une chaîne AES et reconvertit en objet JS
export function decryptData(cipherText, key) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    const json = bytes.toString(CryptoJS.enc.Utf8);
    if (!json) return null;
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

// Validation d'email simple (regex standard)
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).trim().toLowerCase());
}

// Règles de robustesse du mot de passe : au moins 6 caractères,
// une majuscule, un chiffre (exigence typique d'un cours de sécurité)
export function isValidPassword(password) {
  if (!password || password.length < 6) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUpper && hasNumber;
}
