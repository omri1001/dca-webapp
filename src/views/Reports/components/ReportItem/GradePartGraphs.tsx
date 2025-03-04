import React from 'react';
import { Box, Typography } from '@mui/material';
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
    grade: number | string | { $numberDouble?: string };
}

interface ScoreData {
    parts: Part[];
    finalGrade: number | string;
}

interface GradePartGraphsProps {
    scoreData: ScoreData;
}

const GradePartGraphs: React.FC<GradePartGraphsProps> = ({ scoreData }) => {
    // Parse the grade value, handling both number, string, or an object (e.g. {$numberDouble: "value"})
    const parseGrade = (grade: number | string | { $numberDouble?: string }): number => {
        if (typeof grade === 'object' && grade.$numberDouble) {
            return parseFloat(grade.$numberDouble);
        }
        return typeof grade === 'string' ? parseFloat(grade) : grade;
    };


    const data = scoreData.parts.map((part, index) => {
        const rawGrade = parseGrade(part.grade);
        const normalizedGrade = rawGrade * 3;
        return {
            name: `Part ${index + 1}`,
            grade: normalizedGrade,
            pass: 60,
            highest: 98,
        };
    });

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
                Detailed Grade per Part
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="grade" name="ציון הכוח" fill="#8884d8" />
                    <Bar dataKey="pass" name="ציון ממוצע של שאר הכוחות" fill="#82ca9d" />

                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default GradePartGraphs;
