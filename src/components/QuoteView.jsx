import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';

const QuoteView = ({ quote, onBack }) => {
  const printRef = useRef();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Visualizar Orçamento</h1>
          <p className="text-white/60">Confira os detalhes do orçamento e salve em PDF</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Voltar
          </Button>
          <Button
            onClick={() => window.print()}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            Salvar em PDF
          </Button>
        </div>
      </div>
      <div ref={printRef} className="bg-white/10 backdrop-blur-xl border-white/20 rounded-lg p-8 text-white print:bg-white print:text-black print:border-none print:p-4">
        <h2 className="text-2xl font-bold mb-2">Orçamento #{quote.id}</h2>
        <p className="mb-1"><span className="font-semibold">Cliente:</span> {quote.clientName}</p>
        <p className="mb-1"><span className="font-semibold">Descrição:</span> {quote.description}</p>
        <p className="mb-1"><span className="font-semibold">Data:</span> {new Date(quote.createdAt).toLocaleDateString('pt-BR')}</p>
        <p className="mb-1"><span className="font-semibold">Válido até:</span> {quote.validUntil}</p>
        <p className="mb-1"><span className="font-semibold">Status:</span> {quote.status === 'approved' ? 'Aprovado' : quote.status === 'rejected' ? 'Rejeitado' : 'Pendente'}</p>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Itens</h3>
          <table className="w-full text-white print:text-black">
            <thead>
              <tr className="border-b border-white/20 print:border-black/20">
                <th className="text-left py-1">Produto</th>
                <th className="text-left py-1">Quantidade</th>
                <th className="text-left py-1">Preço Unit.</th>
                <th className="text-left py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item, idx) => (
                <tr key={idx} className="border-b border-white/10 print:border-black/10">
                  <td className="py-1">{item.productName}</td>
                  <td className="py-1">{item.quantity}</td>
                  <td className="py-1">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="py-1">R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <div><span className="font-semibold">Desconto:</span> {quote.discount}%</div>
          <div><span className="font-semibold">Total Geral:</span> <span className="text-green-400 font-bold">R$ {quote.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
        </div>
        {quote.notes && (
          <div className="mt-4">
            <span className="font-semibold">Observações:</span>
            <div className="bg-white/5 rounded p-2 mt-1 print:bg-transparent">{quote.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteView; 