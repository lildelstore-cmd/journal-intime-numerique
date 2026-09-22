import React, { createContext, useContext, useState } from 'react';
import {
  generateSalt,
  hashPassword,
  deriveEncryptionKey,
  isValidEmail,
  isValidPassword,
} from '../utils/security';
import { findUserByEmail, createUser } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // `user` = { id, email }  — jamais le mot de passe ni son hash
  const [user, setUser] = useState(null);
  // `encryptionKey` vit UNIQUEMENT en mémoire, jamais sur disque.
  // Elle disparaît automatiquement à la déconnexion / fermeture de l'app.
  const [encryptionKey, setEncryptionKey] = useState(null);

  async function signUp(email, password, confirmPassword) {
    if (!isValidEmail(email)) {
      throw new Error("Format d'email invalide.");
    }
    if (!isValidPassword(password)) {
      throw new Error(
        'Le mot de passe doit contenir au moins 6 caractères, une majuscule et un chiffre.'
      );
    }
    if (password !== confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas.');
    }
    const existing = await findUserByEmail(email);
    if (existing) {
      throw new Error('Un compte existe déjà avec cet email.');
    }

    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);
    const newUser = {
      id: Date.now().toString(),
      email: email.trim().toLowerCase(),
      passwordHash,
      salt,
    };
    await createUser(newUser);

    // Connexion automatique après inscription
    const key = deriveEncryptionKey(password, salt);
    setUser({ id: newUser.id, email: newUser.email });
    setEncryptionKey(key);
  }

  async function login(email, password) {
    if (!isValidEmail(email)) {
      throw new Error("Format d'email invalide.");
    }
    const existing = await findUserByEmail(email);
    if (!existing) {
      throw new Error('Aucun compte trouvé avec cet email.');
    }
    const attemptHash = hashPassword(password, existing.salt);
    if (attemptHash !== existing.passwordHash) {
      throw new Error('Mot de passe incorrect.');
    }

    const key = deriveEncryptionKey(password, existing.salt);
    setUser({ id: existing.id, email: existing.email });
    setEncryptionKey(key);
  }

  function logout() {
    setUser(null);
    setEncryptionKey(null); // la clé disparaît de la mémoire
  }

  return (
    <AuthContext.Provider value={{ user, encryptionKey, signUp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé à l’intérieur de AuthProvider');
  return ctx;
}
