// ChronologicItem.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Collapse,
    Tooltip,
    IconButton,
} from '@mui/material';
// Eye icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { Item, ItemValue } from './questionsModel';
import TrafficMethod from './TrafficMethod';
import BinaryMethod from './BinaryMethod';

export interface ChronologicItemProps {
    partIndex: number;
    itemIndex: number;
    item: Item;
    handleItemChoice: (
        partIndex: number,
        itemIndex: number,
        value: ItemValue | 'notRelevant' | null
    ) => void;
    handleItemSelected?: () => void;
    handleItemReopen?: () => void;
}

const defaultTrafficText = { full: 'קרה', half: 'חלקי', none: 'לא קרה' };
const defaultBinaryText = { full: 'קרה', none: 'לא קרה' };

const ChronologicItem: React.FC<ChronologicItemProps> = ({
                                                             partIndex,
                                                             itemIndex,
                                                             item,
                                                             handleItemChoice,
                                                             handleItemSelected,
                                                             handleItemReopen,
                                                         }) => {
    const [isRelevant, setIsRelevant] = useState(item.value !== 'notRelevant');
    const [selectedMode, setSelectedMode] = useState(false);

    useEffect(() => {
        // Keep isRelevant in sync with item.value
        setIsRelevant(item.value !== 'notRelevant');
    }, [item.value]);

    const toggleRelevant = () => {
        if (isRelevant) {
            handleItemChoice(partIndex, itemIndex, 'notRelevant');
            setIsRelevant(false);
        } else {
            handleItemChoice(partIndex, itemIndex, null);
            setIsRelevant(true);
        }
    };

    const onSelectAnswer = (value: ItemValue) => {
        handleItemChoice(partIndex, itemIndex, value);
        setSelectedMode(true);
        handleItemSelected?.();
    };

    const onReopenItem = () => {
        handleItemChoice(partIndex, itemIndex, null);
        setSelectedMode(false);
        handleItemReopen?.();
    };

    // Tooltip includes question number, part, and category
    const tooltipContent = `Part: ${item.part} | Category: ${item.category} | שאלה ${item.questionNumber}`;

    // Get label (e.g. "קרה") for the selected value
    const getChosenAnswerLabel = (): string => {
        if (item.value === 'full' || item.value === 'half' || item.value === 'none') {
            const answerText =
                item.answerText ??
                (item.type === 'binary' ? defaultBinaryText : defaultTrafficText);

            switch (item.value) {
                case 'full':
                    return answerText.full;
                case 'half':
                    return answerText.half ?? '';
                case 'none':
                    return answerText.none;
            }
        }
        return '';
    };

    // Responsive font for item name
    const questionLabelStyles = {
        fontSize: {
            xs: '1.4rem',
            sm: '1.6rem',
            md: '1.8rem',
            lg: '2rem',
        },
        fontWeight: 500,
    };

    const chosenAnswerLabel = getChosenAnswerLabel();

    return (
        <Tooltip title={tooltipContent} arrow>
            <Box
                sx={{
                    mb: 2,
                    borderRadius: 2,
                    border: selectedMode ? '2px solid primary.main' : '2px solid #ccc',
                    overflow: 'hidden',
                    direction: 'rtl',     // Important for RTL
                    textAlign: 'right',   // Text is right-aligned
                }}
            >
                {/* HEADER */}
                {!selectedMode ? (
                    // ── Mode: NOT SELECTED ──────────────────────────
                    <Box
                        sx={{
                            py: 2,
                            px: 3,
                            backgroundColor: '#424242',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start', // In RTL, "start" = right side
                            gap: 2,
                        }}
                    >
                        {/* 1) Item Name (RIGHTMOST) */}
                        <Typography variant="h6" sx={questionLabelStyles}>
                            {item.name}
                        </Typography>

                        {/* 2) Eye Icon to the LEFT of the Name */}
                        <IconButton
                            onClick={toggleRelevant}
                            sx={{
                                color: '#40E0D0',
                                '&:hover': {
                                    backgroundColor: 'rgba(64,224,208,0.15)',
                                },
                            }}
                        >
                            {isRelevant ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                    </Box>
                ) : (
                    // ── Mode: SELECTED ──────────────────────────────
                    <Box
                        sx={{
                            py: 2,
                            px: 3,
                            backgroundColor: '#424242',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start', // again "start" is right in RTL
                            gap: 2,
                        }}
                    >
                        {/* 1) Item Name (RIGHTMOST) */}
                        <Typography variant="h6" sx={questionLabelStyles}>
                            {item.name}
                        </Typography>

                        {/* 2) "נשמר : ..." */}
                        <Typography
                            sx={{
                                color: '#40E0D0',
                                fontSize: {
                                    xs: '1.2rem',
                                    sm: '1.3rem',
                                    md: '1.4rem',
                                    lg: '1.5rem',
                                },
                            }}
                        >
                            {`נשמר : ${chosenAnswerLabel}`}
                        </Typography>

                        {/* 3) ערוך Button (LEFTMOST) */}
                        <Button
                            variant="outlined"
                            onClick={onReopenItem}
                            sx={{
                                color: '#fff',
                                borderColor: '#fff',
                                textTransform: 'none',
                                fontSize: {
                                    xs: '1rem',
                                    sm: '1.1rem',
                                    md: '1.2rem',
                                    lg: '1.3rem',
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    borderColor: '#fff',
                                },
                            }}
                        >
                            ערוך
                        </Button>
                    </Box>
                )}

                {/* COLLAPSIBLE BODY */}
                <Collapse in={isRelevant} timeout="auto" unmountOnExit>
                    <Box
                        sx={{
                            py: 3,
                            px: 3,
                            backgroundColor: '#424242',
                            color: 'white',
                            textAlign: 'right',
                        }}
                    >
                        {/* Show answer buttons if not selected */}
                        {!selectedMode && (
                            <>
                                {item.type === 'trafficLight' && (
                                    <TrafficMethod
                                        selectedValue={item.value}
                                        onSelectAnswer={onSelectAnswer}
                                        answerText={item.answerText ?? defaultTrafficText}
                                    />
                                )}

                                {item.type === 'binary' && (
                                    <BinaryMethod
                                        selectedValue={item.value}
                                        onSelectAnswer={onSelectAnswer}
                                        answerText={item.answerText ?? defaultBinaryText}
                                    />
                                )}
                            </>
                        )}
                    </Box>
                </Collapse>
            </Box>
        </Tooltip>
    );
};

export default ChronologicItem;
