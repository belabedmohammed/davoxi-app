import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Skeleton, alpha, Alert, Button } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PhoneMissedOutlinedIcon from '@mui/icons-material/PhoneMissedOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../context/BusinessContext';
import { StatCard } from '../components/common/StatCard';
import { EmptyState } from '../components/common/EmptyState';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';

export default function DashboardPage() {
  const { user } = useAuth();
  const { activeBusiness, businesses, loading, error, refetch } = useBusiness();
  const navigate = useNavigate();

  const firstName = useMemo(() => {
    if (!user?.name) return '';
    return user.name.split(' ')[0];
  }, [user]);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  if (!loading && error) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>{error}</Alert>
        <Button variant="outlined" onClick={refetch}>Retry</Button>
      </Box>
    );
  }

  if (!loading && businesses.length === 0) {
    return (
      <EmptyState
        icon={AddBusinessOutlinedIcon}
        title="Set up your AI receptionist"
        description="Get started by telling us about your business. It only takes a few minutes."
        actionLabel="Set up my business"
        onAction={() => navigate('/onboarding')}
      />
    );
  }

  return (
    <>
      {/* Welcome */}
      <Box sx={{ mb: 5, pt: 1 }}>
        <Typography
          sx={{
            fontSize: '1.75rem', fontWeight: 750, letterSpacing: '-0.035em', lineHeight: 1.15,
            background: 'linear-gradient(135deg, #0f0f1a 0%, #3a3a5e 100%)',
            backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}
        >
          {greeting}{firstName ? `, ${firstName}` : ''}
        </Typography>
        <Typography sx={{ mt: 0.5, color: '#9ca3af', fontSize: '0.9375rem' }}>
          {activeBusiness
            ? `Here's how ${activeBusiness.name} is doing today.`
            : "Here's what's happening today."}
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 5 }}>
        {loading ? (
          [0, 1, 2, 3].map(i => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Card sx={{ '&:hover': { transform: 'none' } }}>
                <CardContent sx={{ p: 3 }}>
                  <Skeleton height={14} width={80} sx={{ mb: 1.5 }} />
                  <Skeleton height={36} width={60} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard label="Calls Today" value={0} icon={PhoneOutlinedIcon} color="#2563eb" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard label="Missed Calls" value={0} icon={PhoneMissedOutlinedIcon} color="#dc2626" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard label="Avg Duration" value="0m" icon={TimerOutlinedIcon} color="#d97706" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard label="Satisfaction" value="--" icon={TrendingUpIcon} color="#059669" />
            </Grid>
          </>
        )}
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: '1.0625rem', fontWeight: 650, color: '#0f0f1a', letterSpacing: '-0.01em', mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {[
            { title: 'Update Knowledge', desc: 'Add or edit what your AI receptionist knows', path: '/knowledge', color: '#2563eb' },
            { title: 'View Call History', desc: 'See recent calls and transcripts', path: '/calls', color: '#059669' },
            { title: 'Phone Settings', desc: 'Manage your phone number and forwarding', path: '/phone', color: '#d97706' },
          ].map(action => (
            <Grid size={{ xs: 12, sm: 4 }} key={action.path}>
              <Card
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: alpha(action.color, 0.2),
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 24px ${alpha(action.color, 0.06)}`,
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onClick={() => navigate(action.path)}
              >
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Typography sx={{ fontWeight: 650, fontSize: '0.9375rem', color: '#0f0f1a', letterSpacing: '-0.01em', mb: 0.5 }}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                    {action.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
