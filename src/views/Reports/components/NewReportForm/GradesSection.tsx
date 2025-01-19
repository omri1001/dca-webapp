// src/components/NewReportForm/GradesSection.tsx

import React from 'react';
import { Box, TextField } from '@mui/material';
import { LocalGradesState } from '@/components/models/gradesUtils';
// Adjust import path if needed

interface GradesSectionProps {
    grades: LocalGradesState;
    setGrades: React.Dispatch<React.SetStateAction<LocalGradesState>>;
}

const GradesSection: React.FC<GradesSectionProps> = ({ grades, setGrades }) => {
    // Helper: update a numeric value in the state's "items" object
    const handleNumberChange = (category: string, item: string, value: number) => {
        setGrades((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                items: {
                    ...prev[category].items,
                    [item]: value
                }
            }
        }));
    };

    // Helper: update the comment for a category
    const handleCommentChange = (category: string, comment: string) => {
        setGrades((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                comment
            }
        }));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* פיקוד ושליטה */}
            <TextField
                label="1.1 גיבוש תמונת מצב"
                type="number"
                inputProps={{ min: 1, max: 10 }}
                value={grades['פיקוד ושליטה'].items['1.1 גיבוש תמונת מצב']}
                onChange={(e) =>
                    handleNumberChange(
                        'פיקוד ושליטה',
                        '1.1 גיבוש תמונת מצב',
                        Number(e.target.value)
                    )
                }
            />
            <TextField
                label="1.2 ניהול הכוח"
                type="number"
                inputProps={{ min: 1, max: 10 }}
                value={grades['פיקוד ושליטה'].items['1.2 ניהול הכוח']}
                onChange={(e) =>
                    handleNumberChange(
                        'פיקוד ושליטה',
                        '1.2 ניהול הכוח',
                        Number(e.target.value)
                    )
                }
            />
            <TextField
                label="1.3 מיקום המפקד"
                type="number"
                inputProps={{ min: 1, max: 10 }}
                value={grades['פיקוד ושליטה'].items['1.3 מיקום המפקד']}
                onChange={(e) =>
                    handleNumberChange(
                        'פיקוד ושליטה',
                        '1.3 מיקום המפקד',
                        Number(e.target.value)
                    )
                }
            />
            <TextField
                label="הערות (פיקוד ושליטה)"
                value={grades['פיקוד ושליטה'].comment}
                onChange={(e) => handleCommentChange('פיקוד ושליטה', e.target.value)}
                multiline
                rows={3}
            />

            {/* עבודת קשר */}
            <TextField
                label="2.1 נדב'ר בסיסי"
                type="number"
                inputProps={{ min: 1, max: 10 }}
                value={grades['עבודת קשר'].items["2.1 נדב'ר בסיסי"]}
                onChange={(e) =>
                    handleNumberChange(
                        'עבודת קשר',
                        "2.1 נדב'ר בסיסי",
                        Number(e.target.value)
                    )
                }
            />
            <TextField
                label="2.2 אסרטיביות"
                type="number"
                inputProps={{ min: 1, max: 10 }}
                value={grades['עבודת קשר'].items['2.2 אסרטיביות']}
                onChange={(e) =>
                    handleNumberChange(
                        'עבודת קשר',
                        '2.2 אסרטיביות',
                        Number(e.target.value)
                    )
                }
            />
            <TextField
                label="2.3 דיווחים"
                type="number"
                inputProps={{ min: 1, max: 10 }}
                value={grades['עבודת קשר'].items['2.3 דיווחים']}
                onChange={(e) =>
                    handleNumberChange(
                        'עבודת קשר',
                        '2.3 דיווחים',
                        Number(e.target.value)
                    )
                }
            />
            <TextField
                label="הערות (עבודת קשר)"
                value={grades['עבודת קשר'].comment}
                onChange={(e) => handleCommentChange('עבודת קשר', e.target.value)}
                multiline
                rows={3}
            />
        </Box>
    );
};

export default GradesSection;
