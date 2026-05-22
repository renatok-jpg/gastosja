import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/theme';
import Ionicons from '@expo/vector-icons/build/Ionicons';

type SummaryCardProps = {
    totalIncome: number;
    totalExpense: number;
    balance: number;
};

function formatCurrency(value: number): string {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

export function SummaryCard({ totalIncome, totalExpense, balance }: SummaryCardProps) {
    return (
        <LinearGradient
            colors={[
                Colors.gradientPrimaryStart,
                Colors.gradientPrimaryEnd,
                Colors.gradientPrimaryEnd,
                Colors.gradientPrimaryStart,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: -1.5 }}
            locations={[0, 0.4, 0.6, 1]}
            style={styles.card}
        >
            <View style={styles.cardContent}>
                <View style={styles.header}>
                    <Text style={styles.subtitle}>Saldo Total</Text>
                </View>
                <Text style={styles.balance}>{formatCurrency(balance)}</Text>
                <View style={styles.incomeAndExpenseContainer}>
                    <View style={styles.baseCard}>
                        <Text style={styles.subtitle}>Receitas</Text>
                        <Text style={styles.title}>{formatCurrency(totalIncome)}</Text>
                    </View>
                    <View style={styles.baseCard}>
                        <Text style={styles.subtitle}>Despesas</Text>
                        <Text style={styles.title}>{formatCurrency(totalExpense)}</Text>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        borderRadius: 28,
        padding: 24,
        marginBottom: 0,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    cardContent: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    balance: {
        color: Colors.white,
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    baseCard: {
        width: '48%',
        borderRadius: 24,
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 1,
    },
    incomeAndExpenseContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        color: Colors.textSecondary,
        fontSize: 20,
        fontWeight: '300',
    },
});