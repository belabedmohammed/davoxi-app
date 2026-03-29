import { memo } from 'react';
import { Card, CardContent, Box, Typography, alpha } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';

interface Props {
  label: string;
  value: string | number;
  icon: SvgIconComponent;
  color: string;
  onClick?: () => void;
}

export const StatCard = memo(function StatCard({ label, value, icon: Icon, color, onClick }: Props) {
  return (
    <Card
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          borderColor: alpha(color, 0.2),
          boxShadow: `0 8px 24px ${alpha(color, 0.06)}`,
          transform: 'translateY(-2px)',
        } : {},
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#9ca3af', letterSpacing: '0.01em', mb: 1 }}>
              {label}
            </Typography>
            <Typography sx={{ fontSize: '2.25rem', fontWeight: 750, color: '#0f0f1a', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{
            width: 44, height: 44, borderRadius: '12px',
            bgcolor: alpha(color, 0.08),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon sx={{ fontSize: 22, color }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});
