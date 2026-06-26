// domain models
export interface IUser {
  id: string;
  username: string;
  email: string;
}

export interface ITrade {
  id: string;
  userId: string;
  date: Date;
  asset: string;
  direction: 'BUY' | 'SELL';
  entry: number;
  sl: number;
  tp: number;
  lotSize: number;
  riskPercent: number;
  profit: number;
  notes?: string;
  mistakes?: string[];
  checklist?: Record<string, boolean>;
  disciplineScore?: number;
}

// Repositories
export interface IUserRepository {
  findOne(query: any): Promise<any>;
  create(userData: any): Promise<any>;
  update(user: any): Promise<any>;
}

export interface ITradeRepository {
  create(tradeData: any): Promise<any>;
  find(query: any, sortParams?: any): Promise<any[]>;
  findOne(query: any): Promise<any>;
  findOneAndUpdate(query: any, updateData: any, options?: any): Promise<any>;
  findOneAndDelete(query: any): Promise<any>;
}

// Strategy Pattern
export interface ITradingStrategy {
  name: string;
  validateTrade(trade: ITrade): boolean;
  calculateRisk(entry: number, sl: number): number;
}

export interface IStrategyFactory {
  createStrategy(type: string): ITradingStrategy;
}

// Services
export interface IAnalyticsService {
  getSummary(userId: string): Promise<any>;
}

export interface IReportService {
  generatePdfReport(userId: string, period: string): Promise<Buffer>;
  exportCsvReport(userId: string, period: string): Promise<string>;
}

// Facades
export interface IAnalyticsFacade {
  getFullAnalyticsReport(userId: string): Promise<any>;
}
