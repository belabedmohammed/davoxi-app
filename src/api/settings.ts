import { api } from './client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  org_id: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface OrgProfile {
  org_id: string;
  name: string;
  plan_id: string;
  owner_id: string;
  business_ids: string[];
  created_at: string;
}

export const settingsApi = {
  getProfile: () => api.get<UserProfile>('/users/me'),
  updateProfile: (data: { name?: string }) => api.put<UserProfile>('/users/me', data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put<{ ok: boolean }>('/users/me/password', {
      current_password: currentPassword,
      new_password: newPassword,
    }),
  deleteAccount: (password: string) => api.del<{ ok: boolean }>('/users/me', { password }),
  getOrg: () => api.get<OrgProfile>('/orgs/current'),
  updateOrg: (data: { name?: string }) => api.put<OrgProfile>('/orgs/current', data),
};
