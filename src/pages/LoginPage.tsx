import { useState, useCallback } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, alpha } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }, [email, password, login, navigate]);

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
            Your AI receptionist that answers calls, books appointments, and delights your customers — 24/7.
          </Typography>
        </Box>
      </Box>

      {/* Right: Form */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafbfc', px: 3 }}>
        <Box sx={{ width: '100%', maxWidth: 380, animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          {/* Mobile logo */}
          <Box sx={{ textAlign: 'center', mb: 5, display: { xs: 'block', md: 'none' } }}>
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
            Welcome back
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: '#9ca3af' }}>
            Sign in to manage your AI receptionist
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
              <Box>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 550, color: '#374151', mb: 0.75 }}>Email</Typography>
                <TextField type="email" fullWidth value={email} onChange={e => setEmail(e.target.value)} placeholder="you@business.com" autoComplete="email" autoFocus />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 550, color: '#374151', mb: 0.75 }}>Password</Typography>
                <TextField type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" />
              </Box>
              <Button type="submit" variant="contained" fullWidth disabled={loading || !email || !password} sx={{ mt: 0.5, py: 1.35, fontSize: '0.9375rem', fontWeight: 600 }}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Box>
          </form>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 4, color: '#9ca3af' }}>
            Don't have an account?{' '}
            <Typography component={Link} to="/signup" sx={{ color: '#1a1a2e', fontWeight: 600, textDecoration: 'none', fontSize: 'inherit', '&:hover': { opacity: 0.7 } }}>
              Get started
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
