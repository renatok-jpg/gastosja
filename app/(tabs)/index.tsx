import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, Tabs } from 'expo-router';
//vou adicionar  a tela de home qeue u criei, para mostrar o resumo financeiro e as transações recentes
// importando as cores do tema para usar na estilização
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/ui/header';
import { SummaryCard } from '../../components/ui/summaryCard';

// exemplo de tipagem pensando em backend
type TransactionType = 'income' | 'expense';

type Transaction = {
    id: string;
    title: string;
    amount: number;
    type: TransactionType;
    icon: keyof typeof Ionicons.glyphMap;
};


const transactions: Transaction[] = [
    {
        id: '1',
        title: 'Salário',
        amount: 3000,
        type: 'income',
        icon: 'briefcase-outline',
    },
    {
        id: '2',
        title: 'Almoço',
        amount: 25,
        type: 'expense',
        icon: 'restaurant-outline',
    },
    {
        id: '3',
        title: 'Supermercado',
        amount: 150,
        type: 'expense',
        icon: 'cart-outline',
    },
    {
        id: '4',
        title: 'Freelance',
        amount: 800,
        type: 'income',
        icon: 'laptop-outline',
    },
    {
        id: '5',
        title: 'Presente',
        amount: 50,
        type: 'expense',
        icon: 'gift-outline',
    }
];

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
};

// Componente principal da tela de boas-vindas
export default function Welcome() {
    return (

        <ScrollView
            
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <Header />
            {/* Conteúdo principal */}
            <View style={styles.content}>
                {/* Card de resumo financeiro */}
                <SummaryCard />
                {/* Seção de transações recentes */}
                <View style={styles.textRow}>
                    <Text style={styles.title}>Transações Recentes</Text>
                    {/* Placeholder para um botão de "Ver Todas" ou similar */}
                    <Text style={styles.subtitle}>Mostrar Tudo </Text>
                </View>
                {/* Lista de transações recentes */}

                <View style={styles.card}>
                    {transactions.map((transaction) => {
                        const config = transactionTypeConfig[transaction.type];

                        return (
                            <Pressable
                                key={transaction.id}
                                onPress={() => {
                                    console.log('Transação clicada:', transaction);
                                    // Futuramente:
                                    // router.push(`/transaction/${transaction.id}`);
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
                                            name={transaction.icon}
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
                    })}
                </View>
            </View>
            
        </ScrollView >
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
        flexShrink: 0, // não deixa quebrar linha
        lineHeight: 18, // maior que o fontSize
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white,
        textAlign: 'right',
    },
});

