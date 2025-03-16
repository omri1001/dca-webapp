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

/* --------------------------------------------
   1) INTERFACES (same as your original)
---------------------------------------------*/
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
                // Optional parentName for sub-items
                parentName?: string;
            }[];
        }[];
        finalGrade: number | string;
    };
}

interface GradesProps {
    grade1: GradeItem | null;
    grade2: GradeItem | null;
}

/* --------------------------------------------
   2) HELPER: EXPAND AN ITEM INTO SUB-ITEMS
---------------------------------------------*/
function expandItem(item: GradeItem['scoreData']['parts'][0]['items'][0]) {
    // If multipleChoice, expand each subKey as a separate item
    if (
        item.type === 'multipleChoice' &&
        item.value &&
        typeof item.value === 'object'
    ) {
        const subItems = Object.entries(item.value).map(([subKey, subVal]) => ({
            ...item,            // copy all fields
            name: subKey,       // subKey becomes the 'name'
            value: subVal,      // "full"|"half"|"none"
            parentName: item.name, // store the parent's name
        }));
        return subItems;
    }
    // Otherwise, it's just a single item
    return [item];
}

/* --------------------------------------------
   3) HELPER: RENDER ITEMS GROUPED BY PARENTNAME
---------------------------------------------*/
function renderItemsWithParentGrouping(
    items: GradeItem['scoreData']['parts'][0]['items']
) {
    // Group by parentName
    const map = new Map<string, typeof items>();
    items.forEach((itm) => {
        const parent = itm.parentName || '';
        if (!map.has(parent)) {
            map.set(parent, []);
        }
        map.get(parent)!.push(itm);
    });

    const elements: JSX.Element[] = [];
    let groupIndex = 0;

    map.forEach((groupItems, parentName) => {
        // If there's a parent name, show it as a sub-heading
        if (parentName) {
            elements.push(
                <Typography
                    key={`parent-${groupIndex}`}
                    variant="subtitle2"
                    sx={{ fontWeight: 'bold', mt: 1 }}
                >
                    {parentName}
                </Typography>
            );
        }
        groupItems.forEach((itm, idx) => {
            elements.push(
                <Typography
                    key={`itm-${groupIndex}-${idx}`}
                    variant="body1"
                    // Using 'inherit' so that it picks up the parent text color
                    sx={{ color: 'inherit', mb: 0.5 }}
                >
                    {idx + 1}. {itm.name}
                </Typography>
            );
        });
        groupIndex++;
    });

    return <>{elements}</>;
}

