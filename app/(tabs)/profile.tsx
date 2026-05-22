import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Colors } from "../../constants/theme";

// --- TIPAGENS ---
interface ListItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  showChevron?: boolean;
  danger?: boolean;
  onPress?: () => void;
}

interface SectionHeaderProps {
  title: string;
}

// --- COMPONENTES AUXILIARES (Sem React.FC) ---
const SectionHeader = ({ title }: SectionHeaderProps) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const ListItem = ({
  icon,
  title,
  value,
  showChevron = true,
  danger = false,
  onPress,
}: ListItemProps) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    style={({ pressed }) => [
      styles.listItemContainer,
      pressed && {
        opacity: 0.7,
        backgroundColor: Colors.cardHover,
        borderRadius: 16,
      },
    ]}
  >
    <View style={styles.iconAndText}>
      <View
        style={[
          styles.iconContainer,
          danger && { backgroundColor: "rgba(248, 113, 113, 0.12)" },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={danger ? Colors.destructive : Colors.white}
        />
      </View>

      <Text
        style={[styles.title, { marginLeft: 16 }, danger && styles.textDanger]}
      >
        {title}
      </Text>
    </View>

    <View style={styles.listItemRight}>
      {value && <Text style={styles.listItemValue}>{value}</Text>}
      {showChevron && (
        <Ionicons
          name="chevron-forward-outline"
          size={20}
          color={Colors.icon}
        />
      )}
    </View>
  </Pressable>
);

// --- TELA PRINCIPAL ---
export default function Profile() {
  const router = useRouter(); // Inicializa o roteador
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.content}>
        {/* Título da Tela */}
        <View style={styles.headerRow}>
          <Text style={styles.screenTitle}>Perfil</Text>
        </View>

        {/* Card do Usuário */}
        <View style={styles.card}>
          <View style={styles.userCardContent}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=11" }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Renato Figueiredo</Text>
              <Text style={styles.userEmail} numberOfLines={1}>
                renato.figueiredo@example.com
              </Text>
            </View>

            <Pressable
              onPress={() => console.log("Editar Perfil")}
              style={({ pressed }) => [
                styles.editButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </Pressable>
          </View>
        </View>

        {/* Seção: CONTA */}
        <SectionHeader title="CONTA" />
        <View style={styles.card}>
          <ListItem
            icon="help-circle-outline"
            title="Ajuda & Suporte"
            onPress={() => router.push("/support")} // Faz a navegação para a nova tela
          />
          <ListItem
            icon="information-circle-outline"
            title="Sobre o GastosJá"
            value="v1.0.0"
            onPress={() => router.push("/about")} // Navegação para o Sobre
          />
        </View>

        {/* Seção: AVANÇADO */}
        <SectionHeader title="AVANÇADO" />
        <View style={styles.card}>
          <ListItem
            icon="trash-outline"
            title="Limpar dados"
            danger
            showChevron={false}
            onPress={() => console.log("Limpar dados")}
          />
          <ListItem
            icon="log-out-outline"
            title="Sair da conta"
            danger
            showChevron={false}
            onPress={() => console.log("Sair da conta")}
          />
        </View>

        {/* Rodapé do App */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Feito com 💚 — GastosJá v1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 5,
    paddingTop: 0,
    marginTop: 0,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 40,
  },
  content: {
    width: "100%",
    paddingHorizontal: 10,
    paddingTop: 10,
    alignItems: "flex-start",
  },
  headerRow: {
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 25,
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.white,
  },
  card: {
    backgroundColor: Colors.card,
    width: "100%",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 16,
    marginTop: 8,
  },
  userCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  editButton: {
    backgroundColor: "rgba(74, 222, 128, 0.12)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  editButtonText: {
    color: Colors.primaryGlow,
    fontWeight: "600",
    fontSize: 14,
  },
  iconAndText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.iconBg,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "600",
  },
  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  textDanger: {
    color: Colors.destructive,
  },
  listItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  footer: {
    width: "100%",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
});
