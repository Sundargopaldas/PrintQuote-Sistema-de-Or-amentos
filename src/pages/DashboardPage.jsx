import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FilePlus2, DollarSign, Users, BarChart3, Printer, Settings, LogOut } from 'lucide-react';

const MotionCard = motion(Card);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const DashboardPage = () => {
  const { toast } = useToast();

  const handleNotImplemented = () => {
    toast({
      title: "Funcionalidade em breve! 🚧",
      description: "Este recurso ainda não foi implementado, mas não se preocupe! Você pode solicitá-lo no próximo prompt! 🚀",
      variant: "default",
    });
  };

  const quotes = [
    { id: 'ORC-001', client: 'Tech Solutions', date: '2025-07-15', total: 'R$ 1.250,00', status: 'Aprovado' },
    { id: 'ORC-002', client: 'Marketing Criativo', date: '2025-07-14', total: 'R$ 850,50', status: 'Pendente' },
    { id: 'ORC-003', client: 'Café Gourmet', date: '2025-07-13', total: 'R$ 2.300,00', status: 'Recusado' },
    { id: 'ORC-004', client: 'Loja de Roupas Style', date: '2025-07-12', total: 'R$ 450,00', status: 'Aprovado' },
  ];

  const chartData = [
    { name: 'Jan', Aprovado: 4000, Pendente: 2400 },
    { name: 'Fev', Aprovado: 3000, Pendente: 1398 },
    { name: 'Mar', Aprovado: 2000, Pendente: 9800 },
    { name: 'Abr', Aprovado: 2780, Pendente: 3908 },
    { name: 'Mai', Aprovado: 1890, Pendente: 4800 },
    { name: 'Jun', Aprovado: 2390, Pendente: 3800 },
    { name: 'Jul', Aprovado: 3490, Pendente: 4300 },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'Pendente':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'Recusado':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard de Orçamentos - PrintSaaS</title>
        <meta name="description" content="Dashboard principal para gerenciamento de orçamentos para gráficas." />
      </Helmet>
      <div className="flex min-h-screen w-full bg-gray-900 text-white">
        <aside className="hidden w-64 flex-col border-r border-gray-800 bg-gray-900 p-4 sm:flex">
          <div className="mb-8 flex items-center gap-2">
            <Printer className="h-8 w-8 text-purple-400" />
            <h2 className="text-2xl font-bold">PrintSaaS</h2>
          </div>
          <nav className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start gap-2 text-white bg-purple-500/20"><BarChart3 className="h-5 w-5" /> Dashboard</Button>
            <Button variant="ghost" className="justify-start gap-2 hover:bg-purple-500/10" onClick={handleNotImplemented}><FilePlus2 className="h-5 w-5" /> Orçamentos</Button>
            <Button variant="ghost" className="justify-start gap-2 hover:bg-purple-500/10" onClick={handleNotImplemented}><Users className="h-5 w-5" /> Clientes</Button>
          </nav>
          <div className="mt-auto flex flex-col gap-2">
            <Button variant="ghost" className="justify-start gap-2 hover:bg-purple-500/10" onClick={handleNotImplemented}><Settings className="h-5 w-5" /> Configurações</Button>
            <Button variant="ghost" className="justify-start gap-2 hover:bg-purple-500/10" onClick={handleNotImplemented}><LogOut className="h-5 w-5" /> Sair</Button>
          </div>
        </aside>

        <main className="flex-1 flex-col p-4 md:p-8 overflow-auto">
          <header className="mb-8 flex items-center justify-between">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-400">Bem-vindo de volta! Aqui está um resumo dos seus orçamentos.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Button className="gap-2 bg-purple-600 hover:bg-purple-700" onClick={handleNotImplemented}>
                <FilePlus2 className="h-5 w-5" /> Novo Orçamento
              </Button>
            </motion.div>
          </header>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <MotionCard custom={0} initial="hidden" animate="visible" variants={cardVariants} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Faturado</CardTitle>
                <DollarSign className="h-5 w-5 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">R$ 15.342,70</div>
                <p className="text-xs text-gray-400">+20.1% do último mês</p>
              </CardContent>
            </MotionCard>
            <MotionCard custom={1} initial="hidden" animate="visible" variants={cardVariants} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Orçamentos Pendentes</CardTitle>
                <Users className="h-5 w-5 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">+23</div>
                <p className="text-xs text-gray-400">+5 desde ontem</p>
              </CardContent>
            </MotionCard>
            <MotionCard custom={2} initial="hidden" animate="visible" variants={cardVariants} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Taxa de Conversão</CardTitle>
                <BarChart3 className="h-5 w-5 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">68.9%</div>
                <p className="text-xs text-gray-400">+5.2% do último mês</p>
              </CardContent>
            </MotionCard>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-7">
            <MotionCard custom={3} initial="hidden" animate="visible" variants={cardVariants} className="lg:col-span-4 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Orçamentos Recentes</CardTitle>
                <CardDescription>Você tem {quotes.length} orçamentos recentes.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-gray-700/50">
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes.map((quote) => (
                      <TableRow key={quote.id} className="border-gray-800 hover:bg-gray-700/50">
                        <TableCell className="font-medium">{quote.id}</TableCell>
                        <TableCell>{quote.client}</TableCell>
                        <TableCell>{quote.date}</TableCell>
                        <TableCell><Badge variant="outline" className={getStatusBadge(quote.status)}>{quote.status}</Badge></TableCell>
                        <TableCell className="text-right">{quote.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </MotionCard>

            <MotionCard custom={4} initial="hidden" animate="visible" variants={cardVariants} className="lg:col-span-3 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Desempenho Mensal</CardTitle>
                <CardDescription>Orçamentos aprovados vs. pendentes.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(31, 41, 55, 0.8)",
                        borderColor: "#4B5563",
                        color: "#FFFFFF"
                      }}
                      cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }}
                    />
                    <Legend iconType="circle" />
                    <Bar dataKey="Aprovado" fill="#4ade80" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Pendente" fill="#facc15" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </MotionCard>
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;