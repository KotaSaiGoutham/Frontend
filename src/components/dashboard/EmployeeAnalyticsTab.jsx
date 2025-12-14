import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Paper,
  Divider,
  useTheme,
  LinearProgress
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { FaArrowUp, FaArrowDown, FaChartPie, FaChartBar, FaWallet } from 'react-icons/fa';

const EmployeeAnalyticsTab = ({ payments }) => {
  const theme = useTheme();

  // --- DATA PROCESSING ---
  const chartData = useMemo(() => {
    // 1. Sort payments chronologically
    const sorted = [...payments].sort((a, b) => {
      const dateA = new Date(a.year, a.month - 1);
      const dateB = new Date(b.year, b.month - 1);
      return dateA - dateB;
    });

    // 2. Prepare Data for Area Chart (Trend)
    const trendData = sorted.map(p => ({
      name: new Date(p.year, p.month - 1).toLocaleString('default', { month: 'short' }),
      amount: p.paidAmount,
      salary: p.salary,
      fullDate: `${p.month}/${p.year}`
    }));

    // 3. Prepare Data for Pie Chart (Status)
    const fullPayments = payments.filter(p => p.paidAmount === p.salary).length;
    const partialPayments = payments.filter(p => p.paidAmount < p.salary).length;
    
    const pieData = [
      { name: 'Full Payment', value: fullPayments, color: '#10b981' }, // Green
      { name: 'Partial', value: partialPayments, color: '#f59e0b' },   // Orange
    ];

    return { trendData, pieData, lastPayment: sorted[sorted.length - 1] };
  }, [payments]);

  // --- UI COMPONENTS ---

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={3} sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e2e8f0' }}>
          <Typography variant="subtitle2" fontWeight="bold" color="textSecondary">{label}</Typography>
          <Box sx={{ mt: 1 }}>
             <Typography variant="body2" color="#6366f1" fontWeight="600">
                Paid: ₹{payload[0].value.toLocaleString()}
             </Typography>
             {payload[1] && (
                <Typography variant="body2" color="#94a3b8">
                    Target: ₹{payload[1].value.toLocaleString()}
                </Typography>
             )}
          </Box>
        </Paper>
      );
    }
    return null;
  };

  if (payments.length === 0) {
      return (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400} flexDirection="column">
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-2130362-1800926.png" alt="No Data" width={200} style={{opacity:0.5}} />
              <Typography variant="h6" color="textSecondary" mt={2}>No analytics data available yet</Typography>
          </Box>
      )
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight="700" color="#1e293b" mb={3}>
        Financial Analytics
      </Typography>

      <Grid>
        
        {/* ROW 1: PAYMENT TREND (Area Chart) */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: 350 }}>
             <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Box p={1} bgcolor="#eef2ff" borderRadius={2} color="#6366f1"><FaChartBar /></Box>
                    <Typography variant="subtitle1" fontWeight="700" color="#334155">Payment Trend</Typography>
                </Box>
                <Typography variant="caption" color="textSecondary">Last 12 Months</Typography>
             </Box>
             
             <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={chartData.trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorPaid)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="salary" 
                    stroke="#cbd5e1" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    fill="transparent" 
                  />
                </AreaChart>
             </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* ROW 1: DISTRIBUTION (Pie Chart) */}
        <Grid item xs={12} md={4}>
           <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: 350, position: 'relative' }}>
             <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Box p={1} bgcolor="#ecfdf5" borderRadius={2} color="#10b981"><FaChartPie /></Box>
                <Typography variant="subtitle1" fontWeight="700" color="#334155">Payment Consistency</Typography>
             </Box>
             
             <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={chartData.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
             </ResponsiveContainer>

             <Box position="absolute" top="45%" left="0" right="0" textAlign="center">
                <Typography variant="h4" fontWeight="800" color="#1e293b">{chartData.pieData[0].value}</Typography>
                <Typography variant="caption" color="textSecondary" fontWeight="600">On Time</Typography>
             </Box>
           </Paper>
        </Grid>

        {/* ROW 2: Quarterly Analysis Bar */}
        <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#1e293b', color: 'white' }}>
                 <Grid container alignItems="center">
                    <Grid item xs={12} md={4}>
                        <Box p={2}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Quarterly Performance</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.7, mb: 3 }}>
                                Your payment consistency is excellent. You have maintained a 100% full payment ratio for the last 3 quarters.
                            </Typography>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Box>
                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>Avg. Quarterly</Typography>
                                    <Typography variant="h5" fontWeight="bold">₹21,000</Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                                <Box>
                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>Growth</Typography>
                                    <Box display="flex" alignItems="center" color="#4ade80">
                                        <FaArrowUp size={12} />
                                        <Typography variant="body1" fontWeight="bold" ml={0.5}>5%</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Box height={200} width="100%">
                             <ResponsiveContainer>
                                <BarChart data={chartData.trendData.slice(-6)}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                                    <RechartsTooltip 
                                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: 8 }}
                                    />
                                    <Bar dataKey="amount" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                             </ResponsiveContainer>
                        </Box>
                    </Grid>
                 </Grid>
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeAnalyticsTab;