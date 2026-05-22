import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { Colors } from '../../constants/theme';
import { addTransaction } from '../../services/transactionService';

export default function NewTransaction() {
    const navigation = useNavigation();

    const [transactionType, setTransactionType] = useState<'expense' | 'income' | 'goal'>('expense');
    const [amount, setAmount] = useState('0,00');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Alimentação');
    const [date, setDate] = useState('22/05/2026');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    // Função para converter string de valor para número
    const parseAmount = (value: string): number => {
        // Remove tudo exceto dígitos e vírgula
        const cleaned = value.replace(/[^0-9,]/g, '');
        // Substitui vírgula por ponto para conversão
        const normalized = cleaned.replace(',', '.');
        const numberValue = parseFloat(normalized);
        return isNaN(numberValue) ? 0 : numberValue;
    };

    const handleSave = async () => {
        try {
            // Validações
            if (!title.trim()) {
                Alert.alert('Erro', 'Digite um título para a transação.');
                return;
            }

            const numericAmount = parseAmount(amount);
            if (numericAmount <= 0) {
                Alert.alert('Erro', 'Digite um valor maior que zero.');
                return;
            }

            // Ignora tipo 'goal' por enquanto
            if (transactionType === 'goal') {
                Alert.alert('Aviso', 'Tipo "Meta" ainda não está implementado. Selecione Despesa ou Receita.');
                return;
            }

            // Converte data string "DD/MM/AAAA" para Date
            const [day, month, year] = date.split('/');
            const dateObj = new Date(Number(year), Number(month) - 1, Number(day));

            setLoading(true);

            await addTransaction({
                title: title.trim(),
                amount: numericAmount,
                type: transactionType as 'income' | 'expense',
                category,
                date: dateObj,
                notes: notes.trim() || undefined,
            });

            Alert.alert('Sucesso', 'Transação salva com sucesso!');

            // Limpa formulário
            setTransactionType('expense');
            setAmount('0,00');
            setTitle('');
            setCategory('Alimentação');
            setDate('22/05/2026');
            setNotes('');

        } catch (error) {
            console.error('Erro ao salvar:', error);
            Alert.alert('Erro', 'Não foi possível salvar a transação. Verifique sua conexão.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            {/* HEADER DA TELA */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Nova transação</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* SELETOR DE TIPO (Despesa, Receita, Meta) */}
            <View style={styles.typeSelectorContainer}>
                <Pressable
                    style={[styles.typeButton, transactionType === 'expense' && { backgroundColor: Colors.expense }]}
                    onPress={() => setTransactionType('expense')}
                >
                    <Text style={[styles.typeButtonText, transactionType !== 'expense' && { color: Colors.textSecondary }]}>
                        Despesa
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.typeButton, transactionType === 'income' && { backgroundColor: Colors.income }]}
                    onPress={() => setTransactionType('income')}
                >
                    <Text style={[styles.typeButtonText, transactionType !== 'income' && { color: Colors.textSecondary }]}>
                        Receita
                    </Text>
                </Pressable>


            </View>

            {/* CAMPO DE VALOR */}
            <View style={styles.amountContainer}>
                <Text style={styles.labelCenter}>VALOR</Text>
                <View style={styles.amountRow}>
                    <Text style={styles.currencyText}>R$</Text>
                    <TextInput
                        style={styles.amountInput}
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                        placeholderTextColor={Colors.textSecondary}
                        editable={!loading}
                    />
                </View>
            </View>

            {/* CAMPO: TÍTULO */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>TÍTULO</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Mercado da semana"
                    placeholderTextColor={Colors.textSecondary}
                    value={title}
                    onChangeText={setTitle}
                    editable={!loading}
                />
            </View>

            {/* CAMPO: CATEGORIA (Scroll Horizontal) */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CATEGORIA</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>

                    <Pressable
                        style={[
                            styles.categoryBadge,
                            category !== 'Alimentação' && styles.categoryInactiveBadge,
                            category === 'Alimentação' && { backgroundColor: Colors.alimentation }
                        ]}
                        onPress={() => setCategory('Alimentação')}
                    >
                        <Ionicons name="restaurant-outline" size={16} color={Colors.white} />
                        <Text style={styles.categoryText}>Alimentação</Text>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.categoryBadge,
                            category !== 'Transporte' && styles.categoryInactiveBadge,
                            category === 'Transporte' && { backgroundColor: Colors.transport }
                        ]}
                        onPress={() => setCategory('Transporte')}
                    >
                        <Ionicons name="car-outline" size={16} color={Colors.white} />
                        <Text style={styles.categoryText}>Transporte</Text>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.categoryBadge,
                            category !== 'Saúde' && styles.categoryInactiveBadge,
                            category === 'Saúde' && { backgroundColor: Colors.health }
                        ]}
                        onPress={() => setCategory('Saúde')}
                    >
                        <Ionicons name="heart-outline" size={16} color={Colors.white} />
                        <Text style={styles.categoryText}>Saúde</Text>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.categoryBadge,
                            category !== 'Lazer' && styles.categoryInactiveBadge,
                            category === 'Lazer' && { backgroundColor: Colors.leisure }
                        ]}
                        onPress={() => setCategory('Lazer')}
                    >
                        <Ionicons name="game-controller-outline" size={16} color={Colors.white} />
                        <Text style={styles.categoryText}>Lazer</Text>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.categoryBadge,
                            category !== 'Trabalho' && styles.categoryInactiveBadge,
                            category === 'Trabalho' && { backgroundColor: Colors.work }
                        ]}
                        onPress={() => setCategory('Trabalho')}
                    >
                        <Ionicons name="briefcase-outline" size={16} color={Colors.white} />
                        <Text style={styles.categoryText}>Trabalho</Text>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.categoryBadge,
                            category !== 'Freelance' && styles.categoryInactiveBadge,
                            category === 'Freelance' && { backgroundColor: Colors.freelance }
                        ]}
                        onPress={() => setCategory('Freelance')}
                    >
                        <Ionicons name="laptop-outline" size={16} color={Colors.white} />
                        <Text style={styles.categoryText}>Freelance</Text>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.categoryBadge,
                            category !== 'Outros' && styles.categoryInactiveBadge,
                            category === 'Outros' && { backgroundColor: Colors.others }
                        ]}
                        onPress={() => setCategory('Outros')}
                    >
                        <Ionicons name="ellipsis-horizontal-outline" size={16} color={Colors.white} />
                        <Text style={styles.categoryText}>Outros</Text>
                    </Pressable>

                </ScrollView>
            </View>

            {/* CAMPO: DATA */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>DATA</Text>
                <Pressable style={styles.datePickerInput}>
                    <Text style={styles.dateText}>{date}</Text>
                    <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} />
                </Pressable>
            </View>

            {/* CAMPO: NOTAS */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>NOTAS</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Adicione um comentário..."
                    placeholderTextColor={Colors.textSecondary}
                    multiline
                    numberOfLines={4}
                    value={notes}
                    onChangeText={setNotes}
                    editable={!loading}
                />
            </View>

            {/* BOTÃO SALVAR */}
            <Pressable
                style={[styles.saveButton, loading && { opacity: 0.6 }]}
                onPress={handleSave}
                disabled={loading}
            >
                <Ionicons name="checkmark" size={22} color={Colors.background} style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>
                    {loading ? 'Salvando...' : 'Salvar transação'}
                </Text>
            </Pressable>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 20,

    },
    contentContainer: {
        paddingBottom: 120,
        marginBottom: 100

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.white,
    },
    typeSelectorContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.card,
        borderRadius: 24,
        padding: 6,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeButtonText: {
        color: Colors.white,
        fontWeight: '600',
        fontSize: 15,
    },
    amountContainer: {
        alignItems: 'center',
        marginBottom: 30,
        padding: 0,
    },
    labelCenter: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 8,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    currencyText: {
        fontSize: 32,
        color: Colors.textSecondary,
        fontWeight: '600',
        marginRight: 10,
    },
    amountInput: {
        fontSize: 54,
        color: Colors.white,
        fontWeight: 'bold',
        minWidth: 120,
        textAlign: 'left',
        padding: 0,
    },
    inputGroup: {
        width: '100%',
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 10,
    },
    input: {
        backgroundColor: Colors.card,
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 16,
        color: Colors.white,
        fontSize: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    categoryScroll: {
        flexDirection: 'row',
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    categoryInactiveBadge: {
        backgroundColor: Colors.card,
    },
    categoryText: {
        color: Colors.white,
        fontWeight: '600',
        marginLeft: 8,
        fontSize: 14,
    },
    datePickerInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    dateText: {
        color: Colors.white,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        paddingVertical: 16,
        marginTop: 20,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    saveButtonText: {
        color: Colors.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
});