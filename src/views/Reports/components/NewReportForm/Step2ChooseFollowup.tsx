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
    ListItemText,
} from '@mui/material';
import ScenarioSummary from './ScenarioSummary';

interface Step2ChooseFollowupProps {
    /** Step1 (basic info) data: */
    reportType: '' | 'פלוגה' | 'גדוד';
    date: string;
    hatmar: string;
    hativa: string;
    gdod: string;
    pluga?: string;
    mentorName: string;
    exerciseManagerName: string;
    mefakedHakoah: string;
    gzera: string;
    mission: string;

    /** Step2 follow-up data: */
    gradeData1: any;
    gradeData2: any;
    scenarioData1: any;
    scenarioData2: any;

    /** Callback for scenario summary */
    onSummarizeScenarios: (summary: string) => void;

    /** Navigation callbacks: */
    onChooseFollowup: (type: 'grades' | 'scenario', slot: 1 | 2) => void;
    onBack: () => void;
    onFinalSubmit: () => void;
}

const Step2ChooseFollowup: React.FC<Step2ChooseFollowupProps> = ({
                                                                     reportType,
                                                                     date,
                                                                     hatmar,
                                                                     hativa,
                                                                     gdod,
                                                                     pluga,
                                                                     mentorName,
                                                                     exerciseManagerName,
                                                                     mefakedHakoah,
                                                                     gzera,
                                                                     mission,
                                                                     gradeData1,
                                                                     gradeData2,
                                                                     scenarioData1,
                                                                     scenarioData2,
                                                                     onSummarizeScenarios,
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
                                            secondary={`סוג: ${part.type || 'לא ידוע'}, ${part.items.length} פריטים`}
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
                        {/* 1. תאריך */}
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>תאריך:</strong> {date || 'לא הוגדר'}
                            </Typography>
                        </Grid>
                        {/* 2. סוג דוח */}
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>סוג דוח:</strong> {reportType || 'לא הוגדר'}
                            </Typography>
                        </Grid>
                        {/* 3. חטמר */}
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>חטמר:</strong> {hatmar || 'לא הוגדר'}
                            </Typography>
                        </Grid>
                        {/* 4. חטיבה */}
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>חטיבה:</strong> {hativa || 'לא הוגדר'}
                            </Typography>
                        </Grid>
                        {/* 5. שם גדוד */}
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>שם גדוד:</strong> {gdod || 'לא הוגדר'}
                            </Typography>
                        </Grid>
                        {/* 6. אות פלוגה (if applicable) */}
                        {reportType === 'פלוגה' && (
                            <Grid item xs={12} sm={6}>
                                <Typography>
                                    <strong>אות פלוגה:</strong> {pluga || 'לא הוגדר'}
                                </Typography>
                            </Grid>
                        )}
                        {/* 7. גזרה */}
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>גזרה:</strong> {gzera || 'לא הוגדר'}
                            </Typography>
                        </Grid>
                        {/* 8. משימה */}
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>משימה:</strong> {mission || 'לא הוגדר'}
                            </Typography>
                        </Grid>
                        {/* 9. שם חונך */}
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>שם חונך:</strong> {mentorName || 'לא הוגדר'}
                            </Typography>
                        </Grid>
                        {/* 10. שם מנהל תרגיל */}
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>שם מנהל תרגיל:</strong> {exerciseManagerName || 'לא הוגדר'}
                            </Typography>
                        </Grid>
                        {/* 11. שם מפקד הכוח */}
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>שם מפקד הכוח:</strong> {mefakedHakoah || 'לא הוגדר'}
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

            {/* 4) Scenario Summary */}
            {scenarioData1 && scenarioData1.scenarioText && (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        תקציר תרחישים
                    </Typography>
                    <ScenarioSummary
                        scenario1={scenarioData1.scenarioText}
                        scenario2={scenarioData2?.scenarioText || ''}
                        onSummaryGenerated={onSummarizeScenarios}
                    />
                </Box>
            )}



            {/* 5) Navigation Buttons */}
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
