import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    useTheme,
} from '@mui/material';
import GradePartGraphs from './GradePartGraphs';

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
    grade1: GradeItem | null;
    grade2: GradeItem | null;
}

const Grades: React.FC<GradesProps> = ({ grade1, grade2 }) => {
    const theme = useTheme();

    // Checks if a grade has a valid finalGrade
    const hasGrade = (grade: GradeItem | null) => {
        if (!grade || !grade.scoreData) return false;
        const parsed = parseFloat(String(grade.scoreData.finalGrade));
        return !isNaN(parsed) && parsed !== 0;
    };

    // Groups items by value: 'full', 'half', 'none'
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

    // Renders the columns of items (full / half / none) for the overall grade
    const renderGradeColumns = (grade: GradeItem) => {
        const { fullItems, halfItems, noneItems } = groupItems(grade);

        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 2,
                    gap: 4,
                    textAlign: 'center',
                }}
            >
                {/* Full */}
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: 'green',
                            borderBottom: '1px solid green',
                            mb: 1,
                            fontWeight: 'bold',
                        }}
                    >
                        מה הכח עשה טוב
                    </Typography>
                    {fullItems.map((item, index) => (
                        <Typography
                            key={index}
                            variant="body1"
                            sx={{ color: 'white', mb: 0.5 }}
                        >
                            {index + 1}. {item.name}
                        </Typography>
                    ))}
                </Box>

                {/* Half */}
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: 'orange',
                            borderBottom: '1px solid orange',
                            mb: 1,
                            fontWeight: 'bold',
                        }}
                    >
                        מה הכח עשה טוב באופן חלקי
                    </Typography>
                    {halfItems.map((item, index) => (
                        <Typography
                            key={index}
                            variant="body1"
                            sx={{ color: 'white', mb: 0.5 }}
                        >
                            {index + 1}. {item.name}
                        </Typography>
                    ))}
                </Box>

                {/* None */}
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: 'red',
                            borderBottom: '1px solid red',
                            mb: 1,
                            fontWeight: 'bold',
                        }}
                    >
                        מה הצוות עשה לא טוב
                    </Typography>
                    {noneItems.map((item, index) => (
                        <Typography
                            key={index}
                            variant="body1"
                            sx={{ color: 'white', mb: 0.5 }}
                        >
                            {index + 1}. {item.name}
                        </Typography>
                    ))}
                </Box>
            </Box>
        );
    };

    // Mapping for part numbers to titles
    const partTitles: { [key: string]: string } = {
        '1': 'גיבוש תמונת מצב באירוע',
        '2': 'הפעלת כוחות ומשימות',
        '3': 'מיצוי מכפילי כוח',
    };

    // New function to group items by their part (e.g., 1, 2, 3) and then by value order: full, half, none.
    const renderPartColumns = (grade: GradeItem) => {
        return (
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                    פירוט לפי הישגים נדרשים
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 4,
                        textAlign: 'center',
                    }}
                >
                    {grade.scoreData.parts.map((part, partIndex) => {
                        // Group items in each part by their value
                        const fullItems: any[] = [];
                        const halfItems: any[] = [];
                        const noneItems: any[] = [];

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

                        // Extract the part number if available
                        const rawPart = part.items[0]?.part?.$numberInt || part.items[0]?.part;
                        const partNumber = rawPart ? String(rawPart) : String(partIndex + 1);

                        // Use the mapping or fallback to default header
                        const partTitle = partTitles[partNumber] || `חלק ${partNumber}`;

                        return (
                            <Box key={partIndex} sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                                    {partTitle}
                                </Typography>
                                {/* Full */}
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        color: 'green',
                                        borderBottom: '1px solid green',
                                        mb: 1,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    מה הכח עשה טוב
                                </Typography>
                                {fullItems.map((item, index) => (
                                    <Typography
                                        key={index}
                                        variant="body1"
                                        sx={{ color: 'white', mb: 0.5 }}
                                    >
                                        {index + 1}. {item.name}
                                    </Typography>
                                ))}
                                {/* Half */}
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        color: 'orange',
                                        borderBottom: '1px solid orange',
                                        mt: 2,
                                        mb: 1,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    מה הכח עשה טוב באופן חלקי
                                </Typography>
                                {halfItems.map((item, index) => (
                                    <Typography
                                        key={index}
                                        variant="body1"
                                        sx={{ color: 'white', mb: 0.5 }}
                                    >
                                        {index + 1}. {item.name}
                                    </Typography>
                                ))}
                                {/* None */}
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        color: 'red',
                                        borderBottom: '1px solid red',
                                        mt: 2,
                                        mb: 1,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    מה הצוות עשה לא טוב
                                </Typography>
                                {noneItems.map((item, index) => (
                                    <Typography
                                        key={index}
                                        variant="body1"
                                        sx={{ color: 'white', mb: 0.5 }}
                                    >
                                        {index + 1}. {item.name}
                                    </Typography>
                                ))}
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        );
    };

    // Safely formats finalGrade with 2 decimals
    const formatFinalGrade = (grade: GradeItem) => {
        const parsed = parseFloat(String(grade.scoreData.finalGrade));
        return parsed.toFixed(2); // e.g., 75 -> "75.00"
    };

    return (
        <Card
            sx={{
                maxWidth: 800,
                margin: '20px auto',
                direction: 'rtl',
                textAlign: 'center',
                boxShadow: 3,
                backgroundColor: '#333',
                color: '#fffdfd',
                p: 2,
            }}
        >
            <CardContent>
                {/* פרטי תרגיל 1 */}
                {hasGrade(grade1) && grade1 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                            פרטי תרגיל 1
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            ציון סופי: {formatFinalGrade(grade1)}
                        </Typography>
                        {renderGradeColumns(grade1)}
                        {/* New section: group items by part with updated titles */}
                        {renderPartColumns(grade1)}
                        <Box sx={{ mt: 3 }}>
                            <GradePartGraphs scoreData={grade1.scoreData} />
                        </Box>
                    </Box>
                )}

                {/* Divider only if both grades exist */}
                {hasGrade(grade1) && hasGrade(grade2) && grade1 && grade2 && (
                    <Divider sx={{ bgcolor: '#666', my: 4 }} />
                )}

                {/* פרטי תרגיל 2 */}
                {hasGrade(grade2) && grade2 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                            פרטי תרגיל 2
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            ציון סופי: {formatFinalGrade(grade2)}
                        </Typography>
                        {renderGradeColumns(grade2)}
                        {/* Only render parts if available */}
                        {grade2.scoreData.parts && grade2.scoreData.parts.length > 0 && renderPartColumns(grade2)}
                        <Box sx={{ mt: 3 }}>
                            <GradePartGraphs scoreData={grade2.scoreData} />
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default Grades;
