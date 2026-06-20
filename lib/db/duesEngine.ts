import { generateDuesForMonth } from '../domain/dues';
import type { Due, NewDue, Tenant } from '../../types';

// duesToCreate(tenants, existingDues, monthKey) — note arg order matches the test
export const duesToCreate = (tenants: Tenant[], existingDues: Due[], monthKey: string): NewDue[] =>
  generateDuesForMonth(tenants, monthKey, existingDues);

export async function ensureCurrentMonthDues(uid: string, tenants: Tenant[], existing: Due[], monthKey: string) {
  const { createDues } = await import('./dues');
  const toCreate = generateDuesForMonth(tenants, monthKey, existing);
  await createDues(uid, toCreate);
}
