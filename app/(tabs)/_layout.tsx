// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/theme";
import { View } from "react-native";

export default function TabsLayout() {
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
                marginTop: -30, // faz o botão "subir"
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
