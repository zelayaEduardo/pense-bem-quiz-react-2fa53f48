
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HistoryEntry } from '@/types/quiz';

interface HistoryProps {
  battery: string;
  onBack: () => void;
}

const History: React.FC<HistoryProps> = ({ battery, onBack }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Buscando histórico do banco para a bateria:', battery);
        
        const response = await fetch('http://localhost:3001/api/history');
        if (!response.ok) {
          throw new Error('Erro ao buscar histórico do servidor');
        }
        
        const allHistory = await response.json();
        console.log('Histórico completo recebido:', allHistory);
        
        // Filtrar apenas os resultados desta bateria
        const batteryHistory = allHistory
          .filter((entry: any) => entry.battery === battery)
          .map((entry: any) => ({
            ...entry,
            id: entry.id.toString(),
            completedAt: new Date(entry.completedAt).toISOString()
          }))
          .sort((a: HistoryEntry, b: HistoryEntry) => 
            new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
          );
        
        console.log('Histórico filtrado para bateria', battery, ':', batteryHistory);
        setHistory(batteryHistory);
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        setError('Erro ao carregar histórico do servidor');
        
        // Fallback para localStorage em caso de erro
        const stored = localStorage.getItem(`quiz-history-${battery}`);
        const localHistory = stored ? JSON.parse(stored) : [];
        setHistory(localHistory.sort((a: HistoryEntry, b: HistoryEntry) => 
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        ));
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [battery]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-yellow-600";
    if (percentage >= 70) return "text-green-600";
    if (percentage >= 50) return "text-blue-600";
    return "text-purple-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-200 to-amber-200 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
            <CardContent className="p-8 text-center">
              <div className="text-xl text-gray-600">Carregando histórico...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-200 to-amber-200 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Histórico - Atividade {battery}
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Livro: PENSE BEM Atividades Programadas 1
            </CardDescription>
            {error && (
              <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                {error} - Exibindo dados locais como fallback
              </div>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {history.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xl text-gray-600">
                  Nenhum resultado encontrado para esta atividade.
                </p>
                <p className="text-gray-500 mt-2">
                  Complete um quiz para ver o histórico aqui!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-lg font-semibold text-gray-700">
                    {history.length} resultado{history.length !== 1 ? 's' : ''} encontrado{history.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                {history.map((entry) => (
                  <div 
                    key={entry.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {entry.nickname}
                        </h3>
                        <div className="text-sm text-gray-600 mt-1">
                          {formatDate(entry.completedAt)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">
                          {entry.score} / {entry.total} pontos
                        </div>
                        <div className={`text-xl font-bold ${getPerformanceColor(entry.percentage)}`}>
                          {entry.percentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-6 border-t">
              <Button 
                onClick={onBack}
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
              >
                ← Voltar para Seleção de Atividade
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;
