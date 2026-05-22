import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { Colors } from '../constants/theme';
import { addGoal } from '../services/goalService';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AddGoal() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title || !targetAmount) {
      alert('Preencha título e valor da meta');
      return;
    }

    const target = parseFloat(targetAmount.replace(',', '.'));
    const current = parseFloat(currentAmount.replace(',', '.')) || 0;

    if (isNaN(target) || target <= 0) {
      alert('Valor da meta inválido');
      return;
    }

    setLoading(true);
    try {
      await addGoal({
        title,
        targetAmount: target,
        currentAmount: current,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        icon: 'life-buoy',
      });
      alert('Meta criada com sucesso!');
      router.back();
    } catch (err: any) {
      alert('Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Nova Meta</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Título */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>TÍTULO</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Reserva de Emergência"
          placeholderTextColor={Colors.textSecondary}
        />
      </View>

      {/* Valor da Meta */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>VALOR DA META</Text>
        <View style={styles.amountRow}>
          <Text style={styles.currency}>R$</Text>
          <TextInput
            style={styles.amountInput}
            value={targetAmount}
            onChangeText={setTargetAmount}
            keyboardType="numeric"
            placeholder="5.000,00"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>
      </View>

      {/* Valor Atual */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>VALOR ATUAL (opcional)</Text>
        <View style={styles.amountRow}>
          <Text style={styles.currency}>R$</Text>
          <TextInput
            style={styles.amountInput}
            value={currentAmount}
            onChangeText={setCurrentAmount}
            keyboardType="numeric"
            placeholder="0,00"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>
      </View>

      {/* Info */}
      <View style={styles.infoCard}>
        <Ionicons name="bulb-outline" size={20} color={Colors.primary} style={{ marginRight: 10 }} />
        <Text style={styles.infoText}>
           Você pode adicionar valores à meta a qualquer momento pela tela de Metas.
        </Text>
      </View>

      {/* Botão Salvar */}
      <Pressable
        style={[styles.saveButton, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Ionicons name="checkmark" size={22} color={Colors.background} style={{ marginRight: 8 }} />
        <Text style={styles.saveButtonText}>
          {loading ? 'Criando meta...' : 'Criar Meta'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 30 
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
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.white },

  inputGroup: { width: '100%', marginBottom: 20 },
  label: { 
    fontSize: 12, 
    color: Colors.textSecondary, 
    fontWeight: '700', 
    letterSpacing: 1, 
    marginBottom: 10 
  },
  input: { 
    backgroundColor: Colors.card, 
    borderRadius: 18, 
    paddingHorizontal: 16, 
    paddingVertical: 16, 
    color: Colors.white, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: Colors.border 
  },
  amountRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: Colors.card, 
    borderRadius: 18, 
    paddingHorizontal: 16, 
    borderWidth: 1, 
    borderColor: Colors.border 
  },
  currency: { 
    fontSize: 20, 
    color: Colors.textSecondary, 
    fontWeight: '600', 
    marginRight: 10 
  },
  amountInput: { 
    flex: 1, 
    fontSize: 32, 
    color: Colors.white, 
    fontWeight: 'bold', 
    paddingVertical: 14 
  },

  infoCard: { 
    flexDirection: 'row', 
    backgroundColor: Colors.card, 
    borderRadius: 18, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: Colors.border,
    marginTop: 10,
    alignItems: 'flex-start',
  },
  infoText: { 
    color: Colors.textSecondary, 
    fontSize: 13, 
    flex: 1, 
    lineHeight: 18 
  },

  saveButton: { 
    backgroundColor: Colors.primary, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 24, 
    paddingVertical: 16, 
    marginTop: 30,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  saveButtonText: { 
    color: Colors.background, 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});