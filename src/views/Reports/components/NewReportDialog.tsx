import React, { useState, useCallback, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import Step1BasicInfo from './NewReportForm/Step1BasicInfo';
import Step2ChooseFollowup from './NewReportForm/Step2ChooseFollowup';
import Step3FollowupForm from './NewReportForm/Step3FollowupForm';

export interface NewReportDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void; // Final payload to backend
}

const NewReportDialog: React.FC<NewReportDialogProps> = ({
                                                             open,
                                                             onClose,
                                                             onSubmit,
                                                         }) => {
    const [step, setStep] = useState<number>(1);

    // --- Step 1: Basic Info ---
    const [reportType, setReportType] = useState<'' | 'פלוגה' | 'גדוד'>('');
    const [gdod, setGdod] = useState('');
    const [pluga, setPluga] = useState('');
    const [date, setDate] = useState('');
    const [mentorName, setMentorName] = useState('');
    const [exerciseManagerName, setExerciseManagerName] = useState('');
    const [gzera, setGzera] = useState('');
    const [mission, setMission] = useState('');
    const [hativa, setHativa] = useState('');
    const [hatmar, setHatmar] = useState('');
    const [mefakedHakoah, setMefakedHakoah] = useState('');

    // --- Follow‑up data ---
    const [gradeData1, setGradeData1] = useState<any>(null);
    const [gradeData2, setGradeData2] = useState<any>(null);
    const [scenarioData1, setScenarioData1] = useState<any>(null);
    const [scenarioData2, setScenarioData2] = useState<any>(null);
    const [scenarioSummary, setScenarioSummary] = useState(''); // new state for summary

    // --- Step 3: Follow‑up form selection ---
    const [formType, setFormType] = useState<null | 'grades' | 'scenario'>(null);
    const [currentSlot, setCurrentSlot] = useState<null | 1 | 2>(null);
    const [currentFormData, setCurrentFormData] = useState<any>(null);

    // Reset all state when dialog opens.
    useEffect(() => {
        if (open) {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            setDate(`${yyyy}-${mm}-${dd}`);

            setStep(1);
            setReportType('');
            setGdod('');
            setPluga('');
            setMentorName('');
            setExerciseManagerName('');
            setGzera('');
            setMission('');
            setHativa('');
            setHatmar('');
            setMefakedHakoah('');
            setGradeData1(null);
            setGradeData2(null);
            setScenarioData1(null);
            setScenarioData2(null);
            setScenarioSummary('');
            setFormType(null);
            setCurrentSlot(null);
            setCurrentFormData(null);
        }
    }, [open]);

    // --- Handlers ---

    // Step 1 next
    const handleBasicInfoNext = () => {
        if (
            !reportType ||
            !gdod ||
            (reportType === 'פלוגה' && !pluga) ||
            !mentorName ||
            !exerciseManagerName ||
            !gzera ||
            !mission ||
            !mefakedHakoah
        ) {
            return;
        }
        setStep(2);
    };

    // Step 2 choose follow‑up
    const handleChooseFollowup = (type: 'grades' | 'scenario', slot: 1 | 2) => {
        setFormType(type);
        setCurrentSlot(slot);
        setCurrentFormData(null);
        setStep(3);
    };

    // Handle form data change
    const handleFormDataChange = useCallback((data: any) => {
        setCurrentFormData(data);
    }, []);

    // Step 3 save follow‑up
    const handleSaveFollowup = () => {
        if (formType === 'grades') {
            if (currentSlot === 1) setGradeData1(currentFormData);
            else if (currentSlot === 2) setGradeData2(currentFormData);
        } else if (formType === 'scenario') {
            if (currentSlot === 1) setScenarioData1(currentFormData);
            else if (currentSlot === 2) setScenarioData2(currentFormData);
        }
        setStep(2);
        setFormType(null);
        setCurrentSlot(null);
        setCurrentFormData(null);
    };

    // Final submit
    const handleFinalSubmit = () => {
        // Build the primary key by joining non-empty fields with underscores.
        const primaryKey = [gdod, pluga, date, hativa, hatmar]
            .filter((field) => field.trim() !== '')
            .join('_');

        const defaultGrade = { name: '', scoreData: { parts: [], finalGrade: 0 } };
        const defaultScenario = { scenarioText: '', scenarioUseAI: false };

        const payload = {
            primaryKey,
            reportType,
            gdod,
            ...(reportType === 'פלוגה' && { pluga }),
            date,
            mentorName,
            exerciseManagerName,
            mefakedHakoah,
            gzera,
            mission,
            hativa,
            hatmar,
            data: {
                grades: {
                    grade1: gradeData1 || defaultGrade,
                    grade2: gradeData2 || defaultGrade,
                },
                scenarios: {
                    scenario1: scenarioData1 || defaultScenario,
                    scenario2: scenarioData2 || defaultScenario,
                    summary: scenarioSummary || '',
                },
            },
        };

        console.log('Final payload:', payload);
        onSubmit(payload);
        onClose();
    };

    // Step content
    let content;
    if (step === 1) {
        content = (
            <Step1BasicInfo
                reportType={reportType}
                setReportType={setReportType}
                gdod={gdod}
                setGdod={setGdod}
                pluga={pluga}
                setPluga={setPluga}
                date={date}
                setDate={setDate}
                mentorName={mentorName}
                setMentorName={setMentorName}
                exerciseManagerName={exerciseManagerName}
                setExerciseManagerName={setExerciseManagerName}
                gzera={gzera}
                setGzera={setGzera}
                mission={mission}
                setMission={setMission}
                hativa={hativa}
                setHativa={setHativa}
                hatmar={hatmar}
                setHatmar={setHatmar}
                mefakedHakoah={mefakedHakoah}
                setMefakedHakoah={setMefakedHakoah}
                onNext={handleBasicInfoNext}
            />
        );
    } else if (step === 2) {
        content = (
            <Step2ChooseFollowup
                // ---- Step1 data:
                reportType={reportType}
                gdod={gdod}
                pluga={pluga}
                date={date}
                mentorName={mentorName}
                exerciseManagerName={exerciseManagerName}
                mefakedHakoah={mefakedHakoah}
                gzera={gzera}
                mission={mission}
                hatmar={hatmar}
                hativa={hativa}
                // ---- Step2 existing data:
                gradeData1={gradeData1}
                gradeData2={gradeData2}
                scenarioData1={scenarioData1}
                scenarioData2={scenarioData2}
                // ---- Callback for scenario summary:
                onSummarizeScenarios={setScenarioSummary}
                // ---- Navigation callbacks:
                onChooseFollowup={handleChooseFollowup}
                onBack={() => setStep(1)}
                onFinalSubmit={handleFinalSubmit}
            />
        );
    } else if (step === 3) {
        content = (
            <Step3FollowupForm
                formType={formType!}
                slot={currentSlot!}
                onDataChange={handleFormDataChange}
                onBack={() => setStep(2)}
                onSave={handleSaveFollowup}
            />
        );
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen
            sx={{
                '& .MuiDialog-paper': {
                    direction: 'rtl',
                    textAlign: 'right',
                },
            }}
        >
            <DialogTitle
                sx={{
                    position: 'relative',
                    textAlign: 'right',
                    direction: 'rtl',
                    pr: 8,
                }}
            >
                הכנס דוח חדש
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                dividers
                sx={{
                    overflow: 'auto',
                    direction: 'rtl',
                    textAlign: 'right',
                }}
            >
                {content}
            </DialogContent>
        </Dialog>
    );
};

export default NewReportDialog;
