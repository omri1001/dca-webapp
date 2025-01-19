// src/components/EditReportDialog.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import { IReport } from './ReportItem.tsx'; // Adjust the import path
import NewReportForm from './NewReportForm/NewReportForm.tsx';
import { NewReportData } from '../models/ReportInterface.ts';

interface EditReportDialogProps {
    open: boolean;
    onClose: () => void;
    report: IReport | null; // The report to edit
    onUpdate: (id: string, data: NewReportData) => void; // Callback to handle the actual update
}

const EditReportDialog: React.FC<EditReportDialogProps> = ({
                                                               open,
                                                               onClose,
                                                               report,
                                                               onUpdate
                                                           }) => {
    const formRef = useRef<any>(null);

    // We only open this if we have a valid report
    if (!report) return null;

    const handleSave = () => {
        // We'll call the handleSubmit method of NewReportForm via ref
        if (formRef.current && formRef.current.handleSubmit) {
            formRef.current.handleSubmit();
        }
    };

    const handleFormSubmit = (data: NewReportData) => {
        // Here you can do the PUT request to your server or call the parent callback
        onUpdate(report._id, data);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>עריכת דו"ח</DialogTitle>
            <DialogContent>
                {/*
          Reuse your NewReportForm but pass an "initialData" prop
          so it can populate states with existing report data
        */}
                <NewReportForm
                    ref={formRef}
                    onSubmit={handleFormSubmit}
                    initialData={report} // <-- we'll add support for this in NewReportForm
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>בטל</Button>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    שמירה
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditReportDialog;
