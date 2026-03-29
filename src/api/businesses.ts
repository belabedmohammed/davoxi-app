import { api } from './client';
import type { Business, CreateBusinessPayload, UpdateBusinessPayload } from '../types';

export const businessApi = {
  list: () => api.get<Business[]>('/businesses'),
  get: (id: string) => api.get<Business>(`/businesses/${id}`),
  create: (data: CreateBusinessPayload) => api.post<Business>('/businesses', data),
  update: (id: string, data: UpdateBusinessPayload) => api.put<Business>(`/businesses/${id}`, data),
  delete: (id: string) => api.del<{ deleted: boolean }>(`/businesses/${id}`),
};
