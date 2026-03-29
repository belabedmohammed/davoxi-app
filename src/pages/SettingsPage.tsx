import { useState, useCallback } from 'react';
import {
  Box, Typography, TextField, Button, Card, CardContent, Grid, Alert,
  MenuItem, Select, Accordion, AccordionSummary, AccordionDetails, alpha,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useBusiness } from '../context/BusinessContext';
import { useAuth } from '../context/AuthContext';
import { businessApi } from '../api/businesses';
import { settingsApi } from '../api/settings';
import { apiKeysApi } from '../api/apiKeys';
import { useApi, useMutation } from '../hooks/useApi';
import { PageHeader } from '../components/common/PageHeader';
import { LoadingState } from '../components/common/LoadingState';
import type { ApiKeyItem, CreateKeyResponse } from '../types';

const VOICES = [
  { id: 'alloy', label: 'Alloy — Warm & professional' },
  { id: 'nova', label: 'Nova — Friendly & energetic' },
  { id: 'echo', label: 'Echo — Calm & reassuring' },
  { id: 'shimmer', label: 'Shimmer — Clear & confident' },
];

const LANGUAGES = [
  { id: 'en-US', label: 'English (US)' },
  { id: 'en-GB', label: 'English (UK)' },
  { id: 'es-ES', label: 'Spanish' },
  { id: 'fr-FR', label: 'French' },
  { id: 'de-DE', label: 'German' },
  { id: 'ar-SA', label: 'Arabic' },
];

const fetchKeys = () => apiKeysApi.list();

