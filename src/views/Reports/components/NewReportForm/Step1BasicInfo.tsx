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
    gdod: string;
    setGdod: (value: string) => void;
    pluga: string;
    setPluga: (value: string) => void;
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
    hativa: string;
    setHativa: (value: string) => void;
    hatmar: string;
    setHatmar: (value: string) => void;
    mefakedHakoah: string;
    setMefakedHakoah: (value: string) => void;
    onNext: () => void;
}

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
                                                           reportType,
                                                           setReportType,
                                                           gdod,
                                                           setGdod,
                                                           pluga,
                                                           setPluga,
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
                                                           hativa,
                                                           setHativa,
                                                           hatmar,
                                                           setHatmar,
                                                           mefakedHakoah,
                                                           setMefakedHakoah,
                                                           onNext,
                                                       }) => {
    // Consistent right-to-left style for inputs and labels.
    const textFieldRightAlign = {
        direction: 'rtl',
        '& .MuiInputBase-input': {
            textAlign: 'right',
        },
    };

    return (
        <Stack spacing={3} sx={{ direction: 'rtl', textAlign: 'right' }}>
            {/* 1. תאריך */}
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

            {/* 2. סוג דוח */}
            <Box>
                <FormLabel sx={{ textAlign: 'right', width: '100%' }}>בחר סוג דוח</FormLabel>
                <RadioGroup
                    row
                    sx={{ flexDirection: 'row-reverse', textAlign: 'right' }}
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as 'פלוגה' | 'גדוד')}
                >
                    <FormControlLabel
                        value="פלוגה"
                        control={<Radio />}
                        label="דוח פלוגה"
                        labelPlacement="start"
                    />
                    <FormControlLabel
                        value="גדוד"
                        control={<Radio />}
                        label="דוח גדוד"
                        labelPlacement="start"
                    />
                </RadioGroup>
            </Box>

            {/* 3. חטמר */}
            <TextField
                label="חטמר"
                value={hatmar}
                onChange={(e) => setHatmar(e.target.value)}
                fullWidth
                sx={textFieldRightAlign}
            />

            {/* 4. חטיבה */}
            <TextField
                label="חטיבה"
                value={hativa}
                onChange={(e) => setHativa(e.target.value)}
                fullWidth
                sx={textFieldRightAlign}
            />

            {/* 5. שם גדוד */}
            <TextField
                label="שם גדוד"
                value={gdod}
                onChange={(e) => setGdod(e.target.value)}
                required
                fullWidth
                sx={textFieldRightAlign}
            />

            {/* 6. אות פלוגה (only if report type is 'פלוגה') */}
            {reportType === 'פלוגה' && (
                <TextField
                    label="אות פלוגה"
                    value={pluga}
                    onChange={(e) => setPluga(e.target.value)}
                    required
                    fullWidth
                    sx={textFieldRightAlign}
                />
            )}

            {/* 7. גזרה */}
            <TextField
                label="גזרה"
                select
                value={gzera}
                onChange={(e) => setGzera(e.target.value)}
                required
                fullWidth
                sx={textFieldRightAlign}
            >
                <MenuItem value="נוב">נוב</MenuItem>
                <MenuItem value="עותניאל">עותניאל</MenuItem>
                <MenuItem value="תפוח">תפוח</MenuItem>
            </TextField>

            {/* 8. משימה */}
            <TextField
                label="משימה"
                select
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                required
                fullWidth
                sx={textFieldRightAlign}
            >
                <MenuItem value="עומק">עומק</MenuItem>
                <MenuItem value="תפר">תפר</MenuItem>
                <MenuItem value="גנה על היישוב">הגנה על היישוב</MenuItem>
            </TextField>

            {/* 9. שם חונך */}
            <TextField
                label="שם חונך"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                required
                fullWidth
                sx={textFieldRightAlign}
            />

            {/* 10. שם מנהל תרגיל */}
            <TextField
                label="שם מנהל תרגיל"
                value={exerciseManagerName}
                onChange={(e) => setExerciseManagerName(e.target.value)}
                required
                fullWidth
                sx={textFieldRightAlign}
            />

            {/* 11. שם מפקד הכוח */}
            <TextField
                label="שם מפקד הכוח"
                value={mefakedHakoah}
                onChange={(e) => setMefakedHakoah(e.target.value)}
                required
                fullWidth
                sx={textFieldRightAlign}
            />

            {/* כפתור "הבא" */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                <Button
                    variant="contained"
                    onClick={onNext}
                    disabled={
                        !reportType ||
                        !gdod ||
                        (reportType === 'פלוגה' && !pluga) ||
                        !mentorName ||
                        !exerciseManagerName ||
                        !gzera ||
                        !mission ||
                        !mefakedHakoah
                    }
                >
                    הבא
                </Button>
            </Box>
        </Stack>
    );
};

export default Step1BasicInfo;
