import { memo } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const PageHeader = memo(function PageHeader({ title, subtitle, actionLabel, onAction }: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4, pt: 1 }}>
      <Box>
        <Typography
          sx={{
            fontSize: '1.75rem', fontWeight: 750, letterSpacing: '-0.035em', lineHeight: 1.15,
            background: 'linear-gradient(135deg, #0f0f1a 0%, #3a3a5e 100%)',
            backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ mt: 0.5, color: '#9ca3af', fontSize: '0.9375rem' }}>{subtitle}</Typography>
        )}
      </Box>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} size="small">{actionLabel}</Button>
      )}
    </Box>
  );
});
