import { api } from './client';
import type { ApiKeyItem, CreateKeyResponse } from '../types';

export const apiKeysApi = {
  list: () => api.get<ApiKeyItem[]>('/api-keys'),
  create: (name: string) => api.post<CreateKeyResponse>('/api-keys', { name }),
  revoke: (prefix: string) => api.del<{ ok: boolean }>(`/api-keys/${prefix}`),
};
