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

// Interface for the grade item
interface GradeItem {
    scoreData: {
        finalGrade: number | string;
    };
}

interface FinalGradeProps {
    grade1: GradeItem | null;
    grade2: GradeItem | null;
}

const FinalGrade: React.FC<FinalGradeProps> = ({ grade1, grade2 }) => {
    const theme = useTheme();

    // Helper to parse a grade value into a number
    const parseGrade = (grade: number | string): number =>
        typeof grade === 'string' ? parseFloat(grade) : grade;

    // Extract and parse final grade values if available
    const grade1Value =
        grade1 && parseGrade(grade1.scoreData.finalGrade) > 0
            ? parseGrade(grade1.scoreData.finalGrade)
            : null;
    const grade2Value =
        grade2 && parseGrade(grade2.scoreData.finalGrade) > 0
            ? parseGrade(grade2.scoreData.finalGrade)
            : null;

    // Calculate average:
    let avgValue = 0;
    if (grade1Value !== null && grade2Value !== null) {
        avgValue = (grade1Value + grade2Value) / 2;
    } else if (grade1Value !== null) {
        avgValue = grade1Value;
    } else if (grade2Value !== null) {
        avgValue = grade2Value;
    }

    // Build data for the chart.
    const data = [
        {
            displayName: `תרגיל 1\n${grade1Value !== null ? grade1Value.toFixed(2) : '-'}`,
            finalGrade: grade1Value !== null ? grade1Value : 0,
        },
        {
            displayName: `תרגיל 2\n${grade2Value !== null ? grade2Value.toFixed(2) : '-'}`,
            finalGrade: grade2Value !== null ? grade2Value : 0,
        },
        {
            displayName: `ממוצע\n${avgValue > 0 ? avgValue.toFixed(2) : '-'}`,
            finalGrade: avgValue,
        },
    ];

    // Custom tick renderer to support multi-line labels.
    const renderCustomTick = (props: any) => {
        const { x, y, payload } = props;
        const lines = payload.value.split('\n');
        return (
            <g transform={`translate(${x},${y})`}>
                {lines.map((line: string, index: number) => (
                    <text
                        key={index}
                        x={0}
                        y={index * 15}
                        textAnchor="middle"
                        fill={theme.palette.text.primary}
                        fontSize={14}
                        fontWeight="bold"
                    >
                        {line}
                    </text>
                ))}
            </g>
        );
    };

    return (
        <Card
            sx={{
                maxWidth: 800,
                mx: 'auto',
                mt: 3,
                boxShadow: 3,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                p: 2,
            }}
        >
            <CardHeader
                title="השוואת ציון סופי"
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
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        barCategoryGap="20%"
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={theme.palette.divider}
                        />
                        <XAxis
                            dataKey="displayName"
                            tick={renderCustomTick}
                            axisLine={{ stroke: theme.palette.divider }}
                            tickLine={{ stroke: theme.palette.divider }}
                        />
                        <YAxis
                            domain={[0, 100]}
                            tick={{ fontSize: 14, fill: theme.palette.text.primary }}
                            axisLine={{ stroke: theme.palette.divider }}
                            tickLine={{ stroke: theme.palette.divider }}
                        />
                        <Tooltip
                            formatter={(value: number) => value.toFixed(2)}
                            contentStyle={{
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                color: theme.palette.text.primary,
                            }}
                            itemStyle={{ color: theme.palette.text.primary }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: 14, color: theme.palette.text.primary }}
                        />
                        <Bar
                            dataKey="finalGrade"
                            name="ציון סופי"
                            fill={theme.palette.info.light}
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
                <Box mt={2}>
                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ color: theme.palette.text.secondary }}
                    >
                        *ציונים מוצגים מ-0 עד 100
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default FinalGrade;
