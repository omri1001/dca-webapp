import React, { useState } from "react";
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

interface EditGradeTamplateFormProps {
    /** Array of parts (each has multiple items). */
    parts: Part[];
    /** Called when parts array changes (e.g., user toggles or picks a new value). */
    onPartsChange: (updatedParts: Part[]) => void;
    /** Called whenever the overall final grade changes. */
    onFinalGradeChange?: (grade: number) => void;
}

/** Returns background color for a given item.value */
const getItemBackgroundColor = (item: Item): string | undefined => {
    if (item.value === null) return undefined;
    if (item.value === "none") return "red";
    if (item.value === "full") return "green";
    if (item.value === "half") return "orange";
    return undefined;
};

const EditGradeTamplateForm: React.FC<EditGradeTamplateFormProps> = ({
                                                                         parts,
                                                                         onPartsChange,
                                                                         onFinalGradeChange,
                                                                     }) => {
    /** Key = "partIndex-itemIndex", value = old value so user can "cancel" */
    const [pendingResets, setPendingResets] = useState<{
        [key: string]: TrafficLightValue | BinaryValue;
    }>({});

    /**
     * 1) Compute and update the final grade whenever parts change.
     *    The final grade should be between 0 and 100.
     */
    const recomputeFinalGrade = (updatedParts: Part[]) => {
        const totalParts = updatedParts.length;
        if (totalParts === 0) {
            onFinalGradeChange?.(0);
            return;
        }

        // Sum each part's score (each part is also 0–100)
        const totalScore = updatedParts.reduce((acc, part) => {
            return acc + computePartScore(part);
        }, 0);

        // Average across all parts => final grade on 0–100 scale
        const finalGrade = totalScore / totalParts;
        onFinalGradeChange?.(finalGrade);
    };

    /**
     * 2) Helper to replace local parts and also recalc final grade.
     */
    const handlePartsUpdate = (updatedParts: Part[]) => {
        onPartsChange(updatedParts);
        recomputeFinalGrade(updatedParts);
    };

    /**
     * 3) Computes numeric score (0–100) for one part
     */
    const computePartScore = (part: Part): number => {
        const scores = part.items
            .map((item) => {
                if (!item.active) return null;
                if (item.value === null) return null;

                // For a trafficLight item:
                // full = 1, half = 0.5, none = 0
                if (item.type === "trafficLight") {
                    return item.value === "full" ? 1 : item.value === "half" ? 0.5 : 0;
                }

                // For a binary item:
                // full = 1, none = 0
                return item.value === "full" ? 1 : 0;
            })
            .filter((score) => score !== null) as number[];

        if (scores.length === 0) return 0;

        // Average is from 0 to 1
        const average = scores.reduce((a, b) => a + b, 0) / scores.length;

        // Convert to 0–100
        return average * 100;
    };

    /**
     * Handlers below to toggle active, set item choices, or reset them
     */
    const toggleItemActive = (pIndex: number, iIndex: number) => {
        const newParts = [...parts];
        const item = newParts[pIndex].items[iIndex];

        newParts[pIndex].items[iIndex] = {
            ...item,
            active: !item.active,
            // reset value if toggling from active->inactive or vice versa
            value: !item.active ? null : item.value,
        };

        const key = `${pIndex}-${iIndex}`;
        if (pendingResets[key] !== undefined) {
            const newPending = { ...pendingResets };
            delete newPending[key];
            setPendingResets(newPending);
        }
        handlePartsUpdate(newParts);
    };

    const handleItemChoice = (
        pIndex: number,
        iIndex: number,
        value: TrafficLightValue | BinaryValue
    ) => {
        const newParts = [...parts];
        newParts[pIndex].items[iIndex] = {
            ...newParts[pIndex].items[iIndex],
            value,
            active: true,
        };

        const key = `${pIndex}-${iIndex}`;
        if (pendingResets[key] !== undefined) {
            const newPending = { ...pendingResets };
            delete newPending[key];
            setPendingResets(newPending);
        }
        handlePartsUpdate(newParts);
    };

    const initiateReset = (pIndex: number, iIndex: number) => {
        const key = `${pIndex}-${iIndex}`;
        const newParts = [...parts];
        const currentValue = newParts[pIndex].items[iIndex].value;

        if (currentValue !== null) {
            // store old value so user can cancel
            setPendingResets((prev) => ({ ...prev, [key]: currentValue }));
            newParts[pIndex].items[iIndex] = {
                ...newParts[pIndex].items[iIndex],
                value: null,
            };
            handlePartsUpdate(newParts);
        }
    };

    const cancelReset = (pIndex: number, iIndex: number) => {
        const key = `${pIndex}-${iIndex}`;
        const oldValue = pendingResets[key];
        if (oldValue === undefined) return;

        const newParts = [...parts];
        newParts[pIndex].items[iIndex] = {
            ...newParts[pIndex].items[iIndex],
            value: oldValue,
        };

        const newPending = { ...pendingResets };
        delete newPending[key];
        setPendingResets(newPending);
        handlePartsUpdate(newParts);
    };

    /**
     * Render each part & item
     */
    return (
        <Box>
            {parts.map((part, pIndex) => {
                // Score for this part on 0–100
                const partScore = computePartScore(part).toFixed(2);

                return (
                    <Box
                        key={pIndex}
                        sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, mb: 2 }}
                    >
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            חלק {pIndex + 1}
                        </Typography>

                        <Grid container spacing={2}>
                            {part.items.map((item, iIndex) => {
                                const key = `${pIndex}-${iIndex}`;
                                const isPendingReset = pendingResets[key] !== undefined;

                                return (
                                    <Grid key={iIndex} item xs={12} sm={6} md={4}>
                                        <Box
                                            sx={{
                                                p: 1,
                                                border: "1px solid #ddd",
                                                borderRadius: 1,
                                                backgroundColor: getItemBackgroundColor(item),
                                            }}
                                        >
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
                                                פריט {iIndex + 1} [
                                                {item.type === "trafficLight" ? "רמזור" : "בינארי"} ]
                                            </Typography>

                                            {item.active ? (
                                                item.value === null ? (
                                                    // Show color choices
                                                    <Box
                                                        sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                                                    >
                                                        {item.type === "trafficLight" ? (
                                                            <>
                                                                <Button
                                                                    variant="contained"
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: "green",
                                                                        color: "#fff",
                                                                    }}
                                                                    onClick={() =>
                                                                        handleItemChoice(pIndex, iIndex, "full")
                                                                    }
                                                                >
                                                                    קיים (1)
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: "orange",
                                                                        color: "#fff",
                                                                    }}
                                                                    onClick={() =>
                                                                        handleItemChoice(pIndex, iIndex, "half")
                                                                    }
                                                                >
                                                                    חלקי (0.5)
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: "red",
                                                                        color: "#fff",
                                                                    }}
                                                                    onClick={() =>
                                                                        handleItemChoice(pIndex, iIndex, "none")
                                                                    }
                                                                >
                                                                    לא קיים (0)
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Button
                                                                    variant="contained"
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: "green",
                                                                        color: "#fff",
                                                                    }}
                                                                    onClick={() =>
                                                                        handleItemChoice(pIndex, iIndex, "full")
                                                                    }
                                                                >
                                                                    קיים (1)
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: "red",
                                                                        color: "#fff",
                                                                    }}
                                                                    onClick={() =>
                                                                        handleItemChoice(pIndex, iIndex, "none")
                                                                    }
                                                                >
                                                                    לא קיים (0)
                                                                </Button>
                                                            </>
                                                        )}

                                                        {isPendingReset && (
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={() => cancelReset(pIndex, iIndex)}
                                                            >
                                                                בטל
                                                            </Button>
                                                        )}
                                                    </Box>
                                                ) : (
                                                    // If we already have a chosen value
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

                                                        {isPendingReset ? (
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={() => cancelReset(pIndex, iIndex)}
                                                            >
                                                                בטל
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="text"
                                                                size="small"
                                                                onClick={() => initiateReset(pIndex, iIndex)}
                                                            >
                                                                שנה
                                                            </Button>
                                                        )}
                                                    </Box>
                                                )
                                            ) : (
                                                <Typography variant="body2">לא נבחר</Typography>
                                            )}
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>

                        {/* Show each part's numeric score (0–100) */}
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            ציון עבור חלק {pIndex + 1}: {partScore}
                        </Typography>
                    </Box>
                );
            })}
        </Box>
    );
};

export default EditGradeTamplateForm;
