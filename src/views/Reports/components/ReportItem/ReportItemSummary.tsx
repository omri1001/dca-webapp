import React from 'react';
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Stack,
    Divider,
} from '@mui/material';

interface ReportItemSummaryProps {
    gdod: string;
    pluga?: string;
    reportType: string;
    date: string;
    gzera?: string;
    mefakedHakoah?: string;
    exerciseManagerName?: string;
    mentorName?: string;
    hativa?: string;
    hatmar?: string;
    mission?: string;
}

const ReportItemSummary: React.FC<ReportItemSummaryProps> = ({
                                                                 gdod,
                                                                 pluga,
                                                                 reportType,
                                                                 date,
                                                                 gzera,
                                                                 mefakedHakoah,
                                                                 exerciseManagerName,
                                                                 mentorName,
                                                                 hativa,
                                                                 hatmar,
                                                                 mission,
                                                             }) => {
    const missingText = 'מידע לא קיים';

    // Title: if `pluga` exists => "דוח סיכום אימון ל{גדוד}-{פלוגה}"
    // otherwise => "דוח סיכום אימון ל{גדוד}"
    const title = pluga
        ? `  דוח סיכום אימון לגדוד ${gdod} פלוגה- ${pluga}`
        : ` דוח סיכום אימון לגדוד ${gdod} `;

    return (
        <Box sx={{ width: '100%', mt: 2, px: 1, direction: 'rtl' }}>
            {/* Wider Card with a gradient background */}
            <Card
                sx={{
                    maxWidth: 800,                 // Increased width for a wider layout
                    margin: '0 auto',             // Center horizontally
                    borderRadius: 4,
                    background: 'linear-gradient(to bottom, #607d8b, #455a64)',
                    color: '#fff',
                    boxShadow: 3,
                }}
            >
                <CardHeader
                    title={title}
                    subheader="-שמור-"
                    sx={{ textAlign: 'center' }}
                    titleTypographyProps={{
                        variant: 'h4',               // Larger title font
                        fontWeight: 'bold',
                    }}
                    subheaderTypographyProps={{
                        variant: 'h6',              // Larger subheader font
                        fontWeight: 'bold',
                        sx: { mt: 1 },              // Small top margin for spacing
                    }}
                />

                <CardContent>
                    {/*
            Using Stack with bigger font variant for each line (h6).
            You can adjust "h6" to "body1" or any variant you prefer,
            and use sx={{ fontSize: '1.2rem' }} for custom sizes.
          */}
                    <Stack
                        spacing={2}
                        divider={<Divider flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />}
                        alignItems="center"
                        textAlign="center"
                    >
                        <Typography variant="h6">
                            <strong>סוג הדוח:</strong> {reportType || missingText}
                        </Typography>

                        <Typography variant="h6">
                            <strong>תאריך:</strong> {date || missingText}
                        </Typography>

                        <Typography variant="h6">
                            <strong>גזרה:</strong> {gzera || missingText}
                        </Typography>

                        <Typography variant="h6">
                            <strong>מפקד הכוח:</strong> {mefakedHakoah || missingText}
                        </Typography>

                        <Typography variant="h6">
                            <strong>מנהל התרגיל:</strong> {exerciseManagerName || missingText}
                        </Typography>

                        <Typography variant="h6">
                            <strong>חונך:</strong> {mentorName || missingText}
                        </Typography>

                        <Typography variant="h6">
                            <strong>חטיבה:</strong> {hativa || missingText}
                        </Typography>

                        <Typography variant="h6">
                            <strong>חטמר:</strong> {hatmar || missingText}
                        </Typography>

                        <Typography variant="h6">
                            <strong>משימה:</strong> {mission || missingText}
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ReportItemSummary;
