// ScoreCalcQuestions.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { Part, Item } from './questionsModel';
import ChronologicItem from './ChronologicItem';
import StaticItem from './StaticItem.tsx';

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
}

export default function ScoreCalcQuestions({
                                               parts,
                                               handleItemChoice,
                                               handleExtraAnswer,
                                           }: ScoreCalcQuestionsProps) {
    // Store all chronologic items in one array.
    const [chronologicItems, setChronologicItems] = useState<ChronologicItemData[]>([]);
    const [staticItems, setStaticItems] = useState<{ partIndex: number; itemIndex: number; item: Item }[]>([]);

    // This state will hold the keys (unique identifiers) of answered items in the order they were selected.
    const [selectedOrder, setSelectedOrder] = useState<string[]>([]);

    // Helper to generate a unique key for each chronologic item.
    const getKey = (partIndex: number, itemIndex: number) =>
        `chronologic-${partIndex}-${itemIndex}`;

    // On mount, build the arrays of items.
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

        // Initially, sort chronologic items by question number.
        cItems.sort((a, b) => a.item.questionNumber - b.item.questionNumber);
        setChronologicItems(cItems);
        setStaticItems(sItems);
    }, [parts]);

    // When an answer is selected, add its key to the selectedOrder array (if not already added).
    const handleItemSelected = (partIndex: number, itemIndex: number) => {
        const key = getKey(partIndex, itemIndex);
        setSelectedOrder((prev) => {
            if (!prev.includes(key)) {
                return [...prev, key];
            }
            return prev;
        });
    };

    // When an item is reopened, remove its key from the selectedOrder.
    const handleItemReopen = (partIndex: number, itemIndex: number) => {
        const key = getKey(partIndex, itemIndex);
        setSelectedOrder((prev) => prev.filter((k) => k !== key));
    };

    // Compute the sorted list:
    // - Open items (keys not in selectedOrder) are sorted by question number.
    // - Answered items (keys in selectedOrder) are sorted by their index in selectedOrder.
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
            {/* Left Column: Chronologic Items (50% width on md and up) */}
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
                        />
                    ))}
                </Box>
            </Grid>

            {/* Right Column: Static Items (50% width on md and up) */}
            <Grid item xs={12} md={6}>
                <Box
                    sx={{
                        textAlign: 'right',
                        // Change alignment to "stretch" so the static items fill the column width.
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
                </Box>
            </Grid>
        </Grid>
    );
}
