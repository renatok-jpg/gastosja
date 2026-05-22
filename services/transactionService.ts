import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { Transaction, TransactionType } from '../types/database';

type AddTransactionData = {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  notes?: string;
};

export const addTransaction = async (data: AddTransactionData): Promise<string> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');

    const docRef = await addDoc(collection(db, 'transactions'), {
      userId,
      title: data.title,
      amount: data.amount,
      type: data.type,
      category: data.category,
      date: Timestamp.fromDate(data.date),
      notes: data.notes || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar transação:', error);
    alert('Erro ao salvar transação. Tente novamente.');
    throw error;
  }
};

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const transactions: Transaction[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      transactions.push({
        id: docSnap.id,
        userId: data.userId,
        title: data.title,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date?.toDate() || new Date(),
        notes: data.notes,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });

    return transactions;
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    alert('Erro ao carregar transações.');
    throw error;
  }
};

export const onTransactionsChange = (
  callback: (transactions: Transaction[]) => void
) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    console.warn('Usuário não autenticado - listener não iniciado');
    return () => {};
  }

  const q = query(
    collection(db, 'transactions'),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const transactions: Transaction[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        transactions.push({
          id: docSnap.id,
          userId: data.userId,
          title: data.title,
          amount: data.amount,
          type: data.type,
          category: data.category,
          date: data.date?.toDate() || new Date(),
          notes: data.notes,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });
      callback(transactions);
    },
    (error) => {
      console.error('Erro no listener de transações:', error);
      alert('Erro ao sincronizar dados em tempo real.');
    }
  );

  return unsubscribe;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'transactions', id));
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    alert('Erro ao deletar transação.');
    throw error;
  }
};

export const updateTransaction = async (
  id: string,
  data: Partial<AddTransactionData>
): Promise<void> => {
  try {
    const updateData: Record<string, any> = {
      updatedAt: Timestamp.now(),
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.date !== undefined) updateData.date = Timestamp.fromDate(data.date);
    if (data.notes !== undefined) updateData.notes = data.notes;

    await updateDoc(doc(db, 'transactions', id), updateData);
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    alert('Erro ao atualizar transação.');
    throw error;
  }
};