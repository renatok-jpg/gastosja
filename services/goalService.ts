import { db, auth } from './firebaseConfig';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { Goal } from '../types/database';

const GOALS_COLLECTION = 'goals';

// Helper para pegar userId
const getUserId = () => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado');
  return uid;
};

// Helper para converter Firestore Timestamp -> Date
const convertGoal = (docSnap: any): Goal => {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    userId: d.userId,
    title: d.title,
    targetAmount: d.targetAmount,
    currentAmount: d.currentAmount,
    deadline: d.deadline?.toDate?.() || new Date(),
    icon: d.icon,
    createdAt: d.createdAt?.toDate?.() || new Date(),
    updatedAt: d.updatedAt?.toDate?.() || new Date(),
  };
};

// ✅ CRIAR META
export const addGoal = async (
  data: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const userId = getUserId();
    const docRef = await addDoc(collection(db, GOALS_COLLECTION), {
      ...data,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    throw error;
  }
};

// ✅ LER METAS
export const getGoals = async (): Promise<Goal[]> => {
  try {
    const userId = getUserId();
    const q = query(
      collection(db, GOALS_COLLECTION),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(convertGoal);
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
    throw error;
  }
};

// ✅ LISTENER EM TEMPO REAL (ESSENCIAL)
export const onGoalsChange = (callback: (goals: Goal[]) => void) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return () => {};

  const q = query(
    collection(db, GOALS_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const goals = snapshot.docs.map(convertGoal);
    callback(goals);
  });
};

// ✅ ATUALIZAR META
export const updateGoal = async (
  goalId: string,
  updates: Partial<Omit<Goal, 'id' | 'userId'>>
) => {
  try {
    const docRef = doc(db, GOALS_COLLECTION, goalId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Erro ao atualizar meta:', error);
    throw error;
  }
};

// ✅ DELETAR META
export const deleteGoal = async (goalId: string) => {
  try {
    await deleteDoc(doc(db, GOALS_COLLECTION, goalId));
  } catch (error) {
    console.error('Erro ao deletar meta:', error);
    throw error;
  }
};