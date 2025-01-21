/**
 * Matches the final JSON structure you want,
 * with just date, force_name, manager, location, and scenarios.
 */
export interface NewReportData {
    date: string;
    force_name: string;
    manager: string;
    location: string;
    scenarios: {
        scenario_1: string;
        scenario_2: string;
    };
}
