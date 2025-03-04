//ScoreCalcUtils
import {
    Item,
    TrafficLightValue,
    BinaryValue,
} from './questionsModel';

export const PART_WEIGHT = 33.33;

/** Given an item, return a numeric score or null if no score can be computed. */
export function getItemScore(item: Item): number | null {
    if (!item.active) return null;

    // If the item has an extra property and its value is an object,
    // assume it holds sub–item answers.
    if (item.extra && item.value && typeof item.value === 'object') {
        const extraAnswers = item.value as Record<string, string>;
        const scores = Object.values(extraAnswers).map((val) => {
            if (val === 'full') return 1;
            if (val === 'half') return 0.5;
            return 0; // 'none' or any other value
        });
        if (scores.length === 0) return 0;
        const avg = scores.reduce((acc, cur) => acc + cur, 0) / scores.length;
        return avg;
    }

    // Otherwise, compute score based on the main answer.
    switch (item.type) {
        case 'trafficLight': {
            const value = item.value as 'full' | 'half' | 'none' | null;
            if (value === 'full') return 1;
            if (value === 'half') return 0.5;
            return 0;
        }
        case 'binary': {
            const value = item.value as 'full' | 'none' | null;
            return value === 'full' ? 1 : 0;
        }
        case 'multipleChoice': {
            const selected = item.value as string[] | null;
            if (!selected) return 0;
            return selected.includes('optionB') ? 1 : 0;
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
