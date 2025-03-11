import React from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    Box,
    useTheme,
} from '@mui/material';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import { IReport } from '../ReportItem';

interface GraphAverageGradePartOneProps {
    reports: IReport[];
}

const GraphAverageGradePartOne: React.FC<GraphAverageGradePartOneProps> = ({ reports }) => {
    const theme = useTheme();

    // Safely parse a grade value (handles strings, numbers, and {$numberDouble}).
    const parseGrade = (grade: any): number => {
        if (typeof grade === 'object' && grade.$numberDouble) {
            return parseFloat(grade.$numberDouble);
        }
        return parseFloat(grade);
    };

    // Step 1: Compute the raw average for part 1 for each report.
    //         (We do not multiply by anything yet; just get the actual average.)
    const rawData = reports.map(report => {
        let sum = 0;
        let count = 0;

        // Check part 1 in grade1
        const parts1 = report.data?.grades?.grade1?.scoreData?.parts;
        if (Array.isArray(parts1) && parts1[0]?.gradeOfPart !== undefined) {
            const val = parseGrade(parts1[0].gradeOfPart);
            if (!isNaN(val)) {
                sum += val;
                count++;
            }
        }

        // Check part 1 in grade2
        const parts2 = report.data?.grades?.grade2?.scoreData?.parts;
        if (Array.isArray(parts2) && parts2[0]?.gradeOfPart !== undefined) {
            const val = parseGrade(parts2[0].gradeOfPart);
            if (!isNaN(val)) {
                sum += val;
                count++;
            }
        }

        // Raw average (no scaling).
        const rawAvg = count > 0 ? sum / count : 0;

        // Label for the X-axis: gdod + pluga if available, else fallback.
        const gdod = report.gdod || '';
        const pluga = report.pluga?.trim();
        const name = gdod ? (pluga ? `${gdod} ${pluga}` : gdod) : (report.primaryKey || report._id);

        return { name, rawAvg };
    });

    // Step 2: Find the maximum raw average across all reports.
    const rawMax = rawData.reduce((max, item) => (item.rawAvg > max ? item.rawAvg : max), 0);

    // Step 3: Scale each raw average so that rawMax maps to 33.3
    //         scaledValue = rawValue * (33.3 / rawMax)
    //         If rawMax == 0, everything stays 0.
    const scaledData = rawData.map(item => {
        const scaledValue =
            rawMax > 0 ? parseFloat((item.rawAvg * (33.3 / rawMax)).toFixed(2)) : 0;
        return { name: item.name, value: scaledValue };
    });

    // Compute the overall raw average, then scale it too.
    const overallRawSum = rawData.reduce((acc, cur) => acc + cur.rawAvg, 0);
    const overallRawAvg = rawData.length > 0 ? overallRawSum / rawData.length : 0;
    const overallScaled =
        rawMax > 0 ? parseFloat((overallRawAvg * (33.3 / rawMax)).toFixed(2)) : 0;

    // Append an extra data point for the overall average.
    scaledData.push({ name: 'ממוצע חלק 1', value: overallScaled });

    return (
        <Card
            sx={{
                maxWidth: 800,
                mx: 'auto',
                mt: 3,
                boxShadow: 3,
                backgroundColor: '#333',
                color: '#fff',
            }}
        >
            <CardHeader
                title="ציון חלק 1 לכל דוח וממוצע"
                titleTypographyProps={{
                    variant: 'h6',
                    align: 'center',
                    fontWeight: 'bold',
                }}
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    py: 1.5,
                }}
            />
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                        data={scaledData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        barCategoryGap="20%"
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#fff' }}
                            interval={0}
                            axisLine={{ stroke: '#999' }}
                            tickLine={{ stroke: '#999' }}
                            dy={8}
                        />
                        <YAxis
                            type="number"
                            domain={[33.3]}  // Force the max to 33.3
                            allowDecimals
                            allowDataOverflow
                            tick={{ fontSize: 14, fill: '#fff' }}
                            axisLine={{ stroke: '#999' }}
                            tickLine={{ stroke: '#999' }}
                        />
                        <Tooltip
                            formatter={(value: number) => value.toString()}
                            contentStyle={{
                                backgroundColor: '#444',
                                border: '1px solid #666',
                                color: '#fff',
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: 14, color: '#fff' }}
                            align="center"
                            verticalAlign="top"
                            iconSize={14}
                        />
                        <Bar
                            dataKey="value"
                            name="ציון חלק 1"
                            fill={theme.palette.info.light}
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
                <Box mt={2}>
                    <Typography variant="body2" align="center" sx={{ color: '#ccc' }}>
                        הגרף מציג את ציון חלק 1 לכל דוח, כאשר הציון הגבוה ביותר ממופה ל־33.3.
                        העמודה האחרונה מציגה את הממוצע הכולל של חלק 1 (גם הוא ממופה לתחום 0–33.3).
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default GraphAverageGradePartOne;
