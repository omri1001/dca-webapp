import React, { useState, useCallback } from 'react';
import {
    Drawer,
    Box,
    Typography,
    Stack,
    TextField,
    Button,
    Divider,
} from '@mui/material';

interface FilterState {
    freeText: string;
    gdod: string;
    pluga: string;
    gzera: string;
    mission: string;
    mentorName: string;
    date: string;
    hativa: string;
    hatmar: string;
}

interface RightFilterSideBarProps {
    onFilter: (filters: Partial<FilterState>) => void;
    onFilterChange?: (filters: Partial<FilterState>) => void;
    currentFilters?: Partial<FilterState>;
}

const RightFilterSideBar: React.FC<RightFilterSideBarProps> = ({
                                                                   onFilter,
                                                                   onFilterChange,
                                                                   currentFilters,
                                                               }) => {
    const [freeText, setFreeText] = useState('');
    const [gdod, setGdod] = useState('');
    const [pluga, setPluga] = useState('');
    const [gzera, setGzera] = useState('');
    const [mission, setMission] = useState('');
    const [mentorName, setMentorName] = useState('');
    const [date, setDate] = useState('');
    const [hativa, setHativa] = useState('');
    const [hatmar, setHatmar] = useState('');

    const handleApply = useCallback(() => {
        const filters: Partial<FilterState> = {};
        if (freeText.trim()) filters.freeText = freeText;
        if (gdod.trim()) filters.gdod = gdod;
        if (pluga.trim()) filters.pluga = pluga;
        if (gzera.trim()) filters.gzera = gzera;
        if (mission.trim()) filters.mission = mission;
        if (mentorName.trim()) filters.mentorName = mentorName;
        if (date.trim()) filters.date = date;
        if (hativa.trim()) filters.hativa = hativa;
        if (hatmar.trim()) filters.hatmar = hatmar;

        onFilter(filters);
        onFilterChange?.(filters);
    }, [freeText, gdod, pluga, gzera, mission, mentorName, date, hativa, hatmar, onFilter, onFilterChange]);

    const handleClear = useCallback(() => {
        setFreeText('');
        setGdod('');
        setPluga('');
        setGzera('');
        setMission('');
        setMentorName('');
        setDate('');
        setHativa('');
        setHatmar('');
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
                    marginTop: '64px', // To prevent overlapping with top bar
                },
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    מסננים
                </Typography>
                <Divider />
                <Stack spacing={2} sx={{ mt: 2 }}>
                    <TextField
                        label="טקסט חופשי"
                        value={freeText}
                        onChange={(e) => setFreeText(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="גדוד"
                        value={gdod}
                        onChange={(e) => setGdod(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="פלוגה"
                        value={pluga}
                        onChange={(e) => setPluga(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="גזרה"
                        value={gzera}
                        onChange={(e) => setGzera(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="משימה"
                        value={mission}
                        onChange={(e) => setMission(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="חונך"
                        value={mentorName}
                        onChange={(e) => setMentorName(e.target.value)}
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
                        label="חטיבה"
                        value={hativa}
                        onChange={(e) => setHativa(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="חטיבה מרחבית"
                        value={hatmar}
                        onChange={(e) => setHatmar(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
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
