import { create } from 'zustand';
import { Trade, AnalyticsSummary } from '../types';
import { tradeService, analyticsService } from '../services/api';

interface TradeState {
  trades: Trade[];
  loading: boolean;
  error: string | null;
  summary: AnalyticsSummary | null;
  fetchTrades: (userId?: string) => Promise<void>;
  addTrade: (trade: Omit<Trade, 'id' | 'timestamp' | 'date'>) => Promise<void>;
  updateTrade: (id: string, updates: Partial<Trade>) => Promise<void>;
  deleteTrade: (id: string) => Promise<void>;
  calculateSummary: () => Promise<void>;
}

export const useTradeStore = create<TradeState>((set, get) => ({
  trades: [],
  loading: false,
  error: null,
  summary: null,

  fetchTrades: async () => {
    set({ loading: true, error: null });
    try {
      const res = await tradeService.getTrades();
      const mappedTrades = res.data.map((t: any) => ({ ...t, pnl: t.profit, id: t._id }));
      set({ trades: mappedTrades, loading: false });
      get().calculateSummary();
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch trades', loading: false });
    }
  },

  addTrade: async (trade) => {
    set({ error: null });
    try {
      const payload = { ...trade, profit: trade.pnl };
      const res = await tradeService.createTrade(payload);
      const newTrade = { ...res.data, pnl: res.data.profit, id: res.data._id };
      set((state) => ({ trades: [newTrade, ...state.trades] }));
      get().calculateSummary();
    } catch (error: any) {
      set({ error: error.message || 'Failed to add trade' });
    }
  },

  updateTrade: async (id, updates) => {
    set({ error: null });
    try {
      const payload = { ...updates, ...(updates.pnl !== undefined && { profit: updates.pnl }) };
      const res = await tradeService.updateTrade(id, payload);
      const updatedTrade = { ...res.data, pnl: res.data.profit, id: res.data._id };
      set((state) => ({
        trades: state.trades.map((t) => (t.id === id ? updatedTrade : t)),
      }));
      get().calculateSummary();
    } catch (error: any) {
      set({ error: error.message || 'Failed to update trade' });
    }
  },

  deleteTrade: async (id) => {
    set({ error: null });
    try {
      await tradeService.deleteTrade(id);
      set((state) => ({
        trades: state.trades.filter((t) => t._id !== id && t.id !== id),
      }));
      get().calculateSummary();
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete trade' });
    }
  },

  calculateSummary: async () => {
    try {
      const res = await analyticsService.getSummary();
      // Map backend response keys to AnalyticsSummary type if necessary
      // Backend: { totalProfit, winRate, totalTrades, disciplineScore, avgRR, equityCurve, mostCommonMistakes }
      set({ 
        summary: {
            totalPnL: res.data.totalProfit,
            winRate: parseFloat(res.data.winRate),
            totalTrades: res.data.totalTrades,
            disciplineScore: parseFloat(res.data.disciplineScore),
            equityCurve: res.data.equityCurve.map((pt: any) => ({
                date: `Trade ${pt.x}`,
                value: pt.y
            })),
            mostCommonMistakes: res.data.mostCommonMistakes
        }
      });
    } catch (error: any) {
      console.error("Failed to fetch analytics summary", error.message);
    }
  },
}));
