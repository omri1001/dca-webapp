import React from 'react';
import {
    Box,
    Button,
    FormControlLabel,
    FormLabel,
    MenuItem,
    Radio,
    RadioGroup,
    TextField,
    Stack
} from '@mui/material';

interface Step1BasicInfoProps {
    reportType: '' | 'פלוגה' | 'גדוד';
    setReportType: (value: '' | 'פלוגה' | 'גדוד') => void;
    battalionName: string;
    setBattalionName: (value: string) => void;
    platoonSymbol: string;
    setPlatoonSymbol: (value: string) => void;
    date: string;
    setDate: (value: string) => void;
    mentorName: string;
    setMentorName: (value: string) => void;
    exerciseManagerName: string;
    setExerciseManagerName: (value: string) => void;
    gzera: string;
    setGzera: (value: string) => void;
    mission: string;
    setMission: (value: string) => void;
    onNext: () => void;
}

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
                                                           reportType,
                                                           setReportType,
                                                           battalionName,
                                                           setBattalionName,
                                                           platoonSymbol,
                                                           setPlatoonSymbol,
                                                           date,
                                                           setDate,
                                                           mentorName,
                                                           setMentorName,
                                                           exerciseManagerName,
                                                           setExerciseManagerName,
                                                           gzera,
                                                           setGzera,
                                                           mission,
                                                           setMission,
                                                           onNext,
                                                       }) => {
    // Helper style for right-aligned TextField
    const textFieldRightAlign = {
        direction: 'rtl',
        '& .MuiInputBase-input': {
            textAlign: 'right',
        },
    };

    return (
        <Stack
            spacing={3}
            sx={{
                // Make the entire container RTL
                direction: 'rtl',
                textAlign: 'right',
            }}
        >
            {/* תאריך */}
            <TextField
                label="תאריך"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={textFieldRightAlign}
                required
                fullWidth
            />

            {/* סוג דוח */}
            <Box sx={{ textAlign: 'right' }}>
                <FormLabel>בחר סוג דוח</FormLabel>
                <RadioGroup
                    row
                    sx={{
                        // Place radio items from right to left
                        flexDirection: 'row-reverse',
                    }}
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as 'פלוגה' | 'גדוד')}
                >
                    <FormControlLabel
                        value="פלוגה"
                        control={<Radio />}
                        label="דוח פלוגה"
                        // Put label on the right, radio on the left
                        labelPlacement="start"
                    />
                    <FormControlLabel
                        value="גדוד"
                        control={<Radio />}
                        label="דוח גדוד"
                        // Put label on the right, radio on the left
                        labelPlacement="start"
                    />
                </RadioGroup>
            </Box>

            {/* שם הגדוד + אות פלוגה */}
            <Stack direction={{ xs: 'column', sm: 'row-reverse' }} spacing={2}>
                <TextField
                    label="שם הגדוד"
                    value={battalionName}
                    onChange={(e) => setBattalionName(e.target.value)}
                    required
                    fullWidth
                    sx={textFieldRightAlign}
                />
                {reportType === 'פלוגה' && (
                    <TextField
                        label="אות פלוגה"
                        value={platoonSymbol}
                        onChange={(e) => setPlatoonSymbol(e.target.value)}
                        required
                        fullWidth
                        sx={textFieldRightAlign}
                    />
                )}
            </Stack>

            {/* שם חונך + מנהל תרגיל */}
            <Stack direction={{ xs: 'column', sm: 'row-reverse' }} spacing={2}>
                <TextField
                    label="שם חונך"
                    value={mentorName}
                    onChange={(e) => setMentorName(e.target.value)}
                    required
                    fullWidth
                    sx={textFieldRightAlign}
                />
                <TextField
                    label="שם מנהל תרגיל"
                    value={exerciseManagerName}
                    onChange={(e) => setExerciseManagerName(e.target.value)}
                    required
                    fullWidth
                    sx={textFieldRightAlign}
                />
            </Stack>

            {/* גזרה + משימה */}
            <Stack direction={{ xs: 'column', sm: 'row-reverse' }} spacing={2}>
                <TextField
                    label="גזרה"
                    select
                    value={gzera}
                    onChange={(e) => setGzera(e.target.value)}
                    required
                    fullWidth
                    sx={textFieldRightAlign}
                >
                    <MenuItem value="a">אופציה A</MenuItem>
                    <MenuItem value="b">אופציה B</MenuItem>
                    <MenuItem value="c">אופציה C</MenuItem>
                </TextField>

                <TextField
                    label="משימה"
                    select
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    required
                    fullWidth
                    sx={textFieldRightAlign}
                >
                    <MenuItem value="a">משימה A</MenuItem>
                    <MenuItem value="b">משימה B</MenuItem>
                </TextField>
            </Stack>

            {/* כפתור "הבא" */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                <Button
                    variant="contained"
                    onClick={onNext}
                    disabled={
                        !reportType ||
                        !battalionName ||
                        (reportType === 'פלוגה' && !platoonSymbol) ||
                        !mentorName ||
                        !exerciseManagerName ||
                        !gzera ||
                        !mission
                    }
                >
                    הבא
                </Button>
            </Box>
        </Stack>
    );
};

export default Step1BasicInfo;
