
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultsProps {
  nickname: string;
  battery: string;
  score: number;
  total: number;
  onRestart: () => void;
  onNewBattery: () => void;
}

const Results: React.FC<ResultsProps> = ({ 
  nickname, 
  battery, 
  score, 
  total, 
  onRestart, 
  onNewBattery 
}) => {
  const percentage = Math.round((score / total) * 100);
  const questionsCount = total / 3; // Total de perguntas (cada pergunta vale 3 pontos)
  
  const getPerformanceMessage = () => {
    if (percentage >= 90) return "🎉 Excelente! Você arrasou!";
    if (percentage >= 70) return "👏 Muito bom! Continue assim!";
    if (percentage >= 50) return "👍 Bom trabalho! Você está no caminho certo!";
    return "💪 Continue praticando! Você vai conseguir!";
  };

  const getPerformanceColor = () => {
    if (percentage >= 90) return "from-yellow-400 to-orange-400";
    if (percentage >= 70) return "from-green-400 to-emerald-400";
    if (percentage >= 50) return "from-blue-400 to-cyan-400";
    return "from-purple-400 to-violet-400";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-yellow-200 to-amber-200 p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <div className={`mx-auto w-32 h-32 bg-gradient-to-br ${getPerformanceColor()} rounded-full flex items-center justify-center shadow-lg`}>
            <div className="text-4xl font-bold text-white">
              {percentage}%
            </div>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Quiz Finalizado!
          </CardTitle>
          <CardDescription className="text-xl text-gray-600">
            {getPerformanceMessage()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Parabéns, {nickname}!
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="text-lg">
                <span className="font-semibold">Livro:</span> PENSE BEM Atividades Programadas 1
              </div>
              <div className="text-lg">
                <span className="font-semibold">Atividade:</span> {battery}
              </div>
              <div className="text-lg">
                <span className="font-semibold">Perguntas:</span> {questionsCount}
              </div>
              <div className="text-lg">
                <span className="font-semibold">Pontuação:</span> {score} de {total} pontos
              </div>
              <div className="text-lg">
                <span className="font-semibold">Aproveitamento:</span> {percentage}%
              </div>
              <div className="text-sm text-gray-600 mt-4">
                Sistema de pontuação: 3 pontos (1ª tentativa), 2 pontos (2ª tentativa), 1 ponto (3ª tentativa)
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={onRestart}
              className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
            >
              🔄 Refazer esta Atividade
            </Button>
            
            <Button 
              onClick={onNewBattery}
              variant="outline"
              className="w-full py-4 text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-colors"
            >
              📚 Escolher Nova Atividade
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500 pt-4 border-t">
            Continue praticando para melhorar ainda mais seus conhecimentos!
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
