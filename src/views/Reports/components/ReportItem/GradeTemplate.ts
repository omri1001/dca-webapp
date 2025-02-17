// src/views/Reports/components/GradeTemplate.ts
import { Part } from "./GradeTemplateForm";

export function createDefaultPart(): Part {
    return {
        items: [
            { type: "trafficLight", value: null, active: false },
            { type: "trafficLight", value: null, active: false },
            { type: "trafficLight", value: null, active: false },
            { type: "trafficLight", value: null, active: false },
            { type: "trafficLight", value: null, active: false },
            { type: "binary", value: null, active: false },
            { type: "binary", value: null, active: false },
        ],
    };
}

export function createDefaultParts(): Part[] {
    return [createDefaultPart(), createDefaultPart(), createDefaultPart()];
}
