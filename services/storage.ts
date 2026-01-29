import { SongOrder } from '../types';

const STORAGE_KEY = 'maimelody_orders';

export const saveOrder = (order: SongOrder) => {
  const existing = getOrders();
  const updated = [...existing, order];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getOrders = (): SongOrder[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const clearOrders = () => {
  localStorage.removeItem(STORAGE_KEY);
};