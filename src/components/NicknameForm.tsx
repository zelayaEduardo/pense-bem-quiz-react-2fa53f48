
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface NicknameFormProps {
  onSubmit: (nickname: string) => void;
}

const NicknameForm: React.FC<NicknameFormProps> = ({ onSubmit }) => {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      onSubmit(nickname.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-yellow-200 to-amber-200 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
            <img 
              src="/lovable-uploads/363c5a07-7709-4988-bd3e-31ba7c64ceec.png" 
              alt="Quiz Icon" 
              className="w-12 h-12"
            />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Pense Bem Quiz
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Atividades Programadas de Aprendizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="nickname" className="text-sm font-medium text-gray-700">
                Como você gostaria de ser chamado?
              </label>
              <Input
                id="nickname"
                type="text"
                placeholder="Digite seu nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="text-lg py-3 border-2 border-gray-200 focus:border-blue-400 transition-colors"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
              disabled={!nickname.trim()}
            >
              Começar Quiz
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NicknameForm;
