export interface MarketAnalysis {
  bullishScore: number;
  bearishScore: number;
  breakoutScore: number;
  fakeoutRiskScore: number;
  confidenceScore: number;
  trendStrengthScore: number;
  volatilityScore: number;
  momentumScore: number;
  summary: string;
  reasons: string[];
}
