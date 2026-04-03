'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  LayoutDashboard, CreditCard, ArrowUpRight, 
  ArrowDownRight, Wallet, History, Search, Plus, Trash2 
} from "lucide-react";

export default function BankingApp() {
  // --- 1. STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [balance, setBalance] = useState(5240.50);
  const [monthlyBudget, setMonthlyBudget] = useState(2000);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [transactions, setTransactions] = useState([
    { id: '1', desc: 'Initial Deposit', date: '2026-04-01', amount: 5240.50, type: 'income' },
  ]);

  const [cards, setCards] = useState([
    { id: '1', number: '**** **** **** 4242', expiry: '12/26', brand: 'Visa' }
  ]);

  // --- 2. PERSISTENCE (LocalStorage) ---
  useEffect(() => {
    const saved = {
      balance: localStorage.getItem('v_balance'),
      tx: localStorage.getItem('v_tx'),
      budget: localStorage.getItem('v_budget'),
      cards: localStorage.getItem('v_cards')
    };
    
    if (saved.balance) setBalance(parseFloat(saved.balance));
    if (saved.tx) setTransactions(JSON.parse(saved.tx));
    if (saved.budget) setMonthlyBudget(parseFloat(saved.budget));
    if (saved.cards) setCards(JSON.parse(saved.cards));
  }, []);

  useEffect(() => {
    localStorage.setItem('v_balance', balance.toString());
    localStorage.setItem('v_tx', JSON.stringify(transactions));
    localStorage.setItem('v_budget', monthlyBudget.toString());
    localStorage.setItem('v_cards', JSON.stringify(cards));
  }, [balance, transactions, monthlyBudget, cards]);

  // --- 3. LOGIC CALCULATIONS ---
  const totalSpent = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

  const budgetRemaining = monthlyBudget - totalSpent;
  const spendPercentage = Math.min((totalSpent / monthlyBudget) * 100, 100);
  const filteredTxs = transactions.filter(t => t.desc.toLowerCase().includes(searchTerm.toLowerCase()));

  // --- 4. ACTION HANDLERS ---
  const handleTransaction = (type: 'income' | 'expense') => {
    const amountStr = prompt(`Enter ${type} amount:`);
    const desc = prompt("Enter description:");
    if (!amountStr || !desc || isNaN(Number(amountStr))) return;
    
    const amount = Math.abs(parseFloat(amountStr));
    const finalAmount = type === 'income' ? amount : -amount;

    setBalance(prev => prev + finalAmount);
    setTransactions([{
      id: Date.now().toString(),
      desc,
      date: new Date().toLocaleDateString(),
      amount: finalAmount,
      type
    }, ...transactions]);
  };

  const addCard = () => {
    const last4 = prompt("Enter last 4 digits of card:");
    if (last4 && last4.length === 4) {
      setCards([...cards, { 
        id: Date.now().toString(), 
        number: `**** **** **** ${last4}`, 
        expiry: '05/29', 
        brand: 'Mastercard' 
      }]);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 p-6 space-y-8">
        <div className="flex items-center gap-2 px-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white"><Wallet size={20}/></div>
          <span className="font-bold text-xl tracking-tight">VBANK</span>
        </div>
        <nav className="space-y-1">
          <button className="w-full" onClick={() => setActiveTab('Dashboard')}>
            <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active={activeTab === 'Dashboard'} />
          </button>
          <button className="w-full" onClick={() => setActiveTab('Cards')}>
            <NavItem icon={<CreditCard size={18}/>} label="My Cards" active={activeTab === 'Cards'} />
          </button>
          <button className="w-full" onClick={() => setActiveTab('Transactions')}>
            <NavItem icon={<History size={18}/>} label="Transactions" active={activeTab === 'Transactions'} />
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* VIEW 1: DASHBOARD */}
          {activeTab === 'Dashboard' && (
            <>
              <header className="flex justify-between items-end">
                <div>
                  <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Overview</h2>
                  <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => handleTransaction('income')} variant="outline" className="text-green-700 border-green-200">Deposit</Button>
                  <Button onClick={() => handleTransaction('expense')} className="bg-slate-900 text-white">Send Money</Button>
                </div>
              </header>

              <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2 bg-slate-900 text-white border-none shadow-2xl p-6">
                  <p className="text-sm opacity-70">Total Balance</p>
                  <h3 className="text-5xl font-mono font-bold mt-2">${balance.toLocaleString()}</h3>
                </Card>
                <Card className="bg-white border-slate-200 p-6">
                  <p className="text-xs text-slate-500 uppercase">Monthly Budget</p>
                  <div className="text-2xl font-bold mt-2">${totalSpent} / ${monthlyBudget}</div>
                  <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                    <div className={`h-full ${spendPercentage > 90 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${spendPercentage}%` }}></div>
                  </div>
                </Card>
              </div>

              <Card className="border-slate-200 bg-white">
                <Table>
                  <TableHeader><TableRow><TableHead>Recent Transactions</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {transactions.slice(0, 5).map(t => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.desc}</TableCell>
                        <TableCell className={`text-right font-bold ${t.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                          {t.amount > 0 ? '+' : ''}${Math.abs(t.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </>
          )}

          {/* VIEW 2: CARDS */}
          {activeTab === 'Cards' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Cards</h1>
                <Button onClick={addCard} className="bg-blue-600 text-white"><Plus className="mr-2 h-4 w-4"/> Add Card</Button>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {cards.map(card => (
                  <Card key={card.id} className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-8 rounded-2xl shadow-xl relative group">
                    <div className="flex justify-between items-start mb-12">
                      <CreditCard size={32} />
                      <button onClick={() => setCards(cards.filter(c => c.id !== card.id))} className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-white transition-opacity">
                        <Trash2 size={20}/>
                      </button>
                    </div>
                    <div className="text-2xl font-mono tracking-[0.2em] mb-4">{card.number}</div>
                    <div className="flex justify-between text-xs opacity-80 uppercase tracking-widest">
                      <span>Exp: {card.expiry}</span>
                      <span className="font-bold">{card.brand}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: TRANSACTIONS */}
          {activeTab === 'Transactions' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Transaction History</h1>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input placeholder="Search records..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Card className="border-slate-200 bg-white">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-6">Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right px-6">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTxs.map(t => (
                      <TableRow key={t.id}>
                        <TableCell className="px-6 py-4 font-medium">{t.desc}</TableCell>
                        <TableCell className="text-slate-500">{t.date}</TableCell>
                        <TableCell className={`text-right px-6 font-bold ${t.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                          {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${active ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}