import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Clock3,
    CheckCircle2,
    XCircle,
    ChevronRight,
} from "lucide-react";

import CodeEditor from "../components/CodeEditor";
import {
    INNOCENT_CHALLENGES,
    IMPOSTER_CHALLENGES,
} from "../data/missionChallenges";
import { runCode } from "../lib/compiler";

export default function MissionScreen({
    teamName,
    role,
    onExit,
}) {
    const questions =
        role === "IMPOSTER"
            ? IMPOSTER_CHALLENGES
            : INNOCENT_CHALLENGES;

    // -----------------------------------------
    // PHASE
    // 1 = Questions 1-5
    // 2 = Round Table
    // 3 = Questions 6-10
    // 4 = Finished
    // -----------------------------------------

    const [phase, setPhase] = useState(1);

    const [questionIndex, setQuestionIndex] = useState(0);

    const [timeLeft, setTimeLeft] = useState(30 * 60);

    const [language, setLanguage] = useState("python");

    const [code, setCode] = useState("");

    const [running, setRunning] = useState(false);

    const [result, setResult] = useState(null);

    const [score, setScore] = useState(0);

    const [solvedQuestions, setSolvedQuestions] = useState([]);

    const mission = questions[questionIndex];

    // -----------------------------------------
    // LOAD STARTER CODE
    // -----------------------------------------

    useEffect(() => {
        if (!mission) return;

        setCode(
            mission.starterCode?.[language] || ""
        );

        setResult(null);
    }, [mission, language]);

    // -----------------------------------------
    // TIMER
    // -----------------------------------------

    useEffect(() => {
        if (phase === 4) return;

        const timer = setInterval(() => {
            setTimeLeft((previous) => {
                if (previous <= 1) {
                    return 0;
                }

                return previous - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [phase]);

    // -----------------------------------------
    // TIMER EVENTS
    // -----------------------------------------

    useEffect(() => {
        if (timeLeft !== 0) return;

        // =========================================
        // MISSION 1 ENDED
        // 30 MINUTES COMPLETED
        // =========================================
        if (phase === 1) {
            setPhase(2);
            setQuestionIndex(5);

            // Round Table = exactly 10 minutes
            setTimeLeft(10 * 60);

            setResult(null);
            return;
        }

        // =========================================
        // ROUND TABLE ENDED
        // 10 MINUTES COMPLETED
        // =========================================
        if (phase === 2) {
            setPhase(3);

            // Start Question 6
            setQuestionIndex(5);

            // Mission 2 = exactly 30 minutes
            setTimeLeft(30 * 60);

            setResult(null);
            return;
        }

        // =========================================
        // MISSION 2 ENDED
        // 30 MINUTES COMPLETED
        // =========================================
        if (phase === 3) {
            setPhase(4);
            setTimeLeft(0);
            return;
        }

    }, [timeLeft, phase]);
    // -----------------------------------------
    // RUN CODE
    // -----------------------------------------

    const handleRun = async () => {
        if (!mission || running) return;

        setRunning(true);
        setResult(null);

        try {
            const compilerResult = await runCode({
                language,
                code,
                testCases: mission.testCases || [],
            });

            setResult(compilerResult);

            if (compilerResult.success) {
                setSolvedQuestions((previous) => {
                    if (previous.includes(questionIndex)) {
                        return previous;
                    }

                    setScore(
                        (previousScore) =>
                            previousScore + (mission.points || 30)
                    );

                    return [...previous, questionIndex];
                });
            }
        } catch (error) {
            setResult({
                success: false,
                passedCount: 0,
                total: mission.testCases?.length || 0,
                results: [
                    {
                        testCase: 0,
                        passed: false,
                        error:
                            error?.message ||
                            "Compiler connection failed.",
                    },
                ],
            });
        } finally {
            setRunning(false);
        }
    };

    // -----------------------------------------
    // NEXT QUESTION
    // -----------------------------------------

    const nextQuestion = () => {
        // Mission 1: Questions 1-5
        if (phase === 1 && questionIndex < 4) {
            setQuestionIndex((previous) => previous + 1);
            return;
        }

        // Mission 2: Questions 6-10
        if (phase === 3 && questionIndex < 9) {
            setQuestionIndex((previous) => previous + 1);
            return;
        }
    };
    // -----------------------------------------
    // TIME FORMAT
    // -----------------------------------------

    const formattedTime = `${String(
        Math.floor(timeLeft / 60)
    ).padStart(2, "0")}:${String(
        timeLeft % 60
    ).padStart(2, "0")}`;

    const isRoundTable = phase === 2;
    const isFinished = phase === 4;

    // -----------------------------------------
    // UI
    // -----------------------------------------

    return (
        <div className="min-h-screen bg-[#05030A] text-white font-sans">

            {/* TOP BAR */}

            <header className="h-16 border-b border-purple-500/30 bg-[#08050E] flex items-center justify-between px-5">

                <button
                    onClick={onExit}
                    className="flex items-center gap-2 text-white/50 hover:text-white"
                >
                    <ArrowLeft size={20} />
                    EXIT MISSION
                </button>

                <div className="text-center">
                    <div className="text-xs text-purple-400 tracking-[0.3em] font-bold">
                        PARADOX / INFINITY
                    </div>

                    <div className="font-black tracking-wider">
                        MISSION TERMINAL
                    </div>
                </div>

                <div
                    className={`font-black tracking-widest ${role === "IMPOSTER"
                        ? "text-red-400"
                        : "text-green-400"
                        }`}
                >
                    {role}
                </div>
            </header>

            {/* STATUS BAR */}

            <div className="px-5 py-3 border-b border-white/10 bg-[#08050E] flex items-center justify-between">

                <div>
                    <span className="text-xs text-white/40 tracking-widest">
                        TEAM
                    </span>

                    <span className="ml-2 font-black">
                        {teamName}
                    </span>
                </div>

                <div className="flex items-center gap-8">

                    <div className="text-xs tracking-widest">
                        {phase === 1 && "MISSION 1 • QUESTIONS 01–05"}
                        {phase === 2 && "ROUND TABLE • 10 MINUTES"}
                        {phase === 3 && "MISSION 2 • QUESTIONS 06–10"}
                        {phase === 4 && "MISSION COMPLETE"}
                    </div>

                    <div className="text-xs tracking-widest">
                        SCORE:
                        <span className="ml-2 text-purple-400 font-black">
                            {score}
                        </span>
                    </div>

                    <div
                        className={`flex items-center gap-2 font-mono text-2xl font-black ${timeLeft <= 60
                            ? "text-red-400 animate-pulse"
                            : "text-purple-400"
                            }`}
                    >
                        <Clock3 size={20} />
                        {formattedTime}
                    </div>

                </div>
            </div>

            {/* ROUND TABLE */}

            {isRoundTable && (
                <div 
                    className="min-h-[calc(100vh-7rem)] flex items-center justify-center p-8 bg-cover bg-center"
                    style={{ backgroundImage: "url('/splash-bg.jpg')" }}
                >

                    <div className="w-full max-w-3xl border-2 border-purple-500 bg-[#08050E] p-12 text-center shadow-[0_0_50px_rgba(139,92,246,0.25)]">

                        <div className="text-purple-400 text-sm font-black tracking-[0.4em]">
                            INTERMISSION
                        </div>

                        <h1 className="mt-5 text-5xl font-black tracking-widest">
                            ROUND TABLE
                        </h1>

                        <p className="mt-5 text-white/50 text-lg">
                            Discuss the evidence with your team.
                        </p>

                        <div className="mt-10 flex justify-center">
                            <div className="border border-purple-500/50 px-12 py-6">
                                <Clock3
                                    size={35}
                                    className="mx-auto text-purple-400 mb-3"
                                />

                                <div className="text-6xl font-mono font-black text-purple-400">
                                    {formattedTime}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-red-400 font-black tracking-widest">
                            QUESTIONS 06–10 LOCKED
                        </div>

                    </div>
                </div>
            )}

            {/* FINISHED */}

            {isFinished && (
                <div 
                    className="min-h-[calc(100vh-7rem)] flex items-center justify-center p-8 bg-cover bg-center"
                    style={{ backgroundImage: "url('/splash-bg.jpg')" }}
                >

                    <div className="border-2 border-purple-500 bg-[#08050E] p-12 text-center">

                        <CheckCircle2
                            size={65}
                            className="mx-auto text-green-400 mb-5"
                        />

                        <h1 className="text-5xl font-black tracking-widest text-green-400">
                            ROUND COMPLETE
                        </h1>

                        <p className="mt-5 text-white/50 tracking-widest">
                            ALL 10 QUESTIONS COMPLETED
                        </p>

                        <div className="mt-7 text-4xl font-black text-purple-400">
                            SCORE: {score}
                        </div>

                        <button
                            onClick={onExit}
                            className="mt-8 px-8 py-4 bg-purple-600 hover:bg-purple-500 font-black tracking-widest"
                        >
                            RETURN TO DASHBOARD
                        </button>

                    </div>
                </div>
            )}

            {/* QUESTIONS */}

            {!isRoundTable && !isFinished && mission && (

                <main className="h-[calc(100vh-7rem)] p-4">

                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">

                        {/* QUESTION */}

                        <section className="border border-purple-500/30 bg-[#08060D] flex flex-col min-h-0">

                            <div className="border-b border-white/10 p-5">

                                <div className="text-xs text-purple-400 tracking-[0.3em] font-bold">
                                    {mission.caseFile}
                                </div>

                                <div className="flex items-center justify-between mt-2">

                                    <h1 className="text-3xl font-black">
                                        {mission.title}
                                    </h1>

                                    <span className="px-3 py-1 border border-green-500/30 text-green-400 text-xs font-bold">
                                        {mission.difficulty}
                                    </span>

                                </div>

                                <div className="mt-3 text-xs text-white/40 tracking-widest">
                                    QUESTION {questionIndex + 1} / 10
                                </div>

                            </div>

                            <div className="flex-1 overflow-y-auto p-6">

                                <div className="text-lg text-white/75 leading-8">
                                    {mission.description}
                                </div>

                                <div className="mt-6 text-white/60 leading-7">
                                    {mission.problem}
                                </div>

                                {mission.examples?.length > 0 && (
                                    <div className="mt-8">

                                        <h2 className="text-lg font-black tracking-wider mb-4">
                                            EXAMPLES
                                        </h2>

                                        <div className="space-y-5">

                                            {mission.examples.map(
                                                (example, index) => (
                                                    <div
                                                        key={index}
                                                        className="border border-white/10 bg-black/30 p-5"
                                                    >

                                                        <div className="text-purple-400 font-bold mb-3">
                                                            Example {index + 1}
                                                        </div>

                                                        <div className="font-mono text-sm">

                                                            <div className="text-white/70 whitespace-pre-wrap">
                                                                <span className="text-white/40">
                                                                    Input:
                                                                </span>{" "}
                                                                {example.input}
                                                            </div>

                                                            <div className="mt-3 text-white/80 whitespace-pre-wrap">
                                                                <span className="text-white/40">
                                                                    Output:
                                                                </span>{" "}
                                                                {example.output}
                                                            </div>

                                                        </div>

                                                    </div>
                                                )
                                            )}

                                        </div>
                                    </div>
                                )}

                                {result && (
                                    <div className="mt-8">

                                        <div
                                            className={`p-5 border ${result.success
                                                ? "border-green-500/50 bg-green-950/20"
                                                : "border-red-500/50 bg-red-950/20"
                                                }`}
                                        >

                                            <div className="flex items-center gap-3">

                                                {result.success ? (
                                                    <CheckCircle2
                                                        className="text-green-400"
                                                        size={25}
                                                    />
                                                ) : (
                                                    <XCircle
                                                        className="text-red-400"
                                                        size={25}
                                                    />
                                                )}

                                                <div>

                                                    <div
                                                        className={`font-black tracking-widest ${result.success
                                                            ? "text-green-400"
                                                            : "text-red-400"
                                                            }`}
                                                    >
                                                        {result.success
                                                            ? "CASE FILE CORRECT"
                                                            : "CASE FILE FAILED"}
                                                    </div>

                                                    <div className="text-sm text-white/50 mt-1">
                                                        {result.passedCount} /{" "}
                                                        {result.total} TEST CASES PASSED
                                                    </div>

                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                )}

                            </div>

                        </section>

                        {/* CODE */}

                        <section className="min-h-0">

                            <CodeEditor
                                language={language}
                                setLanguage={setLanguage}
                                code={code}
                                setCode={setCode}
                                onRun={handleRun}
                                running={running}
                                output={result}
                            />

                        </section>

                    </div>
                </main>
            )}

            {/* NEXT BUTTON */}

            {!isRoundTable &&
                !isFinished &&
                result?.success &&
                ((phase === 1 && questionIndex < 4) ||
                    (phase === 3 && questionIndex < 9)) && (

                    <div className="fixed bottom-5 right-5">

                        <button
                            onClick={nextQuestion}
                            className="flex items-center gap-3 px-7 py-4 bg-purple-600 hover:bg-purple-500 font-black tracking-widest"
                        >
                            NEXT QUESTION
                            <ChevronRight size={20} />
                        </button>

                    </div>
                )}

        </div>
    );
}