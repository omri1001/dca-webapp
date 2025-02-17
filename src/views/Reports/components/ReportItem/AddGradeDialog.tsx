// src/views/Reports/components/AddGradeDialog.tsx
import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
} from "@mui/material";
import GradeTemplateForm, { computePartScore, Part } from "./GradeTemplateForm";
import { createDefaultParts } from "./GradeTemplate";

export type TrafficLightValue = "full" | "half" | "none" | null;
export type BinaryValue = "full" | "none" | null;

export interface ScoreCalcFormData {
    parts: Part[];
    finalGrade: number;
}

export interface IReport {
    _id: string;
    data: {
        grades: {
            grade1: {
                name: string;
                scoreData: ScoreCalcFormData;
            };
            grade2: {
                name: string;
                scoreData: ScoreCalcFormData;
            };
        };
        // ...other properties as needed
    };
}

interface AddGradeDialogProps {
    open: boolean;
    onClose: () => void;
    report: IReport;
    gradeType: "grade1" | "grade2";
    onUpdate: (id: string, updatedData: any) => void;
}

const AddGradeDialog: React.FC<AddGradeDialogProps> = ({
                                                           open,
                                                           onClose,
                                                           report,
                                                           gradeType,
                                                           onUpdate,
                                                       }) => {
    const [gradeName, setGradeName] = useState("");
    const [parts, setParts] = useState<Part[]>([]);

    useEffect(() => {
        if (open) {
            const existingGrade = report.data.grades[gradeType];
            if (!existingGrade || !existingGrade.name || existingGrade.name.trim() === "") {
                // No grade exists – load default template.
                setGradeName("");
                setParts(createDefaultParts());
            } else {
                // Grade exists – preserve its items.
                setGradeName(existingGrade.name);
                const processedParts = existingGrade.scoreData.parts.map((part) => ({
                    items: part.items.map((item) => ({
                        ...item,
                        active: item.value !== null, // Mark as active if a value exists.
                    })),
                }));
                setParts(processedParts);
            }
        }
    }, [open, report, gradeType]);

    const finalGrade = parts.reduce((acc, part) => acc + computePartScore(part), 0);

    const handleSubmit = () => {
        const updatedGrade = {
            name: gradeName,
            scoreData: {
                parts,
                finalGrade,
            },
        };

        const updatedData = {
            ...report,
            data: {
                ...report.data,
                grades: {
                    ...report.data.grades,
                    [gradeType]: updatedGrade,
                },
            },
        };

        onUpdate(report._id, updatedData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {gradeType === "grade1" ? "עריכת/הוספת מדד 1" : "עריכת/הוספת מדד 2"}
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <TextField
                        label="שם מדד"
                        value={gradeName}
                        onChange={(e) => setGradeName(e.target.value)}
                        fullWidth
                    />
                    <Typography variant="h6">מחשבון ציונים – סך הכל 100 נק'</Typography>
                    <GradeTemplateForm parts={parts} onPartsChange={setParts} />
                    <Typography variant="h6">
                        ציון סופי: {finalGrade.toFixed(2)} / 100
                    </Typography>
                </Box>
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

export default AddGradeDialog;
