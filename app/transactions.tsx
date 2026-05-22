import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../constants/theme';
import { onTransactionsChange } from '../services/transactionService';
import { Transaction } from '../types/database';

// Mapa de categoria para ícone
const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
    const map: Record<string, keyof typeof Ionicons.glyphMap> = {
        'Alimentação': 'restaurant-outline',
        'Transporte': 'car-outline',
        'Saúde': 'heart-outline',
        'Salário': 'briefcase-outline',
        'Freelance': 'laptop-outline',
        'Assinaturas': 'wifi-outline',
    };
    return map[category] || 'wallet-outline';
};

// Mapa de categoria para cor do ícone
const getCategoryIconColor = (type: Transaction['type'], category: string): string => {
    if (type === 'income') return Colors.income;
    if (category === 'Alimentação') return Colors.expense;
    if (category === 'Transporte') return Colors.textSecondary;
    if (category === 'Assinaturas') return Colors.expense;
    return Colors.textSecondary;
};

// Mapa de categoria para background do ícone
const getCategoryIconBg = (type: Transaction['type'], category: string): string => {
    if (type === 'income') return Colors.iconIncome;
    if (category === 'Alimentação') return Colors.iconExpense;
    if (category === 'Transporte') return Colors.iconBg;
    if (category === 'Assinaturas') return Colors.iconExpense;
    return Colors.iconBg;
};

// Formata data para "SEGUNDA-FEIRA, 18 DE MAIO"
function formatGroupDate(date: Date): string {
    const dias = ['DOMINGO', 'SEGUNDA-FEIRA', 'TERÇA-FEIRA', 'QUARTA-FEIRA', 'QUINTA-FEIRA', 'SEXTA-FEIRA', 'SÁBADO'];
    const meses = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
    const diaSemana = dias[date.getDay()];
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    return `${diaSemana}, ${dia} DE ${mes}`;
}

// Formata hora para "09:00"
function formatTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Formata valor para "+ R$ 3.500,00" ou "- R$ 184,50"
function formatAmount(amount: number, type: Transaction['type']): string {
    const prefix = type === 'income' ? '+ ' : '- ';
    const formatted = amount.toFixed(2).replace('.', ',');
    return `${prefix}R$ ${formatted}`;
}

type GroupedData = {
    id: string;
    date: string;
    dailyTotal: string;
    totalType: 'income' | 'expense' | 'neutral';
    data: Transaction[];
};

