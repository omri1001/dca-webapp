import React from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    Box,
    useTheme
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

interface Part {
    items: any[];
    gradeOfPart: number | string | { $numberDouble?: string };
}

interface ScoreData {
    parts: Part[];
    finalGrade: number | string;
}

interface GradePartGraphsProps {
    scoreData: ScoreData;
}

const GradePartGraphs: React.FC<GradePartGraphsProps> = ({ scoreData }) => {
    const theme = useTheme();

    // Safely parse numeric values from various formats
    const parseGrade = (grade: number | string | { $numberDouble?: string }): number => {
        if (typeof grade === 'object' && grade.$numberDouble) {
            return parseFloat(grade.$numberDouble);
        }
        return typeof grade === 'string' ? parseFloat(grade) : grade;
    };

    // Custom titles for each part index
    const partTitles = [
        "גיבוש תמונת מצב באירוע",
        "הפעלת כוחות ומשימות",
        "מיצוי מכפילי כוח",
    ];

    // Build data array for Recharts
    const data = scoreData.parts.map((part, index) => {
        const rawGrade = parseGrade(part.gradeOfPart);
        const normalizedGrade = rawGrade * 3; // Scale to 100

        // Append normalized grade (2 decimals) to the title on the X-axis
        const displayName = `${partTitles[index] || `חלק ${index + 1}`} (${normalizedGrade.toFixed(
            2
        )})`;

        return {
            name: displayName,
            grade: normalizedGrade, // ציון הכוח
            pass: 60,              // Example "average" score; replace as needed
        };
    });

    return (
        <Card
            sx={{
                maxWidth: 800,
                mx: 'auto',
                mt: 3,
                boxShadow: 3,
                backgroundColor: '#333', // Dark background
                color: '#fff',           // White text for contrast
            }}
        >
            <CardHeader
                title="התפלגות ציונים לפי השיגים נדרשים"
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
                        {/* Subtle grid lines (lighter for a dark background) */}
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#444"
                        />

                        {/* X-axis with white ticks for a dark background */}
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#fff' }}
                            interval={0}
                            axisLine={{ stroke: '#999' }}
                            tickLine={{ stroke: '#999' }}
                            dy={8}
                        />

                        {/* Y-axis from 0 to 100, also white ticks */}
                        <YAxis
                            domain={[0, 100]}
                            tick={{ fontSize: 14, fill: '#fff' }}
                            axisLine={{ stroke: '#999' }}
                            tickLine={{ stroke: '#999' }}
                        />

                        {/* Tooltip with dark background and white text */}
                        <Tooltip
                            formatter={(value: number) => value.toFixed(2)}
                            contentStyle={{
                                backgroundColor: '#444',
                                border: '1px solid #666',
                                color: '#fff',
                            }}
                            itemStyle={{ color: '#fff' }}
                        />

                        {/* Legend with white text */}
                        <Legend
                            wrapperStyle={{ fontSize: 14, color: '#fff' }}
                            align="center"
                            verticalAlign="top"
                            iconSize={14}
                        />

                        {/* Bar: ציון הכוח (no label on top) */}
                        <Bar
                            dataKey="grade"
                            name="ציון הכוח"
                            fill={theme.palette.info.light}  // Use a lighter info color
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                        />

                        {/* Bar: ציון ממוצע של שאר הכוחות (no label on top) */}
                        <Bar
                            dataKey="pass"
                            name="ציון ממוצע של שאר הכוחות"
                            fill={theme.palette.success.main}
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
                <Box mt={2}>
                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ color: '#ccc' }}
                    >
                        *ערכים מוצגים כציון מ-0 עד 100 (הכפלה פי 3 מהציון המקורי)
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default GradePartGraphs;
