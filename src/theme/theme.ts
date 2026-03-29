import { createTheme, alpha, type Shadows } from '@mui/material/styles';

const palette = {
  ink: '#0f0f1a',
  slate: '#1a1a2e',
  steel: '#3a3a5e',
  graphite: '#374151',
  ash: '#6b7280',
  silver: '#9ca3af',
  mist: '#d1d5db',
  cloud: '#e5e7eb',
  snow: '#f3f4f6',
  pearl: '#f8f9fb',
  white: '#ffffff',
  warmGold: '#d4a574',
  warmGoldLight: '#e8cdb0',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: palette.slate,
      light: palette.steel,
      dark: palette.ink,
      contrastText: palette.white,
    },
    secondary: {
      main: palette.warmGold,
      light: palette.warmGoldLight,
      dark: '#b8884e',
    },
    background: {
      default: palette.pearl,
      paper: palette.white,
    },
    text: {
      primary: palette.ink,
      secondary: palette.ash,
    },
    divider: palette.cloud,
    error: { main: '#dc2626', light: '#fef2f2' },
    success: { main: '#059669', light: '#ecfdf5' },
    warning: { main: '#d97706', light: '#fffbeb' },
    info: { main: '#2563eb', light: '#eff6ff' },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.15, color: palette.ink },
    h2: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.2, color: palette.ink },
    h3: { fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.3, color: palette.ink },
    h4: { fontSize: '1.0625rem', fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.35, color: palette.ink },
    h5: { fontSize: '0.9375rem', fontWeight: 600, lineHeight: 1.4, color: palette.ink },
    h6: { fontSize: '0.6875rem', fontWeight: 600, lineHeight: 1.5, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: palette.silver },
    body1: { fontSize: '0.9375rem', lineHeight: 1.65, color: palette.graphite },
    body2: { fontSize: '0.8125rem', lineHeight: 1.55, color: palette.ash },
    button: { textTransform: 'none' as const, fontWeight: 550, letterSpacing: '0.005em' },
    caption: { fontSize: '0.75rem', color: palette.silver, letterSpacing: '0.01em', lineHeight: 1.5 },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.03)',
    '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
    '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.03)',
    '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -4px rgba(0,0,0,0.03)',
    '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.03)',
    ...Array(19).fill('0 25px 50px -12px rgba(0,0,0,0.1)'),
  ] as Shadows,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        body: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes gentlePulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        '::selection': { backgroundColor: alpha(palette.slate, 0.12), color: palette.ink },
        'html': { scrollBehavior: 'smooth' },
        '::-webkit-scrollbar': { width: '6px', height: '6px' },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': {
          background: palette.cloud,
          borderRadius: '3px',
          '&:hover': { background: palette.mist },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: true },
      styleOverrides: {
        root: { borderRadius: 10, padding: '8px 18px', fontSize: '0.8125rem', fontWeight: 550, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative' as const },
        contained: {
          background: `linear-gradient(135deg, ${palette.slate} 0%, ${palette.ink} 100%)`,
          boxShadow: `0 1px 3px ${alpha(palette.ink, 0.15)}, 0 1px 2px ${alpha(palette.ink, 0.1)}`,
          '&:hover': {
            background: `linear-gradient(135deg, ${palette.steel} 0%, ${palette.slate} 100%)`,
            boxShadow: `0 4px 14px ${alpha(palette.ink, 0.2)}, 0 2px 6px ${alpha(palette.ink, 0.12)}`,
            transform: 'translateY(-1px)',
          },
          '&:active': { transform: 'translateY(0)', boxShadow: `0 1px 3px ${alpha(palette.ink, 0.12)}` },
        },
        outlined: {
          borderColor: palette.cloud,
          color: palette.graphite,
          '&:hover': { borderColor: palette.mist, backgroundColor: alpha(palette.slate, 0.03), transform: 'translateY(-0.5px)' },
        },
        text: {
          color: palette.ash,
          '&:hover': { backgroundColor: alpha(palette.slate, 0.04), color: palette.ink },
        },
        sizeSmall: { padding: '5px 14px', fontSize: '0.8125rem' },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { border: `1px solid ${palette.cloud}`, backgroundImage: 'none' } },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: `1px solid ${alpha(palette.cloud, 0.8)}`,
          borderRadius: 14,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': { borderColor: palette.mist, boxShadow: `0 8px 24px ${alpha(palette.ink, 0.04)}, 0 2px 8px ${alpha(palette.ink, 0.02)}` },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            fontSize: '0.9375rem',
            transition: 'all 0.2s ease',
            '& fieldset': { borderColor: palette.cloud, transition: 'all 0.2s ease' },
            '&:hover fieldset': { borderColor: palette.mist },
            '&.Mui-focused fieldset': { borderColor: palette.slate, borderWidth: 1.5, boxShadow: `0 0 0 3px ${alpha(palette.slate, 0.06)}` },
          },
        },
      },
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 7, fontWeight: 550, fontSize: '0.6875rem', letterSpacing: '0.01em' } } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: alpha(palette.cloud, 0.6), padding: '14px 18px', fontSize: '0.8125rem' },
        head: { fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: palette.silver, backgroundColor: alpha(palette.snow, 0.5), borderBottom: `1px solid ${palette.cloud}` },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { transition: 'background-color 0.15s ease', '&.MuiTableRow-hover:hover': { backgroundColor: alpha(palette.slate, 0.015) } },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 18, border: `1px solid ${palette.cloud}`, boxShadow: `0 24px 48px ${alpha(palette.ink, 0.12)}, 0 8px 16px ${alpha(palette.ink, 0.06)}` },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: palette.ink, fontSize: '0.6875rem', borderRadius: 8, padding: '6px 12px', fontWeight: 500, letterSpacing: '0.01em', boxShadow: `0 8px 16px ${alpha(palette.ink, 0.2)}` },
        arrow: { color: palette.ink },
      },
    },
    MuiIconButton: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: { borderRadius: 10, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', '&:hover': { backgroundColor: alpha(palette.slate, 0.06), transform: 'scale(1.05)' } },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12, fontSize: '0.8125rem', fontWeight: 500, border: '1px solid' },
        standardError: { backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' },
        standardSuccess: { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46' },
        standardWarning: { backgroundColor: '#fffbeb', borderColor: '#fde68a', color: '#92400e' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 6, height: 6, backgroundColor: palette.snow },
        bar: { borderRadius: 6 },
      },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: alpha(palette.cloud, 0.7) } } },
  },
});

export default theme;
