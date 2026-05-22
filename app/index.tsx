import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/theme';
import { auth } from '../services/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // Novo: estado para segurar o app no carregamento inicial
  const [error, setError] = useState('');
  const router = useRouter();

  // Bloqueio de segurança inicial
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Se já estiver logado, pula direto pras abas
        router.replace('../(tabs)/index');
      } else {
        // Se não tiver ninguém, libera o formulário de login
        setCheckingAuth(false);
      }
    });
    return () => unsub();
  }, []);

  const handleAuth = async () => {
    if (!email || !password || (isSignUp && !name)) {
      setError('Preencha todos os campos');
      return;
    }
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.replace('/(tabs)');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') setError('Este e-mail já está em uso.');
      else if (err.code === 'auth/invalid-email') setError('E-mail inválido.');
      else if (err.code === 'auth/weak-password') setError('A senha deve ter pelo menos 6 caracteres.');
      else setError('E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  // Se estiver checando o login automático, mostra o loading e esconde o layout do formulário
  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Ionicons name="wallet" size={50} color={Colors.primary} />
        <Text style={styles.title}>GastosJá</Text>
      </View>

      <View style={styles.form}>
        {isSignUp && (
          <>
            <Text style={styles.label}>NOME</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome completo"
              value={name}
              onChangeText={setName}
              editable={!loading}
              placeholderTextColor={Colors.textSecondary}
            />
          </>
        )}

        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          placeholderTextColor={Colors.textSecondary}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>SENHA</Text>
        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          placeholderTextColor={Colors.textSecondary}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={({ pressed }) => [styles.button, (loading || pressed) && { opacity: 0.7 }]}
          onPress={handleAuth}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Aguarde...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
          </Text>
        </Pressable>

        <Pressable onPress={() => { setIsSignUp(!isSignUp); setError(''); setName(''); }} disabled={loading}>
          <Text style={styles.switchText}>
            {isSignUp ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.white, marginTop: 10 },
  form: { width: '100%' },
  label: { fontSize: 12, color: Colors.textSecondary, fontWeight: '700', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: Colors.card, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: Colors.white, fontSize: 14, marginBottom: 20, borderWidth: 1, borderColor: Colors.border },
  button: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  buttonText: { color: Colors.background, fontWeight: 'bold', fontSize: 16 },
  error: { color: Colors.destructive, marginBottom: 15, fontSize: 14, textAlign: 'center', fontWeight: '500' },
  switchText: { color: Colors.primary, textAlign: 'center', marginTop: 20, fontWeight: '600' },
});