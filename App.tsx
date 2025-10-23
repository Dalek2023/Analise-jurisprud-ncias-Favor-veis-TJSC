import React, { useState } from 'react';
import JurisprudenceAnalyzer from './components/JurisprudenceAnalyzer';
import ImageGenerator from './components/ImageGenerator';
import { Tabs, Tab } from './components/ui/Tabs';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analyzer');

  return (
    <div className="min-h-screen bg-brand-background text-brand-text font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-7xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-brand-light flex items-center justify-center gap-3">
          <Sparkles className="w-10 h-10 text-brand-secondary" />
          Assistente Jurídico Lendário
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          Análise de Jurisprudência e Geração de Imagens com Gemini AI
        </p>
      </header>

      <main className="w-full max-w-7xl flex-grow">
        <Tabs>
          <Tab
            label="Analisador de Jurisprudência"
            isActive={activeTab === 'analyzer'}
            onClick={() => setActiveTab('analyzer')}
          />
          <Tab
            label="Gerador de Imagens"
            isActive={activeTab === 'generator'}
            onClick={() => setActiveTab('generator')}
          />
        </Tabs>

        <div className="mt-6">
          {activeTab === 'analyzer' && <JurisprudenceAnalyzer />}
          {activeTab === 'generator' && <ImageGenerator />}
        </div>
      </main>
      
      <footer className="w-full max-w-7xl text-center mt-12 text-gray-500 text-sm">
        <p>Desenvolvido por um engenheiro de frontend de classe mundial para atingir a excelência.</p>
        <p className="mt-1">
          Este aplicativo utiliza a API do Google Gemini. Os resultados são gerados por IA e devem ser verificados.
        </p>
      </footer>
    </div>
  );
};

export default App;