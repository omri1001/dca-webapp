// src/components/item-report/Grades.tsx

import React, { useState } from 'react';
import { Box, Typography, Button, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface GradeItem {
    name: string;
    scoreData: {
        parts: {
            items: {
                name: string;
                type: string;
                value: any;
                active: boolean;
                part: any;
                category: string;
                questionNumber: any;
                answerText: any;
                extra?: any;
            }[];
        }[];
        finalGrade: number | string;
    };
}

interface GradesProps {
    grade1: GradeItem;
    grade2: GradeItem;
    onEditGrade: (gradeType: 'grade1' | 'grade2') => void;
    onAddGrade: (gradeType: 'grade1' | 'grade2') => void;
}

const Grades: React.FC<GradesProps> = ({ grade1, grade2, onEditGrade, onAddGrade }) => {
    const [expanded, setExpanded] = useState(false);

    const hasGrade = (grade: GradeItem) => {
        if (!grade || !grade.scoreData) return false;
        const finalGrade =
            typeof grade.scoreData.finalGrade === 'number'
                ? grade.scoreData.finalGrade
                : parseFloat(grade.scoreData.finalGrade);
        return !isNaN(finalGrade) && finalGrade !== 0;
    };

    const groupItems = (grade: GradeItem) => {
        const fullItems: any[] = [];
        const halfItems: any[] = [];
        const noneItems: any[] = [];
        grade.scoreData.parts.forEach((part) => {
            part.items.forEach((item) => {
                if (typeof item.value === 'string') {
                    if (item.value === 'full') {
                        fullItems.push(item);
                    } else if (item.value === 'half') {
                        halfItems.push(item);
                    } else if (item.value === 'none') {
                        noneItems.push(item);
                    }
                }
            });
        });
        return { fullItems, halfItems, noneItems };
    };

    const renderGradeColumns = (grade: GradeItem) => {
        const { fullItems, halfItems, noneItems } = groupItems(grade);
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, gap: 2, textAlign: 'right' }}>
                {/* Full column */}
                <Box sx={{ flex: 1, textAlign: 'right' }}>
                    <Typography variant="subtitle2" sx={{ color: 'green', borderBottom: '1px solid green', mb: 1 }}>
                        Full
                    </Typography>
                    {fullItems.map((item, index) => (
                        <Typography key={index} variant="body2" sx={{ color: 'green', mb: 0.5 }}>
                            {index + 1}. {item.name}
                        </Typography>
                    ))}
                </Box>
                {/* Half column */}
                <Box sx={{ flex: 1, textAlign: 'right' }}>
                    <Typography variant="subtitle2" sx={{ color: 'orange', borderBottom: '1px solid orange', mb: 1 }}>
                        Half
                    </Typography>
                    {halfItems.map((item, index) => (
                        <Typography key={index} variant="body2" sx={{ color: 'orange', mb: 0.5 }}>
                            {index + 1}. {item.name}
                        </Typography>
                    ))}
                </Box>
                {/* None column */}
                <Box sx={{ flex: 1, textAlign: 'right' }}>
                    <Typography variant="subtitle2" sx={{ color: 'red', borderBottom: '1px solid red', mb: 1 }}>
                        None
                    </Typography>
                    {noneItems.map((item, index) => (
                        <Typography key={index} variant="body2" sx={{ color: 'red', mb: 0.5 }}>
                            {index + 1}. {item.name}
                        </Typography>
                    ))}
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
                מדדים
            </Typography>

            {/* Grade 1 Header */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                    מדד 1{' '}
                    {grade1.scoreData?.finalGrade !== undefined &&
                        `– ציון סופי: ${grade1.scoreData.finalGrade}`}
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                        hasGrade(grade1) ? onEditGrade('grade1') : onAddGrade('grade1')
                    }
                    sx={{ mt: 1 }}
                >
                    {hasGrade(grade1) ? 'ערוך מדד' : 'הוסף מדד'}
                </Button>
            </Box>

            {/* Grade 2 Header */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                    מדד 2{' '}
                    {grade2.scoreData?.finalGrade !== undefined &&
                        `– ציון סופי: ${grade2.scoreData.finalGrade}`}
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                        hasGrade(grade2) ? onEditGrade('grade2') : onAddGrade('grade2')
                    }
                    sx={{ mt: 1 }}
                >
                    {hasGrade(grade2) ? 'ערוך מדד' : 'הוסף מדד'}
                </Button>
            </Box>

            {/* Toggle Arrow */}
            <Box
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mt: 1, textAlign: 'right' }}
                onClick={() => setExpanded(!expanded)}
            >
                <IconButton
                    size="small"
                    sx={{
                        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                    }}
                >
                    <ExpandMoreIcon />
                </IconButton>
                {!expanded && (
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                        הצג מדדים
                    </Typography>
                )}
            </Box>

            {/* Collapse for detailed metrics */}
            <Collapse in={expanded}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                        פרטי מדד 1
                    </Typography>
                    {renderGradeColumns(grade1)}
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                        פרטי מדד 2
                    </Typography>
                    {renderGradeColumns(grade2)}
                </Box>
            </Collapse>
        </Box>
    );
};

export default Grades;
