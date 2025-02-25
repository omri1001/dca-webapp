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
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { Item, ItemValue, ExtraSubItem, ExtraGroup } from './questionsModel';
import TrafficMethod from './TrafficMethod';
import BinaryMethod from './BinaryMethod';

// Helper: Determine if a value is a single ExtraSubItem (leaf) versus a group of sub–items.
function isExtraSubItem(value: ExtraSubItem | ExtraGroup): value is ExtraSubItem {
    return (value as ExtraSubItem).type !== undefined;
}

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
    // Handler for extra (sub–item) answers
    handleExtraAnswer?: (
        partIndex: number,
        itemIndex: number,
        extraKey: string,
        answer: any
    ) => void;
}

const defaultTrafficText = { full: 'קרה', half: 'חלקי', none: 'לא קרה' };
const defaultBinaryText = { full: 'קרה', none: 'לא קרה' };

const answerBoxStyles = {
    width: '100%',
    p: 2,
    mt: 1,
    fontSize: {
        xs: '1rem',
        sm: '1.1rem',
        md: '1.2rem',
        lg: '1.3rem',
    },
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
};

const ChronologicItem: React.FC<ChronologicItemProps> = ({
                                                             partIndex,
                                                             itemIndex,
                                                             item,
                                                             handleItemChoice,
                                                             handleItemSelected,
                                                             handleItemReopen,
                                                             handleExtraAnswer,
                                                         }) => {
    const [isRelevant, setIsRelevant] = useState(item.value !== 'notRelevant');
    const [selectedMode, setSelectedMode] = useState(false);
    const [majorOpen, setMajorOpen] = useState<Record<string, boolean>>({});
    const [subOpen, setSubOpen] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setIsRelevant(item.value !== 'notRelevant');
        if (item.extra) {
            // Default each major group to open
            const defaults: Record<string, boolean> = {};
            Object.keys(item.extra).forEach((key) => {
                defaults[key] = true;
            });
            setMajorOpen(defaults);
        }
    }, [item.value, item.extra]);

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

    const tooltipContent = `Part: ${item.part} | Category: ${item.category} | שאלה ${item.questionNumber}`;

    const getChosenAnswerLabel = (): string => {
        if (
            item.value === 'full' ||
            item.value === 'half' ||
            item.value === 'none'
        ) {
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

    const questionLabelStyles = {
        fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem', lg: '2rem' },
        fontWeight: 500,
    };

    const chosenAnswerLabel = getChosenAnswerLabel();

    // For extra answers, if available, assume item.value holds an object.
    const currentExtraAnswers =
        item.extra && item.value && typeof item.value === 'object'
            ? (item.value as Record<string, any>)
            : {};

    const toggleMajor = (majorKey: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setMajorOpen((prev) => ({ ...prev, [majorKey]: !prev[majorKey] }));
    };

    const toggleSubItem = (combinedKey: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSubOpen((prev) => ({ ...prev, [combinedKey]: !prev[combinedKey] }));
    };

    // Render the answer buttons for a sub–item.
    const renderButtonGroup = (
        combinedKey: string,
        subItem: ExtraSubItem,
        currentValue: string | null | undefined
    ) => {
        switch (subItem.type) {
            case 'trafficLight':
                return (
                    <Box sx={answerBoxStyles}>
                        <TrafficMethod
                            selectedValue={currentValue}
                            onSelectAnswer={(value) => {
                                handleExtraAnswer?.(partIndex, itemIndex, combinedKey, value);
                            }}
                            answerText={subItem.answerText}
                        />
                    </Box>
                );
            case 'binary':
                return (
                    <Box sx={answerBoxStyles}>
                        <BinaryMethod
                            selectedValue={currentValue}
                            onSelectAnswer={(value) => {
                                handleExtraAnswer?.(partIndex, itemIndex, combinedKey, value);
                            }}
                            answerText={subItem.answerText}
                        />
                    </Box>
                );
            default:
                return null;
        }
    };

    // Render the complete extra structure (major groups and sub–items)
    const renderExtraContent = () => {
        if (!item.extra) return null;
        return Object.keys(item.extra).map((majorKey) => {
            const extraData = item.extra![majorKey];
            if (isExtraSubItem(extraData)) {
                // Single extra sub–item
                const currentValue = currentExtraAnswers[majorKey];
                return (
                    <Box key={majorKey} sx={{ mt: 2 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                cursor: 'pointer',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: { xs: '1.3rem', sm: '1.4rem', md: '1.5rem', lg: '1.6rem' },
                                    fontWeight: 500,
                                    textAlign: 'right',
                                }}
                            >
                                {majorKey}
                            </Typography>
                            <IconButton
                                sx={{ color: '#ff69b4' }}
                                onClick={(e) => toggleMajor(majorKey, e)}
                            >
                                {majorOpen[majorKey] ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                        </Box>
                        <Collapse in={majorOpen[majorKey]} unmountOnExit>
                            <Box sx={{ ml: 3, mt: 1 }}>
                                {renderButtonGroup(majorKey, extraData as ExtraSubItem, currentValue)}
                            </Box>
                        </Collapse>
                    </Box>
                );
            } else {
                // extraData is a group of sub–items
                const groupData = extraData as ExtraGroup;
                return (
                    <Box key={majorKey} sx={{ mt: 2 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                cursor: 'pointer',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: { xs: '1.3rem', sm: '1.4rem', md: '1.5rem', lg: '1.6rem' },
                                    fontWeight: 500,
                                    textAlign: 'right',
                                }}
                            >
                                {majorKey}
                            </Typography>
                            <IconButton
                                sx={{ color: '#ff69b4' }}
                                onClick={(e) => toggleMajor(majorKey, e)}
                            >
                                {majorOpen[majorKey] ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                        </Box>
                        <Collapse in={majorOpen[majorKey]} unmountOnExit>
                            <Box sx={{ ml: 3, mt: 1 }}>
                                {Object.keys(groupData).map((subKey) => {
                                    const combinedKey = `${majorKey}.${subKey}`;
                                    const currentValue = currentExtraAnswers[combinedKey];
                                    return (
                                        <Box key={combinedKey} sx={{ mt: 2, ml: 3 }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    cursor: 'pointer',
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem', lg: '1.5rem' },
                                                        fontWeight: 400,
                                                        textAlign: 'right',
                                                    }}
                                                >
                                                    {subKey}
                                                </Typography>
                                                <IconButton
                                                    sx={{ color: '#9c27b0' }}
                                                    onClick={(e) => toggleSubItem(combinedKey, e)}
                                                >
                                                    {subOpen[combinedKey] ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                </IconButton>
                                            </Box>
                                            <Collapse in={subOpen[combinedKey]} unmountOnExit>
                                                <Box sx={{ ml: 4, mt: 1 }}>
                                                    {renderButtonGroup(combinedKey, groupData[subKey], currentValue)}
                                                </Box>
                                            </Collapse>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Collapse>
                    </Box>
                );
            }
        });
    };

    return (
        <Tooltip title={tooltipContent} arrow>
            <Box
                sx={{
                    mb: 2,
                    borderRadius: 2,
                    border: selectedMode ? '2px solid primary.main' : '2px solid #ccc',
                    overflow: 'hidden',
                    direction: 'rtl',
                    textAlign: 'right',
                }}
            >
                {/* HEADER */}
                {!selectedMode ? (
                    <Box
                        sx={{
                            py: 2,
                            px: 3,
                            backgroundColor: '#424242',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: 2,
                        }}
                    >
                        <Typography variant="h6" sx={questionLabelStyles}>
                            {item.name}
                        </Typography>
                        <IconButton
                            onClick={toggleRelevant}
                            sx={{
                                color: '#40E0D0',
                                '&:hover': { backgroundColor: 'rgba(64,224,208,0.15)' },
                            }}
                        >
                            {isRelevant ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            py: 2,
                            px: 3,
                            backgroundColor: '#424242',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: 2,
                        }}
                    >
                        <Typography variant="h6" sx={questionLabelStyles}>
                            {item.name}
                        </Typography>
                        <Typography
                            sx={{
                                color: '#40E0D0',
                                fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem', lg: '1.5rem' },
                            }}
                        >
                            {`נשמר : ${chosenAnswerLabel}`}
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={onReopenItem}
                            sx={{
                                color: '#fff',
                                borderColor: '#fff',
                                textTransform: 'none',
                                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem', lg: '1.3rem' },
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: '#fff' },
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
                        {item.extra ? (
                            renderExtraContent()
                        ) : (
                            !selectedMode && (
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
                            )
                        )}
                    </Box>
                </Collapse>
            </Box>
        </Tooltip>
    );
};

export default ChronologicItem;
