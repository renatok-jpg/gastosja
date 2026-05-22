import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Importando para o botão de voltar
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/theme";

interface Creator {
  name: string;
  email: string;
}

const creators: Creator[] = [
  { name: "Caio Escóssio Prieto", email: "caio.246541@fmm.org.br" },
  { name: "Renato Figueiredo de Moraes", email: "renato.246505@fmm.org.br" },
  { name: "Matheus Cardoso Barbosa", email: "matheus.246535@fmm.org.br" },
];

export default function Support() {
  const router = useRouter(); // Inicializando o roteador

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.content}>
        {/* Header atualizado com botão de voltar e borda */}
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <Pressable
              onPress={() => router.replace("/profile")} // Força a volta para o perfil
              style={({ pressed }) => [
                styles.backButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Ionicons name="chevron-back" size={24} color={Colors.white} />
            </Pressable>
            <Text style={styles.screenTitle}>Suporte</Text>
          </View>

          <Text style={styles.description}>
            Caso precise de ajuda ou queira reportar um erro, entre em contato
            com um dos nossos desenvolvedores:
          </Text>
        </View>

        {creators.map((creator, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.creatorRow}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.info}>
                <Text style={styles.name}>{creator.name}</Text>

                <View style={styles.emailContainer}>
                  <Ionicons
                    name="mail-outline"
                    size={16}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.email}>{creator.email}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Equipe GastosJá — 2026</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  content: {
    width: "100%",
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  // Estilos atualizados do Header
  headerRow: {
    marginBottom: 25,
    paddingHorizontal: 5,
    paddingBottom: 20, // Espaço antes da linha
    borderBottomWidth: 1, // Espessura da linha
    borderBottomColor: Colors.border, // Cor da linha (usando a mesma dos cards)
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.iconBg, // Fundo igual aos outros ícones
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.white,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  // Restante dos estilos
  card: {
    backgroundColor: Colors.card,
    width: "100%",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.iconBg,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 4,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
