import { memo } from 'react';
import { Box, Typography, alpha } from '@mui/material';

export const LoadingState = memo(function LoadingState({ message }: { message?: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 14,
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, mb: message ? 3 : 0 }}>
        {[0, 1, 2].map(i => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: alpha('#1a1a2e', 0.25),
              animation: 'gentlePulse 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </Box>
      {message && (
        <Typography variant="body2" sx={{ color: '#9ca3af', fontWeight: 450, fontSize: '0.8125rem' }}>
          {message}
        </Typography>
      )}
    </Box>
  );
});
