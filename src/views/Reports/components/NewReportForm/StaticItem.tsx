// StaticItem.tsx
import React from 'react';
import {
    Box,
    Typography,
    Collapse,
    IconButton,
    Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import TrafficMethod from './TrafficMethod';
import BinaryMethod from './BinaryMethod';
import { Item, ExtraSubItem, ExtraGroup } from './questionsModel';

export interface StaticItemProps {
    partIndex: number;
    itemIndex: number;
    item: Item;
    handleExtraAnswer: (
        partIndex: number,
        itemIndex: number,
        extraKey: string,
        answer: any
    ) => void;
}

/** Checks if a value is a single ExtraSubItem (leaf) or a group of sub–items. */
function isExtraSubItem(value: ExtraSubItem | ExtraGroup): value is ExtraSubItem {
    return (value as ExtraSubItem).type !== undefined;
}

// Default texts if the sub–items do not define them
const defaultTrafficAnswerText = {
    full: 'קיים (1)',
    half: 'חלקי (0.5)',
    none: 'לא קיים (0)',
};
const defaultBinaryAnswerText = {
    full: 'קיים (1)',
    none: 'לא קיים (0)',
};

/** Common styles for TrafficMethod / BinaryMethod wrappers. */
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

const StaticItem: React.FC<StaticItemProps> = ({
                                                   partIndex,
                                                   itemIndex,
                                                   item,
                                                   handleExtraAnswer,
                                               }) => {
    // Toggle for the entire item
    const [openItem, setOpenItem] = React.useState(false);

    // Toggles for major groups
    const [majorOpen, setMajorOpen] = React.useState<Record<string, boolean>>(() => {
        if (item.extra) {
            return Object.keys(item.extra).reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {} as Record<string, boolean>);
        }
        return {};
    });

    // Toggles for sub–items
    const [subOpen, setSubOpen] = React.useState<Record<string, boolean>>({});

    // Safely handle item.value if it's not an object
    const currentExtraAnswers =
        item.value && typeof item.value === 'object' ? item.value : {};

    // Top-level toggle
    const toggleItem = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenItem((prev) => !prev);
    };

    // Major group toggle
    const toggleMajor = (key: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setMajorOpen((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // Sub–item toggle
    const toggleSubItem = (combinedKey: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSubOpen((prev) => ({ ...prev, [combinedKey]: !prev[combinedKey] }));
    };

    /** Render traffic-light buttons. */
    function renderTrafficLightButtons(
        combinedKey: string,
        currentValue: string | null | undefined,
        answerText = defaultTrafficAnswerText
    ) {
        return (
            <Box sx={answerBoxStyles}>
                <TrafficMethod
                    selectedValue={currentValue}
                    onSelectAnswer={(value) =>
                        handleExtraAnswer(partIndex, itemIndex, combinedKey, value)
                    }
                    answerText={answerText}
                />
            </Box>
        );
    }

    /** Render binary buttons. */
    function renderBinaryButtons(
        combinedKey: string,
        currentValue: string | null | undefined,
        answerText = defaultBinaryAnswerText
    ) {
        return (
            <Box sx={answerBoxStyles}>
                <BinaryMethod
                    selectedValue={currentValue}
                    onSelectAnswer={(value) =>
                        handleExtraAnswer(partIndex, itemIndex, combinedKey, value)
                    }
                    answerText={answerText}
                />
            </Box>
        );
    }

    /** Decide which button group to render. */
    function renderButtonGroup(
        subItem: ExtraSubItem,
        combinedKey: string,
        currentValue: string | null | undefined
    ) {
        const { type, answerText } = subItem;
        switch (type) {
            case 'trafficLight':
                return renderTrafficLightButtons(combinedKey, currentValue, answerText);
            case 'binary':
                return renderBinaryButtons(combinedKey, currentValue, answerText);
            default:
                return null;
        }
    }

    // We'll display the item name in the top label
    const label = item.name;
    // Hover info with part, category, question number
    const tooltipContent = `Part: ${item.part} | Category: ${item.category} | שאלה ${item.questionNumber}`;

    return (
        <Box
            sx={{
                mb: 2,
                p: 3,
                width: '100%',
                borderRadius: 1,
                border: openItem ? '2px solid primary.main' : '1px solid #ccc',
                transition: 'all 0.3s ease',
                boxShadow: openItem ? '0px 0px 10px rgba(0,0,0,0.2)' : 'none',
                textAlign: 'right',
                direction: 'rtl', // Right-to-left environment
            }}
        >
            {/* ───── Top-Level Item Header ───── */}
            <Tooltip title={tooltipContent} arrow>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start', // physically the right in RTL
                        gap: 2,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Item name on the right (in RTL) */}
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: {
                                xs: '1.4rem',
                                sm: '1.6rem',
                                md: '1.8rem',
                                lg: '2rem',
                            },
                            fontWeight: 500,
                        }}
                    >
                        {label}
                    </Typography>

                    {/* Eye icon => Green */}
                    <IconButton
                        sx={{ color: 'green' }} // Top-level item: green
                        onClick={toggleItem}
                    >
                        {openItem ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                </Box>
            </Tooltip>

            {/* ───── Item Content ───── */}
            <Collapse in={openItem} unmountOnExit timeout={300}>
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                    {/* Iterate over top-level keys (major groups) */}
                    {item.extra &&
                        Object.keys(item.extra).map((majorKey) => {
                            const majorValue = item.extra![majorKey];
                            const isMajorGroupOpen = !!majorOpen[majorKey];

                            return (
                                <Box key={majorKey} sx={{ mb: 3, textAlign: 'right' }}>
                                    {/* ───── Major Group Row ───── */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            gap: 2,
                                            cursor: 'pointer',
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* Major group name */}
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontSize: {
                                                    xs: '1.3rem',
                                                    sm: '1.4rem',
                                                    md: '1.5rem',
                                                    lg: '1.6rem',
                                                },
                                                fontWeight: 500,
                                            }}
                                        >
                                            {majorKey}
                                        </Typography>

                                        {/* Eye icon => Pink */}
                                        <IconButton
                                            sx={{ color: '#ff69b4' }} // major group: pink
                                            onClick={(e) => toggleMajor(majorKey, e)}
                                        >
                                            {isMajorGroupOpen ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </Box>

                                    {/* Major group content */}
                                    <Collapse in={isMajorGroupOpen} unmountOnExit>
                                        {isExtraSubItem(majorValue) ? (
                                            // If it's a single ExtraSubItem
                                            <Box sx={{ ml: 3, mt: 2 }}>
                                                {renderButtonGroup(
                                                    majorValue,
                                                    majorKey,
                                                    currentExtraAnswers[majorKey] as string
                                                )}
                                            </Box>
                                        ) : (
                                            // If it's a group of sub–items
                                            Object.keys(majorValue).map((subKey) => {
                                                const subValue = (majorValue as ExtraGroup)[subKey];
                                                const combinedKey = `${majorKey}.${subKey}`;
                                                const isThisSubOpen = !!subOpen[combinedKey];
                                                const currentValue = currentExtraAnswers[combinedKey];

                                                return (
                                                    <Box key={subKey} sx={{ ml: 3, mt: 2, textAlign: 'right' }}>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'flex-start',
                                                                gap: 2,
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {/* Sub–item name */}
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    fontSize: {
                                                                        xs: '1.2rem',
                                                                        sm: '1.3rem',
                                                                        md: '1.4rem',
                                                                        lg: '1.5rem',
                                                                    },
                                                                    fontWeight: 400,
                                                                }}
                                                            >
                                                                {subKey}
                                                            </Typography>

                                                            {/* Eye icon => Purple */}
                                                            <IconButton
                                                                sx={{ color: '#9c27b0' }} // sub–item: purple
                                                                onClick={(e) => toggleSubItem(combinedKey, e)}
                                                            >
                                                                {isThisSubOpen ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                            </IconButton>
                                                        </Box>

                                                        <Collapse in={isThisSubOpen} unmountOnExit>
                                                            <Box sx={{ mt: 1, ml: 4 }}>
                                                                {isExtraSubItem(subValue) &&
                                                                    renderButtonGroup(subValue, combinedKey, currentValue)}
                                                            </Box>
                                                        </Collapse>
                                                    </Box>
                                                );
                                            })
                                        )}
                                    </Collapse>
                                </Box>
                            );
                        })}
                </Box>
            </Collapse>
        </Box>
    );
};

export default StaticItem;



