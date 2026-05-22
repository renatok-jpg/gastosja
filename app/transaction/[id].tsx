import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert, ScrollView, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/theme';
import { Transaction } from '../../types/database';
import { getTransactionById, deleteTransaction } from '../../services/transactionService';

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
    
    // Estado para controlar a visibilidade do nosso Modal customizado
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    // Função que realmente exclui a transação no banco
    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            const transactionId = Array.isArray(id) ? id[0] : id;
            if (transactionId) {
                await deleteTransaction(transactionId);
                setShowDeleteModal(false);
                router.back();
            }
        } catch (error) {
            console.error("Erro ao excluir:", error);
            Alert.alert("Erro", "Não foi possível excluir a transação.");
        } finally {
            setIsDeleting(false);
        }
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
                <View style={{ width: 24 }} />
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

                {/* Card de Informações */}
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
                        style={styles.deleteButton} 
                        onPress={() => setShowDeleteModal(true)}
                    >
                        <Ionicons name="trash-outline" size={20} color={Colors.destructive} />
                        <Text style={styles.deleteButtonText}>Excluir Transação</Text>
                    </Pressable>
                </View>
            </ScrollView>

            {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
            <Modal
                visible={showDeleteModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalIconContainer}>
                            <Ionicons name="warning-outline" size={32} color={Colors.destructive} />
                        </View>
                        
                        <Text style={styles.modalTitle}>Excluir Transação</Text>
                        <Text style={styles.modalMessage}>
                            Tem certeza que deseja excluir esta transação? Essa ação não pode ser desfeita.
                        </Text>
                        
                        <View style={styles.modalButtonsContainer}>
                            <Pressable 
                                style={[styles.modalButton, styles.modalButtonCancel]} 
                                onPress={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                            >
                                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
                            </Pressable>
                            
                            <Pressable 
                                style={[styles.modalButton, styles.modalButtonDelete]} 
                                onPress={confirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <ActivityIndicator color={Colors.white} size="small" />
                                ) : (
                                    <Text style={styles.modalButtonDeleteText}>Excluir</Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
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
        paddingTop: 60,
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
        marginLeft: 56,
    },
    actionButtons: {
        flexDirection: 'row',
    },
    deleteButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
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
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: Colors.card,
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    modalIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 8,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalButtonCancel: {
        backgroundColor: Colors.surfaceElevated,
    },
    modalButtonCancelText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    modalButtonDelete: {
        backgroundColor: Colors.destructive,
    },
    modalButtonDeleteText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});