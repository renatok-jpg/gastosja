import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, Tabs } from 'expo-router';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/ui/header';
import { SummaryCard } from '../../components/ui/summaryCard';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { onTransactionsChange } from '../../services/transactionService';
import { Transaction } from '../../types/database';

// Configuração centralizada por tipo
const transactionTypeConfig = {
    income: {
        iconColor: Colors.income,
        backgroundColor: Colors.iconIncome,
    },
    expense: {
        iconColor: Colors.expense,
        backgroundColor: Colors.iconExpense,
    },
} as const;

// Mapa de categoria para ícone
const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
    const map: Record<string, keyof typeof Ionicons.glyphMap> = {
        'Alimentação': 'restaurant-outline',
        'Transporte': 'car-outline',
        'Saúde': 'heart-outline',
        'Salário': 'briefcase-outline',
        'Freelance': 'laptop-outline',
    };
    return map[category] || 'wallet-outline';
};

// Componente principal da tela de boas-vindas
export default function Welcome() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const unsubscribe = onTransactionsChange((data) => {
            setTransactions(data.slice(0, 5));
        });
        return () => unsubscribe();
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <Header />
            {/* Conteúdo principal */}
            <View style={styles.content}>
                {/* Card de resumo financeiro */}
                <SummaryCard
                    totalIncome={transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)}
                    totalExpense={transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)}
                    balance={transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0)}
                />
                {/* Seção de transações recentes */}
                <View style={styles.textRow}>
                    <Text style={styles.title}>Transações Recentes</Text>
                    <Text style={styles.subtitle} onPress={() => router.push('/transactions')}>
                        Mostrar Tudo
                    </Text>
                </View>
                {/* Lista de transações recentes */}
                <View style={styles.card}>
                    {transactions.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhuma transação ainda</Text>
                    ) : (
                        transactions.map((transaction) => {
                            const config = transactionTypeConfig[transaction.type];
                            const icon = getCategoryIcon(transaction.category);

                            return (
                                <Pressable
                                    key={transaction.id}
                                    onPress={() => {
                                        console.log('Transação clicada:', transaction);
                                    }}
                                    style={({ pressed }) => [
                                        styles.transactionRow,
                                        pressed && {
                                            opacity: 0.7,
                                            backgroundColor: Colors.cardHover,
                                            borderRadius: 24,
                                        },
                                    ]}
                                >
                                    <View style={styles.iconAndText}>
                                        <View
                                            style={[
                                                styles.iconContainer,
                                                { backgroundColor: config.backgroundColor },
                                            ]}
                                        >
                                            <Ionicons
                                                name={icon}
                                                size={20}
                                                color={config.iconColor}
                                            />
                                        </View>

                                        <View style={styles.textContainer}>
                                            <Text style={styles.title}>{transaction.title}</Text>
                                            <Text style={styles.subtitle}>
                                                {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={styles.transactionAmount}>
                                        R$ {transaction.amount.toFixed(2).replace('.', ',')}
                                    </Text>
                                </Pressable>
                            );
                        })
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 5,
        paddingTop: 0,
        marginTop: 0,
    },
    textContainer: {
        marginLeft: 10,
        padding: 0,
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingBottom: 20,
    },
    content: {
        width: '100%',
        paddingHorizontal: 10,
        paddingTop: 10,
        alignItems: 'flex-start',
    },
    textRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
        marginTop: 25,
        marginBottom: 10,
    },
    card: {
        backgroundColor: Colors.card,
        width: '100%',
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
    cardContent: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    iconAndText: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    transactionRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.iconIncome,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 0,
    },
    title: {
        fontSize: 16,
        color: Colors.white,
        marginVertical: 0,
        padding: 0,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginVertical: 0,
        padding: 0,
        flexShrink: 0,
        lineHeight: 18,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white,
        textAlign: 'right',
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        paddingVertical: 20,
    },
});