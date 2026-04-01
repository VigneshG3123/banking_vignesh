import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// This part is needed for shadcn to work
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// THIS IS THE PART YOUR ERROR IS MISSING:
export const accounts = [
  { id: '1', name: 'Main Checking', balance: 5240.50, color: 'bg-slate-900 text-white' },
  { id: '2', name: 'Savings Account', balance: 12100.00, color: 'bg-blue-600 text-white' }
];

export const transactions = [
  { id: 't1', desc: 'Apple Store', date: 'Apr 01', amount: -99.00 },
  { id: 't2', desc: 'Salary Deposit', date: 'Mar 31', amount: 3500.00 },
  { id: 't3', desc: 'Starbucks', date: 'Mar 30', amount: -6.50 },
];