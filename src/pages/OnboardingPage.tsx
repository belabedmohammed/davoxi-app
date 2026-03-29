import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Card, CardContent, Grid, alpha, LinearProgress, Chip,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SpaIcon from '@mui/icons-material/Spa';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GavelIcon from '@mui/icons-material/Gavel';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { businessApi } from '../api/businesses';
import { buildPromptFromBusinessInfo } from '../api/promptAi';
import { useMutation } from '../hooks/useApi';
import type { CreateBusinessPayload } from '../types';

const BUSINESS_TYPES = [
  { id: 'restaurant', label: 'Restaurant', icon: RestaurantIcon },
  { id: 'salon', label: 'Salon & Spa', icon: SpaIcon },
  { id: 'clinic', label: 'Medical Clinic', icon: LocalHospitalIcon },
  { id: 'dental', label: 'Dental Office', icon: MedicalServicesIcon },
  { id: 'auto', label: 'Auto Shop', icon: DirectionsCarIcon },
  { id: 'legal', label: 'Law Office', icon: GavelIcon },
  { id: 'realestate', label: 'Real Estate', icon: HomeIcon },
  { id: 'other', label: 'Other', icon: StoreIcon },
];

const VOICES = [
  { id: 'alloy', label: 'Alloy', desc: 'Warm & professional' },
  { id: 'nova', label: 'Nova', desc: 'Friendly & energetic' },
  { id: 'echo', label: 'Echo', desc: 'Calm & reassuring' },
  { id: 'shimmer', label: 'Shimmer', desc: 'Clear & confident' },
];

