import { db, auth } from './firebaseConfig';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { Transaction } from '../types/database';

const TRANSACTIONS_COLLECTION = 'transactions';

const convertTransaction = (docSnap: any): Transaction => {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    userId: d.userId,
    title: d.title,
    amount: d.amount,
    type: d.type,
    category: d.category,
    date: d.date?.toDate?.() || new Date(),
    notes: d.notes,
    createdAt: d.createdAt?.toDate?.() || new Date(),
    updatedAt: d.updatedAt?.toDate?.() || new Date(),
  };
};

// Listener em tempo real (independente do service da Pessoa 2)
export const onTransactionsChange = (callback: (transactions: Transaction[]) => void) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return () => {};

  const q = query(
    collection(db, TRANSACTIONS_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map(convertTransaction);
    callback(transactions);
  });
};

// Métricas do topo (Maior despesa, Média diária, Receitas mês, Taxa poupança)
export const calculateMetrics = (transactions: Transaction[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Transações do mês atual
  const monthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const expenses = monthTransactions.filter(t => t.type === 'expense');
  const incomes = monthTransactions.filter(t => t.type === 'income');

  // Maior despesa
  const highestExpense = expenses.length > 0 
    ? expenses.reduce((max, t) => t.amount > max.amount ? t : max, expenses[0])
    : null;

  // Média diária (últimos 30 dias)
  const last30Days = transactions.filter(t => {
    const d = new Date(t.date);
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 30 && t.type === 'expense';
  });
  const total30Days = last30Days.reduce((sum, t) => sum + t.amount, 0);
  const dailyAverage = last30Days.length > 0 ? total30Days / 30 : 0;

  // Receitas do mês
  const monthlyIncomeTotal = incomes.reduce((sum, t) => sum + t.amount, 0);

  // Taxa de poupança
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = monthlyIncomeTotal > 0 
    ? Math.round(((monthlyIncomeTotal - totalExpense) / monthlyIncomeTotal) * 100) 
    : 0;

  return {
    highestExpense: highestExpense 
      ? { amount: highestExpense.amount, category: highestExpense.category } 
      : { amount: 0, category: 'Nenhuma' },
    dailyAverage,
    monthlyIncome: { amount: monthlyIncomeTotal, changePercentage: 0 },
    savingsRate: Math.max(0, Math.min(100, savingsRate)),
  };
};

// Despesas por categoria (para o gráfico de rosca)
export const getCategoryExpenses = (transactions: Transaction[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthExpenses = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.type === 'expense';
  });

  const categories: Record<string, number> = {};
  monthExpenses.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + t.amount;
  });

  const colors: Record<string, string> = {
    'Alimentação': '#F97316',
    'Transporte': '#3B82F6',
    'Saúde': '#EF4444',
    'Lazer': '#8B5CF6',
    'Assinaturas': '#14B8A6',
    'Outros': '#6B7280',
  };

  const result = Object.entries(categories).map(([name, amount], index) => ({
    id: String(index),
    name,
    amount,
    color: colors[name] || '#6B7280',
  })).sort((a, b) => b.amount - a.amount);

  const total = result.reduce((s, c) => s + c.amount, 0);
  return result.map(c => ({ ...c, percentage: total > 0 ? Math.round((c.amount / total) * 100) : 0 }));
};

// Dados para gráfico de barras (últimos 6 meses)
export const getMonthlyChartData = (transactions: Transaction[]) => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const now = new Date();
  const data = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthIndex = d.getMonth();
    const year = d.getFullYear();
    
    const monthTransactions = transactions.filter(t => {
      const td = new Date(t.date);
      return td.getMonth() === monthIndex && td.getFullYear() === year;
    });

    const receita = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const despesa = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const max = Math.max(receita, despesa, 1);
    
    data.push({
      mes: months[monthIndex],
      receita: Math.round((receita / max) * 100),
      despesa: Math.round((despesa / max) * 100),
      receitaRaw: receita,
      despesaRaw: despesa,
    });
  }

  return data;
};