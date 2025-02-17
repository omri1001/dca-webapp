import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import { IReport } from '../ReportItem';
import ScenarioInputWithAI from '../NewReportForm/ScenarioInputWithAI';

interface EditScenarioDialogProps {
    open: boolean;
    onClose: () => void;
    report: IReport;
    scenarioType: 'scenario1' | 'scenario2';
    onUpdate: (id: string, updatedData: any) => void;
}

const EditScenarioDialog: React.FC<EditScenarioDialogProps> = ({
                                                                   open,
                                                                   onClose,
                                                                   report,
                                                                   scenarioType,
                                                                   onUpdate,
                                                               }) => {
    const [scenarioText, setScenarioText] = useState('');
    const [scenarioUseAI, setScenarioUseAI] = useState(false);

    // Prefill with existing scenario data when dialog opens
    useEffect(() => {
        if (
            report.data &&
            report.data.scenarios &&
            report.data.scenarios[scenarioType]
        ) {
            setScenarioText(report.data.scenarios[scenarioType].scenarioText || '');
            setScenarioUseAI(report.data.scenarios[scenarioType].scenarioUseAI || false);
        }
    }, [report, scenarioType, open]);

    const handleSubmit = () => {
        const updatedScenario = {
            scenarioText,
            scenarioUseAI,
        };

        const updatedData = {
            ...report,
            data: {
                ...report.data,
                scenarios: {
                    ...report.data?.scenarios,
                    [scenarioType]: updatedScenario,
                },
            },
        };

        onUpdate(report._id, updatedData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {scenarioType === 'scenario1' ? 'ערוך תמליל (תרחיש 1)' : 'ערוך תמליל (תרחיש 2)'}
            </DialogTitle>
            <DialogContent>
                <ScenarioInputWithAI
                    label="תיאור התרחיש"
                    scenarioText={scenarioText}
                    setScenarioText={setScenarioText}
                    scenarioUseAI={scenarioUseAI}
                    setScenarioUseAI={setScenarioUseAI}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>ביטול</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    עדכון
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditScenarioDialog;
