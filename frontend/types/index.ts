export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export type TradeDirection = 'BUY' | 'SELL';

export interface Trade {
  id: string;
  userId: string;
  asset: string;
  direction: TradeDirection;
  entry: number;
  sl: number;
  tp: number;
  lotSize: number;
  riskPercent: number;
  pnl: number;
  mistakes: string[];
  checklist: {
    htfBias: boolean;
    confirmation: boolean;
    riskPlanned: boolean;
    emotionControlled: boolean;
  };
  notes: string;
  timestamp: any; // Firestore Timestamp
}

export interface AnalyticsSummary {
  totalPnL: number;
  winRate: number;
  totalTrades: number;
  disciplineScore: number;
  equityCurve: { date: string; value: number }[];
  mostCommonMistakes: { mistake: string; count: number }[];
}
