
import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { Select } from './ui/Select';
import { Spinner } from './ui/Spinner';
import { Card, CardHeader, CardContent } from './ui/Card';
import { AspectRatioOption } from '../types';

const aspectRatios: AspectRatioOption[] = [
  { value: '1:1', label: 'Quadrado (1:1)' },
  { value: '16:9', label: 'Paisagem (16:9)' },
  { value: '9:16', label: 'Retrato (9:16)' },
  { value: '4:3', label: 'Padrão (4:3)' },
  { value: '3:4', label: 'Retrato Padrão (3:4)' },
];

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption['value']>('1:1');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Por favor, insira um prompt para gerar a imagem.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const base64Image = await generateImage(prompt, aspectRatio);
      setImageUrl(`data:image/png;base64,${base64Image}`);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao gerar a imagem. Verifique sua chave de API e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold text-brand-light">Gerador de Imagens</h2>
          <p className="text-gray-400">Descreva a imagem que você deseja criar com o máximo de detalhes possível.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: um robô segurando um skate vermelho em estilo cyberpunk..."
            rows={5}
            disabled={isLoading}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <Select
              label="Proporção da Imagem"
              options={aspectRatios}
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatioOption['value'])}
              disabled={isLoading}
            />
            <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()}>
              {isLoading ? <Spinner /> : 'Gerar Imagem'}
            </Button>
          </div>
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
            <p className="mt-4 text-lg font-medium text-brand-secondary">Gerando imagem com alta qualidade...</p>
        </div>
      )}

      {imageUrl && (
        <Card>
            <CardHeader>
                <h3 className="text-xl font-bold text-brand-light">Imagem Gerada</h3>
            </CardHeader>
            <CardContent className="flex justify-center">
                 <img src={imageUrl} alt={prompt} className="rounded-lg shadow-lg max-w-full max-h-[70vh] object-contain" />
            </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageGenerator;
