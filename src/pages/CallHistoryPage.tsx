import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, alpha } from '@mui/material';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { useBusiness } from '../context/BusinessContext';
import { LoadingState } from '../components/common/LoadingState';

// Mock data - will be replaced with real API when call logs endpoint exists
const MOCK_CALLS: {
  call_id: string;
  caller: string;
  status: 'answered' | 'missed' | 'transferred';
  duration: string;
  time: string;
}[] = [];

export default function CallHistoryPage() {
  const { loading } = useBusiness();

  if (loading) return <LoadingState message="Loading call history..." />;

  const statusColor = (status: string) => {
    switch (status) {
      case 'answered': return { bg: alpha('#059669', 0.1), color: '#059669' };
      case 'missed': return { bg: alpha('#dc2626', 0.1), color: '#dc2626' };
      case 'transferred': return { bg: alpha('#2563eb', 0.1), color: '#2563eb' };
      default: return { bg: alpha('#9ca3af', 0.1), color: '#9ca3af' };
    }
  };

  return (
    <>
      <PageHeader
        title="Call History"
        subtitle="View all incoming calls and transcripts"
      />

      {MOCK_CALLS.length === 0 ? (
        <EmptyState
          icon={HistoryOutlinedIcon}
          title="No calls yet"
          description="When your AI receptionist starts taking calls, they'll appear here with full transcripts."
        />
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Caller</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {MOCK_CALLS.map(call => {
                  const sc = statusColor(call.status);
                  return (
                    <TableRow key={call.call_id} hover sx={{ cursor: 'pointer' }}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 550, fontSize: '0.875rem' }}>{call.caller}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                          size="small"
                          sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{call.duration}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#9ca3af' }}>{call.time}</Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Info */}
      <Box sx={{ mt: 3, p: 2.5, borderRadius: '12px', bgcolor: alpha('#2563eb', 0.04), border: `1px solid ${alpha('#2563eb', 0.1)}` }}>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 550, color: '#2563eb', mb: 0.5 }}>
          Call transcripts
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280' }}>
          Click on any call to see the full conversation transcript between your AI receptionist and the caller.
        </Typography>
      </Box>
    </>
  );
}
