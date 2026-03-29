import { Box, Typography, Card, CardContent, Grid, Chip, alpha } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PhoneForwardedOutlinedIcon from '@mui/icons-material/PhoneForwardedOutlined';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import { useBusiness } from '../context/BusinessContext';
import { PageHeader } from '../components/common/PageHeader';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';

export default function PhonePage() {
  const { activeBusiness, loading } = useBusiness();

  if (loading) return <LoadingState message="Loading phone details..." />;

  const phoneNumbers = activeBusiness?.phone_numbers || [];

  return (
    <>
      <PageHeader
        title="Phone"
        subtitle="Manage your business phone number"
      />

      {phoneNumbers.length === 0 ? (
        <EmptyState
          icon={PhoneOutlinedIcon}
          title="No phone number yet"
          description="Your AI receptionist needs a phone number to start answering calls. Contact support to get set up."
        />
      ) : (
        <Grid container spacing={3}>
          {/* Phone Number Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: '12px',
                    bgcolor: alpha('#059669', 0.08),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <PhoneOutlinedIcon sx={{ fontSize: 22, color: '#059669' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Your Phone Number
                    </Typography>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f0f1a', letterSpacing: '-0.02em' }}>
                      {phoneNumbers[0]}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label="Active" size="small" sx={{ bgcolor: alpha('#059669', 0.1), color: '#059669', fontWeight: 600 }} />
                  <Chip label="AI Answering" size="small" variant="outlined" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Status */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: '12px',
                    bgcolor: alpha('#2563eb', 0.08),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <SignalCellularAltIcon sx={{ fontSize: 22, color: '#2563eb' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Status
                    </Typography>
                    <Typography sx={{ fontSize: '1.0625rem', fontWeight: 650, color: '#059669' }}>
                      Online & Ready
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                  Your AI receptionist is active and answering calls.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Call Forwarding */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: '12px',
                    bgcolor: alpha('#d97706', 0.08),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <PhoneForwardedOutlinedIcon sx={{ fontSize: 22, color: '#d97706' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '1.0625rem', fontWeight: 650, color: '#0f0f1a' }}>
                      Call Forwarding
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                      Forward calls to your personal phone when needed
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#b0b4bb', fontStyle: 'italic' }}>
                  Call forwarding configuration coming soon.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
}
