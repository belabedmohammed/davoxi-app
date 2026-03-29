import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, alpha } from '@mui/material';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#fafbfc',
        px: 3,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '20px',
          bgcolor: alpha('#1a1a2e', 0.06),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <SearchOffOutlinedIcon sx={{ fontSize: 36, color: '#9ca3af' }} />
      </Box>
      <Typography
        sx={{
          fontSize: '3rem',
          fontWeight: 800,
          color: '#0f0f1a',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          mb: 1,
        }}
      >
        404
      </Typography>
      <Typography
        sx={{
          fontSize: '1.25rem',
          fontWeight: 650,
          color: '#0f0f1a',
          letterSpacing: '-0.02em',
          mb: 1,
        }}
      >
        Page not found
      </Typography>
      <Typography
        sx={{
          color: '#9ca3af',
          fontSize: '0.9375rem',
          maxWidth: 400,
          mb: 4,
        }}
      >
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/', { replace: true })}
        sx={{ px: 4 }}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
}
