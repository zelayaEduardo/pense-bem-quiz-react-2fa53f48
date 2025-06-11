import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { quizData } from '@/data/quizData';
import { Question, HistoryEntry } from '@/types/quiz';

interface QuizProps {
  nickname: string;
  battery: string;
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}

const Quiz: React.FC<QuizProps> = ({ nickname, battery, onComplete, onBack }) => {
  const questions = quizData["Pense-bem Atividades Programadas 1"][battery];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [questionCompleted, setQuestionCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const maxPoints = questions.length * 3; // 3 pontos máximos por pergunta

  const saveToHistory = (finalScore: number, totalPoints: number) => {
    const historyEntry: HistoryEntry = {
      id: Date.now().toString(),
      nickname,
      battery,
      score: finalScore,
      total: totalPoints,
      percentage: Math.round((finalScore / totalPoints) * 100),
      completedAt: new Date().toISOString()
    };

    const existingHistory = localStorage.getItem(`quiz-history-${battery}`);
    const history: HistoryEntry[] = existingHistory ? JSON.parse(existingHistory) : [];
    history.push(historyEntry);
    localStorage.setItem(`quiz-history-${battery}`, JSON.stringify(history));
  };

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback || questionCompleted) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || questionCompleted) return;

    let correct = false;
    
    if (currentQuestion.opcoes && currentQuestion.resposta) {
      // Pergunta de múltipla escolha
      correct = selectedAnswer === currentQuestion.resposta;
    } else if (currentQuestion.quantidade !== undefined) {
      // Pergunta de contagem
      correct = parseInt(selectedAnswer) === currentQuestion.quantidade;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      // Sistema de pontuação: 3 pontos na 1ª tentativa, 2 na 2ª, 1 na 3ª
      const points = Math.max(0, 4 - newAttempts);
      setScore(score + points);
      setQuestionCompleted(true);
    } else if (newAttempts >= 3) {
      // Esgotou as 3 tentativas
      setQuestionCompleted(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setIsCorrect(false);
      setAttempts(0);
      setQuestionCompleted(false);
    } else {
      saveToHistory(score, maxPoints);
      onComplete(score, maxPoints);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer('');
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const getCorrectAnswer = () => {
    if (currentQuestion.resposta) {
      return currentQuestion.resposta;
    }
    if (currentQuestion.quantidade !== undefined) {
      return currentQuestion.quantidade.toString();
    }
    return '';
  };

  const renderQuestionContent = () => {
    if (currentQuestion.opcoes) {
      // Pergunta de múltipla escolha
      return (
        <div className="space-y-3">
          {currentQuestion.opcoes.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === option ? "default" : "outline"}
              className={`w-full p-4 text-left justify-start text-lg transition-all duration-200 ${
                showFeedback && questionCompleted
                  ? option === currentQuestion.resposta
                    ? "bg-green-500 text-white border-green-500"
                    : selectedAnswer === option && option !== currentQuestion.resposta
                    ? "bg-red-500 text-white border-red-500"
                    : "opacity-50"
                  : selectedAnswer === option
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleAnswerSelect(option)}
              disabled={showFeedback || questionCompleted}
            >
              {String.fromCharCode(65 + index)}) {option}
            </Button>
          ))}
        </div>
      );
    } else if (currentQuestion.quantidade !== undefined) {
      // Pergunta de contagem
      return (
        <div className="space-y-4">
          <p className="text-lg text-gray-600 text-center">
            Digite o número de vezes que {currentQuestion.figura} aparece:
          </p>
          <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <Button
                key={num}
                variant={selectedAnswer === num.toString() ? "default" : "outline"}
                className={`aspect-square text-lg transition-all duration-200 ${
                  showFeedback && questionCompleted
                    ? num === currentQuestion.quantidade
                      ? "bg-green-500 text-white border-green-500"
                      : selectedAnswer === num.toString() && num !== currentQuestion.quantidade
                      ? "bg-red-500 text-white border-red-500"
                      : "opacity-50"
                    : selectedAnswer === num.toString()
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleAnswerSelect(num.toString())}
                disabled={showFeedback || questionCompleted}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-200 to-amber-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {nickname} - Atividade {battery}
            </h1>
            <div className="text-lg font-semibold text-gray-700">
              {currentQuestionIndex + 1} / {questions.length}
            </div>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Question Card */}
        <Card className="mb-6 shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Pergunta {currentQuestionIndex + 1}
            </CardTitle>
            <p className="text-center text-sm text-gray-600">
              Livro: PENSE BEM Atividades Programadas 1
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-xl text-center text-gray-800 leading-relaxed">
              {currentQuestion.descricao}
            </p>

            {renderQuestionContent()}

            {/* Feedback */}
            {showFeedback && (
              <div className={`p-4 rounded-lg text-center text-lg font-semibold ${
                isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {isCorrect ? (
                  <div>
                    <div>✅ Resposta Correta!</div>
                    <div className="text-sm mt-2">
                      Pontos ganhos: {Math.max(0, 4 - attempts)} / 3
                    </div>
                  </div>
                ) : questionCompleted ? (
                  <div>
                    <div>❌ Você esgotou suas 3 tentativas.</div>
                    <div className="text-sm mt-2">
                      A resposta correta é: {getCorrectAnswer()}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div>❌ Resposta Incorreta.</div>
                    <div className="text-sm mt-2">
                      Tentativa {attempts} de 3. Tente novamente!
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Attempt indicator */}
            {!questionCompleted && (
              <div className="text-center text-sm text-gray-600">
                Tentativa: {attempts + 1} / 3
                {attempts > 0 && (
                  <div className="text-xs mt-1">
                    Pontos possíveis: {Math.max(0, 3 - attempts)}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between items-center pt-4">
              <Button 
                onClick={onBack}
                variant="outline"
                className="px-6 py-2"
              >
                ← Voltar
              </Button>

              {!showFeedback ? (
                <Button 
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="px-8 py-2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                >
                  Confirmar Resposta
                </Button>
              ) : questionCompleted ? (
                <Button 
                  onClick={handleNextQuestion}
                  className="px-8 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {currentQuestionIndex < questions.length - 1 ? "Próxima Pergunta" : "Ver Resultado"}
                </Button>
              ) : (
                <Button 
                  onClick={handleTryAgain}
                  className="px-8 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  Tentar Novamente
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Score Display */}
        <div className="text-center">
          <div className="inline-block bg-white/90 backdrop-blur rounded-full px-6 py-3 shadow-lg">
            <span className="text-lg font-semibold text-gray-700">
              Pontuação: {score} / {maxPoints}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
