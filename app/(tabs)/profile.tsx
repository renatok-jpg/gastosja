import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '../../services/firebaseConfig';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';

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

const SectionHeader = ({ title }: SectionHeaderProps) => (
    <Text style={styles.sectionHeader}>{title}</Text>
);

const ListItem = ({ icon, title, value, showChevron = true, danger = false, onPress }: ListItemProps) => (
    <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={({ pressed }) => [
            styles.listItemContainer,
            pressed && { opacity: 0.7, backgroundColor: Colors.cardHover, borderRadius: 16 },
        ]}
    >
        <View style={styles.iconAndText}>
            <View style={[styles.iconContainer, danger && { backgroundColor: 'rgba(248, 113, 113, 0.12)' }]}>
                <Ionicons name={icon} size={20} color={danger ? Colors.destructive : Colors.icon} />
            </View>
            <Text style={[styles.title, { marginLeft: 16 }, danger && styles.textDanger]}>
                {title}
            </Text>
        </View>

        <View style={styles.listItemRight}>
            {value && <Text style={styles.listItemValue}>{value}</Text>}
            {showChevron && <Ionicons name="chevron-forward-outline" size={20} color={Colors.icon} />}
        </View>
    </Pressable>
);

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false); // Dados carregados do Firebase, pode liberar a tela
        });
        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.replace('/login');
        } catch (error) {
            console.error("Erro ao deslogar: ", error);
        }
    };

    // Enquanto o Firebase não responde quem é o usuário logado, mostra um loading discreto
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color={Colors.primary} size="large" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.content}>
                
                <View style={styles.headerRow}>
                    <Text style={styles.screenTitle}>Perfil</Text>
                </View>

                {/* Card do Usuário Real vindo do Firebase */}
                <View style={styles.card}>
                    <View style={styles.userCardContent}>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>
                                {user?.displayName || 'Usuário GastosJá'}
                            </Text>
                            <Text style={styles.userEmail} numberOfLines={1}>
                                {user?.email || 'Sem e-mail cadastrado'}
                            </Text>
                        </View>
                    </View>
                </View>

                <SectionHeader title="CONTA" />
                <View style={styles.card}>
                    <ListItem icon="help-circle-outline" title="Ajuda & Suporte" onPress={() => router.push('/support')} />
                    <ListItem icon="information-circle-outline" title="Sobre o GastosJá" value="v1.0.0" onPress={() => router.push('/about')} />
                </View>

                <SectionHeader title="AVANÇADO" />
                <View style={styles.card}>
                    <ListItem icon="log-out-outline" title="Sair da conta" danger showChevron={false} onPress={handleSignOut} />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Feito com 💚 — GastosJá v1.0.0</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: 5 },
    loadingContainer: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
    contentContainer: { alignItems: 'center', justifyContent: 'flex-start', paddingBottom: 40 },
    content: { width: '100%', paddingHorizontal: 10, paddingTop: 10, alignItems: 'flex-start' },
    headerRow: { width: '100%', paddingHorizontal: 10, marginTop: 25, marginBottom: 20 },
    screenTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.white },
    card: { backgroundColor: Colors.card, width: '100%', borderRadius: 24, padding: 16, marginBottom: 16, shadowColor: Colors.cardShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5, borderWidth: 2, borderColor: Colors.border },
    sectionHeader: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, letterSpacing: 1.2, marginBottom: 8, marginLeft: 16, marginTop: 8 },
    userCardContent: { flexDirection: 'row', alignItems: 'center' },
    userInfo: { flex: 1, marginRight: 8 },
    userName: { fontSize: 16, fontWeight: 'bold', color: Colors.white, marginBottom: 4 },
    userEmail: { fontSize: 14, color: Colors.textSecondary },
    iconAndText: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
    iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.iconBg, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 16, color: Colors.white, fontWeight: '600' },
    listItemContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 4 },
    textDanger: { color: Colors.destructive },
    listItemRight: { flexDirection: 'row', alignItems: 'center' },
    listItemValue: { fontSize: 14, color: Colors.textSecondary, marginRight: 8 },
    footer: { width: '100%', alignItems: 'center', marginTop: 16, marginBottom: 24 },
    footerText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
});