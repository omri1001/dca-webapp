import React from 'react';
import {
    Box,
    Button,
    Typography,
    Grid,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemText
} from '@mui/material';

/** Step2ChooseFollowupProps
 *  - Step1 data: for displaying at top
 *  - Step2 data: for displaying already-entered follow-ups
 *  - onChooseFollowup: callback to go to step 3 for either 'grades' or 'scenario'
 *  - onBack: go back to step1
 *  - onFinalSubmit: finalize
 */
interface Step2ChooseFollowupProps {
    /** Step1 (basic info) data: */
    reportType: '' | 'פלוגה' | 'גדוד';
    battalionName: string;
    platoonSymbol?: string;
    date: string;
    mentorName: string;
    exerciseManagerName: string;
    gzera: string;
    mission: string;

    /** Step2 follow-up data: */
    gradeData1: any;
    gradeData2: any;
    scenarioData1: any;
    scenarioData2: any;

    /** Navigation callbacks: */
    onChooseFollowup: (type: 'grades' | 'scenario', slot: 1 | 2) => void;
    onBack: () => void;
    onFinalSubmit: () => void;
}

const Step2ChooseFollowup: React.FC<Step2ChooseFollowupProps> = ({
                                                                     reportType,
                                                                     battalionName,
                                                                     platoonSymbol,
                                                                     date,
                                                                     mentorName,
                                                                     exerciseManagerName,
                                                                     gzera,
                                                                     mission,
                                                                     gradeData1,
                                                                     gradeData2,
                                                                     scenarioData1,
                                                                     scenarioData2,
                                                                     onChooseFollowup,
                                                                     onBack,
                                                                     onFinalSubmit,
                                                                 }) => {
    // Helper to display a "מדדים" summary card
    const renderGradeCard = (gradeData: any, slot: number) => {
        if (!gradeData) return null;

        const { name, scoreData } = gradeData;
        const finalGrade = scoreData?.finalGrade ?? 0;
        const parts = scoreData?.parts ?? [];

        return (
            <Card sx={{ mb: 1 }}>
                <CardContent sx={{ direction: 'rtl', textAlign: 'right' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        מדדים {slot}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        <strong>הערות:</strong> {name || 'ללא הערות'}
                    </Typography>
                    <Typography variant="body1">
                        <strong>ציון סופי:</strong> {finalGrade.toFixed(2)} / 100
                    </Typography>

                    {/* Example of listing each part briefly. Adjust as you like. */}
                    {parts.length > 0 && (
                        <>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                פירוט חלקים ({parts.length}):
                            </Typography>
                            <List dense>
                                {parts.map((part: any, idx: number) => (
                                    <ListItem key={idx} sx={{ py: 0.5 }}>
                                        <ListItemText
                                            primary={
                                                <span>
                          <strong>חלק {idx + 1}:</strong> {part.title || '(ללא כותרת)'}
                        </span>
                                            }
                                            secondary={`סוג: ${part.type || 'לא ידוע'}, ${
                                                part.items.length
                                            } פריטים`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
                </CardContent>
            </Card>
        );
    };

    // Helper to display a "תמליל" summary card
    const renderScenarioCard = (scenarioData: any, slot: number) => {
        if (!scenarioData) return null;
        const text = scenarioData.scenarioText || '';
        return (
            <Card sx={{ mb: 1 }}>
                <CardContent sx={{ direction: 'rtl', textAlign: 'right' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        תמליל {slot}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {text.length > 40 ? text.substring(0, 40) + '...' : text || 'ללא תוכן'}
                    </Typography>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                direction: 'rtl',
                textAlign: 'right',
            }}
        >
            {/* 1) Display Step1 (BasicInfo) data */}
            <Card sx={{ mb: 1 }}>
                <CardContent sx={{ direction: 'rtl', textAlign: 'right' }}>
                    <Typography variant="h6" gutterBottom>
                        פרטי הדוח משלב 1
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>סוג דוח:</strong> {reportType || 'לא הוגדר'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>תאריך:</strong> {date || 'לא הוגדר'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>שם הגדוד:</strong> {battalionName || 'לא הוגדר'}
                            </Typography>
                        </Grid>
                        {reportType === 'פלוגה' && (
                            <Grid item xs={12} sm={6}>
                                <Typography>
                                    <strong>אות פלוגה:</strong> {platoonSymbol || 'לא הוגדר'}
                                </Typography>
                            </Grid>
                        )}
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>שם חונך:</strong> {mentorName || 'לא הוגדר'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>שם מנהל תרגיל:</strong> {exerciseManagerName || 'לא הוגדר'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>גזרה:</strong> {gzera || 'לא הוגדר'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>משימה:</strong> {mission || 'לא הוגדר'}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* 2) Follow-up: מדדים (grades) */}
            <Box>
                <Typography variant="h6" gutterBottom>
                    הוספת מדדים
                </Typography>
                {/* Grade 1 */}
                {!gradeData1 && (
                    <Button
                        variant="outlined"
                        onClick={() => onChooseFollowup('grades', 1)}
                        sx={{ mb: 2 }}
                    >
                        הכנסת מדדים 1
                    </Button>
                )}
                {gradeData1 && renderGradeCard(gradeData1, 1)}

                {/* Grade 2 */}
                {!gradeData2 && gradeData1 && (
                    <Button
                        variant="outlined"
                        onClick={() => onChooseFollowup('grades', 2)}
                        sx={{ mb: 2 }}
                    >
                        הכנסת מדדים 2
                    </Button>
                )}
                {gradeData2 && renderGradeCard(gradeData2, 2)}
            </Box>

            {/* 3) Follow-up: תמליל (scenarios) */}
            <Box>
                <Typography variant="h6" gutterBottom>
                    הוספת תמליל
                </Typography>
                {/* Scenario 1 */}
                {!scenarioData1 && (
                    <Button
                        variant="outlined"
                        onClick={() => onChooseFollowup('scenario', 1)}
                        sx={{ mb: 2 }}
                    >
                        הכנסת תמליל 1
                    </Button>
                )}
                {scenarioData1 && renderScenarioCard(scenarioData1, 1)}

                {/* Scenario 2 */}
                {!scenarioData2 && scenarioData1 && (
                    <Button
                        variant="outlined"
                        onClick={() => onChooseFollowup('scenario', 2)}
                        sx={{ mb: 2 }}
                    >
                        הכנסת תמליל 2
                    </Button>
                )}
                {scenarioData2 && renderScenarioCard(scenarioData2, 2)}
            </Box>

            {/* 4) Navigation Buttons */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 2,
                }}
            >
                <Button variant="outlined" onClick={onBack}>
                    חזור
                </Button>
                <Button variant="contained" onClick={onFinalSubmit}>
                    שלח
                </Button>
            </Box>
        </Box>
    );
};

export default Step2ChooseFollowup;
