import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import { IReport } from '../ReportItem';
import ScenarioInputWithAI from '../NewReportForm/ScenarioInputWithAI';

interface AddScenarioDialogProps {
    open: boolean;
    onClose: () => void;
    report: IReport;
    scenarioType: 'scenario1' | 'scenario2';
    onUpdate: (id: string, updatedData: any) => void;
}

const AddScenarioDialog: React.FC<AddScenarioDialogProps> = ({
                                                                 open,
                                                                 onClose,
                                                                 report,
                                                                 scenarioType,
                                                                 onUpdate,
                                                             }) => {
    // Initially empty text and AI usage = false
    const [scenarioText, setScenarioText] = useState('');
    const [scenarioUseAI, setScenarioUseAI] = useState(false);

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
                {scenarioType === 'scenario1' ? 'הוסף תמליל (תרחיש 1)' : 'הוסף תמליל (תרחיש 2)'}
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
                    שמירה
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddScenarioDialog;
