export interface Business {
  business_id: string;
  name: string;
  phone_numbers: string[];
  voice_config: VoiceConfig;
  master_config: MasterConfig;
  created_at: string;
  updated_at: string;
}

export interface VoiceConfig {
  voice: string;
  language: string;
  personality_prompt: string;
}

export interface MasterConfig {
  temperature: number;
  max_specialists_per_turn: number;
}

export type CreateBusinessPayload = {
  name: string;
  phone_numbers: string[];
  voice_config: VoiceConfig;
  master_config: MasterConfig;
};

export type UpdateBusinessPayload = Partial<CreateBusinessPayload>;

// Simplified business types for the app (no AI jargon)
export interface BusinessType {
  id: string;
  label: string;
  icon: string;
  defaultPromptKey: string;
}

export const BUSINESS_TYPES: BusinessType[] = [
  { id: 'restaurant', label: 'Restaurant', icon: 'restaurant', defaultPromptKey: 'restaurant' },
  { id: 'salon', label: 'Salon & Spa', icon: 'spa', defaultPromptKey: 'default' },
  { id: 'clinic', label: 'Medical Clinic', icon: 'local_hospital', defaultPromptKey: 'medical' },
  { id: 'dental', label: 'Dental Office', icon: 'medical_services', defaultPromptKey: 'medical' },
  { id: 'auto', label: 'Auto Shop', icon: 'directions_car', defaultPromptKey: 'default' },
  { id: 'legal', label: 'Law Office', icon: 'gavel', defaultPromptKey: 'default' },
  { id: 'realestate', label: 'Real Estate', icon: 'home', defaultPromptKey: 'default' },
  { id: 'other', label: 'Other', icon: 'store', defaultPromptKey: 'default' },
];

export interface CallRecord {
  call_id: string;
  business_id: string;
  caller_number: string;
  status: 'answered' | 'missed' | 'transferred';
  duration_seconds: number;
  started_at: string;
  ended_at: string;
  transcript?: string;
}

export interface ApiKeyItem {
  prefix: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
}

export interface CreateKeyResponse {
  key: string;
  prefix: string;
  name: string;
  created_at: string;
}

export interface UsageSummary {
  org_id: string;
  period: string;
  plan_id: string;
  minutes: ResourceUsage;
  api_requests: ResourceUsage;
  businesses: ResourceUsage;
  agents: ResourceUsage;
}

export interface ResourceUsage {
  current: number;
  limit: number;
  percent: number;
  unlimited: boolean;
}
