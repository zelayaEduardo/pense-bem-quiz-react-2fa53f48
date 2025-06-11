
import React, { useState } from 'react';
import NicknameForm from '@/components/NicknameForm';
import BatterySelector from '@/components/BatterySelector';
import Quiz from '@/components/Quiz';
import Results from '@/components/Results';
import History from '@/components/History';
import { GameState } from '@/types/quiz';

type GamePhase = 'nickname' | 'battery' | 'quiz' | 'results' | 'history';

const Index = () => {
  const [gamePhase, setGamePhase] = useState<GamePhase>('nickname');
  const [gameState, setGameState] = useState<GameState>({
    nickname: '',
    selectedBattery: '',
    currentQuestion: 0,
    score: 0,
    answers: [],
    isCompleted: false
  });
  const [quizResults, setQuizResults] = useState({ score: 0, total: 0 });
  const [selectedHistoryBattery, setSelectedHistoryBattery] = useState('');

  const handleNicknameSubmit = (nickname: string) => {
    setGameState(prev => ({ ...prev, nickname }));
    setGamePhase('battery');
  };

  const handleBatterySelect = (battery: string) => {
    setGameState(prev => ({ 
      ...prev, 
      selectedBattery: battery,
      currentQuestion: 0,
      score: 0,
      answers: [],
      isCompleted: false
    }));
    setGamePhase('quiz');
  };

  const handleViewHistory = (battery: string) => {
    setSelectedHistoryBattery(battery);
    setGamePhase('history');
  };

  const handleQuizComplete = (score: number, total: number) => {
    setQuizResults({ score, total });
    setGameState(prev => ({ ...prev, score, isCompleted: true }));
    setGamePhase('results');
  };

  const handleRestart = () => {
    setGameState(prev => ({ 
      ...prev,
      currentQuestion: 0,
      score: 0,
      answers: [],
      isCompleted: false
    }));
    setGamePhase('quiz');
  };

  const handleNewBattery = () => {
    setGamePhase('battery');
  };

  const handleBackToNickname = () => {
    setGameState({
      nickname: '',
      selectedBattery: '',
      currentQuestion: 0,
      score: 0,
      answers: [],
      isCompleted: false
    });
    setGamePhase('nickname');
  };

  const handleBackToBattery = () => {
    setGamePhase('battery');
  };

  const handleBackFromHistory = () => {
    setGamePhase('battery');
  };

  console.log('Current game phase:', gamePhase);
  console.log('Game state:', gameState);

  return (
    <>
      {gamePhase === 'nickname' && (
        <NicknameForm onSubmit={handleNicknameSubmit} />
      )}
      
      {gamePhase === 'battery' && (
        <BatterySelector 
          nickname={gameState.nickname}
          onSelectBattery={handleBatterySelect}
          onViewHistory={handleViewHistory}
          onBack={handleBackToNickname}
        />
      )}
      
      {gamePhase === 'quiz' && (
        <Quiz 
          nickname={gameState.nickname}
          battery={gameState.selectedBattery}
          onComplete={handleQuizComplete}
          onBack={handleBackToBattery}
        />
      )}

      {gamePhase === 'history' && (
        <History 
          battery={selectedHistoryBattery}
          onBack={handleBackFromHistory}
        />
      )}
      
      {gamePhase === 'results' && (
        <Results 
          nickname={gameState.nickname}
          battery={gameState.selectedBattery}
          score={quizResults.score}
          total={quizResults.total}
          onRestart={handleRestart}
          onNewBattery={handleNewBattery}
        />
      )}
    </>
  );
};

export default Index;
