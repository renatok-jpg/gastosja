import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../constants/theme';

const groupedTransactions = [
    {
        id: 'g1',
        date: 'QUARTA-FEIRA, 20 DE MAIO',
        dailyTotal: '+R$ 3.500,00',
        totalType: 'income',
        data: [
            {
                id: '1',
                title: 'Salário',
                subtitle: 'Salário · 09:00',
                amount: '+ R$ 3.500,00',
                amountColor: Colors.income,
                icon: 'briefcase-outline',
                iconColor: Colors.income,
                iconBg: Colors.iconIncome,
            }
        ]
    },
    {
        id: 'g2',
        date: 'TERÇA-FEIRA, 19 DE MAIO',
        dailyTotal: '-R$ 184,50',
        totalType: 'textPrimary',
        data: [
            {
                id: '2',
                title: 'Mercado',
                subtitle: 'Alimentação · 18:30',
                amount: '- R$ 184,50',
                amountColor: Colors.textPrimary,
                icon: 'restaurant-outline',
                iconColor: Colors.expense, 
                iconBg: Colors.iconExpense,
            }
        ]
    },
    {
        id: 'g3',
        date: 'SEGUNDA-FEIRA, 18 DE MAIO',
        dailyTotal: '-R$ 78,80',
        totalType: 'textPrimary',
        data: [
            {
                id: '3',
                title: 'Uber',
                subtitle: 'Transporte · 08:15',
                amount: '- R$ 22,90',
                amountColor: Colors.textPrimary,
                icon: 'car-outline',
                iconColor: Colors.textSecondary, // Neutro se quiser variar
                iconBg: Colors.iconBg,
            },
            {
                id: '4',
                title: 'Netflix',
                subtitle: 'Assinaturas · 22:00',
                amount: '- R$ 55,90',
                amountColor: Colors.textPrimary,
                icon: 'wifi-outline',
                iconColor: Colors.expense,
                iconBg: Colors.iconExpense,
            }
        ]
    }
];

export default function TransactionsScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Tudo');

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
           {/* Header */}
<View style={styles.header}>
    <Pressable 
        onPress={() => router.push('/')} // ou router.back() se preferir apenas voltar a tela
        style={({ pressed }) => [
            styles.backButton,
            pressed && { opacity: 0.7 }
        ]}
    >
        <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
    </Pressable>
    <Text style={styles.headerTitle}>
        Transações
    </Text>
</View>

            {/* Busca e Filtro */}
            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={Colors.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar transação..."
                        placeholderTextColor={Colors.textSecondary}
                    />
                </View>
                <Pressable style={styles.filterButton}>
                    <Ionicons name="options-outline" size={22} color={Colors.textPrimary} />
                </Pressable>
            </View>

            {/* Abas */}
            <View style={styles.tabsContainer}>
                {['Tudo', 'Receitas', 'Despesas'].map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <Pressable
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[
                                styles.tab, 
                                isActive && styles.activeTab,
                                // Adiciona um leve background caso esteja ativo
                                isActive && { backgroundColor: Colors.primary } 
                            ]}
                        >
                            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                                {tab}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {/* Lista de Transações */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {groupedTransactions.map((group) => (
                    <View key={group.id} style={styles.groupContainer}>
                        
                        {/* Cabeçalho da Data */}
                        <View style={styles.groupHeader}>
                            <Text style={styles.groupDate}>{group.date}</Text>
                            <Text style={[
                                styles.groupTotal,
                                { color: group.totalType === 'income' ? Colors.income : Colors.textPrimary }
                            ]}>
                                {group.dailyTotal}
                            </Text>
                        </View>

                        {/* Card do grupo */}
                        <View style={styles.groupCard}>
                            {group.data.map((transaction, index) => (
                                <View key={transaction.id}>
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.transactionRow,
                                            pressed && { opacity: 0.7, backgroundColor: Colors.cardHover }
                                        ]}
                                    >
                                        <View style={styles.iconAndText}>
                                            <View style={[styles.iconWrapper, { backgroundColor: transaction.iconBg }]}>
                                                <Ionicons name={transaction.icon as any} size={20} color={transaction.iconColor} />
                                            </View>
                                            <View style={styles.textContainer}>
                                                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                                                <Text style={styles.transactionSubtitle}>{transaction.subtitle}</Text>
                                            </View>
                                        </View>
                                        <Text style={[styles.transactionAmount, { color: transaction.amountColor }]}>
                                            {transaction.amount}
                                        </Text>
                                    </Pressable>

                                    {/* Separador */}
                                    {index < group.data.length - 1 && <View style={styles.separator} />}
                                </View>
                            ))}
                        </View>

                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
   header: {
        flexDirection: 'row',
        alignItems: 'center', // Alinha o botão e o texto no centro
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        gap: 12, // Dá um espaço entre a seta e o título
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
        fontSize: 28, // Diminui de 32 para 28 para encaixar melhor com o botão
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    searchSection: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 12,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderRadius: 24,
        paddingHorizontal: 16,
        height: 48,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        color: Colors.textPrimary,
        fontSize: 16,
    },
    filterButton: {
        width: 48,
        height: 48,
        backgroundColor: Colors.card,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: Colors.card,
        borderRadius: 30,
        padding: 4,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 26,
    },
    activeTab: {
      
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    activeTabText: {
        color: Colors.background,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    groupContainer: {
        marginTop: 20,
    },
    groupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    groupDate: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.textSecondary,
        letterSpacing: 0.5,
    },
    groupTotal: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    groupCard: {
        backgroundColor: Colors.card,
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    transactionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 16, 
    },
    iconAndText: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 12,
        justifyContent: 'center',
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    transactionSubtitle: {
        fontSize: 13,
        color: Colors.textSecondary,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 8,
        marginLeft: 56, 
    },
});