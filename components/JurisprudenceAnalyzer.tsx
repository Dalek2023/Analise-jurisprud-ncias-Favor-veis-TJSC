import React, { useState, useCallback } from 'react';
import { analyzeJurisprudence } from '../services/geminiService';
import { JurisprudenceCase } from '../types';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { Spinner } from './ui/Spinner';
import { Card, CardHeader, CardContent } from './ui/Card';

const JurisprudenceAnalyzer: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [results, setResults] = useState<JurisprudenceCase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);

  const handleAnalyze = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Por favor, insira um texto para ser analisado.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults([]);
    setHasAnalyzed(true);

    try {
      const analysisResults = await analyzeJurisprudence(inputText);
      setResults(analysisResults);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
      setError(`Falha na análise: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold text-brand-light">Analisar Jurisprudência</h2>
          <p className="text-gray-400">Cole o texto de uma peça jurídica, decisão ou tese para encontrar jurisprudências compatíveis.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Cole seu texto jurídico aqui..."
            rows={15}
            disabled={isLoading}
          />
          <Button onClick={handleAnalyze} disabled={isLoading || !inputText.trim()}>
            {isLoading ? <Spinner /> : 'Analisar com Excelência'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="bg-red-900/20 border-red-500">
          <CardContent>
            <p className="text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <Spinner />
            <p className="mt-4 text-lg font-medium text-brand-secondary">Realizando análise profunda... O máximo de processamento está sendo utilizado para garantir a excelência.</p>
            <p className="text-gray-400 mt-1">Isso pode levar alguns segundos.</p>
        </div>
      )}

      {!isLoading && !error && hasAnalyzed && results.length === 0 && (
         <Card>
            <CardContent className="text-center text-gray-400 py-10">
                <h3 className="text-lg font-semibold text-white">Nenhum Resultado Encontrado</h3>
                <p>A análise foi concluída, mas nenhuma jurisprudência compatível foi encontrada para o texto fornecido.</p>
            </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center text-brand-light">Resultados da Análise</h3>
            {results.map((caseResult, index) => (
                <Card key={index} className="transition-all hover:border-brand-secondary/80">
                    <CardHeader>
                        <h4 className="text-xl font-semibold text-brand-secondary">{caseResult.titulo_caso}</h4>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h5 className="font-bold text-brand-light mb-1">Resumo do Caso</h5>
                            <p className="text-gray-300 whitespace-pre-wrap">{caseResult.resumo}</p>
                        </div>
                        <div>
                            <h5 className="font-bold text-brand-light mb-2">Princípios Jurídicos Aplicados</h5>
                            <div className="flex flex-wrap gap-2">
                                {caseResult.principios_juridicos.map((principle, pIndex) => (
                                    <span key={pIndex} className="bg-brand-dark text-brand-light text-xs font-medium px-2.5 py-1 rounded-full">{principle}</span>
                                ))}
                            </div>
                        </div>
                         <div>
                            <h5 className="font-bold text-brand-light mb-1">Conexão com o seu Texto</h5>
                            <p className="text-gray-300 bg-brand-dark/30 p-3 rounded-md border border-brand-border whitespace-pre-wrap">{caseResult.conexao_com_texto}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default JurisprudenceAnalyzer;