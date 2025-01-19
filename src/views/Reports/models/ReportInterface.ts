// src/components/NewReportDialog/interfaces.ts

/**
 * Matches the final JSON structure you want,
 * with "scenarios" and "grades" objects.
 */
export interface NewReportData {
    primary_key: string;
    date: string;
    time: string;
    force_name: string;
    manager: string;
    location: string;
    scenarios: {
        scenario_1: string;
        scenario_2: string;
    };
    grades: {
        [category: string]: {
            items: {
                [itemKey: string]:
                    | { $numberInt: string }
                    | { $numberDouble: string };
            };
            comment: string;
            average: { $numberDouble: string };
        };
    };
}
