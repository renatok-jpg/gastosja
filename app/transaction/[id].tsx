import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/theme';
import { Transaction } from '../../types/database';

import { getTransactionById, deleteTransaction } from '../../services/transactionService';

// Mapa de ícones e cores por categoria (para manter o padrão da UI)
const getCategoryDetails = (category: string) => {
    const map: Record<string, { icon: keyof typeof Ionicons.glyphMap, color: string }> = {
        'Alimentação': { icon: 'restaurant-outline', color: Colors.alimentation },
        'Transporte': { icon: 'car-outline', color: Colors.transport },
        'Saúde': { icon: 'heart-outline', color: Colors.health },
        'Salário': { icon: 'briefcase-outline', color: Colors.income },
        'Freelance': { icon: 'laptop-outline', color: Colors.freelance },
    };
    return map[category] || { icon: 'wallet-outline', color: Colors.others };
};

export default function TransactionDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransaction = async () => {
            if (typeof id === 'string') {
                const data = await getTransactionById(id);
                setTransaction(data);
            }
            setLoading(false);
        };
        fetchTransaction();
    }, [id]);

    const handleDelete = () => {
        Alert.alert(
            "Excluir Transação",
            "Tem certeza que deseja excluir esta transação? Essa ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            if (typeof id === 'string') {
                                await deleteTransaction(id);
                                router.back();
                            }
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível excluir a transação.");
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!transaction) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Transação não encontrada.</Text>
                <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: Colors.primary }}>Voltar</Text>
                </Pressable>
            </View>
        );
    }

    const isIncome = transaction.type === 'income';
    const categoryDetails = getCategoryDetails(transaction.category);
    
    // Formata a data igual à imagem: "quarta-feira, 20 de maio de 2026"
    const formattedDate = transaction.date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={Colors.white} />
                </Pressable>
                <Text style={styles.headerTitle}>Detalhes</Text>
                <View style={{ width: 24 }} /> {/* Espaçador invisível para centralizar o título */}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Card de Valor (Top) com Gradiente */}
                <LinearGradient
                    colors={[Colors.gradientPrimaryStart, Colors.gradientPrimaryEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.amountCard}
                >
                    <View style={styles.iconCircle}>
                        <Ionicons name={categoryDetails.icon} size={28} color={Colors.white} />
                    </View>
                    
                    <Text style={styles.typeText}>
                        {isIncome ? 'RECEITA' : 'DESPESA'}
                    </Text>
                    
                    <Text style={styles.amountText}>
                        {isIncome ? '+ ' : '– '}R$ {transaction.amount.toFixed(2).replace('.', ',')}
                    </Text>
                    
                    <Text style={styles.titleText}>{transaction.title}</Text>
                </LinearGradient>

                {/* Card de Informações (List) */}
                <View style={styles.infoCard}>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBox}>
                            <Ionicons name="pricetag-outline" size={20} color={categoryDetails.color} />
                        </View>
                        <View style={styles.infoTexts}>
                            <Text style={styles.infoLabel}>Categoria</Text>
                            <Text style={styles.infoValue}>{transaction.category}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBox}>
                            <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} />
                        </View>
                        <View style={styles.infoTexts}>
                            <Text style={styles.infoLabel}>Data</Text>
                            <Text style={styles.infoValue}>{formattedDate}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBox}>
                            <Ionicons name="document-text-outline" size={20} color={Colors.textSecondary} />
                        </View>
                        <View style={styles.infoTexts}>
                            <Text style={styles.infoLabel}>Notas</Text>
                            <Text style={styles.infoValue}>{transaction.notes || '—'}</Text>
                        </View>
                    </View>

                </View>

                {/* Botões de Ação */}
                <View style={styles.actionButtons}>
                    <Pressable 
                        style={styles.editButton} 
                        onPress={() => console.log('Navegar para edição')} // Substitua pela sua rota de edição
                    >
                        <Ionicons name="pencil" size={20} color={Colors.white} />
                        <Text style={styles.editButtonText}>Editar</Text>
                    </Pressable>

                    <Pressable 
                        style={styles.deleteButton} 
                        onPress={handleDelete}
                    >
                        <Ionicons name="trash-outline" size={20} color={Colors.destructive} />
                        <Text style={styles.deleteButtonText}>Excluir</Text>
                    </Pressable>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    center: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60, // Ajuste dependendo do seu SafeAreaView
        paddingBottom: 20,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.white,
    },
    amountCard: {
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    typeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'rgba(255, 255, 255, 0.7)',
        letterSpacing: 1,
        marginBottom: 8,
    },
    amountText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 8,
    },
    titleText: {
        fontSize: 16,
        color: Colors.white,
    },
    infoCard: {
        backgroundColor: Colors.card,
        borderRadius: 24,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    infoIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.surfaceElevated,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    infoTexts: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.white,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginLeft: 56, // Alinha a linha divisória com o texto, pulando o ícone
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    editButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.card,
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        gap: 8,
    },
    editButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(248, 113, 113, 0.1)', // Fundo com leve tint vermelho
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(248, 113, 113, 0.2)',
        gap: 8,
    },
    deleteButtonText: {
        color: Colors.destructive,
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: Colors.destructive,
        fontSize: 16,
    }
});