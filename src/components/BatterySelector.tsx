
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { quizData } from '@/data/quizData';

interface BatterySelectorProps {
  nickname: string;
  onSelectBattery: (battery: string) => void;
  onViewHistory: (battery: string) => void;
  onBack: () => void;
}

const BatterySelector: React.FC<BatterySelectorProps> = ({ 
  nickname, 
  onSelectBattery, 
  onViewHistory,
  onBack 
}) => {
  const batteries = Object.keys(quizData["Pense-bem Atividades Programadas 1"]);

  const getHistoryCount = async (battery: string): Promise<number> => {
    try {
      const response = await fetch('http://localhost:3001/api/history');
      if (!response.ok) {
        throw new Error('Erro ao buscar histórico');
      }
      
      const allHistory = await response.json();
      const batteryHistory = allHistory.filter((entry: any) => entry.battery === battery);
      return batteryHistory.length;
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      // Fallback para localStorage em caso de erro
      const stored = localStorage.getItem(`quiz-history-${battery}`);
      return stored ? JSON.parse(stored).length : 0;
    }
  };

  // Vamos usar um estado local para armazenar os counts do histórico
  const [historyCounts, setHistoryCounts] = React.useState<{[key: string]: number}>({});

  React.useEffect(() => {
    const loadHistoryCounts = async () => {
      const counts: {[key: string]: number} = {};
      for (const battery of batteries) {
        counts[battery] = await getHistoryCount(battery);
      }
      setHistoryCounts(counts);
    };

    loadHistoryCounts();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-yellow-200 to-amber-200 p-4">
      <Card className="w-full max-w-4xl shadow-2xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Selecione uma Atividade
          </CardTitle>
          <CardDescription className="text-xl text-gray-600">
            Olá, {nickname}! Escolha uma das atividades do livro PENSE BEM Atividades Programadas 1
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batteries.map((battery) => {
              const questionsCount = quizData["Pense-bem Atividades Programadas 1"][battery].length;
              const historyCount = historyCounts[battery] || 0;
              
              return (
                <div key={battery} className="space-y-3">
                  <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="text-3xl font-bold text-blue-600">
                        {battery}
                      </div>
                      <div className="text-sm text-gray-600">
                        {questionsCount} perguntas
                      </div>
                      {historyCount > 0 && (
                        <div className="text-xs text-green-600 font-medium">
                          {historyCount} resultado{historyCount !== 1 ? 's' : ''} no histórico
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={() => onSelectBattery(battery)}
                      className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold py-3 transition-all duration-300"
                    >
                      ▶ Iniciar Quiz
                    </Button>
                    
                    <Button 
                      onClick={() => onViewHistory(battery)}
                      variant="outline"
                      className="w-full border-2 border-gray-300 hover:border-gray-400 font-semibold py-2 transition-colors"
                    >
                      📊 Ver Histórico{historyCount > 0 ? ` (${historyCount})` : ''}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t">
            <Button 
              onClick={onBack}
              variant="outline"
              className="w-full py-3 text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-colors"
            >
              ← Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatterySelector;
