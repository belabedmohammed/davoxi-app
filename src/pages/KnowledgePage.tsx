import { useState, useCallback } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Grid, Alert, alpha, Chip } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { useBusiness } from '../context/BusinessContext';
import { businessApi } from '../api/businesses';
import { buildPromptFromBusinessInfo } from '../api/promptAi';
import { useMutation } from '../hooks/useApi';
import { PageHeader } from '../components/common/PageHeader';
import { LoadingState } from '../components/common/LoadingState';
import type { UpdateBusinessPayload } from '../types';

export default function KnowledgePage() {
  const { activeBusiness, loading, refetch } = useBusiness();
  const [description, setDescription] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [saved, setSaved] = useState(false);

  // Initialize description from business data
  if (activeBusiness && !initialized) {
    // Extract description from prompt (everything after the template part)
    const prompt = activeBusiness.voice_config?.personality_prompt || '';
    const infoMarker = 'Additional business information:';
    const infoIdx = prompt.indexOf(infoMarker);
    if (infoIdx >= 0) {
      const guidelinesMarker = 'IMPORTANT GUIDELINES:';
      const guidelinesIdx = prompt.indexOf(guidelinesMarker, infoIdx);
      const extracted = prompt.substring(infoIdx + infoMarker.length, guidelinesIdx >= 0 ? guidelinesIdx : undefined).trim();
      setDescription(extracted);
    }
    setInitialized(true);
  }

  const updateBiz = useMutation(
    (payload: UpdateBusinessPayload) => businessApi.update(activeBusiness!.business_id, payload),
  );

  const handleSave = useCallback(async () => {
    if (!activeBusiness) return;
    setSaved(false);
    const prompt = buildPromptFromBusinessInfo(
      activeBusiness.name,
      '', // type not stored, use default
      description,
    );
    try {
      await updateBiz.mutate({
        voice_config: {
          ...activeBusiness.voice_config,
          personality_prompt: prompt,
        },
      });
      setSaved(true);
      refetch();
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // handled by useMutation
    }
  }, [activeBusiness, description, updateBiz, refetch]);

  if (loading) return <LoadingState message="Loading business details..." />;

  if (!activeBusiness) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography sx={{ color: '#9ca3af' }}>No business selected. Please set up your business first.</Typography>
      </Box>
    );
  }

  return (
    <>
      <PageHeader
        title="Knowledge"
        subtitle="Tell your AI receptionist what to know about your business"
      />

      {saved && <Alert severity="success" sx={{ mb: 3 }}>Changes saved! Your AI receptionist has been updated.</Alert>}
      {updateBiz.error && <Alert severity="error" sx={{ mb: 3 }}>{updateBiz.error}</Alert>}

      <Grid container spacing={3}>
        {/* Business Info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '1.0625rem', fontWeight: 650, color: '#0f0f1a', mb: 0.5 }}>
                Business Details
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
                Describe your business — services, hours, policies, common questions.
                Your AI receptionist uses this to answer calls.
              </Typography>
              <TextField
                fullWidth multiline rows={12}
                value={description}
                onChange={e => { setDescription(e.target.value); setSaved(false); }}
                placeholder={`Add information about your business, for example:\n\nBusiness hours: Monday-Friday 9am-6pm, Saturday 10am-4pm\n\nServices we offer:\n- Haircuts ($30-$50)\n- Color treatments ($80-$150)\n- Beard trims ($20)\n\nOur address: 123 Main St, Suite 100\n\nParking is available behind the building.\n\nWe accept walk-ins but appointments are recommended.\nBook online at www.example.com or call us.`}
              />
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Hours" size="small" variant="outlined" onClick={() => setDescription(d => d + '\n\nBusiness hours: ')} />
                <Chip label="Services" size="small" variant="outlined" onClick={() => setDescription(d => d + '\n\nServices we offer:\n- ')} />
                <Chip label="Pricing" size="small" variant="outlined" onClick={() => setDescription(d => d + '\n\nPricing:\n- ')} />
                <Chip label="Address" size="small" variant="outlined" onClick={() => setDescription(d => d + '\n\nOur address: ')} />
                <Chip label="FAQ" size="small" variant="outlined" onClick={() => setDescription(d => d + '\n\nFrequently asked questions:\nQ: \nA: ')} />
                <Chip label="Policies" size="small" variant="outlined" onClick={() => setDescription(d => d + '\n\nPolicies:\n- ')} />
              </Box>

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveOutlinedIcon />}
                  onClick={handleSave}
                  disabled={updateBiz.loading}
                >
                  {updateBiz.loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upload Section */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '1.0625rem', fontWeight: 650, color: '#0f0f1a', mb: 0.5 }}>
                Upload Files
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
                Upload menus, brochures, or any documents about your business.
              </Typography>
              <Box
                sx={{
                  border: `2px dashed ${alpha('#1a1a2e', 0.15)}`,
                  borderRadius: '12px',
                  p: 4,
                  textAlign: 'center',
                  bgcolor: alpha('#1a1a2e', 0.01),
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: alpha('#1a1a2e', 0.3),
                    bgcolor: alpha('#1a1a2e', 0.02),
                  },
                }}
              >
                <CloudUploadOutlinedIcon sx={{ fontSize: 36, color: '#9ca3af', mb: 1 }} />
                <Typography sx={{ fontWeight: 550, fontSize: '0.875rem', color: '#374151', mb: 0.5 }}>
                  Drop files here
                </Typography>
                <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                  PDF, DOC, TXT, or images
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#b0b4bb', textAlign: 'center' }}>
                Coming soon — file upload support
              </Typography>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card sx={{ mt: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '0.9375rem', fontWeight: 650, color: '#0f0f1a', mb: 1.5 }}>
                Tips
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  'Include your business hours and holidays',
                  'List your most popular services with prices',
                  'Add answers to common customer questions',
                  'Mention your booking or appointment process',
                ].map(tip => (
                  <Typography key={tip} variant="body2" sx={{ color: '#6b7280', display: 'flex', gap: 1 }}>
                    <span style={{ color: '#059669' }}>&#10003;</span> {tip}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
