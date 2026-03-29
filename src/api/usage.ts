import { api } from './client';
import type { UsageSummary } from '../types';

export interface UsageResponse {
  org_id: string;
  period: string;
  daily: {
    org_id: string;
    period: string;
    calls: number;
    minutes: number;
    api_requests: number;
    cost_cents: number;
  }[];
  totals: {
    calls: number;
    minutes: number;
    api_requests: number;
    cost_cents: number;
  };
}

export const usageApi = {
  getUsage: () => api.get<UsageResponse>('/usage'),
  getSummary: () => api.get<UsageSummary>('/usage/summary'),
};
