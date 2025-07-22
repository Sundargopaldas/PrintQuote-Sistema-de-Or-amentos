import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download,
  DollarSign,
  Users,
  FileText,
  Target,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';

const Reports = () => {
  const [quotes] = useLocalStorage('quotes', []);
  const [clients] = useLocalStorage('clients', []);
  const [products] = useLocalStorage('products', []);
  const [period, setPeriod] = useState('month');
  const { toast } = useToast();

  const getDateRange = () => {
    const now = new Date();
    const start = new Date();
    
    switch (period) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        start.setMonth(now.getMonth() - 1);
    }
    
    return { start, end: now };
  };

  const { start, end } = getDateRange();
  
  const filteredQuotes = quotes.filter(quote => {
    const quoteDate = new Date(quote.createdAt);
    return quoteDate >= start && quoteDate <= end;
  });

  const stats = {
    totalQuotes: filteredQuotes.length,
    approvedQuotes: filteredQuotes.filter(q => q.status === 'approved').length,
    totalRevenue: filteredQuotes
      .filter(q => q.status === 'approved')
      .reduce((sum, q) => sum + (q.total || 0), 0),
    averageQuoteValue: filteredQuotes.length > 0 
      ? filteredQuotes.reduce((sum, q) => sum + (q.total || 0), 0) / filteredQuotes.length 
      : 0,
    conversionRate: filteredQuotes.length > 0 
      ? (filteredQuotes.filter(q => q.status === 'approved').length / filteredQuotes.length) * 100 
      : 0
  };

  const topClients = clients
    .map(client => {
      const clientQuotes = filteredQuotes.filter(q => q.clientId === client.id);
      const totalValue = clientQuotes
        .filter(q => q.status === 'approved')
        .reduce((sum, q) => sum + (q.total || 0), 0);
      return {
        ...client,
        quotesCount: clientQuotes.length,
        totalValue
      };
    })
    .filter(client => client.quotesCount > 0)
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  const topProducts = products
    .map(product => {
      const productQuotes = filteredQuotes.filter(quote =>
        quote.items?.some(item => item.productId === product.id)
      );
      const totalQuantity = productQuotes.reduce((sum, quote) => {
        const productItems = quote.items?.filter(item => item.productId === product.id) || [];
        return sum + productItems.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0);
      }, 0);
      const totalValue = productQuotes.reduce((sum, quote) => {
        const productItems = quote.items?.filter(item => item.productId === product.id) || [];
        return sum + productItems.reduce((itemSum, item) => itemSum + (item.total || 0), 0);
      }, 0);
      return {
        ...product,
        totalQuantity,
        totalValue
      };
    })
    .filter(product => product.totalQuantity > 0)
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Relatórios</h1>
            <p className="text-white/60">Análise detalhada do seu negócio</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mês</SelectItem>
                <SelectItem value="quarter">Último trimestre</SelectItem>
                <SelectItem value="year">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => toast({
                title: "🚧 Funcionalidade em desenvolvimento",
                description: "Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
              })}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">
              Total de Orçamentos
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuotes}</div>
            <p className="text-xs text-white/60">
              No período selecionado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">
              Orçamentos Aprovados
            </CardTitle>
            <Target className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedQuotes}</div>
            <p className="text-xs text-white/60">
              {stats.conversionRate.toFixed(1)}% de conversão
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-white/60">
              Orçamentos aprovados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">
              Ticket Médio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.averageQuoteValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-white/60">
              Valor médio por orçamento
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">
              Taxa de Conversão
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-white/60">
              Orçamentos aprovados
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-400" />
                <span>Top 5 Clientes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClients.length > 0 ? (
                  topClients.map((client, index) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div>
                        <p className="font-medium text-white">{client.name}</p>
                        <p className="text-sm text-white/60">{client.quotesCount} orçamentos</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">
                          R$ {client.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">Nenhum cliente no período</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-400" />
                <span>Top 5 Produtos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.length > 0 ? (
                  topProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-sm text-white/60">Qtd: {product.totalQuantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">
                          R$ {product.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">Nenhum produto no período</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Chart */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span>Performance de Vendas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Calendar className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <p className="text-white/60 text-lg">Gráfico de performance em desenvolvimento</p>
                <p className="text-sm text-white/40 mt-2">
                  Visualização detalhada das vendas ao longo do tempo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Reports;