export default function SettingsPage() {
  const { activeBusiness, loading, refetch } = useBusiness();
  const { user, updateProfile } = useAuth();

  // Business settings
  const [bizName, setBizName] = useState('');
  const [voice, setVoice] = useState('');
  const [language, setLanguage] = useState('');
  const [bizInit, setBizInit] = useState(false);
  const [bizSaved, setBizSaved] = useState(false);

  // Profile settings
  const [profileName, setProfileName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // API Keys
  const { data: apiKeys, refetch: refetchKeys } = useApi(fetchKeys);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<CreateKeyResponse | null>(null);

  // Init from business
  if (activeBusiness && !bizInit) {
    setBizName(activeBusiness.name);
    setVoice(activeBusiness.voice_config?.voice || 'alloy');
    setLanguage(activeBusiness.voice_config?.language || 'en-US');
    setBizInit(true);
  }

  const updateBiz = useMutation(
    () => businessApi.update(activeBusiness!.business_id, {
      name: bizName,
      voice_config: {
        ...activeBusiness!.voice_config,
        voice,
        language,
      },
    }),
  );

  const handleSaveBusiness = useCallback(async () => {
    setBizSaved(false);
    try {
      await updateBiz.mutate();
      setBizSaved(true);
      refetch();
      setTimeout(() => setBizSaved(false), 3000);
    } catch { /* handled */ }
  }, [updateBiz, refetch]);

  const updateProfileMut = useMutation(
    () => settingsApi.updateProfile({ name: profileName }),
  );

  const changePasswordMut = useMutation(
    () => settingsApi.changePassword(currentPassword, newPassword),
  );

  const handleSaveProfile = useCallback(async () => {
    setProfileSaved(false);
    try {
      await updateProfileMut.mutate();
      updateProfile({ name: profileName });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch { /* handled */ }
  }, [updateProfileMut, profileName, updateProfile]);

  const handleChangePassword = useCallback(async () => {
    try {
      await changePasswordMut.mutate();
      setCurrentPassword('');
      setNewPassword('');
    } catch { /* handled */ }
  }, [changePasswordMut]);

  const createKeyMut = useMutation(
    (name: string) => apiKeysApi.create(name),
  );

  const handleCreateKey = useCallback(async () => {
    try {
      const key = await createKeyMut.mutate(newKeyName.trim());
      setCreatedKey(key);
      setNewKeyName('');
      refetchKeys();
    } catch { /* handled */ }
  }, [createKeyMut, newKeyName, refetchKeys]);

  const revokeKeyMut = useMutation(
    (prefix: string) => apiKeysApi.revoke(prefix),
  );

  const handleRevokeKey = useCallback(async (prefix: string) => {
    try {
      await revokeKeyMut.mutate(prefix);
      refetchKeys();
    } catch { /* handled */ }
  }, [revokeKeyMut, refetchKeys]);

  if (loading) return <LoadingState />;

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your business and account settings" />

      <Grid container spacing={3}>
        {/* Business Settings */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '1.0625rem', fontWeight: 650, color: '#0f0f1a', mb: 3 }}>
                Business
              </Typography>

              {bizSaved && <Alert severity="success" sx={{ mb: 2 }}>Business settings saved!</Alert>}
              {updateBiz.error && <Alert severity="error" sx={{ mb: 2 }}>{updateBiz.error}</Alert>}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 550, color: '#374151', mb: 0.75 }}>Business Name</Typography>
                  <TextField fullWidth value={bizName} onChange={e => setBizName(e.target.value)} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 550, color: '#374151', mb: 0.75 }}>Voice</Typography>
                  <Select fullWidth size="small" value={voice} onChange={e => setVoice(e.target.value)} sx={{ borderRadius: '10px' }}>
                    {VOICES.map(v => <MenuItem key={v.id} value={v.id}>{v.label}</MenuItem>)}
                  </Select>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 550, color: '#374151', mb: 0.75 }}>Language</Typography>
                  <Select fullWidth size="small" value={language} onChange={e => setLanguage(e.target.value)} sx={{ borderRadius: '10px' }}>
                    {LANGUAGES.map(l => <MenuItem key={l.id} value={l.id}>{l.label}</MenuItem>)}
                  </Select>
                </Box>
                <Button
                  variant="contained" startIcon={<SaveOutlinedIcon />}
                  onClick={handleSaveBusiness} disabled={updateBiz.loading}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {updateBiz.loading ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Account */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '1.0625rem', fontWeight: 650, color: '#0f0f1a', mb: 3 }}>
                Account
              </Typography>

              {profileSaved && <Alert severity="success" sx={{ mb: 2 }}>Profile updated!</Alert>}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 550, color: '#374151', mb: 0.75 }}>Your Name</Typography>
                  <TextField fullWidth value={profileName} onChange={e => setProfileName(e.target.value)} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 550, color: '#374151', mb: 0.75 }}>Email</Typography>
                  <TextField fullWidth value={user?.email || ''} disabled />
                </Box>
                <Button
                  variant="outlined" startIcon={<SaveOutlinedIcon />}
                  onClick={handleSaveProfile} disabled={updateProfileMut.loading}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Update Profile
                </Button>
              </Box>

              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f0f1a', mb: 2 }}>
                  Change Password
                </Typography>
                {changePasswordMut.error && <Alert severity="error" sx={{ mb: 2 }}>{changePasswordMut.error}</Alert>}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    type="password" size="small" placeholder="Current password"
                    value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                    autoComplete="off"
                    inputProps={{ autoComplete: 'off' }}
                    sx={{ flex: 1, minWidth: 200 }}
                  />
                  <TextField
                    type="password" size="small" placeholder="New password"
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    inputProps={{ autoComplete: 'new-password' }}
                    sx={{ flex: 1, minWidth: 200 }}
                  />
                  <Button
                    variant="outlined" size="small"
                    onClick={handleChangePassword}
                    disabled={changePasswordMut.loading || !currentPassword || !newPassword}
                  >
                    Change
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Developer Section */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Accordion
            sx={{
              border: `1px solid ${alpha('#e5e7eb', 0.8)}`,
              borderRadius: '14px !important',
              '&::before': { display: 'none' },
              boxShadow: 'none',
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CodeOutlinedIcon sx={{ fontSize: 20, color: '#9ca3af' }} />
                <Box>
                  <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f0f1a' }}>Developer</Typography>
                  <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>API keys for integrations</Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <TextField
                  size="small" fullWidth placeholder="Key name"
                  value={newKeyName} onChange={e => setNewKeyName(e.target.value)}
                />
                <Button
                  variant="contained" size="small"
                  onClick={handleCreateKey}
                  disabled={!newKeyName.trim() || createKeyMut.loading}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Create Key
                </Button>
              </Box>

              {(apiKeys as ApiKeyItem[] | null)?.length ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Key</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(apiKeys as ApiKeyItem[]).map(k => (
                        <TableRow key={k.prefix}>
                          <TableCell>{k.name}</TableCell>
                          <TableCell><code>{k.prefix}...</code></TableCell>
                          <TableCell align="right">
                            <Tooltip title="Revoke">
                              <IconButton size="small" onClick={() => handleRevokeKey(k.prefix)}>
                                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" sx={{ color: '#9ca3af', textAlign: 'center', py: 2 }}>
                  No API keys yet
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      {/* Created Key Dialog */}
      <Dialog open={Boolean(createdKey)} onClose={() => setCreatedKey(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>API Key Created</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Copy this key now. You won't be able to see it again.
          </Alert>
          <Box sx={{
            p: 2, bgcolor: '#f3f4f6', borderRadius: '10px',
            fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all',
            display: 'flex', alignItems: 'center', gap: 1,
          }}>
            <Typography sx={{ flex: 1, fontFamily: 'monospace', fontSize: '0.8125rem' }}>
              {createdKey?.key}
            </Typography>
            <IconButton
              size="small"
              onClick={() => { if (createdKey?.key) navigator.clipboard.writeText(createdKey.key); }}
            >
              <ContentCopyIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="contained" onClick={() => setCreatedKey(null)}>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
