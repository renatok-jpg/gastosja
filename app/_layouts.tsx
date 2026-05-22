import { useEffect, useState } from 'react';
import { Slot, useRouter } from 'expo-router';
import { auth } from '../services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  const [user, setUser] = useState<any>(undefined);
  const router = useRouter();

  useEffect(() => {
    // Monitora o estado da autenticação
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        // Se NÃO tiver usuário logado, joga imediatamente para a tela de login
        router.replace('/login');
      } else {
        // Se já estiver logado, entra direto no app
        router.replace('../(tabs)/index');
      }
    });
    return () => unsub();
  }, []);

  // Enquanto o Firebase está checando se o usuário tá logado ou não,
  // o app mostra uma tela de carregamento com as cores do seu tema.
  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return <Slot />;
}