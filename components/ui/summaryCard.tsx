//agora vou criar um componente de resumo financeiro, que vai mostrar o total de receitas, despesas e saldo do mês, para isso vou criar um novo arquivo chamado summaryCard.tsx na pasta components/ui
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/theme';
import Ionicons from '@expo/vector-icons/build/Ionicons';

export function SummaryCard() {
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
                    <View style={styles.eyeButton}> {/* Placeholder para o ícone de mostrar/ocultar saldo */}
                       <Ionicons name="eye-outline" size={16} color={Colors.icon} />
                    </View>
                </View>
                <Text style={styles.balance}>R$ 2.500,00</Text>
                <View style={styles.incomeAndExpenseContainer}>
                    <View style={styles.baseCard}>
                        <Text style={styles.subtitle}>Receitas</Text>
                        <Text style={styles.title}>R$ 3.000,00</Text>
                    </View>
                    <View style={styles.baseCard}>
                        <Text style={styles.subtitle}>Despesas</Text>
                        <Text style={styles.title}>R$ 500,00</Text>
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
        marginBottom: 20

    },
    baseCard: {
        width: '48%',
        borderRadius: 24,
        padding: 16,
        // caixa transparente
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        // borda sutil para destacar sobre o gradiente
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        // manter sombra leve se desejar profundidade
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 1,

    },
    eyeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.iconBg,
        justifyContent: 'center',
        alignItems: 'center',
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