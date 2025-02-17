// ScoreCalcUtils.ts
import {
    Item,
    TrafficLightValue,
    BinaryValue,
} from './questionsModel';

export const PART_WEIGHT = 33.33;

/** Given an item, return a numeric score or null if no score can be computed. */
export function getItemScore(item: Item): number | null {
    if (!item.active) return null;
    if (item.value === null) return null;

    switch (item.type) {
        case 'trafficLight': {
            const value = item.value as TrafficLightValue;
            if (value === 'full') return 1;
            if (value === 'half') return 0.5;
            return 0; // 'none'
        }
        case 'binary': {
            const value = item.value as BinaryValue;
            return value === 'full' ? 1 : 0;
        }
        case 'multipleChoice': {
            // If the item has an "extra" property, we assume item.value is an object
            // mapping extra keys to answer values. We'll score each answer (e.g., full=1, half=0.5, none=0)
            if (item.extra) {
                const extraAnswers = item.value as Record<string, string>;
                const scores = Object.values(extraAnswers).map((val) => {
                    if (val === 'full') return 1;
                    if (val === 'half') return 0.5;
                    if (val === 'none') return 0;
                    return 0;
                });
                if (scores.length === 0) return 0;
                const avg = scores.reduce((acc, cur) => acc + cur, 0) / scores.length;
                return avg;
            } else {
                // For the original multipleChoice without extra answers,
                // assume item.value is a string array.
                const selected = item.value as string[];
                return selected.includes('optionB') ? 1 : 0;
            }
        }
        default:
            return null;
    }
}

/** Compute a part's average among all non-null items, then multiply by PART_WEIGHT. */
export function computePartScore(part: { items: Item[] }): number {
    const scores = part.items
        .map(getItemScore)
        .filter((x) => x !== null) as number[];
    if (scores.length === 0) return 0;
    const avg = scores.reduce((acc, val) => acc + val, 0) / scores.length;
    return avg * PART_WEIGHT;
}
