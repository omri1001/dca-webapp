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
            name: '"רואה, מעריך, ממליץ" של מפקד הכוח הראשון באירוע בקשר',
            type: 'trafficLight',
            value: null,
            active: false,
            part: 1,
            category: 'chronologic',
            questionNumber: 3,
            answerText: {
                full: 'דיווח תקין',
                half: 'דיווח שגוי',
                none: 'לא דיווח'
            }
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
                full: 'הכריז נכון',
                half: 'הכריז לא נכון',
                none: 'לא הכריז'
            }
        },
        {
            name: 'הגדרה של מי חובר וחבירה למדווח',
            type: 'trafficLight',
            value: null,
            active: false,
            part: 1,
            category: 'chronologic',
            questionNumber: 5,
            answerText: {
                full: 'הוגדר ובוצע חבירה',
                half: 'לא הגדיר או לא בוצע חבירה',
                none: 'לא הגדיר ולא בוצע חבירה'
            }
        },
        {
            name: 'הבהרת תמונת המצב בציר מפקדים וחמ״לים: (פנייה, מה קרה, איפה, מתי, אויב וכוחותינו)',
            type: 'trafficLight',
            value: null,
            active: false,
            part: 1,
            category: 'chronologic',
            questionNumber: 6,
            answerText: { full: 'דיווח תקין', half: 'דיווח שגוי', none: 'לא דיווח' }
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
            answerText: { full: 'בוצע', none: 'לא בוצע' }
        },
        {
            name: 'מתן פקודות ומשימות להמשך ע״פ פק״ל אופציות (במעגל פתוח ע״פ סד״פ מעגל פתוח)',
            type: 'trafficLight',
            value: null,
            active: false,
            part: 2,
            category: 'chronologic',
            questionNumber: 7,
            answerText: { full: 'דיווח תקין', half: 'דיווח שגוי', none: 'לא דיווח' }
        },
        {
            name: 'שימוש במשואה ובמשיבי מיקום - כלל המפקדים',
            type: 'trafficLight',
            value: null,
            active: false,
            part: 2,
            category: 'chronologic',
            questionNumber: 8,
            answerText: { full: 'שימוש שוטף', half: 'חלקם השתמשו', none: 'לא השתמשו' }
        },
        {
            name: 'הצבת עתודה בנקודת תורפה הגזרתית',
            type: 'binary',
            value: null,
            active: false,
            part: 2,
            category: 'chronologic',
            questionNumber: 9,
            answerText: { full: 'בוצע', none: 'לא בוצע' }
        },
        {
            name: 'חזרה לשגרה',
            type: 'multipleChoice',
            value: null,
            active: false,
            part: 2,
            category: 'chronologic',
            questionNumber: 11,
            extra: {
                'דיווח ירוק בעיניים ובצל״ם': {
                    type: 'trafficLight',
                    answerText: {
                        full: 'נדרש ודווח תקין',
                        half: 'נדרש ודווח שגוי',
                        none: 'לא נדרש ולא דווח'
                    }
                },
                'דיווח פצועים והרוגים (מה קרה, איפה, מתי, מי ומספר פצועים)': {
                    type: 'trafficLight',
                    answerText: {
                        full: 'דיווח תקין',
                        half: 'דיווח שגוי',
                        none: 'לא עבר דיווח'
                    }
                },
                'דרישה למסוק פינוי באירוע רב נפגעים': {
                    type: 'binary',
                    answerText: {
                        full: 'בוצע',
                        none: 'לא בצוע'
                    }
                },
                'חלוקת גזרות סריקה ומתן דיווח סופי לרמה ממונה': {
                    type: 'binary',
                    answerText: {
                        full: 'בוצע',
                        none: 'לא בצוע'
                    }
                }
            }
        }
    );

    // Part 3 (questions with part: 3)
    parts[2].items.push(
        {
            name: 'הפעלת כוחות ביטחון בישוב דרך הרבש"צ',
            type: 'binary',
            value: null,
            active: false,
            part: 3,
            category: 'chronologic',
            questionNumber: 4,
            answerText: { full: 'קרה', none: 'לא קרה' }
        },
        {
            name: 'הדרישה והפעלת תת תקיפה חטיבתית: מס"קר / זיק לברחנים',
            type: 'trafficLight',
            value: null,
            active: false,
            part: 3,
            category: 'chronologic',
            questionNumber: 10,
            answerText: { full: 'נדרש ובוצע', half: 'לא נדרש או לא בוצע', none: 'לא נדרש ולא בוצע ' }
        }
    );

    // ─── STATIC QUESTIONS ─────────────────────────────────────────────────────
    // These questions use a structured `extra` to define dynamic answer texts per sub–item.
    // Part 1 (static questions)
    parts[0].items.push(
        {
            name: 'איסוף נתונים מקצינים עוזרים מקצועיים וכוחות בן ארגוניים',
            type: 'multipleChoice',
            value: null,
            active: false,
            part: 1,
            category: 'static',
            questionNumber: 1,
            extra: {
                'תפקיד אגמ': {
                    // This top-level key has a group of sub–items:
                    'קצין אגם': {
                        type: 'binary',
                        answerText: {
                            full: 'בוצע',
                            none: 'לא בוצע'
                        }
                    },
                    'קמב״צית': {
                        type: 'binary',
                        answerText: {
                            full: 'בוצע',
                            none: 'לא בוצע'
                        }
                    },
                    'קמ״ן': {
                        type: 'binary',
                        answerText: {
                            full: 'בוצע',
                            none: 'לא בוצע'
                        }
                    }
                },
                'תפקיד שלישותי': {
                    // Another group of sub–items:
                    'מפ״ם/סמפ"ם': {
                        type: 'binary',
                        answerText: {
                            full: 'בוצע',
                            none: 'לא בוצע'
                        }
                    },
                    'שלישות': {
                        type: 'binary',
                        answerText: {
                            full: 'בוצע',
                            none: 'לא בוצע'
                        }
                    },
                    'דוקטור / פראמדיק': {
                        type: 'binary',
                        answerText: {
                            full: 'בוצע',
                            none: 'לא בוצע'
                        }
                    }
                },
                'כוחות בין ארגוניים': {
                    // Another group of sub–items:
                    'משטרת ישראל': {
                        type: 'binary',
                        answerText: {
                            full: 'בוצע',
                            none: 'לא בוצע'
                        }
                    },
                    'שירות הביטחון הכללי': {
                        type: 'binary',
                        answerText: {
                            full: 'בוצע',
                            none: 'לא בוצע'
                        }
                    },
                    'מוקד אזרחי': {
                        type: 'binary',
                        answerText: {
                            full: 'בוצע',
                            none: 'לא בוצע'
                        }
                    },
                    'קצין אגמ״ר': {
                        type: 'binary',
                        answerText: {
                            full: 'בוצע',
                            none: 'לא בוצע'
                        }
                    }
                }
            }
        }
    );

    // Part 2 (static questions)
    parts[1].items.push(
        {
            name: 'שימוש בחפ״ק מנהלה ות.פ',
            type: 'multipleChoice',
            value: null,
            active: false,
            part: 2,
            category: 'static',
            questionNumber: 3,
            extra: {
                ' חסמים  (במידה והמפ״ם / סמפ״ם אינו מתרגל, אזי יש לדלג על הצהוב)': {
                    type: 'trafficLight',
                    answerText: {
                        full: 'נדרש ובוצע',
                        half: 'נדרש ולא בוצע',
                        none: 'לא נדרש ולא בוצע'
                    }
                },
                'נפ״ק (במידה והשלישה אינה מתרגלת, אזי יש לדלג על הצהוב)': {
                    type: 'trafficLight',
                    answerText: {
                        full: 'נדרש ובוצע',
                        half: 'נדרש ולא בוצע',
                        none: 'לא נדרש ולא בוצע'
                    }
                },
                'תאג"ד (במידה והדוקטור / פראמדיק אינו מתרגל, אזי יש לדלג על הצהוב)': {
                    type: 'trafficLight',
                    answerText: {
                        full: 'נדרש ובוצע',
                        half: 'נדרש ולא בוצע',
                        none: 'לא נדרש ולא בוצע'
                    }
                },
                'טנ״א': {
                    type: 'trafficLight',
                    answerText: {
                        full: 'נדרש ובוצע',
                        half: 'נדרש ולא בוצע',
                        none: 'לא נדרש ולא בוצע'
                    }
                },
                'גשש ': {
                    type: 'trafficLight',
                    answerText: {
                        full: 'נדרש ובוצע',
                        half: 'נדרש ולא בוצע',
                        none: 'לא נדרש ולא בוצע'
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
            questionNumber: 1,
            extra: {
                'צבא': {
                    // This top-level key has a group of sub–items:
                    'תורן תצפית': {
                        type: 'binary',
                        answerText: {
                            full: 'הסתייע ומיצה',
                            none: 'לא הסתייע'
                        }
                    },
                    'בקרות איסוף יבשתי': {
                        type: 'trafficLight',
                        answerText: {
                            full: 'נדרש ובוצע',
                            half: 'נדרש ולא מיצה',
                            none: 'לא נדרש'
                        }
                    },
                    'מצלמות מרכיבי הגנה': {
                        type: 'binary',
                        answerText: {
                            full: 'דרש',
                            none: 'לא דרש'
                        }
                    }
                },
                'ישוב': {
                    // Another group of sub–items:
                    'מכ״מ ומצלמות ptz ': {
                        type: 'binary',
                        answerText: {
                            full: 'דרש',
                            none: 'לא דרש'
                        }
                    },
                    'שימוש ״במרחב חכם״ (מצלמות עבירה ומצלמות הרכשה)': {
                        type: 'binary',
                        answerText: {
                            full: 'דרש',
                            none: 'לא דרש'
                        }
                    }
                }
            }
        },
        {
            name: 'שימוש באמל״ח המגוון של הכוח (מאג / נגב / מטאדור / לאו / מטול)',
            type: 'binary',
            value: null,
            active: false,
            part: 3,
            category: 'static',
            questionNumber: 5,
            answerText: { full: 'קרה', none: 'לא קרה' }
        }
    );

    return parts;
}

// ─── NAMES OF PARTS ─────────────────────────────────────────────────────────
// New section: names of parts.
export const partNames: string[] = [
    'גיבוש תמונת מצב באירוע',
    'הפעלת כוחות ומשימות',
    'מיצוי מכפילי כוח'
];
