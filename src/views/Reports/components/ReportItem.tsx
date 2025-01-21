import React, { useState } from 'react';
import {
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Stack,
    IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';

// Import your EditReportDialog
import EditReportDialog from './EditReportDialog';

/**
 * Minimal interface reflecting only the fields you want to display.
 */
export interface IReport {
    _id: string;
    date: string;
    force_name: string;
    manager: string;
    location: string;
    scenarios: {
        scenario_1: string;
        scenario_2: string;
    };
}

interface ReportItemProps {
    report: IReport;
}

const ReportItem: React.FC<ReportItemProps> = ({ report }) => {
    // State to control the Edit Dialog
    const [editOpen, setEditOpen] = useState(false);

    const handleEditOpen = () => setEditOpen(true);
    const handleEditClose = () => setEditOpen(false);

    // Handler when user saves the updated report
    const handleUpdate = async (id: string, updatedData: any) => {
        console.log('Updated data for ID:', id, updatedData);

        try {
            // Call your server's PUT endpoint to update the report
            const response = await fetch(`http://localhost:3001/api/reports/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            const result = await response.json();
            if (result.success) {
                console.log('Update successful:', result.data);
                // Reload or re-fetch as needed
                window.location.reload();
            } else {
                console.error('Update failed:', result.error);
            }
        } catch (err) {
            console.error('Update error:', err);
        }

        // Close the dialog
        setEditOpen(false);
    };

    return (
        <>
            <Accordion disableGutters sx={{ marginBottom: 2, border: '1px solid #ccc' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box
                        sx={{
                            width: '100%',
                            textAlign: 'right',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                שם הכוח: {report.force_name}
                            </Typography>
                            <Typography variant="body2">
                                תאריך: {report.date} , מיקום: {report.location}
                            </Typography>
                        </Box>
                        {/* Edit button */}
                        <IconButton onClick={handleEditOpen} size="small" sx={{ ml: 2 }}>
                            <EditIcon />
                        </IconButton>
                    </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ textAlign: 'right' }}>
                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                מנהל התרגיל: {report.manager}
                            </Typography>
                        </Box>

                        {/* Scenario 1 */}
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                תרחיש ראשון
                            </Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                {report.scenarios.scenario_1}
                            </Typography>
                        </Box>

                        {/* Scenario 2 */}
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1, mt: 2 }}>
                                תרחיש שני
                            </Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                {report.scenarios.scenario_2}
                            </Typography>
                        </Box>
                    </Stack>
                </AccordionDetails>
            </Accordion>

            {/* Dialog for Editing the report */}
            <EditReportDialog
                open={editOpen}
                onClose={handleEditClose}
                report={report}
                onUpdate={handleUpdate}
            />
        </>
    );
};

export default ReportItem;
