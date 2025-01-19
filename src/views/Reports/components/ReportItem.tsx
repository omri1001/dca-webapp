// src/components/ReportItem.tsx
import React, { useState } from 'react';
import {
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Link,
    Divider,
    Stack,
    IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';

import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar
} from 'recharts';

// Import your EditReportDialog (shown below)
import EditReportDialog from './EditReportDialog';

/**
 * If you already have parseNumber in a separate utility file,
 * import it like:
 * import { parseNumber } from 'path/to/utils';
 * Otherwise, define inline here for convenience:
 */
function parseNumber(val: any): number {
    if (typeof val === 'number') return val;
    if (val && typeof val === 'object') {
        if ('$numberInt' in val) {
            const parsed = parseInt(val.$numberInt, 10);
            return isNaN(parsed) ? 0 : parsed;
        }
        if ('$numberDouble' in val) {
            const parsed = parseFloat(val.$numberDouble);
            return isNaN(parsed) ? 0 : parsed;
        }
    }
    return 0;
}

// Interfaces
interface GradesItemsObject {
    [key: string]: number | { $numberInt?: string; $numberDouble?: string };
}

interface Category {
    items: GradesItemsObject;
    comment: string;
    average: number;
}

export interface IReport {
    _id: string;
    primary_key: string;
    date: string;
    time: string;
    force_name: string;
    manager: string;
    location: string;
    scenarios: {
        scenario_1: string;
        scenario_2: string;
        // scenario_1_AI_used?: boolean; // optional if you want to store AI usage
        // scenario_2_AI_used?: boolean;
    };
    grades: {
        'פיקוד ושליטה'?: Category;
        'עבודת קשר'?: Category;
    };
}

interface ReportItemProps {
    report: IReport;
}

// Convert GradesItemsObject to Recharts data array
function itemsToChartData(items: GradesItemsObject) {
    return Object.entries(items).map(([key, val]) => ({
        name: key,
        value: parseNumber(val)
    }));
}

const ReportItem: React.FC<ReportItemProps> = ({ report }) => {
    // State to control the Edit Dialog
    const [editOpen, setEditOpen] = useState(false);

    // Handlers for opening/closing the Edit dialog
    const handleEditOpen = () => setEditOpen(true);
    const handleEditClose = () => setEditOpen(false);

    // Handler when user saves the updated report
    // (Integrate your PUT request or API call here)
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
                window.location.reload()
                // Optionally, you could refresh your list of reports here
                // or update this item in your local state, etc.
            } else {
                console.error('Update failed:', result.error);
            }
        } catch (err) {
            console.error('Update error:', err);
        }

        // Close the dialog
        setEditOpen(false);
    };


    // Destructure your categories for the charts
    const cat1 = report.grades['פיקוד ושליטה'];
    const cat2 = report.grades['עבודת קשר'];

    const cat1Data = cat1 ? itemsToChartData(cat1.items) : [];
    const cat2Data = cat2 ? itemsToChartData(cat2.items) : [];

    // Compute final grade
    let finalGrade = 0;
    if (cat1 && cat2) {
        finalGrade = (cat1.average + cat2.average) / 2;
    } else if (cat1) {
        finalGrade = cat1.average;
    } else if (cat2) {
        finalGrade = cat2.average;
    }

    // Helper function to render the chart
    const renderChart = (data: Array<{ name: string; value: number }>) => (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );

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
                            <Typography variant="body2">שעה: {report.time}</Typography>
                        </Box>

                        {/* Scenario 1 */}
                        <Divider />
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

                        {/* Graph: פיקוד ושליטה */}
                        <Divider />
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                פיקוד ושליטה
                            </Typography>
                            {cat1 ? (
                                <>
                                    {renderChart(cat1Data)}
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        הערות : {cat1.comment}
                                        <br />
                                        ציון החלק: {cat1.average}
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body2" color="error">
                                    No data available
                                </Typography>
                            )}
                        </Box>

                        {/* Graph: עבודת קשר */}
                        <Divider />
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                עבודת קשר
                            </Typography>
                            {cat2 ? (
                                <>
                                    {renderChart(cat2Data)}
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        הערות: {cat2.comment}
                                        <br />
                                        ציון החלק: {cat2.average}
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body2" color="error">
                                    No data available
                                </Typography>
                            )}
                        </Box>

                        {/* Final grade */}
                        <Divider />
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                ציון סופי: {finalGrade.toFixed(2)}
                            </Typography>
                        </Box>

                        {/* Additional links */}
                        <Divider />
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                לינקים נוספים
                            </Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                                <Link href="#" target="_blank" rel="noopener">
                                    קישור לסרטון תרגיל
                                </Link>{' '}
                                (בפיתוח)
                            </Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                                <Link href="#" target="_blank" rel="noopener">
                                    קישור לסקרי מתאמנים
                                </Link>{' '}
                                (בפיתוח)
                            </Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                                <Link
                                    href={`http://localhost:3001/api/reports/download-doc/${report._id}`}
                                    download
                                    target="_blank"
                                    rel="noopener"
                                >
                                    הורדת דו"ח (DOCX)
                                </Link>
                                (בפיתוח)
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
