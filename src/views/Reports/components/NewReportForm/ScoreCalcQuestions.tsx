//scoreCalcQuestions

import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Typography, Box, TextField } from '@mui/material';
import { Part, Item } from './questionsModel';
import ChronologicItem from './ChronologicItem';
import StaticItem from './StaticItem';

interface ChronologicItemData {
    partIndex: number;
    itemIndex: number;
    item: Item;
}

interface ScoreCalcQuestionsProps {
    parts: Part[];
    handleItemChoice: (partIndex: number, itemIndex: number, value: any) => void;
    handleExtraAnswer: (
        partIndex: number,
        itemIndex: number,
        extraKey: string,
        answer: any
    ) => void;
    duatz: number;
    setDuatz: React.Dispatch<React.SetStateAction<number>>;
}

export default function ScoreCalcQuestions({
                                               parts,
                                               handleItemChoice,
                                               handleExtraAnswer,
                                               duatz,
                                               setDuatz,
                                           }: ScoreCalcQuestionsProps) {
    const [chronologicItems, setChronologicItems] = useState<ChronologicItemData[]>([]);
    const [staticItems, setStaticItems] = useState<{ partIndex: number; itemIndex: number; item: Item }[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<string[]>([]);

    const getKey = (partIndex: number, itemIndex: number) =>
        `chronologic-${partIndex}-${itemIndex}`;

    // Build arrays of items on mount
    useEffect(() => {
        const cItems: ChronologicItemData[] = [];
        const sItems: { partIndex: number; itemIndex: number; item: Item }[] = [];

        parts.forEach((part, pIdx) => {
            part.items.forEach((itm, iIdx) => {
                if (itm.category === 'chronologic') {
                    cItems.push({ partIndex: pIdx, itemIndex: iIdx, item: itm });
                } else if (itm.category === 'static') {
                    sItems.push({ partIndex: pIdx, itemIndex: iIdx, item: itm });
                }
            });
        });

        cItems.sort((a, b) => a.item.questionNumber - b.item.questionNumber);
        setChronologicItems(cItems);
        setStaticItems(sItems);
    }, [parts]);

    // Track answered item order
    const handleItemSelected = (partIndex: number, itemIndex: number) => {
        const key = getKey(partIndex, itemIndex);
        setSelectedOrder((prev) => {
            if (!prev.includes(key)) {
                return [...prev, key];
            }
            return prev;
        });
    };

    const handleItemReopen = (partIndex: number, itemIndex: number) => {
        const key = getKey(partIndex, itemIndex);
        setSelectedOrder((prev) => prev.filter((k) => k !== key));
    };

    // Sort items: open items by questionNumber, answered items by selection order
    const sortedChronologicItems = useMemo(() => {
        const openItems = chronologicItems.filter(
            (entry) => !selectedOrder.includes(getKey(entry.partIndex, entry.itemIndex))
        );
        const closedItems = chronologicItems.filter((entry) =>
            selectedOrder.includes(getKey(entry.partIndex, entry.itemIndex))
        );

        openItems.sort((a, b) => a.item.questionNumber - b.item.questionNumber);
        closedItems.sort(
            (a, b) =>
                selectedOrder.indexOf(getKey(a.partIndex, a.itemIndex)) -
                selectedOrder.indexOf(getKey(b.partIndex, b.itemIndex))
        );

        return [...openItems, ...closedItems];
    }, [chronologicItems, selectedOrder]);

    return (
        <Grid container spacing={4} alignItems="stretch">
            {/* Left Column: Chronologic Items */}
            <Grid item xs={12} md={6}>
                <Box
                    sx={{
                        borderRight: { md: '4px solid #ccc' },
                        pr: { md: 2 },
                        height: '100%',
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        מדדים בסדר כרונולגי
                    </Typography>
                    {sortedChronologicItems.map(({ partIndex, itemIndex, item }) => (
                        <ChronologicItem
                            key={getKey(partIndex, itemIndex)}
                            partIndex={partIndex}
                            itemIndex={itemIndex}
                            item={item}
                            handleItemChoice={handleItemChoice}
                            handleItemSelected={() => handleItemSelected(partIndex, itemIndex)}
                            handleItemReopen={() => handleItemReopen(partIndex, itemIndex)}
                            handleExtraAnswer={handleExtraAnswer}
                        />
                    ))}
                </Box>
            </Grid>

            {/* Right Column: Static Items + "דו״צ" Field */}
            <Grid item xs={12} md={6}>
                <Box
                    sx={{
                        textAlign: 'right',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        height: '100%',
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        מדדים נושמים
                    </Typography>
                    {staticItems.map(({ partIndex, itemIndex, item }) => (
                        <StaticItem
                            key={`static-${partIndex}-${itemIndex}`}
                            partIndex={partIndex}
                            itemIndex={itemIndex}
                            item={item}
                            handleExtraAnswer={handleExtraAnswer}
                        />
                    ))}

                    {/* New Field for "דו״צ" */}
                    <Box sx={{ mt: 2, textAlign: 'right', direction: 'rtl' }}>
                        {/* Label above the field */}
                        <Typography
                            variant="h6"
                            sx={{ fontSize: '1.4rem', mb: 1, textAlign: 'right' }}
                        >
                            דו״צ
                        </Typography>

                        <TextField
                            type="number"
                            value={duatz}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 0 && value <= 10) {
                                    setDuatz(value);
                                }
                            }}
                            inputProps={{ min: 0, max: 10 }}
                            variant="outlined"
                            fullWidth
                            helperText="האם היו אירועי דוצ בתרגיל? אם כן ציין כמה"
                            sx={{
                                '& .MuiInputBase-input': {
                                    fontSize: '1.4rem',
                                    textAlign: 'right',
                                },
                                '& .MuiFormHelperText-root': {
                                    fontSize: '1.2rem',
                                    textAlign: 'right',
                                },
                            }}
                        />
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}


