import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../constants/theme';
import { getTransactions, deleteTransaction } from '../services/transactionService';
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

// Formata valor para "+ R$ 3.500,00" ou "- R$ 184,50"
function formatAmount(amount: number, type: Transaction['type']): string {
  const prefix = type === 'income' ? '+ ' : '- ';
  const formatted = amount.toFixed(2).replace('.', ',');
  return `${prefix}R$ ${formatted}`;
}

// Formata data para "quinta-feira, 21 de maio de 2026"
function formatFullDate(date: Date): string {
  const dias = [
    'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira',
    'quinta-feira', 'sexta-feira', 'sábado'
  ];
  const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  const diaSemana = dias[date.getDay()];
  const dia = date.getDate();
  const mes = meses[date.getMonth()];
  const ano = date.getFullYear();
  return `${diaSemana}, ${dia} de ${mes} de ${ano}`;
}

export default function TransactionDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransaction();
  }, [id]);

  const loadTransaction = async () => {
    try {
      const transactions = await getTransactions();
      const found = transactions.find((t) => t.id === id);
      if (found) {
        setTransaction(found);
      } else {
        Alert.alert('Erro', 'Transação não encontrada');
        router.back();
      }
    } catch (error) {
      console.error('Erro ao carregar transação:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Transação',
      'Tem certeza que deseja excluir esta transação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              if (transaction?.id) {
                await deleteTransaction(transaction.id);
                router.back();
              }
            } catch (error) {
              console.error('Erro ao excluir:', error);
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
  
    router.push('/(tabs)/home');
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (!transaction) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyText}>Transação não encontrada</Text>
      </SafeAreaView>
    );
  }

  const icon = getCategoryIcon(transaction.category);
  const isIncome = transaction.type === 'income';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Card Principal */}
      <View
        style={[
          styles.mainCard,
          {
            backgroundColor: isIncome
              ? 'rgba(0, 115, 255, 0.12)'
              : 'rgba(248, 113, 113, 0.12)',
            borderColor: isIncome
              ? 'rgba(0, 115, 255, 0.25)'
              : 'rgba(248, 113, 113, 0.25)',
          },
        ]}
      >
        {/* Ícone */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isIncome
                ? 'rgba(0, 115, 255, 0.2)'
                : 'rgba(248, 113, 113, 0.2)',
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={28}
            color={isIncome ? Colors.income : Colors.expense}
          />
        </View>

        {/* Tipo */}
        <Text style={styles.typeLabel}>
          {isIncome ? 'RECEITA' : 'DESPESA'}
        </Text>

        {/* Valor */}
        <Text
          style={[
            styles.amountText,
            { color: Colors.white },
          ]}
        >
          {formatAmount(transaction.amount, transaction.type)}
        </Text>

        {/* Título */}
        <Text style={styles.titleText}>{transaction.title}</Text>
      </View>

      {/* Card de Detalhes */}
      <View style={styles.detailsCard}>
        {/* Categoria */}
        <View style={styles.detailRow}>
          <View
            style={[
              styles.detailIconContainer,
              {
                backgroundColor: isIncome
                  ? 'rgba(0, 115, 255, 0.15)'
                  : 'rgba(248, 113, 113, 0.15)',
              },
            ]}
          >
            <Ionicons
              name="pricetag-outline"
              size={18}
              color={isIncome ? Colors.income : Colors.expense}
            />
          </View>
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Categoria</Text>
            <Text style={styles.detailValue}>{transaction.category}</Text>
          </View>
        </View>

        {/* Separador */}
        <View style={styles.separator} />

        {/* Data */}
        <View style={styles.detailRow}>
          <View style={[styles.detailIconContainer, { backgroundColor: Colors.iconBg }]}>
            <Ionicons name="calendar-outline" size={18} color={Colors.textSecondary} />
          </View>
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Data</Text>
            <Text style={styles.detailValue}>
              {formatFullDate(transaction.date)}
            </Text>
          </View>
        </View>

        {/* Separador */}
        <View style={styles.separator} />

        {/* Notas */}
        <View style={styles.detailRow}>
          <View style={[styles.detailIconContainer, { backgroundColor: Colors.iconBg }]}>
            <Ionicons name="document-text-outline" size={18} color={Colors.textSecondary} />
          </View>
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Notas</Text>
            <Text style={styles.detailValue}>
              {transaction.notes || 'Sem notas'}
            </Text>
          </View>
        </View>
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionsContainer}>
        <Pressable
          onPress={handleEdit}
          style={({ pressed }) => [
            styles.editButton,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Ionicons name="pencil" size={18} color={Colors.textPrimary} />
          <Text style={styles.editButtonText}>Editar</Text>
        </Pressable>

        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.destructive} />
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  headerPlaceholder: {
    width: 40,
  },
  mainCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  amountText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  detailsCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 56,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 12,
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: 24,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    borderRadius: 24,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.25)',
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.destructive,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});