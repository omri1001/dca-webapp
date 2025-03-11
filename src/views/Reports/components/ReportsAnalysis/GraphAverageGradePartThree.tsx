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
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import { IReport } from '../ReportItem';

interface GraphAverageGradePartThreeProps {
    reports: IReport[];
}

const GraphAverageGradePartThree: React.FC<GraphAverageGradePartThreeProps> = ({ reports }) => {
    const theme = useTheme();

    // Helper function to safely parse a grade value.
    const parseGrade = (grade: any): number => {
        if (typeof grade === 'object' && grade.$numberDouble) {
            return parseFloat(grade.$numberDouble);
        }
        return parseFloat(grade);
    };

    // Build data points for the average grade for part 3 from both grade1 and grade2.
    const data = reports.map(report => {
        let sum = 0;
        let count = 0;

        // Get part 3 from grade1 if available.
        const parts1 = report.data?.grades?.grade1?.scoreData?.parts;
        if (Array.isArray(parts1) && parts1[2] && parts1[2].gradeOfPart !== undefined) {
            const gradeVal = parseGrade(parts1[2].gradeOfPart);
            if (!isNaN(gradeVal)) {
                sum += gradeVal;
                count++;
            }
        }

        // Get part 3 from grade2 if available.
        const parts2 = report.data?.grades?.grade2?.scoreData?.parts;
        if (Array.isArray(parts2) && parts2[2] && parts2[2].gradeOfPart !== undefined) {
            const gradeVal = parseGrade(parts2[2].gradeOfPart);
            if (!isNaN(gradeVal)) {
                sum += gradeVal;
                count++;
            }
        }

        // Compute the average for part 3.
        const avg = count > 0 ? parseFloat((sum / count).toFixed(2)) : 0;
        // Build the label using gdod and pluga (if available).
        const gdod = report.gdod || '';
        const pluga = report.pluga?.trim();
        const name = gdod ? (pluga ? `${gdod} ${pluga}` : gdod) : (report.primaryKey || report._id);
        return { name, value: avg };
    });

    // Compute the overall average for part 3.
    let overallSum = 0;
    data.forEach(item => {
        overallSum += item.value;
    });
    const overallAvg = data.length > 0 ? parseFloat((overallSum / data.length).toFixed(2)) : 0;

    // Append an extra data point for the overall average.
    data.push({ name: 'ממוצע חלק 3', value: overallAvg });

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
                title="ציון מיצוי מכפילי כוח לכל דוח וממוצע"
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
                        data={data}
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
                            domain={[0, 33.3]}
                            allowDecimals={false}
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
                            name="ציון מיצוי מכפילי כוח"
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        entry.name === 'ממוצע חלק 3'
                                            ? 'orange'
                                            : entry.value < overallAvg
                                                ? 'red'
                                                : entry.value > overallAvg
                                                    ? 'green'
                                                    : theme.palette.info.light
                                    }
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <Box mt={2}>
                    <Typography variant="body2" align="center" sx={{ color: '#ccc' }}>
                        * הגרף מציג את ציון מיצוי מכפילי כוח (הממוצע של הציון עבור מיצוי מכפילי כוח בכל דוח, והעמודה האחרונה מציגה את הממוצע הכולל)
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default GraphAverageGradePartThree;
