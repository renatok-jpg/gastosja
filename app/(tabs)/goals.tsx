import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Pressable, Alert, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { onGoalsChange, updateGoal, deleteGoal } from '../../services/goalService';
import { Goal } from '../../types/database';
import { useRouter } from 'expo-router';

export default function MetasScreen() {
  const router = useRouter();
  
  // Estados da lista de metas
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Modal para Adicionar Valor
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Escuta as mudanças no banco de dados em tempo real
  useEffect(() => {
    const unsubscribe = onGoalsChange((data) => {
      setGoals(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Cálculos do progresso geral
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const percentage = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  const getIcon = (iconName?: string) => (iconName as any) || 'life-buoy';

  // Formata a data vinda do Firebase (String ou Timestamp)
  const formatDeadline = (deadline: any) => {
    if (!deadline) return '';
    try {
      const date = deadline.toDate ? deadline.toDate() : new Date(deadline);
      return `Meta para ${date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}`;
    } catch (e) {
      return '';
    }
  };

  // Abre o modal de inserção de valor (com trava caso já esteja concluída)
  const openAddModal = (goal: Goal) => {
    if (goal.currentAmount >= goal.targetAmount) {
      Alert.alert('Meta Concluída!', 'Esta meta já atingiu o valor máximo. Não é possível adicionar mais dinheiro.');
      return;
    }
    setSelectedGoal(goal);
    setInputValue('');
    setModalVisible(true);
  };

  // Soma a nova quantia ao valor atual da meta (com validação de teto máximo)
  const handleConfirmAddValue = async () => {
    if (!selectedGoal || !inputValue) return;
    
    // Converte vírgula em ponto para aceitar decimais
    const num = parseFloat(inputValue.replace(',', '.'));
    if (isNaN(num) || num <= 0) {
      Alert.alert('Aviso', 'Por favor, introduz um valor válido maior que zero.');
      return;
    }

    const newAmount = selectedGoal.currentAmount + num;
    
    // REGRA DE SEGURANÇA: impede ultrapassar o valor máximo estabelecido
    if (newAmount > selectedGoal.targetAmount) {
      const limiteDisponivel = selectedGoal.targetAmount - selectedGoal.currentAmount;
      Alert.alert(
        'Valor ultrapassa o limite', 
        `Faltam apenas R$ ${limiteDisponivel.toFixed(2).replace('.', ',')} para atingir o objetivo. Insira um valor menor ou igual.`
      );
      return;
    }
    
    try {
      await updateGoal(selectedGoal.id, { currentAmount: newAmount });
      setModalVisible(false);
      Alert.alert('Sucesso!', `Adicionado R$ ${num.toFixed(2).replace('.', ',')} à meta.`);
    } catch (err: any) {
      Alert.alert('Erro ao atualizar', err.message);
    }
  };

  // Botão de deletar funcionando e integrado
  const handleDelete = (goal: Goal) => {
    Alert.alert('Eliminar meta', `Tens a certeza que desejas excluir a meta "${goal.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteGoal(goal.id);
          } catch (err: any) {
            Alert.alert('Erro ao eliminar', err.message || 'Ocorreu um erro.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Feather name="loader" size={32} color={Colors.primary} />
          <Text style={{ color: Colors.textSecondary, marginTop: 12 }}>A carregar metas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Metas</Text>
            <Text style={styles.headerSubtitle}>{goals.length} meta{goals.length !== 1 ? 's' : ''} ativa{goals.length !== 1 ? 's' : ''}</Text>
          </View>
          <TouchableOpacity style={styles.fabButton} onPress={() => router.push('/add-goal')}>
            <Feather name="plus" size={24} color={Colors.background} />
          </TouchableOpacity>
        </View>

        {/* Card: Progresso Geral */}
        <LinearGradient
          colors={[Colors.gradientPrimaryStart, Colors.gradientPrimaryEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainCard}
        >
          <View style={styles.mainCardHeader}>
            <View style={styles.iconCircle}>
              <Feather name="target" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.mainCardSubtitle}>Progresso geral</Text>
          </View>
          <Text style={styles.mainCardAmount}>
            R$ {totalCurrent.toFixed(2).replace('.', ',')}
          </Text>
          <Text style={styles.mainCardDescription}>
            de R$ {totalTarget.toFixed(2).replace('.', ',')} em {goals.length} meta{goals.length !== 1 ? 's' : ''}
          </Text>
          
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${Math.min(percentage, 100)}%` }]} />
          </View>
          <View style={styles.progressFooter}>
            <Text style={styles.mainCardPercentage}>{percentage.toFixed(1)}% concluído</Text>
            {percentage >= 100 && <Text style={styles.completedBadge}>🎉 Meta batida!</Text>}
          </View>
        </LinearGradient>

        {/* Lista de Metas */}
        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Feather name="flag" size={40} color={Colors.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>Nenhuma meta ainda</Text>
            <Text style={styles.emptySubtitle}>Crie a sua primeira meta financeira e acompanhe o seu progresso</Text>
            <Pressable style={styles.emptyButton} onPress={() => router.push('/add-goal')}>
              <Text style={styles.emptyButtonText}>Criar primeira meta</Text>
            </Pressable>
          </View>
        ) : (
          goals.map((goal) => {
            const goalPercentage = goal.targetAmount > 0 
              ? (goal.currentAmount / goal.targetAmount) * 100 
              : 0;
            const isCompleted = goal.currentAmount >= goal.targetAmount;
            
            return (
              <View key={goal.id} style={[styles.goalCard, isCompleted && styles.goalCardCompleted]}>
                <View style={styles.goalCardHeader}>
                  <View style={[styles.iconWrapper, isCompleted && { backgroundColor: 'rgba(74, 222, 128, 0.15)' }]}>
                    <Feather name={getIcon(goal.icon)} size={20} color={isCompleted ? Colors.primary : Colors.expense} />
                  </View>
                  <View style={styles.goalCardTextContainer}>
                    <Text style={styles.goalCardTitle}>{goal.title}</Text>
                    <Text style={styles.goalCardDate}>
                      {formatDeadline(goal.deadline)}
                    </Text>
                  </View>
                  <View style={[styles.badgeContainer, isCompleted && { backgroundColor: 'rgba(74, 222, 128, 0.2)' }]}>
                    <Text style={[styles.badgeText, isCompleted && { color: Colors.primary }]}>
                      {isCompleted ? '✓' : `${goalPercentage.toFixed(0)}%`}
                    </Text>
                  </View>
                </View>

                <View style={styles.goalProgressBarBackground}>
                  <View style={[
                    styles.goalProgressBarFill, 
                    { width: `${Math.min(goalPercentage, 100)}%` },
                    isCompleted && { backgroundColor: Colors.primary }
                  ]} />
                </View>

                <View style={styles.goalCardFooter}>
                  <Text style={styles.goalAmountLeft}>
                    R$ {goal.currentAmount.toFixed(2).replace('.', ',')}
                  </Text>
                  <Text style={styles.goalAmountRight}>
                    R$ {goal.targetAmount.toFixed(2).replace('.', ',')}
                  </Text>
                </View>

                {/* Botões de Ação */}
                <View style={styles.actionRow}>
                  {/* Se completou, desativa visualmente o botão Adicionar */}
                  <TouchableOpacity 
                    style={[styles.actionButton, isCompleted && styles.actionButtonDisabled]} 
                    onPress={() => openAddModal(goal)}
                  >
                    <Feather name="plus-circle" size={18} color={isCompleted ? Colors.textSecondary : Colors.primary} />
                    <Text style={[styles.actionText, isCompleted && { color: Colors.textSecondary }]}>
                      {isCompleted ? 'Máximo' : 'Adicionar'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[styles.actionButton, styles.actionButtonDanger]} onPress={() => handleDelete(goal)}>
                    <Feather name="trash-2" size={18} color={Colors.expense} />
                    <Text style={[styles.actionText, { color: Colors.expense }]}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* MODAL PARA ADICIONAR VALOR */}
      <Modal 
        transparent 
        visible={modalVisible} 
        animationType="fade" 
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar valor</Text>
            <Text style={styles.modalSubtitle}>
              Quanto queres somar à meta "{selectedGoal?.title}"? (Faltam R$ {((selectedGoal?.targetAmount || 0) - (selectedGoal?.currentAmount || 0)).toFixed(2).replace('.', ',')})
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Ex: 50,00"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="numeric"
              value={inputValue}
              onChangeText={setInputValue}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleConfirmAddValue}>
                <Text style={styles.modalButtonConfirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 150 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginTop: 20, marginBottom: 24 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: Colors.textPrimary },
  headerSubtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  fabButton: { 
    width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8,
  },

  mainCard: { marginHorizontal: 24, borderRadius: 28, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: Colors.border },
  mainCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(74, 222, 128, 0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  mainCardSubtitle: { color: Colors.textSecondary, fontSize: 14, fontWeight: '500' },
  mainCardAmount: { fontSize: 36, fontWeight: 'bold', color: Colors.white, marginBottom: 4 },
  mainCardDescription: { color: Colors.textSecondary, fontSize: 14, marginBottom: 24 },
  progressBarBackground: { height: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 5, marginBottom: 12 },
  progressBarFill: { height: 10, backgroundColor: Colors.primary, borderRadius: 5 },
  progressFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mainCardPercentage: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600' },
  completedBadge: { color: Colors.primary, fontSize: 13, fontWeight: 'bold' },

  emptyState: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: Colors.border },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.white, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  emptyButton: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  emptyButtonText: { color: Colors.background, fontWeight: 'bold', fontSize: 16 },

  goalCard: { backgroundColor: Colors.card, marginHorizontal: 24, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: Colors.border, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  goalCardCompleted: { borderColor: Colors.primary, borderWidth: 1.5 },
  goalCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconWrapper: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.iconBg, justifyContent: 'center', alignItems: 'center' },
  goalCardTextContainer: { flex: 1, marginLeft: 12 },
  goalCardTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  goalCardDate: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  badgeContainer: { backgroundColor: Colors.surfaceElevated, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  badgeText: { color: Colors.textPrimary, fontWeight: '700', fontSize: 12 },
  goalProgressBarBackground: { height: 8, backgroundColor: Colors.surfaceElevated, borderRadius: 4, marginBottom: 12 },
  goalProgressBarFill: { height: 8, backgroundColor: Colors.primary, borderRadius: 4 },
  goalCardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  goalAmountLeft: { color: Colors.textSecondary, fontSize: 14, fontWeight: '500' },
  goalAmountRight: { color: Colors.textPrimary, fontSize: 14, fontWeight: 'bold' },

  actionRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12, gap: 12 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(74, 222, 128, 0.08)', paddingVertical: 10, borderRadius: 14, gap: 6 },
  actionButtonDanger: { backgroundColor: 'rgba(248, 113, 113, 0.08)' },
  actionButtonDisabled: { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
  actionText: { color: Colors.primary, fontSize: 13, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: Colors.card, width: '100%', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: Colors.border },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.white, marginBottom: 8 },
  modalSubtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 20 },
  modalInput: { backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, color: Colors.white, padding: 16, fontSize: 16, marginBottom: 24 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  modalButtonCancel: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  modalButtonCancelText: { color: Colors.textSecondary, fontSize: 16, fontWeight: '600' },
  modalButtonConfirm: { backgroundColor: Colors.primary, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  modalButtonConfirmText: { color: Colors.background, fontSize: 16, fontWeight: 'bold' },
});