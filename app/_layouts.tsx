import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/theme";
import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

export default function TabsLayout() {
  // Aqui estão as variáveis de estado que faltavam!
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Se não estiver logado, expulsa para a raiz (que agora é a index.tsx / Login)
        router.replace("../index");
      } else {
        // Se estiver logado, marca como autenticado
        setAuthenticated(true);
      }
      // Tira a tela de carregamento independentemente do resultado
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Enquanto o Firebase decide a vida, mostra o loading e bloqueia a tela
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background }}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  // Barreira extra de segurança: não renderiza as abas se não tiver usuário logado
  if (!authenticated) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderWidth: 1,
          borderColor: Colors.border,
          height: 80,
          padding: 10,
          position: "absolute",
          margin: 20,
          borderRadius: 40,
          elevation: 8,
          flex: 0,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="analysis"
        options={{
          title: "Análise",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="add"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: Colors.primary,
                justifyContent: "center",
                alignItems: "center",
                marginTop: -30,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 8,
              }}
            >
              <Ionicons name="add" size={30} color="white" />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="goals"
        options={{
          title: "Metas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}