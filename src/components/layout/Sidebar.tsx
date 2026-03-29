import { memo, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, alpha,
  Avatar, IconButton, Tooltip, Drawer, useMediaQuery, useTheme,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useAuth } from '../../context/AuthContext';
import { BusinessSwitcher } from './BusinessSwitcher';

const DRAWER_WIDTH = 264;

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: DashboardOutlinedIcon },
  { label: 'Knowledge', path: '/knowledge', icon: MenuBookOutlinedIcon },
  { label: 'Phone', path: '/phone', icon: PhoneOutlinedIcon },
  { label: 'Call History', path: '/calls', icon: HistoryOutlinedIcon },
  { label: 'Settings', path: '/settings', icon: SettingsOutlinedIcon },
] as const;

type NavItem = { label: string; path: string; icon: React.ElementType };

function NavLink({ item, isActive, onClick }: { item: NavItem; isActive: boolean; onClick: () => void }) {
  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        borderRadius: '10px',
        mb: 0.25,
        py: 0.75,
        px: 1.25,
        position: 'relative',
        bgcolor: isActive ? alpha('#1a1a2e', 0.05) : 'transparent',
        '&:hover': { bgcolor: isActive ? alpha('#1a1a2e', 0.07) : alpha('#1a1a2e', 0.025) },
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': isActive ? {
          content: '""', position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)',
          width: 3, height: 20, borderRadius: '0 3px 3px 0', bgcolor: '#1a1a2e',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        } : {
          content: '""', position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)',
          width: 3, height: 0, borderRadius: '0 3px 3px 0', bgcolor: '#1a1a2e',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 32 }}>
        <item.icon sx={{ fontSize: 18, color: isActive ? '#1a1a2e' : '#9ca3af', transition: 'color 0.2s ease' }} />
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        primaryTypographyProps={{
          fontSize: '0.8125rem', fontWeight: isActive ? 600 : 450,
          color: isActive ? '#0f0f1a' : '#6b7280', letterSpacing: '-0.005em',
          sx: { transition: 'all 0.2s ease' },
        }}
      />
    </ListItemButton>
  );
}

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar = memo(function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isActive = useCallback((path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
    if (isMobile) onMobileClose();
  }, [navigate, isMobile, onMobileClose]);

  const initials = useMemo(() => {
    if (!user?.name) return '?';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }, [user?.name]);

  const sidebarContent = (
    <Box
      component="nav"
      sx={{
        width: DRAWER_WIDTH, minWidth: DRAWER_WIDTH, height: '100vh',
        borderRight: isMobile ? 'none' : '1px solid',
        borderColor: alpha('#e5e7eb', 0.7),
        bgcolor: '#fafafa', display: 'flex', flexDirection: 'column',
        boxShadow: isMobile ? undefined : `1px 0 0 ${alpha('#000', 0.02)}`,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          px: 2.5, py: 2.25, display: 'flex', alignItems: 'center', gap: 1.5,
          borderBottom: '1px solid', borderColor: alpha('#e5e7eb', 0.6),
          cursor: 'pointer', transition: 'opacity 0.2s ease',
          '&:hover': { opacity: 0.85 },
        }}
        onClick={() => handleNavigate('/')}
      >
        <Box sx={{
          width: 34, height: 34, borderRadius: '10px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 2px 8px ${alpha('#1a1a2e', 0.2)}`,
        }}>
          <PhoneOutlinedIcon sx={{ color: '#fff', fontSize: 17 }} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 750, color: '#0f0f1a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Davoxi
          </Typography>
          <Typography sx={{ fontSize: '0.5625rem', color: '#b0b4bb', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            For Business
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, px: 1.25, py: 2, overflowY: 'auto' }}>
        <BusinessSwitcher />
        <List disablePadding>
          {NAV_ITEMS.map(item => (
            <NavLink key={item.path} item={item} isActive={isActive(item.path)} onClick={() => handleNavigate(item.path)} />
          ))}
        </List>
      </Box>

      {/* User Section */}
      <Box
        sx={{
          px: 2, py: 1.75, borderTop: '1px solid', borderColor: alpha('#e5e7eb', 0.6),
          display: 'flex', alignItems: 'center', gap: 1.5,
        }}
      >
        <Avatar sx={{
          width: 34, height: 34, fontSize: '0.6875rem', fontWeight: 700,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #3a3a5e 100%)', letterSpacing: '0.02em',
        }}>
          {initials}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{
            fontSize: '0.8125rem', fontWeight: 600, color: '#0f0f1a', lineHeight: 1.2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {user?.name || 'User'}
          </Typography>
          <Typography sx={{
            fontSize: '0.625rem', color: '#9ca3af',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {user?.email || ''}
          </Typography>
        </Box>
        <Tooltip title="Sign out" arrow placement="top">
          <IconButton
            size="small"
            onClick={handleLogout}
            sx={{ color: '#b0b4bb', '&:hover': { color: '#dc2626', bgcolor: alpha('#dc2626', 0.06) } }}
          >
            <LogoutOutlinedIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  // Mobile: use MUI Drawer overlay
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  // Desktop: fixed sidebar
  return (
    <Box sx={{ position: 'fixed', left: 0, top: 0, zIndex: 1200 }}>
      {sidebarContent}
    </Box>
  );
});

export { DRAWER_WIDTH };
