import { memo, useState } from 'react';
import { Box, Typography, Menu, MenuItem, alpha } from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import CheckIcon from '@mui/icons-material/Check';
import { useBusiness } from '../../context/BusinessContext';

export const BusinessSwitcher = memo(function BusinessSwitcher() {
  const { businesses, activeBusiness, setActiveBusinessId } = useBusiness();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // Don't show switcher if 0 or 1 business
  if (businesses.length <= 1) return null;

  const businessCount = `${businesses.length} ${businesses.length === 1 ? 'business' : 'businesses'}`;

  return (
    <>
      <Box
        onClick={e => setAnchorEl(e.currentTarget)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.75,
          mx: 1.25,
          mb: 1,
          borderRadius: '10px',
          cursor: 'pointer',
          bgcolor: alpha('#1a1a2e', 0.03),
          border: `1px solid ${alpha('#e5e7eb', 0.6)}`,
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: alpha('#1a1a2e', 0.05),
            borderColor: alpha('#e5e7eb', 1),
          },
        }}
      >
        <Box sx={{
          width: 28, height: 28, borderRadius: '8px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #3a3a5e 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.6875rem', fontWeight: 700, color: '#fff',
        }}>
          {activeBusiness?.name?.charAt(0).toUpperCase() || 'B'}
        </Box>
        <Typography sx={{
          flex: 1, fontSize: '0.8125rem', fontWeight: 600, color: '#0f0f1a',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {activeBusiness?.name || 'Select business'}
        </Typography>
        <Typography sx={{ fontSize: '0.625rem', color: '#9ca3af', mr: 0.5 }}>{businessCount}</Typography>
        <UnfoldMoreIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: { minWidth: 220, borderRadius: '12px', mt: 0.5 },
          },
        }}
      >
        {businesses.map(b => (
          <MenuItem
            key={b.business_id}
            selected={b.business_id === activeBusiness?.business_id}
            onClick={() => { setActiveBusinessId(b.business_id); setAnchorEl(null); }}
            sx={{ fontSize: '0.8125rem', py: 1, gap: 1 }}
          >
            <Typography sx={{ flex: 1, fontSize: 'inherit', fontWeight: b.business_id === activeBusiness?.business_id ? 600 : 400 }}>
              {b.name}
            </Typography>
            {b.business_id === activeBusiness?.business_id && (
              <CheckIcon sx={{ fontSize: 16, color: '#059669' }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
});
