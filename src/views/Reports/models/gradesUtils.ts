// src/components/NewReportDialog/gradesUtils.ts

/**
 * If you're computing average grades, you can do it here.
 * This example expects an object structure like:
 *
 * {
 *   'פיקוד ושליטה': {
 *     items: { '1.1 גיבוש תמונת מצב': number, ... },
 *     comment: string,
 *     average: number
 *   },
 *   'עבודת קשר': {
 *     items: { '2.1 נדב"ר בסיסי': number, ... },
 *     comment: string,
 *     average: number
 *   }
 * }
 */

export interface LocalGradesState {
    [category: string]: {
        items: { [itemKey: string]: number };
        comment: string;
        average: number; // We store it in local state as a number
    };
}

/**
 * Compute the average for a category, given an "items" object of numeric values.
 */
export function computeAverage(items: { [k: string]: number }): number {
    const keys = Object.keys(items);
    if (keys.length === 0) return 0;
    const sum = keys.reduce((acc, key) => acc + items[key], 0);
    return sum / keys.length;
}

/**
 * Convert local numeric data into the final "grades" structure:
 *   { "$numberInt": "9" } for each item, and
 *   { "$numberDouble": "8.00" } for average.
 */
export function convertGradesToDbFormat(localGrades: LocalGradesState) {
    const finalGrades: any = {};

    for (const category in localGrades) {
        // Convert each item into { $numberInt: ... }
        const convertedItems: any = {};
        for (const itemKey in localGrades[category].items) {
            const numericValue = localGrades[category].items[itemKey];
            convertedItems[itemKey] = {
                $numberInt: String(numericValue)
            };
        }

        // Convert average to { $numberDouble: ... }
        const numericAvg = localGrades[category].average;
        finalGrades[category] = {
            items: convertedItems,
            comment: localGrades[category].comment,
            average: {
                $numberDouble: numericAvg.toFixed(2)
            }
        };
    }

    return finalGrades;
}
