import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme'; 

// --- DADOS MOCKADOS ---
const metrics = {
    highestExpense: { amount: 184.50, category: 'Mercado' },
    dailyAverage: 9.18,
    monthlyIncome: { amount: 3500, changePercentage: 12 },
    savingsRate: 92,
};

const categoryExpenses = [
    { id: '1', name: 'Alimentação', amount: 196.50, color: '#F97316' },
    { id: '2', name: 'Assinaturas', amount: 55.90, color: '#14B8A6' },
    { id: '3', name: 'Transporte', amount: 22.90, color: '#3B82F6' },
];

const barChartData = [
    { mes: 'Jul', receita: 65, despesa: 40 },
    { mes: 'Ago', receita: 60, despesa: 45 },
    { mes: 'Set', receita: 65, despesa: 45 },
    { mes: 'Out', receita: 70, despesa: 50 },
    { mes: 'Nov', receita: 65, despesa: 45 },
    { mes: 'Dez', receita: 100, despesa: 55 },
];

const lineChartMonths = ['Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function AnalysisScreen() {
    return (
        <View style={styles.mainContainer}>
            <ScrollView 
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.headerTitle}>Análise</Text>

                {/* --- GRADE DE METRICAS (4 Cards do topo) --- */}
                <View style={styles.gridContainer}>
                    <View style={[styles.miniCard, { backgroundColor: '#FF6B6B' }]}>
                        <View style={styles.miniCardHeader}>
                            <Ionicons name="trending-down-outline" size={20} color="#FFF" />
                        </View>
                        <Text style={[styles.miniCardLabel, { color: '#FFE3E3' }]}>Maior despesa</Text>
                        <Text style={styles.miniCardValue}>
                            R$ {metrics.highestExpense.amount.toFixed(2).replace('.', ',')}
                        </Text>
                        <Text style={[styles.miniCardSub, { color: '#FFE3E3' }]}>{metrics.highestExpense.category}</Text>
                    </View>

                    <View style={[styles.miniCard, { backgroundColor: Colors.card }]}>
                        <View style={styles.iconContainerBg}>
                            <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} />
                        </View>
                        <Text style={styles.miniCardLabel}>Média diária</Text>
                        <Text style={styles.miniCardValue}>
                            R$ {metrics.dailyAverage.toFixed(2).replace('.', ',')}
                        </Text>
                        <Text style={styles.miniCardSub}>Últimos 30 dias</Text>
                    </View>

                    <View style={[styles.miniCard, { backgroundColor: '#74A2FF' }]}>
                        <View style={styles.miniCardHeader}>
                            <Ionicons name="trending-up-outline" size={20} color="#FFF" />
                        </View>
                        <Text style={[styles.miniCardLabel, { color: '#E0EBFF' }]}>Receitas mês</Text>
                        <Text style={styles.miniCardValue}>
                            R$ {(metrics.monthlyIncome.amount / 1000).toFixed(1)}k
                        </Text>
                        <Text style={[styles.miniCardSub, { color: '#E0EBFF' }]}>
                            +{metrics.monthlyIncome.changePercentage}% vs anterior
                        </Text>
                    </View>

                    <View style={[styles.miniCard, { backgroundColor: Colors.card }]}>
                        <View style={styles.iconContainerBg}>
                            <Ionicons name="wallet-outline" size={20} color={Colors.textSecondary} />
                        </View>
                        <Text style={styles.miniCardLabel}>Taxa de poupança</Text>
                        <Text style={styles.miniCardValue}>{metrics.savingsRate}%</Text>
                        <Text style={[styles.miniCardSub, { color: '#4CD964', fontWeight: '600' }]}>Excelente!</Text>
                    </View>
                </View>

                {/* --- SEÇÃO: DESPESAS POR CATEGORIA --- */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Despesas por categoria</Text>
                    
                    <View style={styles.chartPlaceholderContainer}>
                        <View style={styles.mockDonutChart}>
                            <View style={styles.mockDonutInner} />
                        </View>
                    </View>

                    <View style={styles.legendGrid}>
                        {categoryExpenses.map((category) => (
                            <View key={category.id} style={styles.legendRow}>
                                <View style={styles.legendLeft}>
                                    <View style={[styles.colorDot, { backgroundColor: category.color }]} />
                                    <Text style={styles.legendText}>{category.name}</Text>
                                </View>
                                <Text style={styles.legendAmount}>
                                    R$ {category.amount.toFixed(2).replace('.', ',')}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* --- SEÇÃO: RECEITAS VS DESPESAS (BARRAS) --- */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Receitas vs Despesas</Text>
                    <Text style={styles.cardSubtitle}>Últimos 6 meses</Text>

                    <View style={styles.chartContainer}>
                        <View style={styles.gridLine} />
                        <View style={[styles.gridLine, { bottom: '50%' }]} />
                        <View style={[styles.gridLine, { bottom: '100%' }]} />

                        <View style={styles.barsWrapper}>
                            {barChartData.map((item, index) => (
                                <View key={index} style={styles.barGroup}>
                                    <View style={styles.barPillars}>
                                        <View style={[styles.bar, styles.barReceita, { height: `${item.receita}%` }]} />
                                        <View style={[styles.bar, styles.barDespesa, { height: `${item.despesa}%` }]} />
                                    </View>
                                    <Text style={styles.axisText}>{item.mes}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* --- SEÇÃO: EVOLUÇÃO DO SALDO (LINHA) --- */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Evolução do saldo</Text>
                    <Text style={styles.cardSubtitle}>Crescimento contínuo</Text>

                    <View style={styles.chartContainer}>
                        <View style={styles.gridLine} />
                        <View style={[styles.gridLine, { bottom: '50%' }]} />
                        <View style={[styles.gridLine, { bottom: '100%' }]} />

                        <View style={styles.mockLineContainer}>
                            <View style={styles.mockLine} />
                            {[10, 30, 50, 70, 95].map((pos, i) => (
                                <View key={i} style={[styles.mockDot, { left: `${pos}%`, bottom: `${pos}%` }]} />
                            ))}
                        </View>

                        <View style={styles.lineAxisWrapper}>
                            {lineChartMonths.map((mes, index) => (
                                <Text key={index} style={styles.axisText}>{mes}</Text>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Espaçamento extra no final para o FAB não cobrir nada */}
                <View style={{ height: 80 }} />
            </ScrollView>

            {/* BOTÃO FLUTUANTE (FAB) */}
            <Pressable 
                style={({ pressed }) => [styles.fab, pressed && { opacity: 0.8 }]}
                onPress={() => console.log('Adicionar transação')}
            >
                <Ionicons name="add" size={32} color="#0F172A" />
            </Pressable>
        </View>
    );
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2; 

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 12,
        paddingTop: 20,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.white,
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    
    // Grid de Mini Cards
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',

    },
    miniCard: {
        width: CARD_WIDTH,
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        height: 140,
        justifyContent: 'space-between',
        
    },
    iconContainerBg: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    miniCardHeader: { flexDirection: 'row', justifyContent: 'flex-start' },
    miniCardLabel: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
    miniCardValue: { fontSize: 22, fontWeight: '700', color: Colors.white, marginVertical: 2 },
    miniCardSub: { fontSize: 12, color: Colors.textSecondary },

    // Card Padrão (Usado nas seções maiores)
    card: {
        backgroundColor: Colors.card,
        borderRadius: 24,
        padding: 20,
        marginTop: 12,
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.border || 'transparent',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.white,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 24,
    },

    // Gráfico de Rosca
    chartPlaceholderContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
    mockDonutChart: { width: 140, height: 140, borderRadius: 70, borderWidth: 24, borderColor: '#F97316', justifyContent: 'center', alignItems: 'center' },
    mockDonutInner: { width: 92, height: 92, borderRadius: 46, backgroundColor: Colors.card },
    legendGrid: { marginTop: 10 },
    legendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    legendLeft: { flexDirection: 'row', alignItems: 'center' },
    colorDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
    legendText: { fontSize: 14, color: Colors.textSecondary },
    legendAmount: { fontSize: 14, fontWeight: '600', color: Colors.white },

    // Estilos Gráficos (Barras e Linhas)
    chartContainer: { height: 180, position: 'relative', justifyContent: 'flex-end' },
    gridLine: { position: 'absolute', width: '100%', height: 1, backgroundColor: '#2A3441', bottom: 0 },
    barsWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: '100%', paddingBottom: 24 },
    barGroup: { alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
    barPillars: { flexDirection: 'row', alignItems: 'flex-end', height: '100%' },
    bar: { width: 12, borderTopLeftRadius: 6, borderTopRightRadius: 6, marginHorizontal: 2 },
    barReceita: { backgroundColor: '#3B82F6' },
    barDespesa: { backgroundColor: '#EF4444' },
    axisText: { fontSize: 12, color: Colors.textSecondary, marginTop: 10, position: 'absolute', bottom: 0 },
    
    // Gráfico de Linha Mock
    lineAxisWrapper: { flexDirection: 'row', justifyContent: 'space-around', paddingLeft: 20 },
    mockLineContainer: { ...StyleSheet.absoluteFillObject, bottom: 30, justifyContent: 'center' },
    mockLine: { width: '110%', height: 2, backgroundColor: '#10B981', transform: [{ rotate: '-20deg' }], position: 'absolute', left: -10, bottom: '50%' },
    mockDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', position: 'absolute' },

    // Botão FAB
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#34D399', 
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});