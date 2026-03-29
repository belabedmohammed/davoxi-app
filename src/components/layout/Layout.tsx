import { memo, useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Sidebar, DRAWER_WIDTH } from './Sidebar';
import { BusinessProvider } from '../../context/BusinessContext';

export const Layout = memo(function Layout() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileClose = useCallback(() => setMobileOpen(false), []);
  const handleMobileToggle = useCallback(() => setMobileOpen(prev => !prev), []);

  return (
    <BusinessProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Sidebar mobileOpen={mobileOpen} onMobileClose={handleMobileClose} />

        {/* Mobile header bar */}
        {isMobile && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1100,
              bgcolor: '#fafafa',
              borderBottom: '1px solid',
              borderColor: 'divider',
              px: 1.5,
              py: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IconButton onClick={handleMobileToggle} size="small" sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        <Box
          component="main"
          sx={{
            flex: 1,
            ml: isMobile ? 0 : `${DRAWER_WIDTH}px`,
            px: { xs: 2, sm: 3, md: 5 },
            py: 4,
            pt: isMobile ? 8 : 4,
            maxWidth: isMobile ? '100%' : `calc(100% - ${DRAWER_WIDTH}px)`,
          }}
        >
          <Box
            key={location.pathname}
            sx={{
              maxWidth: 1120,
              mx: 'auto',
              animation: 'fadeIn 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </BusinessProvider>
  );
});
