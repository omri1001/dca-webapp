// questionsModel.ts

export type TrafficLightValue = 'full' | 'half' | 'none' | null;
export type BinaryValue = 'full' | 'none' | null;
export type MultipleChoiceValue = string[] | null;

export type ItemValue = TrafficLightValue | BinaryValue | MultipleChoiceValue;
export type ItemType = 'trafficLight' | 'binary' | 'multipleChoice';

// New type to designate which “section” the question belongs to.
export type QuestionCategory = 'chronologic' | 'static';

// New type for dynamic answer texts.
export interface AnswerText {
    full: string;
    half?: string; // Only used if type is 'trafficLight'
    none: string;
}

/**
 * A single (lowest-level) sub–item in the extra object
 * (for example: { type: 'trafficLight', answerText: {...} }).
 */
export interface ExtraSubItem {
    type: ItemType;
    answerText: AnswerText;
}

/**
 * If we have multiple sub–items under one key, we use Record<string, ExtraSubItem>.
 * Example: 'תפקיד אגמ': {
 *              'קמ"ן': { type: 'trafficLight', answerText: {...} },
 *              'קמב"צית': { type: 'trafficLight', answerText: {...} }
 *          }
 */
export type ExtraGroup = Record<string, ExtraSubItem>;

/**
 * The `extra` property can be:
 *   - A top-level key that directly points to a single ExtraSubItem (no nesting),
 *       e.g., 'שירות': { type: 'trafficLight', answerText: {...} }
 *   - A top-level key that points to a group of sub–items,
 *       e.g., 'תפקיד אגמ': { 'קמ"ן': ExtraSubItem, 'קמב"צית': ExtraSubItem }
 */
export type Extra = Record<string, ExtraSubItem | ExtraGroup>;

export interface Item {
    name: string;
    type: ItemType;
    value: ItemValue;
    active: boolean;
    part: number;
    category: QuestionCategory;
    questionNumber: number;
    // For chronologic questions, answerText may be defined directly on the item.
    answerText?: AnswerText;

    /**
     * For static questions, we now define a structured extra.
     * Each key can map either:
     *   - Directly to { type, answerText }, OR
     *   - To another object holding multiple named sub-items.
     *
     * Example with multiple sub–items:
     * {
     *   'תפקיד אגמ': {
     *       'קמ"ן': { type: 'trafficLight', answerText: {...} },
     *       'קמב"צית': { type: 'trafficLight', answerText: {...} }
     *   }
     * }
     *
     * Example with one sub–item directly:
     * {
     *   'שירות': { type: 'trafficLight', answerText: {...} }
     * }
     */
    extra?: Extra;
}

export interface Part {
    items: Item[];
}

/**
 * Creates default parts for the questionnaire.
 */
