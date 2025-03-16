// DetailedPartsAnalysis/gradingUtils.ts

/* -----------------------------
   1) DEFINE YOUR DATA INTERFACES
------------------------------ */
export interface IPartItem {
    name: string;
    value: 'full' | 'half' | 'none' | string;
    part: number | string;
    parentName?: string;
    type?: string;
}

export interface IPart {
    items: IPartItem[];
    gradeOfPart?: any;
}

export interface IGrade {
    scoreData?: {
        parts?: IPart[];
        finalGrade?: any;
    };
    name?: string;
}

export interface IGrades {
    grade1?: IGrade;
    grade2?: IGrade;
}

export interface IScenarios {
    scenario1?: {
        scenarioText: string;
        scenarioUseAI: boolean;
    };
    scenario2?: {
        scenarioText: string;
        scenarioUseAI: boolean;
    };
    summary?: string;
}

// Note: IReport is imported from '../ReportItem' in your main file.

export const partTitles: Record<string, string> = {
    '1': 'גיבוש תמונת מצב באירוע',
    '2': 'הפעלת כוחות ומשימות',
    '3': 'מיצוי מכפילי כוח',
};

/* -----------------------------
   3) HELPER: GATHER ITEMS BY PART
------------------------------ */
export function gatherItemsByPart(grade?: IGrade) {
    const result: Record<
        string,
        { full: IPartItem[]; half: IPartItem[]; none: IPartItem[] }
    > = {};

    if (!grade?.scoreData?.parts) return result;

    for (const partObj of grade.scoreData.parts) {
        for (const item of partObj.items) {
            const partStr = String(item.part);
            if (!result[partStr]) {
                result[partStr] = { full: [], half: [], none: [] };
            }
            if (item.type === 'multipleChoice' && item.value && typeof item.value === 'object') {
                Object.entries(item.value).forEach(([subKey, subValue]) => {
                    const subVal = subValue as string;
                    const subItem: IPartItem = {
                        name: subKey,
                        part: item.part,
                        value: subVal,
                        parentName: item.name,
                    };
                    if (subVal === 'full') {
                        result[partStr].full.push(subItem);
                    } else if (subVal === 'half') {
                        result[partStr].half.push(subItem);
                    } else if (subVal === 'none') {
                        result[partStr].none.push(subItem);
                    }
                });
            } else {
                if (item.value === 'full') {
                    result[partStr].full.push(item);
                } else if (item.value === 'half') {
                    result[partStr].half.push(item);
                } else if (item.value === 'none') {
                    result[partStr].none.push(item);
                }
            }
        }
    }
    return result;
}

/* -----------------------------
   4) HELPER: COMPUTE OVERALL GRADE SCORE
------------------------------ */
export function computeGradePercentage(grade?: IGrade): number {
    if (!grade?.scoreData?.parts) return 0;
    let totalPoints = 0;
    let maxPoints = 0;
    for (const part of grade.scoreData.parts) {
        for (const item of part.items) {
            maxPoints += 2;
            if (item.value === 'full') {
                totalPoints += 2;
            } else if (item.value === 'half') {
                totalPoints += 1;
            }
        }
    }
    return maxPoints ? (totalPoints / maxPoints) * 100 : 0;
}

/* -----------------------------
   6) HELPER: COMPUTE PART GRADE
------------------------------ */
export function computePartGrade(grade?: IGrade, part: number): number {
    if (!grade?.scoreData?.parts) return 0;
    const partObj = grade.scoreData.parts[part - 1];
    if (!partObj) return 0;
    if (partObj.gradeOfPart) {
        if (typeof partObj.gradeOfPart === 'object' && partObj.gradeOfPart.$numberDouble) {
            return parseFloat(partObj.gradeOfPart.$numberDouble);
        } else if (typeof partObj.gradeOfPart === 'number') {
            return partObj.gradeOfPart;
        } else if (typeof partObj.gradeOfPart === 'string') {
            return parseFloat(partObj.gradeOfPart);
        }
    }
    return 0;
}
