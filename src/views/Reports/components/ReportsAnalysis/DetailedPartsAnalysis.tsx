// DetailedPartsAnalysis.tsx
import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    Divider,
    useTheme,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    CardContent,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams, useLocation } from 'react-router-dom';
import ScenarioSummary from './ScenarioSummary'; // adjust import path as needed
import { IReport } from '../ReportItem';
import { renderThreeColumnsForGrade } from './DetailedPartsAnalysis/renderHelpers';

const DetailedPartsAnalysis: React.FC<{ reports: IReport[] }> = ({ reports }) => {
    const theme = useTheme();
    const { gdod } = useParams<{ gdod: string }>();
    const location = useLocation();

    // Scroll to the report card whose id matches the URL hash after a small delay.
    useEffect(() => {
        if (location.hash) {
            const elementId = location.hash.substring(1); // remove '#' character
            // Delay scrolling to ensure the DOM has rendered the element
            setTimeout(() => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    console.warn(`Element with id ${elementId} not found.`);
                }
            }, 300); // Adjust delay if needed
        }
    }, [location.hash]);

    // Filter reports by the gdod from the URL.
    const filteredReports = gdod
        ? reports.filter((report) => report.gdod === gdod)
        : reports;

    if (filteredReports.length === 0) {
        return (
            <Box sx={{ mt: 4, direction: 'rtl' }}>
                <Typography variant="h6" align="center">
                    אין נתונים עבור גדוד {gdod}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4, direction: 'rtl' }}>


            {filteredReports.map((report, reportIndex) => {
                const { gdod, pluga } = report;
                const cardTitle = pluga
                    ? `התפלגות מדדים עבור פלוגה ${pluga} בגדוד ${gdod}`
                    : gdod
                        ? `התפלגות מדדים עבור גדוד ${gdod}`
                        : `דוח ${reportIndex + 1}`;

                // For the summary accordion title:
                const summaryTitle = pluga
                    ? `סיכום עבור גדוד ${gdod} - פלוגה ${pluga}`
                    : `סיכום עבור גדוד - ${gdod}`;

                const grade1 = report.data?.grades?.grade1;
                const grade2 = report.data?.grades?.grade2;
                const summary = report.data?.scenarios?.summary;

                // If there's no scenario data at all, skip rendering
                if (!grade1 && !grade2 && !summary) return null;

                return (
                    // Wrap the entire report in an Accordion
                    <Accordion
                        key={reportIndex}
                        id={report.primaryKey || report._id} // so we can scroll to it if needed
                        sx={{ mb: 4 }}
                    >
                        {/* AccordionSummary for the entire report */}
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {cardTitle}
                            </Typography>
                        </AccordionSummary>

                        {/* AccordionDetails holds the original Card (and the sub-accordions) */}
                        <AccordionDetails>
                            <Card
                                sx={{
                                    p: 2,
                                    backgroundColor: theme.palette.background.paper,
                                    color: theme.palette.text.primary,
                                    boxShadow: 3,
                                    maxWidth: 1200,
                                    margin: '0 auto',
                                }}
                            >
                                <CardContent>
                                    {/* Sub-Accordion for Scenario 1 */}
                                    {grade1 && (
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    תרחיש 1
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {renderThreeColumnsForGrade(grade1, 'תרחיש 1', theme)}
                                            </AccordionDetails>
                                        </Accordion>
                                    )}

                                    {/* Optional divider if both scenario 1 & 2 exist */}
                                    {grade1 && grade2 && (
                                        <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />
                                    )}

                                    {/* Sub-Accordion for Scenario 2 */}
                                    {grade2 && (
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    תרחיש 2
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {renderThreeColumnsForGrade(grade2, 'תרחיש 2', theme)}
                                            </AccordionDetails>
                                        </Accordion>
                                    )}

                                    {/* Optional divider if scenarios and summary exist */}
                                    {(grade1 || grade2) && summary && (
                                        <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />
                                    )}

                                    {/* Sub-Accordion for Summary */}
                                    {summary && (
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    {summaryTitle}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <ScenarioSummary summary={summary} />
                                            </AccordionDetails>
                                        </Accordion>
                                    )}
                                </CardContent>
                            </Card>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </Box>
    );
};

export default DetailedPartsAnalysis;