export default function TransactionsScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'Tudo' | 'Receitas' | 'Despesas'>('Tudo');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Listener em tempo real
    useEffect(() => {
        const unsubscribe = onTransactionsChange((data) => {
            setTransactions(data);
        });
        return () => unsubscribe();
    }, []);

    // Filtra por aba e busca
    const filteredTransactions = useMemo(() => {
        let filtered = transactions;

        if (activeTab === 'Receitas') {
            filtered = filtered.filter(t => t.type === 'income');
        } else if (activeTab === 'Despesas') {
            filtered = filtered.filter(t => t.type === 'expense');
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.title.toLowerCase().includes(query) ||
                t.category.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [transactions, activeTab, searchQuery]);

    // Agrupa por data
    const groupedTransactions = useMemo((): GroupedData[] => {
        const groups: Record<string, Transaction[]> = {};

        filteredTransactions.forEach(t => {
            const dateKey = t.date.toISOString().split('T')[0];
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(t);
        });

        return Object.entries(groups)
            .sort(([a], [b]) => b.localeCompare(a)) // Mais recente primeiro
            .map(([dateKey, data]) => {
                const date = new Date(dateKey + 'T12:00:00');
                const income = data.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
                const expense = data.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
                const net = income - expense;

                let dailyTotal: string;
                let totalType: 'income' | 'expense' | 'neutral';

                if (net > 0) {
                    dailyTotal = `+R$ ${net.toFixed(2).replace('.', ',')}`;
                    totalType = 'income';
                } else if (net < 0) {
                    dailyTotal = `-R$ ${Math.abs(net).toFixed(2).replace('.', ',')}`;
                    totalType = 'expense';
                } else {
                    dailyTotal = `R$ 0,00`;
                    totalType = 'neutral';
                }

                return {
                    id: dateKey,
                    date: formatGroupDate(date),
                    dailyTotal,
                    totalType,
                    data,
                };
            });
    }, [filteredTransactions]);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.push('/')}
                    style={({ pressed }) => [
                        styles.backButton,
                        pressed && { opacity: 0.7 }
                    ]}
                >
                    <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
                </Pressable>
                <Text style={styles.headerTitle}>Transações</Text>
            </View>

            {/* Busca e Filtro */}
            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={Colors.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar transação..."
                        placeholderTextColor={Colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <Pressable style={styles.filterButton}>
                    <Ionicons name="options-outline" size={22} color={Colors.textPrimary} />
                </Pressable>
            </View>

            {/* Abas */}
            <View style={styles.tabsContainer}>
                {(['Tudo', 'Receitas', 'Despesas'] as const).map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <Pressable
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[
                                styles.tab,
                                isActive && { backgroundColor: Colors.primary }
                            ]}
                        >
                            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                                {tab}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {/* Lista de Transações */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {groupedTransactions.length === 0 ? (
                    <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
                ) : (
                    groupedTransactions.map((group) => (
                        <View key={group.id} style={styles.groupContainer}>
                            {/* Cabeçalho da Data */}
                            <View style={styles.groupHeader}>
                                <Text style={styles.groupDate}>{group.date}</Text>
                                <Text style={[
                                    styles.groupTotal,
                                    { color: group.totalType === 'income' ? Colors.income : Colors.textPrimary }
                                ]}>
                                    {group.dailyTotal}
                                </Text>
                            </View>

                            {/* Card do grupo */}
                            <View style={styles.groupCard}>
                                {group.data.map((transaction, index) => {
                                    const icon = getCategoryIcon(transaction.category);
                                    const iconColor = getCategoryIconColor(transaction.type, transaction.category);
                                    const iconBg = getCategoryIconBg(transaction.type, transaction.category);
                                    const amountColor = transaction.type === 'income' ? Colors.income : Colors.textPrimary;

                                    return (
                                        <View key={transaction.id}>
                                            <Pressable
                                                style={({ pressed }) => [
                                                    styles.transactionRow,
                                                    pressed && { opacity: 0.7, backgroundColor: Colors.cardHover }
                                                ]}
                                            >
                                                <View style={styles.iconAndText}>
                                                    <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
                                                        <Ionicons name={icon} size={20} color={iconColor} />
                                                    </View>
                                                    <View style={styles.textContainer}>
                                                        <Text style={styles.transactionTitle}>{transaction.title}</Text>
                                                        <Text style={styles.transactionSubtitle}>
                                                            {transaction.category} · {formatTime(transaction.date)}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Text style={[styles.transactionAmount, { color: amountColor }]}>
                                                    {formatAmount(transaction.amount, transaction.type)}
                                                </Text>
                                            </Pressable>

                                            {/* Separador */}
                                            {index < group.data.length - 1 && <View style={styles.separator} />}
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        gap: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    searchSection: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 12,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderRadius: 24,
        paddingHorizontal: 16,
        height: 48,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        color: Colors.textPrimary,
        fontSize: 16,
    },
    filterButton: {
        width: 48,
        height: 48,
        backgroundColor: Colors.card,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: Colors.card,
        borderRadius: 30,
        padding: 4,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 26,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    activeTabText: {
        color: Colors.background,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 40,
    },
    groupContainer: {
        marginTop: 20,
    },
    groupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    groupDate: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.textSecondary,
        letterSpacing: 0.5,
    },
    groupTotal: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    groupCard: {
        backgroundColor: Colors.card,
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    transactionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 16,
    },
    iconAndText: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 12,
        justifyContent: 'center',
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    transactionSubtitle: {
        fontSize: 13,
        color: Colors.textSecondary,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 8,
        marginLeft: 56,
    },
});