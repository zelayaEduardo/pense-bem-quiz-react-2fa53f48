
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { quizData } from '@/data/quizData';

interface BatterySelectorProps {
  nickname: string;
  onSelectBattery: (battery: string) => void;
  onBack: () => void;
}

const BatterySelector: React.FC<BatterySelectorProps> = ({ nickname, onSelectBattery, onBack }) => {
  const batteries = Object.keys(quizData["Pense-bem Atividades Programadas 1"]);

  const getBatteryDescription = (battery: string) => {
    const descriptions: { [key: string]: string } = {
      "011": "Identificação de Objetos e Animais",
      "012": "Contagem e Quantidades",
      "013": "Plurais em Português",
      "014": "Vocabulário Básico",
      "015": "Conhecimentos Gerais sobre Animais"
    };
    return descriptions[battery] || "Atividade de Aprendizado";
  };

  const getBatteryColor = (battery: string) => {
    const colors: { [key: string]: string } = {
      "011": "from-red-400 to-pink-400",
      "012": "from-blue-400 to-cyan-400",
      "013": "from-green-400 to-emerald-400",
      "014": "from-purple-400 to-violet-400",
      "015": "from-orange-400 to-amber-400"
    };
    return colors[battery] || "from-gray-400 to-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-200 to-amber-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Olá, {nickname}! 👋
          </h1>
          <p className="text-xl text-gray-700">
            Escolha uma bateria de perguntas para começar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {batteries.map((battery) => (
            <Card 
              key={battery}
              className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 bg-white/90 backdrop-blur"
              onClick={() => onSelectBattery(battery)}
            >
              <CardHeader>
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${getBatteryColor(battery)} flex items-center justify-center text-white text-2xl font-bold mb-4`}>
                  {battery}
                </div>
                <CardTitle className="text-center text-xl">
                  Atividade {battery}
                </CardTitle>
                <CardDescription className="text-center">
                  {getBatteryDescription(battery)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-sm text-gray-600">
                  {quizData["Pense-bem Atividades Programadas 1"][battery].length} perguntas
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={onBack}
            variant="outline"
            className="px-8 py-3 text-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
          >
            ← Voltar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BatterySelector;
