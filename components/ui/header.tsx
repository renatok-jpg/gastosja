import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../../services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { Colors } from '../../constants/theme';

export default function Header() {
  const [name, setName] = useState(auth.currentUser?.displayName || 'Usuário');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.displayName) {
        const firstName = user.displayName.split(' ')[0];
        setName(firstName);
      } else {
        setName('Usuário');
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.greetingText}>Olá, {name} 👋</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: 20,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
});