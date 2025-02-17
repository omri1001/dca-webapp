// src/views/Reports/components/GradeTemplateForm.tsx
import React from "react";
import {
    Box,
    Typography,
    Grid,
    Button,
    Checkbox,
    FormControlLabel,
} from "@mui/material";

export type TrafficLightValue = "full" | "half" | "none" | null;
export type BinaryValue = "full" | "none" | null;

export interface Item {
    type: "trafficLight" | "binary";
    value: TrafficLightValue | BinaryValue;
    active: boolean;
}

export interface Part {
    items: Item[];
}

export interface GradeTemplateFormProps {
    parts: Part[];
    onPartsChange: (parts: Part[]) => void;
}

// Helper: compute a numeric score for an item (only if active)
function getItemScore(item: Item): number | null {
    if (!item.active) return null;
    if (item.value === null) return null;
    if (item.type === "trafficLight") {
        if (item.value === "full") return 1;
        if (item.value === "half") return 0.5;
        return 0;
    } else {
        return item.value === "full" ? 1 : 0;
    }
}

// Helper: compute the score for one part (only including active items)
export function computePartScore(part: Part): number {
    const scores = part.items
        .map((item) => getItemScore(item))
        .filter((score) => score !== null) as number[];
    if (scores.length === 0) return 0;
    const avg = scores.reduce((acc, val) => acc + val, 0) / scores.length;
    return avg * 33.33; // Each part weighted to sum roughly 100 points over 3 parts.
}

const GradeTemplateForm: React.FC<GradeTemplateFormProps> = ({ parts, onPartsChange }) => {
    // Toggle an item’s “active” state.
    const toggleItemActive = (partIndex: number, itemIndex: number) => {
        const newParts = [...parts];
        const item = newParts[partIndex].items[itemIndex];
        newParts[partIndex].items[itemIndex] = {
            ...item,
            active: !item.active,
            value: null, // Reset value when toggling.
        };
        onPartsChange(newParts);
    };

    // Set an item’s value.
    const handleItemChoice = (
        partIndex: number,
        itemIndex: number,
        value: TrafficLightValue | BinaryValue
    ) => {
        const newParts = [...parts];
        newParts[partIndex].items[itemIndex] = {
            ...newParts[partIndex].items[itemIndex],
            value,
        };
        onPartsChange(newParts);
    };

    // Reset an item’s value (but keep it active).
    const resetItem = (partIndex: number, itemIndex: number) => {
        const newParts = [...parts];
        newParts[partIndex].items[itemIndex] = {
            ...newParts[partIndex].items[itemIndex],
            value: null,
        };
        onPartsChange(newParts);
    };

    return (
        <Box>
            {parts.map((part, pIndex) => (
                <Box
                    key={pIndex}
                    sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, mb: 2 }}
                >
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        חלק {pIndex + 1}
                    </Typography>
                    <Grid container spacing={2}>
                        {part.items.map((item, iIndex) => (
                            <Grid key={iIndex} item xs={12} sm={6} md={4}>
                                <Box sx={{ p: 1, border: "1px solid #ddd", borderRadius: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={item.active}
                                                onChange={() => toggleItemActive(pIndex, iIndex)}
                                            />
                                        }
                                        label="הוסף פריט"
                                    />
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        פריט {iIndex + 1} [{" "}
                                        {item.type === "trafficLight" ? "רמזור" : "בינארי"} ]
                                    </Typography>
                                    {item.active ? (
                                        item.value === null ? (
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                                {item.type === "trafficLight" ? (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            sx={{ backgroundColor: "green", color: "#fff" }}
                                                            onClick={() => handleItemChoice(pIndex, iIndex, "full")}
                                                        >
                                                            קיים (1)
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            sx={{ backgroundColor: "orange", color: "#fff" }}
                                                            onClick={() => handleItemChoice(pIndex, iIndex, "half")}
                                                        >
                                                            חלקי (0.5)
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            sx={{ backgroundColor: "red", color: "#fff" }}
                                                            onClick={() => handleItemChoice(pIndex, iIndex, "none")}
                                                        >
                                                            לא קיים (0)
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            sx={{ backgroundColor: "green", color: "#fff" }}
                                                            onClick={() => handleItemChoice(pIndex, iIndex, "full")}
                                                        >
                                                            קיים (1)
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            sx={{ backgroundColor: "red", color: "#fff" }}
                                                            onClick={() => handleItemChoice(pIndex, iIndex, "none")}
                                                        >
                                                            לא קיים (0)
                                                        </Button>
                                                    </>
                                                )}
                                            </Box>
                                        ) : (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <Typography variant="body2">
                                                    {item.type === "trafficLight"
                                                        ? item.value === "full"
                                                            ? "קיים (1)"
                                                            : item.value === "half"
                                                                ? "חלקי (0.5)"
                                                                : "לא קיים (0)"
                                                        : item.value === "full"
                                                            ? "קיים (1)"
                                                            : "לא קיים (0)"}
                                                </Typography>
                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    onClick={() => resetItem(pIndex, iIndex)}
                                                >
                                                    שנה
                                                </Button>
                                            </Box>
                                        )
                                    ) : (
                                        <Typography variant="body2">לא נבחר</Typography>
                                    )}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        ציון עבור חלק {pIndex + 1}: {computePartScore(part).toFixed(2)}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default GradeTemplateForm;
