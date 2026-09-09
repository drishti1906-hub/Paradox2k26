import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Clock3,
    CheckCircle2,
    XCircle,
    ChevronRight,
} from "lucide-react";

import CodeEditor from "../components/CodeEditor";
import { CHALLENGES } from "../data/challenges";
import { runCode } from "../lib/compiler";

export default function MissionScreen({
    onExit,
    timer = "40:00",
}) {
    const [questionIndex, setQuestionIndex] = useState(0);

    const [language, setLanguage] = useState("python");

    const [running, setRunning] = useState(false);

    const [result, setResult] = useState(null);

    const [code, setCode] = useState("");

    const mission = CHALLENGES[questionIndex];

    /*
     * Load starter code whenever question/language changes.
     */
    useEffect(() => {
        setCode(mission.starterCode[language]);
        setResult(null);
    }, [questionIndex, language]);

    useEffect(() => {
        const resetHandler = () => {
            setCode(mission.starterCode[language]);
            setResult(null);
        };

        window.addEventListener(
            "reset-code",
            resetHandler
        );

        return () => {
            window.removeEventListener(
                "reset-code",
                resetHandler
            );
        };
    }, [mission, language]);

    const handleRun = async () => {
        setRunning(true);
        setResult(null);

        try {
            const compilerResult = await runCode({
                language,
                code,
                testCases: mission.testCases,
            });

            setResult(compilerResult);
        } catch (error) {
            setResult({
                success: false,
                passedCount: 0,
                total: mission.testCases.length,
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

    const nextQuestion = () => {
        if (questionIndex < CHALLENGES.length - 1) {
            setQuestionIndex((previous) => previous + 1);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="min-h-screen bg-[#05030A] text-white font-sans">

            {/* TOP BAR */}
            <header className="h-16 border-b border-purple-500/30 bg-[#08050E] flex items-center justify-between px-5">

                <div className="flex items-center gap-4">

                    <button
                        onClick={onExit}
                        className="flex items-center gap-2 text-white/50 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                        EXIT MISSION
                    </button>

                    <div className="h-6 w-px bg-white/10" />

                    <div>
                        <div className="text-xs text-purple-400 tracking-[0.3em] font-bold">
                            PARADOX / INFINITY
                        </div>

                        <div className="font-black tracking-wider">
                            MISSION TERMINAL
                        </div>
                    </div>

                </div>

                {/* TIMER */}
                <div className="flex items-center gap-3 border border-purple-500/30 px-5 py-2 bg-purple-950/20">

                    <Clock3
                        size={20}
                        className="text-purple-400"
                    />

                    <span className="font-mono text-2xl font-black tracking-widest">
                        {timer}
                    </span>

                </div>

            </header>

            {/* MAIN */}
            <main className="h-[calc(100vh-4rem)] p-4">

                <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* ================= QUESTION ================= */}

                    <section className="border border-purple-500/30 bg-[#08060D] flex flex-col min-h-0">

                        {/* HEADER */}

                        <div className="border-b border-white/10 p-5">

                            <div className="text-xs text-purple-400 tracking-[0.3em] font-bold">
                                {mission.caseFile}
                            </div>

                            <div className="flex items-center justify-between mt-2">

                                <h1 className="text-3xl md:text-4xl font-black">
                                    {mission.title}
                                </h1>

                                <span className="px-3 py-1 border border-green-500/30 bg-green-950/20 text-green-400 text-xs font-bold">
                                    {mission.difficulty}
                                </span>

                            </div>

                            <div className="mt-3 text-xs text-white/30">
                                QUESTION {questionIndex + 1} / {CHALLENGES.length}
                            </div>

                        </div>

                        {/* CONTENT */}

                        <div className="flex-1 overflow-y-auto p-6">

                            <div className="text-lg text-white/75 leading-8">
                                {mission.description}
                            </div>

                            <div className="mt-6 text-white/60 leading-7">
                                {mission.problem}
                            </div>

                            {/* EXAMPLES */}

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

                            {/* TEST CASE STATUS */}

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

                                    {/* INDIVIDUAL TEST CASES */}

                                    <div className="mt-4 space-y-2">

                                        {result.results.map(
                                            (test) => (
                                                <div
                                                    key={test.testCase}
                                                    className={`p-3 border ${test.passed
                                                        ? "border-green-500/20"
                                                        : "border-red-500/20"
                                                        }`}
                                                >

                                                    <div className="flex justify-between">

                                                        <span className="font-mono text-sm">
                                                            TEST CASE{" "}
                                                            {test.testCase}
                                                        </span>

                                                        <span
                                                            className={
                                                                test.passed
                                                                    ? "text-green-400"
                                                                    : "text-red-400"
                                                            }
                                                        >
                                                            {test.passed
                                                                ? "PASSED"
                                                                : "FAILED"}
                                                        </span>

                                                    </div>

                                                    {!test.passed &&
                                                        test.error && (
                                                            <pre className="mt-2 text-xs text-red-300 whitespace-pre-wrap">
                                                                {test.error}
                                                            </pre>
                                                        )}

                                                </div>
                                            )
                                        )}

                                    </div>

                                </div>
                            )}

                        </div>

                    </section>

                    {/* ================= CODE ================= */}

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

            {/* NEXT QUESTION */}

            {result?.success && (
                <div className="fixed bottom-5 right-5">

                    {questionIndex < CHALLENGES.length - 1 ? (
                        <button
                            onClick={nextQuestion}
                            className="flex items-center gap-3 px-7 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black tracking-widest shadow-[0_0_25px_rgba(139,92,246,0.5)]"
                        >
                            NEXT QUESTION
                            <ChevronRight size={20} />
                        </button>
                    ) : (
                        <div className="px-7 py-4 bg-green-600 text-white font-black tracking-widest">
                            ALL 5 CASE FILES COMPLETE
                        </div>
                    )}

                </div>
            )}

        </div>
    );
}