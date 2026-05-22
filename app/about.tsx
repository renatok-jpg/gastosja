import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/theme";

export default function About() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.content}>
        {/* Header com botão voltar e linha divisória */}
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
            <Text style={styles.screenTitle}>Sobre o App</Text>
          </View>

          <Text style={styles.description}>
            O{" "}
            <Text style={{ color: Colors.primary, fontWeight: "bold" }}>
              GastosJá
            </Text>{" "}
            nasceu para transformar sua relação com o dinheiro através de uma
            organização simples e eficiente.
          </Text>
        </View>

        {/* Card: O que é o app */}
        <View style={styles.card}>
          <View style={styles.cardIconRow}>
            <Ionicons name="rocket-outline" size={24} color={Colors.primary} />
            <Text style={styles.cardTitle}>Nossa Missão</Text>
          </View>
          <Text style={styles.cardText}>
            Ajudar você a ter total controle sobre sua vida financeira,
            permitindo que cada centavo seja registrado e cada meta seja
            alcançada.
          </Text>
        </View>

        {/* Cards de Funcionalidades */}
        <Text style={styles.sectionTitle}>O que você pode fazer?</Text>

        <View style={styles.card}>
          <View style={styles.featureRow}>
            <View
              style={[styles.iconBox, { backgroundColor: Colors.iconIncome }]}
            >
              <Ionicons name="trending-up" size={20} color={Colors.income} />
            </View>
            <View style={styles.featureTextInfo}>
              <Text style={styles.featureTitle}>Receitas e Gastos</Text>
              <Text style={styles.featureDescription}>
                Registre suas entradas e despesas diariamente para nunca mais
                perder o controle.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.featureRow}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: "rgba(56, 189, 248, 0.15)" },
              ]}
            >
              <Ionicons name="flag-outline" size={20} color="#38BDF8" />
            </View>
            <View style={styles.featureTextInfo}>
              <Text style={styles.featureTitle}>Metas Financeiras</Text>
              <Text style={styles.featureDescription}>
                Estabeleça objetivos para seus sonhos e acompanhe o progresso de
                suas economias.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Versão 1.0.0 — Estável eu acho</Text>
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
  headerRow: {
    marginBottom: 25,
    paddingHorizontal: 5,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
    backgroundColor: Colors.iconBg,
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
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.white,
    marginTop: 10,
    marginBottom: 15,
    marginLeft: 5,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    elevation: 5,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardIconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.white,
  },
  cardText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 15,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  featureTextInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
});
