import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { accounts, transactions } from "@/lib/utils"; // Links to the file you just made

export default function BankDashboard() {
  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Vignesh Dashboard</h1>
            <p className="text-slate-500 text-sm">Welcome back to your banking overview.</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-md transition-all">
            Transfer Funds
          </Button>
        </header>

        {/* Balance Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {accounts.map((acc) => (
            <Card key={acc.id} className={`${acc.color} border-none shadow-xl transform transition hover:scale-[1.01]`}>
              <CardHeader><CardTitle className="text-sm font-medium opacity-70 uppercase tracking-widest">{acc.name}</CardTitle></CardHeader>
              <CardContent><p className="text-4xl font-mono font-bold">${acc.balance.toLocaleString()}</p></CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity Table */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-white">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-6 py-4">Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right px-6">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="px-6 py-4 font-medium">{t.desc}</TableCell>
                    <TableCell className="text-slate-500">{t.date}</TableCell>
                    <TableCell className={`text-right px-6 font-bold font-mono ${t.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                      {t.amount > 0 ? `+` : ``}${t.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}