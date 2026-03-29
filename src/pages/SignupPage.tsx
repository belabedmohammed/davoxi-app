import { useState, useCallback } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, alpha } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await signup(name, email, password, organization);
      navigate('/onboarding', { replace: true });
    } catch {
      setError('Unable to create account. Please try again or use a different email.');
    } finally {
      setLoading(false);
    }
  }, [name, email, password, confirm, organization, signup, navigate]);

  if (user) return <Navigate to="/" replace />;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      {/* Left: Branding */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' }, width: '45%',
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        position: 'relative',
        background: 'linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 50%, #2a2a4e 100%)',
        overflow: 'hidden',
      }}>
        <Box sx={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        <Box sx={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha('#d4a574', 0.08)} 0%, transparent 70%)`,
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        }} />
        <Box sx={{ position: 'relative', textAlign: 'center', px: 6, maxWidth: 420 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '16px',
            background: `linear-gradient(135deg, ${alpha('#fff', 0.12)} 0%, ${alpha('#fff', 0.04)} 100%)`,
            border: `1px solid ${alpha('#fff', 0.1)}`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 3.5,
          }}>
            <PhoneOutlinedIcon sx={{ color: '#fff', fontSize: 26 }} />
          </Box>
          <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, mb: 1.5 }}>
            Davoxi
          </Typography>
          <Typography sx={{ fontSize: '1rem', color: alpha('#fff', 0.5), fontWeight: 400, lineHeight: 1.6 }}>
            Set up your AI receptionist in minutes. No technical skills needed.
          </Typography>
        </Box>
      </Box>

      {/* Right: Form */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafbfc', px: 3, py: 4 }}>
        <Box sx={{ width: '100%', maxWidth: 380, animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          {/* Mobile logo */}
          <Box sx={{ textAlign: 'center', mb: 4, display: { xs: 'block', md: 'none' } }}>
            <Box sx={{
              width: 48, height: 48, borderRadius: '14px',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2,
              boxShadow: `0 4px 12px ${alpha('#1a1a2e', 0.2)}`,
            }}>
              <PhoneOutlinedIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 750, color: '#0f0f1a', letterSpacing: '-0.03em' }}>
              Davoxi
            </Typography>
          </Box>

          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f0f1a', letterSpacing: '-0.03em', mb: 0.5 }}>
            Get started
          </Typography>
          <Typography variant="body2" sx={{ mb: 3.5, color: '#9ca3af' }}>
            Create your account and set up your AI receptionist
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 550, color: '#374151', mb: 0.75 }}>Full Name</Typography>
                <TextField fullWidth value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" autoFocus />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 550, color: '#374151', mb: 0.75 }}>Email</Typography>
                <TextField type="email" fullWidth value={email} onChange={e => setEmail(e.target.value)} placeholder="you@business.com" autoComplete="email" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 550, color: '#374151', mb: 0.75 }}>Business Name</Typography>
                <TextField fullWidth value={organization} onChange={e => setOrganization(e.target.value)} placeholder="Your business name" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 550, color: '#374151', mb: 0.75 }}>Password</Typography>
                <TextField type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" autoComplete="new-password" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 550, color: '#374151', mb: 0.75 }}>Confirm Password</Typography>
                <TextField type="password" fullWidth value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm your password" autoComplete="new-password" />
              </Box>
              <Button type="submit" variant="contained" fullWidth disabled={loading || !name || !email || !password || !confirm} sx={{ mt: 0.5, py: 1.35, fontSize: '0.9375rem', fontWeight: 600 }}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </Box>
          </form>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 3.5, color: '#9ca3af' }}>
            Already have an account?{' '}
            <Typography component={Link} to="/login" sx={{ color: '#1a1a2e', fontWeight: 600, textDecoration: 'none', fontSize: 'inherit', '&:hover': { opacity: 0.7 } }}>
              Sign in
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