const STEPS = ['Business Info', 'Details', 'Voice', 'Ready'];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [description, setDescription] = useState('');
  const [voice, setVoice] = useState('alloy');
  const [language] = useState('en-US');

  const createBusiness = useMutation(
    (payload: CreateBusinessPayload) => businessApi.create(payload),
  );

  const handleFinish = useCallback(async () => {
    const prompt = buildPromptFromBusinessInfo(businessName, businessType, description);
    const payload: CreateBusinessPayload = {
      name: businessName,
      phone_numbers: [],
      voice_config: {
        voice,
        language,
        personality_prompt: prompt,
      },
      master_config: {
        temperature: 0.3,
        max_specialists_per_turn: 5,
      },
    };

    try {
      await createBusiness.mutate(payload);
      navigate('/', { replace: true });
    } catch {
      // error is handled by useMutation
    }
  }, [businessName, businessType, description, voice, language, createBusiness, navigate]);

  const canProceed = () => {
    if (step === 0) return businessName.trim() && businessType;
    if (step === 1) return true; // description is optional
    if (step === 2) return voice;
    return true;
  };

  return (
    <Box sx={{
      minHeight: '100vh', bgcolor: '#fafbfc',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      px: 3, py: 6,
    }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 5, maxWidth: 500 }}>
        <Box sx={{
          width: 48, height: 48, borderRadius: '14px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 3,
          boxShadow: `0 4px 12px ${alpha('#1a1a2e', 0.2)}`,
        }}>
          <PhoneOutlinedIcon sx={{ color: '#fff', fontSize: 22 }} />
        </Box>
        <Typography sx={{ fontSize: '1.75rem', fontWeight: 750, color: '#0f0f1a', letterSpacing: '-0.035em', mb: 0.5 }}>
          Set up your AI receptionist
        </Typography>
        <Typography sx={{ color: '#9ca3af', fontSize: '0.9375rem' }}>
          Tell us about your business and we'll handle the rest.
        </Typography>
      </Box>

      {/* Progress */}
      <Box sx={{ width: '100%', maxWidth: 560, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          {STEPS.map((s, i) => (
            <Typography
              key={s}
              sx={{
                fontSize: '0.6875rem', fontWeight: i <= step ? 600 : 400,
                color: i <= step ? '#0f0f1a' : '#9ca3af',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}
            >
              {s}
            </Typography>
          ))}
        </Box>
        <LinearProgress
          variant="determinate"
          value={((step + 1) / STEPS.length) * 100}
          sx={{ borderRadius: 6, height: 4 }}
        />
      </Box>

      {/* Step Content */}
      <Box sx={{ width: '100%', maxWidth: 560, animation: 'fadeIn 0.3s ease' }}>
        {step === 0 && (
          <Box>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 650, color: '#0f0f1a', mb: 3 }}>
              What's your business?
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 550, color: '#374151', mb: 0.75 }}>Business Name</Typography>
              <TextField
                fullWidth value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g. Mario's Pizza, Serenity Spa"
                autoFocus
              />
            </Box>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 550, color: '#374151', mb: 1.5 }}>Business Type</Typography>
            <Grid container spacing={1.5}>
              {BUSINESS_TYPES.map(bt => (
                <Grid size={{ xs: 6, sm: 3 }} key={bt.id}>
                  <Card
                    onClick={() => setBusinessType(bt.id)}
                    sx={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      borderColor: businessType === bt.id ? '#1a1a2e' : undefined,
                      bgcolor: businessType === bt.id ? alpha('#1a1a2e', 0.03) : undefined,
                      '&:hover': { borderColor: '#1a1a2e' },
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <bt.icon sx={{ fontSize: 28, color: businessType === bt.id ? '#1a1a2e' : '#9ca3af', mb: 0.5 }} />
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 550, color: businessType === bt.id ? '#0f0f1a' : '#6b7280' }}>
                        {bt.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {step === 1 && (
          <Box>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 650, color: '#0f0f1a', mb: 1 }}>
              Tell us more about {businessName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
              The more details you share, the better your AI receptionist will handle calls.
              You can always update this later.
            </Typography>
            <TextField
              fullWidth multiline rows={6}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={`Tell us about your business. For example:\n\n- What services do you offer?\n- What are your business hours?\n- What's your address?\n- Any special policies callers should know about?\n- Common questions you get from customers?`}
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="Hours" size="small" variant="outlined" onClick={() => setDescription(d => d + '\nBusiness hours: ')} />
              <Chip label="Services" size="small" variant="outlined" onClick={() => setDescription(d => d + '\nOur services include: ')} />
              <Chip label="Address" size="small" variant="outlined" onClick={() => setDescription(d => d + '\nOur address is: ')} />
              <Chip label="Pricing" size="small" variant="outlined" onClick={() => setDescription(d => d + '\nOur pricing: ')} />
            </Box>
          </Box>
        )}

        {step === 2 && (
          <Box>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 650, color: '#0f0f1a', mb: 1 }}>
              Choose a voice for your receptionist
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
              This is how your AI receptionist will sound on the phone.
            </Typography>
            <Grid container spacing={2}>
              {VOICES.map(v => (
                <Grid size={{ xs: 12, sm: 6 }} key={v.id}>
                  <Card
                    onClick={() => setVoice(v.id)}
                    sx={{
                      cursor: 'pointer',
                      borderColor: voice === v.id ? '#1a1a2e' : undefined,
                      bgcolor: voice === v.id ? alpha('#1a1a2e', 0.03) : undefined,
                      '&:hover': { borderColor: '#1a1a2e' },
                    }}
                  >
                    <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 44, height: 44, borderRadius: '12px',
                        bgcolor: voice === v.id ? alpha('#1a1a2e', 0.08) : alpha('#9ca3af', 0.08),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Typography sx={{ fontSize: '1.25rem' }}>
                          {v.id === 'alloy' ? '🎙' : v.id === 'nova' ? '✨' : v.id === 'echo' ? '🌊' : '💎'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 650, fontSize: '0.9375rem', color: '#0f0f1a' }}>{v.label}</Typography>
                        <Typography variant="body2" sx={{ color: '#9ca3af' }}>{v.desc}</Typography>
                      </Box>
                      {voice === v.id && <CheckCircleOutlineIcon sx={{ ml: 'auto', color: '#059669', fontSize: 20 }} />}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {step === 3 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{
              width: 72, height: 72, borderRadius: '20px',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 3,
              boxShadow: `0 8px 24px ${alpha('#059669', 0.25)}`,
            }}>
              <CheckCircleOutlineIcon sx={{ color: '#fff', fontSize: 36 }} />
            </Box>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 750, color: '#0f0f1a', letterSpacing: '-0.03em', mb: 1 }}>
              You're all set!
            </Typography>
            <Typography sx={{ color: '#9ca3af', fontSize: '0.9375rem', maxWidth: 400, mx: 'auto', mb: 1 }}>
              Your AI receptionist for <strong>{businessName}</strong> is ready.
              You can update your business details anytime from the Knowledge page.
            </Typography>
            {createBusiness.error && (
              <Typography sx={{ color: '#dc2626', fontSize: '0.8125rem', mt: 2 }}>
                {createBusiness.error}
              </Typography>
            )}
          </Box>
        )}

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          {step > 0 ? (
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon sx={{ fontSize: '16px !important' }} />}
              onClick={() => setStep(s => s - 1)}
            >
              Back
            </Button>
          ) : <Box />}

          {step < 3 ? (
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon sx={{ fontSize: '16px !important' }} />}
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleFinish}
              disabled={createBusiness.loading}
              sx={{ px: 4 }}
            >
              {createBusiness.loading ? 'Setting up...' : 'Go to Dashboard'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
