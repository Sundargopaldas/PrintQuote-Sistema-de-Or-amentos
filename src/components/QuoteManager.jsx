import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Filter,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import QuoteView from './QuoteView';

const QuoteManager = () => {
  const [quotes, setQuotes] = useLocalStorage('quotes', []);
  const [clients] = useLocalStorage('clients', []);
  const [products] = useLocalStorage('products', []);
  const [showForm, setShowForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewQuote, setViewQuote] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    description: '',
    items: [{ productId: '', productName: '', quantity: 1, price: 0, total: 0 }],
    discount: 0,
    total: 0,
    status: 'pending',
    validUntil: '',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      clientId: '',
      clientName: '',
      description: '',
      items: [{ productId: '', productName: '', quantity: 1, price: 0, total: 0 }],
      discount: 0,
      total: 0,
      status: 'pending',
      validUntil: '',
      notes: ''
    });
    setEditingQuote(null);
    setShowForm(false);
  };

  const calculateTotal = (items, discount = 0) => {
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    return subtotal - (subtotal * discount / 100);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'price') {
      newItems[index].total = newItems[index].quantity * newItems[index].price;
    }
    
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].productName = product.name;
        newItems[index].price = product.price;
        newItems[index].total = newItems[index].quantity * product.price;
      }
    }

    const total = calculateTotal(newItems, formData.discount);
    setFormData({ ...formData, items: newItems, total });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', productName: '', quantity: 1, price: 0, total: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const total = calculateTotal(newItems, formData.discount);
    setFormData({ ...formData, items: newItems, total });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.clientId || formData.items.length === 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const quoteData = {
      ...formData,
      id: editingQuote ? editingQuote.id : Date.now().toString(),
      createdAt: editingQuote ? editingQuote.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingQuote) {
      setQuotes(quotes.map(q => q.id === editingQuote.id ? quoteData : q));
      toast({
        title: "Sucesso",
        description: "Orçamento atualizado com sucesso!",
      });
    } else {
      setQuotes([...quotes, quoteData]);
      toast({
        title: "Sucesso",
        description: "Orçamento criado com sucesso!",
      });
      setViewQuote(quoteData); // Redireciona para visualização
      setShowForm(false);
      return;
    }

    resetForm();
  };

  const handleEdit = (quote) => {
    setFormData(quote);
    setEditingQuote(quote);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setQuotes(quotes.filter(q => q.id !== id));
    toast({
      title: "Sucesso",
      description: "Orçamento excluído com sucesso!",
    });
  };

  const handleClientChange = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    setFormData({
      ...formData,
      clientId,
      clientName: client ? client.name : ''
    });
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || quote.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (viewQuote) {
    return <QuoteView quote={viewQuote} onBack={() => setViewQuote(null)} />;
  }

  if (showForm) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {editingQuote ? 'Editar Orçamento' : 'Novo Orçamento'}
            </h1>
            <p className="text-white/60">Preencha os dados do orçamento</p>
          </div>
          <Button
            variant="outline"
            onClick={resetForm}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Cancelar
          </Button>
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Cliente *</Label>
                  <Select value={formData.clientId} onValueChange={handleClientChange}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Válido até</Label>
                  <Input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Descrição</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do orçamento"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white text-lg">Itens do Orçamento</Label>
                  <Button
                    type="button"
                    onClick={addItem}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>

                {formData.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Produto</Label>
                      <Select
                        value={item.productId}
                        onValueChange={(value) => handleItemChange(index, 'productId', value)}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(product => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white text-sm">Quantidade</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white text-sm">Preço Unit.</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white text-sm">Total</Label>
                      <Input
                        type="text"
                        value={`R$ ${item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        readOnly
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>

                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                        disabled={formData.items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Desconto (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => {
                      const discount = parseFloat(e.target.value) || 0;
                      const total = calculateTotal(formData.items, discount);
                      setFormData({ ...formData, discount, total });
                    }}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="approved">Aprovado</SelectItem>
                      <SelectItem value="rejected">Rejeitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Total Geral</Label>
                  <Input
                    type="text"
                    value={`R$ ${formData.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    readOnly
                    className="bg-green-500/20 border-green-500/30 text-green-400 font-bold text-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Observações</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observações adicionais"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {editingQuote ? 'Atualizar' : 'Criar'} Orçamento
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Orçamentos</h1>
          <p className="text-white/60">Gerencie todos os seus orçamentos</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
                <Input
                  placeholder="Buscar orçamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="approved">Aprovados</SelectItem>
                  <SelectItem value="rejected">Rejeitados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20">
                  <TableHead className="text-white/80">Cliente</TableHead>
                  <TableHead className="text-white/80">Descrição</TableHead>
                  <TableHead className="text-white/80">Data</TableHead>
                  <TableHead className="text-white/80">Valor</TableHead>
                  <TableHead className="text-white/80">Status</TableHead>
                  <TableHead className="text-white/80">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id} className="border-white/10">
                    <TableCell className="text-white font-medium">
                      {quote.clientName}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {quote.description}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {new Date(quote.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-white/80">
                      R$ {quote.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        quote.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        quote.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {quote.status === 'approved' ? 'Aprovado' :
                         quote.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setViewQuote(quote)}
                          className="h-8 w-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleEdit(quote)}
                          className="h-8 w-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => toast({
                            title: "🚧 Funcionalidade em desenvolvimento",
                            description: "Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
                          })}
                          className="h-8 w-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleDelete(quote.id)}
                          className="h-8 w-8 bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredQuotes.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="h-16 w-16 text-white/40 mx-auto mb-4" />
              <p className="text-white/60 text-lg">Nenhum orçamento encontrado</p>
              <p className="text-white/40">Crie seu primeiro orçamento para começar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuoteManager;