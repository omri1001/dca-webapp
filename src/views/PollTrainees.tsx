import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    useTheme,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface IPool {
    _id?: string;
    [key: string]: any; // We'll treat keys loosely (Month, שם מלא, etc.)
}

const PoolsViewByMonthWithFilter: React.FC = () => {
    const [pools, setPools] = useState<IPool[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // We'll store the chosen month in state. "all" means show all months.
    const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');

    const theme = useTheme();

    // 1) Fetch the data once
    useEffect(() => {
        const fetchPools = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/pools');
                const jsonData = await response.json();
                console.log('POOLS DATA:', jsonData.data); // Debug: see actual shape

                if (jsonData.success) {
                    setPools(jsonData.data);
                } else {
                    console.error('API returned success=false', jsonData.error);
                }
            } catch (error) {
                console.error('Failed to fetch /api/pools:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPools();
    }, []);

    // 2) Group data by the "Month" field: { [monthNumber]: IPool[] }
    const poolsByMonth: Record<number, IPool[]> = {};

    pools.forEach((pool) => {
        // your actual data has "Month": 6, etc.
        const m: number = pool['Month'] ?? 0;
        if (!poolsByMonth[m]) {
            poolsByMonth[m] = [];
        }
        poolsByMonth[m].push(pool);
    });

    // 3) Determine all distinct months, sorted ascending
    const allMonths = Object.keys(poolsByMonth)
        .map((m) => Number(m))
        .sort((a, b) => a - b);

    // 4) Decide which months to actually show based on selectedMonth
    let displayedMonths: number[] = [];
    if (selectedMonth === 'all') {
        displayedMonths = allMonths;
    } else {
        displayedMonths = [selectedMonth];
    }

    return (
        <Container sx={{ marginY: 4 }}>
            <Typography variant="h4" gutterBottom>
                Pools Dashboard by Month
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
                Total Pools: {pools.length}
            </Typography>

            {/* Month Filter UI */}
            <Box sx={{ marginBottom: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="month-filter-label">Filter by Month</InputLabel>
                    <Select
                        labelId="month-filter-label"
                        label="Filter by Month"
                        value={selectedMonth}
                        onChange={(e) => {
                            // e.target.value can be number or "all"
                            const value = e.target.value;
                            if (value === 'all') {
                                setSelectedMonth('all');
                            } else {
                                setSelectedMonth(Number(value));
                            }
                        }}
                    >
                        {/* "All months" option */}
                        <MenuItem value="all">All</MenuItem>

                        {/* Each distinct month option */}
                        {allMonths.map((monthNum) => (
                            <MenuItem key={monthNum} value={monthNum}>
                                {monthNum}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {loading && <Typography>Loading data...</Typography>}

            {!loading && pools.length === 0 && (
                <Typography>No pool data found.</Typography>
            )}

            {!loading && pools.length > 0 && (
                <>
                    {/* 5) Render one chart per displayed month */}
                    {displayedMonths.map((monthNumber) => {
                        const monthPools = poolsByMonth[monthNumber] || [];
                        const chartData = monthPools.map((pool) => ({
                            // "שם מלא" in your JSON
                            name: pool['שם מלא'] || 'N/A',
                            // "החלטות והערכת סיכונים" in your JSON
                            decisions: pool['החלטות והערכת סיכונים'] ?? 0
                        }));

                        return (
                            <Paper
                                key={monthNumber}
                                elevation={3}
                                sx={{
                                    padding: 2,
                                    mb: 4,
                                    backgroundColor:
                                        theme.palette.mode === 'dark'
                                            ? theme.palette.grey[800]
                                            : theme.palette.grey[100],
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Month: {monthNumber} (Pools: {monthPools.length})
                                </Typography>

                                <Box sx={{ width: '100%', height: 400 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={chartData}
                                            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke={
                                                    theme.palette.mode === 'dark'
                                                        ? theme.palette.grey[700]
                                                        : '#ccc'
                                                }
                                            />
                                            <XAxis
                                                dataKey="name"
                                                stroke={theme.palette.text.primary}
                                                label={{
                                                    value: 'Participant (שם מלא)',
                                                    position: 'insideBottom',
                                                    offset: -5,
                                                    style: { fill: theme.palette.text.primary },
                                                }}
                                            />
                                            <YAxis
                                                stroke={theme.palette.text.primary}
                                                label={{
                                                    value: 'Decision Score (החלטות)',
                                                    angle: -90,
                                                    position: 'insideLeft',
                                                    style: { fill: theme.palette.text.primary },
                                                }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor:
                                                        theme.palette.mode === 'dark' ? '#333' : '#fff',
                                                }}
                                            />
                                            <Legend
                                                wrapperStyle={{ color: theme.palette.text.primary }}
                                            />
                                            <Bar dataKey="decisions" fill="#8884d8" barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        );
                    })}
                </>
            )}
        </Container>
    );
};

export default PoolsViewByMonthWithFilter;
