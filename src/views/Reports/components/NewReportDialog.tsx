// src/components/NewReportDialog.tsx

import React, { useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import NewReportForm from './NewReportForm/NewReportForm.tsx';
import { NewReportData } from '../models/ReportInterface.ts';

interface NewReportDialogProps {
    open: boolean;                      // Whether the dialog is open
    onClose: () => void;               // Callback to close the dialog
    onSubmit: (data: NewReportData) => void; // Callback when the final data is ready
}

const NewReportDialog: React.FC<NewReportDialogProps> = ({
                                                             open,
                                                             onClose,
                                                             onSubmit
                                                         }) => {
    // We'll reference the NewReportForm child to call its "handleSubmit" from here
    const formRef = useRef<any>(null);

    // Called when the user clicks "שלח"
    const handleSubmit = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };

    // This function is called by the <NewReportForm> once it builds final data
    const handleFormSubmit = (data: NewReportData) => {
        onSubmit(data); // pass up to parent
        onClose();      // close the dialog
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            {/* Title with an "X" button on the top-right */}
            <DialogTitle sx={{ position: 'relative' }}>
                הוספת דו"ח חדש
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* The form content */}
            <DialogContent>
                {/**
                 * We pass a ref so we can call formRef.current.handleSubmit() from above.
                 * Also pass onSubmit callback so the child can send data up here.
                 */}
                <NewReportForm
                    ref={formRef}
                    onSubmit={handleFormSubmit}
                />
            </DialogContent>

            {/* The only explicit button in the footer is the "Submit" button */}
            <DialogActions>
                <Button onClick={handleSubmit} variant="contained">
                    שלח
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewReportDialog;
