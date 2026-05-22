import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';

export default function MetasScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Metas</Text>
        </View>

        {/* Card: Progresso Geral */}
        <LinearGradient
          colors={[Colors.gradientPrimaryStart, Colors.gradientPrimaryEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainCard}
        >
          <View style={styles.mainCardHeader}>
            {/* feather é uma biblioteca. Aqui é um ícone de alvo,por isso target.Algo assim, sla */}
            <Feather name="target" size={16} color={Colors.textSecondary} />
            <Text style={styles.mainCardSubtitle}>Progresso geral</Text>
          </View>
          <Text style={styles.mainCardAmount}>R$ 350,00</Text>
          <Text style={styles.mainCardDescription}>de R$ 5.000,00 em 1 metas</Text>
          
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '7%' }]} />
          </View>
          <Text style={styles.mainCardPercentage}>7.0% concluído</Text>
        </LinearGradient>



        {/* Card: Meta Específica */}
        <View style={styles.goalCard}>
          <View style={styles.goalCardHeader}>
            <View style={styles.iconWrapper}>
              <Feather name="life-buoy" size={20} color={Colors.expense} />
            </View>
            <View style={styles.goalCardTextContainer}>
              <Text style={styles.goalCardTitle}>Reserva de Emergência</Text>
              <Text style={styles.goalCardDate}>Meta dez. de 2026</Text>
            </View>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>7%</Text>
            </View>
          </View>

          <View style={styles.goalProgressBarBackground}>
            <View style={[styles.goalProgressBarFill, { width: '7%' }]} />
          </View>

          <View style={styles.goalCardFooter}>
            <Text style={styles.goalAmountLeft}>R$ 350,00</Text>
            <Text style={styles.goalAmountRight}>R$ 5.000,00</Text>
          </View>
        </View>

      </ScrollView>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mainCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainCardSubtitle: {
    color: Colors.textSecondary,
    marginLeft: 8,
    fontSize: 14,
  },
  mainCardAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  mainCardDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 24,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Colors.input,
    borderRadius: 4,
    marginBottom: 12,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  mainCardPercentage: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  goalCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  goalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.iconBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalCardTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  goalCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  goalCardDate: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badgeContainer: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 12,
  },
  goalProgressBarBackground: {
    height: 8,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 4,
    marginBottom: 12,
  },
  goalProgressBarFill: {
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  goalCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalAmountLeft: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  goalAmountRight: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 110,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primaryGlow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    height: 72,
    backgroundColor: Colors.card,
    borderRadius: 36,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 10,
    color: Colors.icon,
    marginTop: 4,
    fontWeight: '500',
  },
  navTextActive: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
  },
  navActiveIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});