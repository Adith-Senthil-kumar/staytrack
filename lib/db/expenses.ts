import { addDoc, deleteDoc, doc } from 'firebase/firestore';
import { expensesRef } from './refs';
import type { Expense } from '../../types';

export const addExpense = (uid: string, expense: Omit<Expense, 'id'>) =>
  addDoc(expensesRef(uid), expense as Expense);
export const removeExpense = (uid: string, id: string) => deleteDoc(doc(expensesRef(uid), id));
