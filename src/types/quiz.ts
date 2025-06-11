
export interface Question {
  descricao: string;
  resposta?: string;
  opcoes?: string[];
  figura?: string;
  quantidade?: number;
}

export interface Battery {
  [key: string]: Question[];
}

export interface QuizData {
  "Pense-bem Atividades Programadas 1": Battery;
}

export interface GameState {
  nickname: string;
  selectedBattery: string;
  currentQuestion: number;
  score: number;
  answers: string[];
  isCompleted: boolean;
}

export interface HistoryEntry {
  id: string;
  nickname: string;
  battery: string;
  score: number;
  total: number;
  percentage: number;
  completedAt: string;
}
