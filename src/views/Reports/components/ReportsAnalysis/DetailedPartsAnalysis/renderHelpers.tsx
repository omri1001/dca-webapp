import React from 'react';
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    IGrade,
    IPartItem,
    partTitles,
    gatherItemsByPart,
    computePartGrade,
    computeGradePercentage,
} from './gradingUtils';

/* -----------------------------
   5) HELPER: RENDER ITEMS WITH PARENT GROUPING
------------------------------ */
export function renderItemsWithParentGrouping(items: IPartItem[]) {
    const groups = new Map<string, IPartItem[]>();
    items.forEach((item) => {
        const groupKey = item.parentName || '';
        if (!groups.has(groupKey)) {
            groups.set(groupKey, []);
        }
        groups.get(groupKey)!.push(item);
    });

    const elements: JSX.Element[] = [];
    let groupIndex = 0;
    groups.forEach((groupItems, groupKey) => {
        if (groupKey !== '') {
            elements.push(
                <Typography
                    key={`group-${groupIndex}`}
                    variant="subtitle2"
                    sx={{ fontWeight: 'bold', mt: 1 }}
                >
                    {groupKey}
                </Typography>
            );
        }
        groupItems.forEach((item, index) => {
            elements.push(
                <Typography key={`${groupIndex}-${index}`} variant="body2" sx={{ mb: 0.5 }}>
                    {index + 1}. {item.name}
                </Typography>
            );
        });
        groupIndex++;
    });

    return <>{elements}</>;
}

/* -----------------------------
   7) HELPER: RENDER 3 COLUMNS FOR A GRADE WITH ACCORDIONS
------------------------------ */
export function renderThreeColumnsForGrade(grade: IGrade, scenarioTitle: string, theme: any) {
    if (!grade?.scoreData?.parts || grade.scoreData.parts.length === 0) {
        return null;
    }

    const partMap = gatherItemsByPart(grade);
    const partOrder = [1, 2, 3];

    let finalScore = 0;
    if (grade.scoreData?.finalGrade) {
        if (
            typeof grade.scoreData.finalGrade === 'object' &&
            grade.scoreData.finalGrade.$numberDouble
        ) {
            finalScore = parseFloat(grade.scoreData.finalGrade.$numberDouble);
        } else if (typeof grade.scoreData.finalGrade === 'number') {
            finalScore = grade.scoreData.finalGrade;
        }
    } else {
        finalScore = computeGradePercentage(grade);
    }

    return (
        <Box sx={{ textAlign: 'right', mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                {scenarioTitle}
            </Typography>
            <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 2 }}>
                ציון סופי: {finalScore.toFixed(2)}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                {partOrder.map((p) => {
                    const keyStr = String(p);
                    const partTitleText = partTitles[keyStr] || `חלק ${keyStr}`;
                    const partGrade = computePartGrade(grade, p);
                    const partData = partMap[keyStr] || { full: [], half: [], none: [] };
                    const { full, half, none } = partData;

                    return (
                        <Box key={keyStr} sx={{ flex: 1 }}>
                            {/* Wrap each column in its own Accordion */}
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {partTitleText} - {partGrade.toFixed(2)}
                                    </Typography>
                                </AccordionSummary>

                                <AccordionDetails>
                                    {/* FULL */}
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            sx={{ borderBottom: `1px solid ${theme.palette.success.main}` }}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ color: theme.palette.success.main, fontWeight: 'bold' }}
                                            >
                                                מה הכח עשה טוב
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {full.length > 0 ? (
                                                renderItemsWithParentGrouping(full)
                                            ) : (
                                                <Typography variant="body2" sx={{ mb: 2 }}>
                                                    (אין ממצאים)
                                                </Typography>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>

                                    {/* HALF */}
                                    <Accordion sx={{ mt: 2 }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            sx={{ borderBottom: `1px solid ${theme.palette.warning.main}` }}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ color: theme.palette.warning.main, fontWeight: 'bold' }}
                                            >
                                                מה הכח עשה טוב באופן חלקי
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {half.length > 0 ? (
                                                renderItemsWithParentGrouping(half)
                                            ) : (
                                                <Typography variant="body2" sx={{ mb: 2 }}>
                                                    (אין ממצאים)
                                                </Typography>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>

                                    {/* NONE */}
                                    <Accordion sx={{ mt: 2 }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            sx={{ borderBottom: `1px solid ${theme.palette.error.main}` }}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ color: theme.palette.error.main, fontWeight: 'bold' }}
                                            >
                                                מה הכח עשה לא טוב
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {none.length > 0 ? (
                                                renderItemsWithParentGrouping(none)
                                            ) : (
                                                <Typography variant="body2" sx={{ mb: 2 }}>
                                                    (אין ממצאים)
                                                </Typography>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}
