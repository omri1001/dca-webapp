// src/components/RightFilterSideBar.tsx

import React, { useState, useCallback } from 'react';
import {
    Drawer,
    Box,
    Typography,
    Stack,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider
} from '@mui/material';

interface FilterState {
    freeText: string;
    forceName: string;
    date: string;
    finalGrade: string;
    finalGradeComparator: string;
}

interface RightFilterSideBarProps {
    // We can remove “open”/“onClose” if we always want it open
    onFilter: (filters: Partial<FilterState>) => void;
    onFilterChange?: (filters: Partial<FilterState>) => void;
    currentFilters?: Partial<FilterState>; // optional for describing
}

/**
 * A permanent drawer anchored to the right,
 * always open, with top margin so it won't hide the top bar.
 */
const RightFilterSideBar: React.FC<RightFilterSideBarProps> = ({
                                                                   onFilter,
                                                                   onFilterChange,
                                                                   currentFilters
                                                               }) => {
    // Local State
    const [freeText, setFreeText] = useState('');
    const [forceName, setForceName] = useState('');
    const [date, setDate] = useState('');
    const [finalGrade, setFinalGrade] = useState('');
    const [finalGradeComparator, setFinalGradeComparator] = useState('');

    // Called when user clicks “Apply Filters”
    const handleApply = useCallback(() => {
        const filters: Partial<FilterState> = {};
        if (freeText.trim()) filters.freeText = freeText;
        if (forceName.trim()) filters.forceName = forceName;
        if (date.trim()) filters.date = date;
        if (finalGrade.trim()) filters.finalGrade = finalGrade;
        if (finalGradeComparator) filters.finalGradeComparator = finalGradeComparator;

        onFilter(filters);
        onFilterChange?.(filters);
    }, [freeText, forceName, date, finalGrade, finalGradeComparator, onFilter, onFilterChange]);

    // Called when user clicks “Clear”
    const handleClear = useCallback(() => {
        setFreeText('');
        setForceName('');
        setDate('');
        setFinalGrade('');
        setFinalGradeComparator('');
        onFilter({});
        onFilterChange?.({});
    }, [onFilter, onFilterChange]);

    return (
        <Drawer
            variant="permanent"
            anchor="right"
            sx={{
                width: 320,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 320,
                    boxSizing: 'border-box',
                    // So it doesn’t overlap the top bar:
                    marginTop: '64px', // Adjust to match your top bar’s height
                }
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    מסננים
                </Typography>
                <Divider />

                <Stack spacing={2} sx={{ mt: 2 }}>
                    <TextField
                        label="חיפוש חופשי"
                        value={freeText}
                        onChange={(e) => setFreeText(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="שם הכוח"
                        value={forceName}
                        onChange={(e) => setForceName(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="תאריך"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="ציון סופי"
                        type="number"
                        value={finalGrade}
                        onChange={(e) => setFinalGrade(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    <FormControl size="small">
                        <InputLabel>מדד</InputLabel>
                        <Select
                            value={finalGradeComparator}
                            label="Comparator"
                            onChange={(e) => setFinalGradeComparator(e.target.value)}
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="above">מעל</MenuItem>
                            <MenuItem value="below">מתחת</MenuItem>
                        </Select>
                    </FormControl>

                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" color="primary" onClick={handleApply}>
                            סנן
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleClear}>
                            נקה מסננים
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Drawer>
    );
};

export default RightFilterSideBar;
