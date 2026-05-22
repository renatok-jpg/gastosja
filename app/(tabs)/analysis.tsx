import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useRouter } from 'expo-router';
import DonutChart from '../../components/ui/donutChart'
import {
  onTransactionsChange,
  calculateMetrics,
  getCategoryExpenses,
  getMonthlyChartData
} from '../../services/analysisService';

export default function AnalysisScreen() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onTransactionsChange((data) => {
      setTransactions(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const metrics = calculateMetrics(transactions);
  const categoryExpenses = getCategoryExpenses(transactions);
  const barChartData = getMonthlyChartData(transactions);

  const totalExpenses = categoryExpenses.reduce((s, c) => s + c.amount, 0);
  const topCategory = categoryExpenses[0];

  // Dados pro donut
  const donutData = categoryExpenses.map(c => ({
    color: c.color,
    percentage: c.percentage,
  }));

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="analytics-outline" size={40} color={Colors.primary} />
          <Text style={{ color: Colors.textSecondary, marginTop: 12 }}>Carregando análise...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Análise</Text>

        {/* --- GRADE DE METRICAS --- */}
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
              R$ {metrics.monthlyIncome.amount.toFixed(2).replace('.', ',')}
            </Text>
            <Text style={[styles.miniCardSub, { color: '#E0EBFF' }]}>
              {metrics.monthlyIncome.amount > 0 ? 'Este mês' : 'Sem receitas'}
            </Text>
          </View>

          <View style={[styles.miniCard, { backgroundColor: Colors.card }]}>
            <View style={styles.iconContainerBg}>
              <Ionicons name="wallet-outline" size={20} color={Colors.textSecondary} />
            </View>
            <Text style={styles.miniCardLabel}>Taxa de poupança</Text>
            <Text style={styles.miniCardValue}>{metrics.savingsRate}%</Text>
            <Text style={[styles.miniCardSub, {
              color: metrics.savingsRate > 50 ? '#4CD964' : metrics.savingsRate > 20 ? '#FACC15' : '#EF4444',
              fontWeight: '600'
            }]}>
              {metrics.savingsRate > 50 ? 'Excelente!' : metrics.savingsRate > 20 ? 'Bom' : 'Atenção!'}
            </Text>
          </View>
        </View>

        {/* --- DESPESAS POR CATEGORIA --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Despesas por categoria</Text>
          <Text style={styles.cardSubtitle}>
            Total: R$ {totalExpenses.toFixed(2).replace('.', ',')} este mês
          </Text>

          <View style={styles.chartPlaceholderContainer}>
            <DonutChart
              data={categoryExpenses.map(c => ({
                value: c.amount,
                color: c.color,
              }))}
              size={150}
              centerText={topCategory ? `${topCategory.percentage}%` : '0%'}
              centerSubtext={topCategory ? topCategory.name : 'Nenhuma'}
            />
          </View>

          <View style={styles.legendGrid}>
            {categoryExpenses.map((category) => (
              <View key={category.id} style={styles.legendRow}>
                <View style={styles.legendLeft}>
                  <View style={[styles.colorDot, { backgroundColor: category.color }]} />
                  <Text style={styles.legendText}>{category.name}</Text>
                </View>
                <Text style={styles.legendAmount}>
                  R$ {category.amount.toFixed(2).replace('.', ',')} ({category.percentage}%)
                </Text>
              </View>
            ))}
            {categoryExpenses.length === 0 && (
              <Text style={{ color: Colors.textSecondary, textAlign: 'center', paddingVertical: 20 }}>
                Nenhuma despesa este mês
              </Text>
            )}
          </View>
        </View>

        {/* --- RECEITAS VS DESPESAS --- */}
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

          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={styles.legendLabel}>Receita</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.legendLabel}>Despesa</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.8 }]}
        onPress={() => router.push('/add')}
      >
        <Ionicons name="add" size={32} color="#0F172A" />
      </Pressable>
    </View>
  );
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  contentContainer: { paddingHorizontal: 12, paddingTop: 0, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: Colors.white, marginBottom: 20, paddingHorizontal: 4 , marginTop: 40},

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
  miniCard: { width: CARD_WIDTH, borderRadius: 20, padding: 16, marginBottom: 12, height: 140, justifyContent: 'space-between' },
  iconContainerBg: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  miniCardHeader: { flexDirection: 'row', justifyContent: 'flex-start' },
  miniCardLabel: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  miniCardValue: { fontSize: 22, fontWeight: '700', color: Colors.white, marginVertical: 2 },
  miniCardSub: { fontSize: 12, color: Colors.textSecondary },

  card: { backgroundColor: Colors.card, borderRadius: 24, padding: 20, marginTop: 12, width: '100%', borderWidth: 1, borderColor: Colors.border },
  cardTitle: { fontSize: 18, fontWeight: '600', color: Colors.white, marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 20 },

  chartPlaceholderContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  legendGrid: { marginTop: 10 },
  legendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  legendLeft: { flexDirection: 'row', alignItems: 'center' },
  colorDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  legendText: { fontSize: 14, color: Colors.textSecondary },
  legendAmount: { fontSize: 14, fontWeight: '600', color: Colors.white },

  chartContainer: { height: 180, position: 'relative', justifyContent: 'flex-end' },
  gridLine: { position: 'absolute', width: '100%', height: 1, backgroundColor: '#2A3441', bottom: 0 },
  barsWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: '100%', paddingBottom: 24 },
  barGroup: { alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barPillars: { flexDirection: 'row', alignItems: 'flex-end', height: '100%' },
  bar: { width: 12, borderTopLeftRadius: 6, borderTopRightRadius: 6, marginHorizontal: 2 },
  barReceita: { backgroundColor: '#3B82F6' },
  barDespesa: { backgroundColor: '#EF4444' },
  axisText: { fontSize: 12, color: Colors.textSecondary, marginTop: 10, position: 'absolute', bottom: 0 },

  chartLegend: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { color: Colors.textSecondary, fontSize: 12 },

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