/* --------------------------------------------
   4) MAIN COMPONENT
---------------------------------------------*/
const Grades: React.FC<GradesProps> = ({ grade1, grade2 }) => {
    const theme = useTheme();

    // Checks if a grade has a valid finalGrade
    const hasGrade = (grade: GradeItem | null) => {
        if (!grade || !grade.scoreData) return false;
        const parsed = parseFloat(String(grade.scoreData.finalGrade));
        return !isNaN(parsed) && parsed !== 0;
    };

    // Safely formats finalGrade with 2 decimals
    const formatFinalGrade = (grade: GradeItem) => {
        const parsed = parseFloat(String(grade.scoreData.finalGrade));
        return parsed.toFixed(2); // e.g., 75 -> "75.00"
    };

    /* ------------------------------------------------------------------
       5) RENDER OVERALL COLUMNS (Aggregating all items from all parts)
    -------------------------------------------------------------------- */
    const renderGradeColumns = (grade: GradeItem) => {
        // Expand all items from all parts into an array
        const allExpanded: any[] = [];
        grade.scoreData.parts.forEach((part) => {
            part.items.forEach((item) => {
                const expanded = expandItem(item);
                allExpanded.push(...expanded);
            });
        });

        // Group by value: 'full', 'half', 'none'
        const fullItems: any[] = [];
        const halfItems: any[] = [];
        const noneItems: any[] = [];

        allExpanded.forEach((itm) => {
            if (itm.value === 'full') {
                fullItems.push(itm);
            } else if (itm.value === 'half') {
                halfItems.push(itm);
            } else if (itm.value === 'none') {
                noneItems.push(itm);
            }
        });

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
                            color: theme.palette.success.main,
                            borderBottom: `1px solid ${theme.palette.success.main}`,
                            mb: 1,
                            fontWeight: 'bold',
                        }}
                    >
                        מה הכח עשה טוב
                    </Typography>
                    {fullItems.length > 0 ? (
                        renderItemsWithParentGrouping(fullItems)
                    ) : (
                        <Typography variant="body1" sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
                            (אין ממצאים)
                        </Typography>
                    )}
                </Box>

                {/* Half */}
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: theme.palette.warning.main,
                            borderBottom: `1px solid ${theme.palette.warning.main}`,
                            mb: 1,
                            fontWeight: 'bold',
                        }}
                    >
                        מה הכח עשה טוב באופן חלקי
                    </Typography>
                    {halfItems.length > 0 ? (
                        renderItemsWithParentGrouping(halfItems)
                    ) : (
                        <Typography variant="body1" sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
                            (אין ממצאים)
                        </Typography>
                    )}
                </Box>

                {/* None */}
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: theme.palette.error.main,
                            borderBottom: `1px solid ${theme.palette.error.main}`,
                            mb: 1,
                            fontWeight: 'bold',
                        }}
                    >
                        מה הצוות עשה לא טוב
                    </Typography>
                    {noneItems.length > 0 ? (
                        renderItemsWithParentGrouping(noneItems)
                    ) : (
                        <Typography variant="body1" sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
                            (אין ממצאים)
                        </Typography>
                    )}
                </Box>
            </Box>
        );
    };

    /* ------------------------------------------------------------------
       6) RENDER PART COLUMNS (Separating items by part #1, #2, #3, etc.)
    ------------------------------------------------------------------ */
    const partTitles: { [key: string]: string } = {
        '1': 'גיבוש תמונת מצב באירוע',
        '2': 'הפעלת כוחות ומשימות',
        '3': 'מיצוי מכפילי כוח',
    };

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
                        // Expand items in this part
                        const expanded: any[] = [];
                        part.items.forEach((item) => {
                            expanded.push(...expandItem(item));
                        });

                        // Group them by value
                        const fullItems: any[] = [];
                        const halfItems: any[] = [];
                        const noneItems: any[] = [];

                        expanded.forEach((itm) => {
                            if (itm.value === 'full') {
                                fullItems.push(itm);
                            } else if (itm.value === 'half') {
                                halfItems.push(itm);
                            } else if (itm.value === 'none') {
                                noneItems.push(itm);
                            }
                        });

                        // Extract the part number if available
                        const rawPart =
                            part.items[0]?.part?.$numberInt || part.items[0]?.part;
                        const partNumber = rawPart
                            ? String(rawPart)
                            : String(partIndex + 1);

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
                                        color: theme.palette.success.main,
                                        borderBottom: `1px solid ${theme.palette.success.main}`,
                                        mb: 1,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    מה הכח עשה טוב
                                </Typography>
                                {fullItems.length > 0 ? (
                                    renderItemsWithParentGrouping(fullItems)
                                ) : (
                                    <Typography variant="body1" sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
                                        (אין ממצאים)
                                    </Typography>
                                )}

                                {/* Half */}
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        color: theme.palette.warning.main,
                                        borderBottom: `1px solid ${theme.palette.warning.main}`,
                                        mt: 2,
                                        mb: 1,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    מה הכח עשה טוב באופן חלקי
                                </Typography>
                                {halfItems.length > 0 ? (
                                    renderItemsWithParentGrouping(halfItems)
                                ) : (
                                    <Typography variant="body1" sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
                                        (אין ממצאים)
                                    </Typography>
                                )}

                                {/* None */}
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        color: theme.palette.error.main,
                                        borderBottom: `1px solid ${theme.palette.error.main}`,
                                        mt: 2,
                                        mb: 1,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    מה הצוות עשה לא טוב
                                </Typography>
                                {noneItems.length > 0 ? (
                                    renderItemsWithParentGrouping(noneItems)
                                ) : (
                                    <Typography variant="body1" sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
                                        (אין ממצאים)
                                    </Typography>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        );
    };

    /* ------------------------------------------------------------------
       7) FINAL RETURN
    ------------------------------------------------------------------ */
    return (
        <Card
            sx={{
                maxWidth: 800,
                margin: '20px auto',
                direction: 'rtl',
                textAlign: 'center',
                boxShadow: 3,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
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

                        {/* Overall columns (all parts combined) */}
                        {renderGradeColumns(grade1)}

                        {/* Part-by-part breakdown */}
                        {renderPartColumns(grade1)}

                        <Box sx={{ mt: 3 }}>
                            <GradePartGraphs scoreData={grade1.scoreData} />
                        </Box>
                    </Box>
                )}

                {/* Divider only if both grades exist */}
                {hasGrade(grade1) && hasGrade(grade2) && grade1 && grade2 && (
                    <Divider sx={{ bgcolor: theme.palette.divider, my: 4 }} />
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
                        {renderPartColumns(grade2)}

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
