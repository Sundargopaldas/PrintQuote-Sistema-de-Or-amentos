import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import QuoteManager from '@/components/QuoteManager';
import ClientManager from '@/components/ClientManager';
import ProductManager from '@/components/ProductManager';
import Reports from '@/components/Reports';
import Settings from '@/components/Settings';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'quotes':
        return <QuoteManager />;
      case 'clients':
        return <ClientManager />;
      case 'products':
        return <ProductManager />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Helmet>
        <title>PrintQuote - Sistema de Orçamentos para Gráficas</title>
        <meta name="description" content="Sistema completo de orçamentos para gráficas com gestão de clientes, produtos e relatórios avançados. Substitua o Excel por uma solução moderna e eficiente." />
      </Helmet>
      
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
      
      <Toaster />
    </>
  );
}

export default App;