export function createDefaultParts(): Part[] {
    const parts: Part[] = [
        { items: [] }, // part 1
        { items: [] }, // part 2
        { items: [] }, // part 3
    ];

    // ─── CHRONOLOGIC QUESTIONS ──────────────────────────────────────────────
    // For chronologic questions, answerText is defined on the item.
    // Part 1 (questions with part: 1)
    parts[0].items.push(
        {
            name: 'רואה מעריך ממליץ של מפקד הכוח הראשון באירוע בקשר',
            type: 'binary',
            value: null,
            active: false,
            part: 1,
            category: 'chronologic',
            questionNumber: 3,
            answerText: { full: 'קרה', none: 'לא קרה' }
        },
        {
            name: 'סיווג אירוע - הכרזה',
            type: 'trafficLight',
            value: null,
            active: false,
            part: 1,
            category: 'chronologic',
            questionNumber: 2,
            answerText: {
                full: 'הכריז נכון ובאופן מיידי וחמ״ל העביר את ההכרזה',
                half: 'הכרזה לא נכונה / חמ״ל לא העביר את ההכרזה בציר חמ״לים',
                none: 'לא קרה בכלל / רמ״מ הכריז לאחר תחילת האירוע'
            }
        },
        {
            name: 'חבירה של רמ״מ למדווח בשטח',
            type: 'binary',
            value: null,
            active: false,
            part: 1,
            category: 'chronologic',
            questionNumber: 5,
            answerText: { full: 'קרה', none: 'לא קרה' }
        },
        {
            name: 'דיווח סדור על האירוע (פנייה, מה קרה, איפה, מי, מתי, אויב וכוחותינו)',
            type: 'trafficLight',
            value: null,
            active: false,
            part: 1,
            category: 'chronologic',
            questionNumber: 6,
            answerText: { full: 'דיווח מלא', half: 'מידע חלקי', none: 'לא בוצע' }
        }
    );

    // Part 2 (questions with part: 2)
    parts[1].items.push(
        {
            name: 'חלוקת גבולות גזרה בהורדת פקודה',
            type: 'binary',
            value: null,
            active: false,
            part: 2,
            category: 'chronologic',
            questionNumber: 1,
            answerText: { full: 'קרה', none: 'לא קרה' }
        },
        {
            name: 'שימוש בפקל אופציות (אין פקל אופציות למעגלים פתוחים)',
            type: 'binary',
            value: null,
            active: false,
            part: 2,
            category: 'chronologic',
            questionNumber: 7,
            answerText: { full: 'קרה', none: 'לא קרה' }
        },
        {
            name: 'שימוש במשואה ובמשיבי מיקום',
            type: 'trafficLight',
            value: null,
            active: false,
            part: 2,
            category: 'chronologic',
            questionNumber: 8,
            answerText: { full: 'כלל המפקדים משתמשים', half: 'רק חמ״ל משתמש', none: 'לא משתמשים בכלל' }
        },
        {
            name: 'הצבת עתודה בנקודת תורפה הגזרתית',
            type: 'binary',
            value: null,
            active: false,
            part: 2,
            category: 'chronologic',
            questionNumber: 9,
            answerText: { full: 'קרה', none: 'לא קרה' }
        },
        {
            name: 'חלוקה לכוחות ומשימות ופקודה סדורה בקשר',
            type: 'trafficLight',
            value: null,
            active: false,
            part: 2,
            category: 'chronologic',
            questionNumber: 10,
            answerText: { full: 'קרה', half: 'חלקי', none: 'לא קרה' }
        },
        {
            name: 'שמירה על ג"ג על פי התכנון',
            type: 'binary',
            value: null,
            active: false,
            part: 2,
            category: 'chronologic',
            questionNumber: 11,
            answerText: { full: 'קרה', none: 'לא קרה' }
        },
        {
            name: 'שימוש בפקל"ים של הכוח (מאג / נגב / מטאדור / לאו / מטול)',
            type: 'trafficLight',
            value: null,
            active: false,
            part: 2,
            category: 'chronologic',
            questionNumber: 12,
            answerText: {
                full: 'ממצים את כלל היכולות',
                half: 'משתמשים בחלק',
                none: 'לא משתמשים בכלל'
            }
        }
    );

    // Part 3 (questions with part: 3)
    parts[2].items.push(
        {
            name: 'שימוש ברבש"צ / כיתת כוננות באירוע ביישוב (צח״י)',
            type: 'binary',
            value: null,
            active: false,
            part: 3,
            category: 'chronologic',
            questionNumber: 4,
            answerText: { full: 'קרה', none: 'לא קרה' }
        },
        {
            name: 'שימוש בהפעלת תת תקיפה חטיבתית: מס"קר / זיק לברחנים',
            type: 'binary',
            value: null,
            active: false,
            part: 3,
            category: 'chronologic',
            questionNumber: 13,
            answerText: { full: 'קרה', none: 'לא קרה' }
        },
        {
            name: 'לבדוק אם אפשר להשתמש בבקסיות ובת תתקיפה בו״ז',
            type: 'binary',
            value: null,
            active: false,
            part: 3,
            category: 'chronologic',
            questionNumber: 14,
            answerText: { full: 'קרה', none: 'לא קרה' }
        },
        {
            name: 'שימוש בדרדר פינוי באירוע אר״ן',
            type: 'binary',
            value: null,
            active: false,
            part: 3,
            category: 'chronologic',
            questionNumber: 15,
            answerText: { full: 'קרה', none: 'לא קרה' }
        }
    );

    // ─── STATIC QUESTIONS ─────────────────────────────────────────────────────
    // These questions use a structured `extra` to define dynamic answer texts per sub–item.
    // Part 1 (static questions)
    parts[0].items.push(
        {
            name: 'איסוף נתונים מקצינים עוזרים מקצועיים',
            type: 'multipleChoice',
            value: null,
            active: false,
            part: 1,
            category: 'static',
            questionNumber: 3,
            extra: {
                'תפקיד אגמ': {
                    // This top-level key has a group of sub–items:
                    'קמ״ן': {
                        type: 'trafficLight',
                        answerText: {
                            full: 'נדרש ובוצע',
                            half: 'נדרש ולא בוצע ',
                            none: 'לא נדרש ולא בוצע'
                        }
                    },
                    'קמב״צית': {
                        type: 'trafficLight',
                        answerText: {
                            full: 'נדרש ובוצע',
                            half: 'נדרש ולא בוצע',
                            none: 'לא נדרש ולא בוצע'
                        }
                    },
                    'קצין אגם': {
                        type: 'trafficLight',
                        answerText: {
                            full: 'נדרש ובוצע',
                            half: 'נדרש ולא בוצע',
                            none: 'לא נדרש ולא בוצע '
                        }
                    }
                },
                'תפקיד שלישותי': {
                    // Another group of sub–items:
                    'מפ״ם': {
                        type: 'trafficLight',
                        answerText: {
                            full: 'נדרש ובוצע',
                            half: 'נדרש ולא בוצע',
                            none: 'לא נדרש ולא בוצע'
                        }
                    },
                    'שלישות': {
                        type: 'trafficLight',
                        answerText: {
                            full: 'נדרש ובוצע',
                            half: 'נדרש ולא בוצע',
                            none: 'לא נדרש ולא בוצע'
                        }
                    },
                    'דוקטור': {
                        type: 'trafficLight',
                        answerText: {
                            full: 'נדרש ובוצע',
                            half: 'נדרש ולא בוצע',
                            none: 'לא נדרש ולא בוצע'
                        }
                    }
                }
            }
        },
        {
            name: 'איסוף נתונים מכוחות בין ארגוניים',
            type: 'multipleChoice',
            value: null,
            active: false,
            part: 1,
            category: 'static',
            questionNumber: 4,
            extra: {
                // Here each top-level key is a single sub–item (no second-level object).
                'שירות': {
                    type: 'trafficLight',
                    answerText: {
                        full: 'נדרש ובוצע',
                        half: 'נדרש ולא בוצע',
                        none: 'לא נדרש ולא בוצע'
                    }
                },
                'מג״ב': {
                    type: 'trafficLight',
                    answerText: {
                        full: 'דרש ובוצע',
                        half: 'נדרש ולא בוצע',
                        none: 'לא נדרש ולא בוצע'
                    }
                }
            }
        },
        {
            name: 'העברת מידע בציר מפקדים וחמ״לים (רמ״מ)',
            type: 'multipleChoice',
            value: null,
            active: false,
            part: 1,
            category: 'static',
            questionNumber: 6,
            extra: {
                'העברת מידע בציר מפקדים וחמ״לים': {
                    type: 'trafficLight',
                    answerText: {
                        full: 'מעביר באופן שוטף מידע מדויק',
                        half: 'מעביר לא באופן שוטף / מידע מוטעה',
                        none: 'לא מעביר מידע'
                    }
                }
            }
        }
    );

    // Part 2 (static questions)
    parts[1].items.push(
        {
            name: 'שימוש בחפ״ק מנהלה לטובת חסמים, נפ״ק ונאפ״ל',
            type: 'trafficLight',
            value: null,
            active: false,
            part: 2,
            category: 'static',
            questionNumber: 1,
            extra: {
                'חסמים': {
                    type: 'trafficLight',
                    answerText: {
                        full: 'דרש ובוצע',
                        half: 'דרש ולא בוצע',
                        none: 'לא דרש ולא בוצע'
                    }
                },
                'נפ״ק': {
                    type: 'trafficLight',
                    answerText: {
                        full: 'דרש ובוצע',
                        half: 'דרש ולא בוצע',
                        none: 'לא דרש ולא בוצע'
                    }
                },
                'נקודת איסוף פצועים': {
                    type: 'trafficLight',
                    answerText: {
                        full: 'דרש ובוצע',
                        half: 'דרש ולא בוצע',
                        none: 'לא דרש ולא בוצע'
                    }
                }
            }
        },
        {
            name: 'חבירה לת.פ (גשש, 18ג׳, טנ״א)',
            type: 'trafficLight',
            value: null,
            active: false,
            part: 2,
            category: 'static',
            questionNumber: 2,
            answerText: {
                full: 'קרה',
                half: 'חלקי',
                none: 'לא קרה'
            },
            extra: {
                'גשש': {
                    type: 'binary',
                    answerText: {
                        full: 'קרה',
                        none: 'לא קרה'
                    }
                },
                '18ג': {
                    type: 'binary',
                    answerText: {
                        full: 'קרה',
                        none: 'לא קרה'
                    }
                },
                'טנ״א': {
                    type: 'binary',
                    answerText: {
                        full: 'קרה',
                        none: 'לא קרה'
                    }
                }
            }
        }
    );

    // Part 3 (static questions)
    parts[2].items.push(
        {
            name: 'מיצוי האיסוף הקרבי',
            type: 'multipleChoice',
            value: null,
            active: false,
            part: 3,
            category: 'static',
            questionNumber: 5,
            extra: {
                'תורן תצפית רלוונטית': {
                    type: 'trafficLight',
                    answerText: {
                        full: 'שומש באופן ממצה',
                        half: 'שומש באופן חלקי',
                        none: 'לא שומש כלל'
                    }
                },
                'בק״סיות': {
                    type: 'trafficLight',
                    answerText: {
                        full: 'דרש ושומש באופן ממצה',
                        half: 'דרש ושומש באופן חלקי',
                        none: 'לא נדרש ולא שומש'
                    }
                },
                'צלמות מרכיבי הגנה (מכ״מ / ptz, / ״מרחב חכם״ (מצלמות עבירה ומצלמות הרכשה)': {
                    type: 'trafficLight',
                    answerText: {
                        full: 'נדרש הכל',
                        half: 'נדרש באופן חלקי',
                        none: 'לא נדרש'
                    }
                }
            }
        }
    );

    return parts;
}
