// EditGradeDialog.tsx
import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";
import EditGradeTamplateForm, { Part } from "./EditGradeTamplateForm";

interface EditGradeDialogProps {
    open: boolean;
    onClose: () => void;
    report: any;       // or a proper type
    gradeType: string; // "grade1", "grade2", etc.
    onUpdate: (reportId: string, updatedReport: any) => void;
}

const EditGradeDialog: React.FC<EditGradeDialogProps> = ({
                                                             open,
                                                             onClose,
                                                             report,
                                                             gradeType,
                                                             onUpdate,
                                                         }) => {
    // 1) Safe fallback for parts
    const initialParts: Part[] =
        report?.data?.grades?.[gradeType]?.scoreData?.parts ?? [];

    // 2) Local state to hold parts (so we can edit them)
    const [parts, setParts] = useState<Part[]>(initialParts);

    // 3) Also store a local finalGrade
    const initialFinalGrade: number =
        report?.data?.grades?.[gradeType]?.scoreData?.finalGrade ?? 0;
    const [finalGrade, setFinalGrade] = useState<number>(initialFinalGrade);

    // If the dialog re-opens or the report changes, reset state
    useEffect(() => {
        const updatedParts = report?.data?.grades?.[gradeType]?.scoreData?.parts ?? [];
        setParts(updatedParts);

        const updatedFinalGrade =
            report?.data?.grades?.[gradeType]?.scoreData?.finalGrade ?? 0;
        setFinalGrade(updatedFinalGrade);
    }, [report, gradeType, open]);

    // 4) When user clicks Save, call `onUpdate` with new parts & finalGrade
    const handleSave = () => {
        const updatedReport = {
            ...report,
            data: {
                ...report.data,
                grades: {
                    ...report.data.grades,
                    [gradeType]: {
                        ...report.data.grades[gradeType],
                        scoreData: {
                            ...report.data.grades[gradeType].scoreData,
                            parts,
                            finalGrade, // store the updated final grade
                        },
                    },
                },
            },
        };
        onUpdate(report._id, updatedReport);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>ערוך מדד</DialogTitle>
            <DialogContent>
                {/* 5) Display the current final grade so the user sees live updates */}
                <Typography variant="h6" gutterBottom>
                    ציון סופי: {finalGrade.toFixed(2)}
                </Typography>

                <EditGradeTamplateForm
                    parts={parts}
                    onPartsChange={setParts}
                    onFinalGradeChange={(newGrade) => setFinalGrade(newGrade)}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>בטל</Button>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    שמור
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditGradeDialog;
