export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Goal = {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
};