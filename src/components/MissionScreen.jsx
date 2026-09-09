import { useState } from 'react';
import { ArrowLeft, Clock3, Flag, CheckCircle2 } from 'lucide-react';
import CodeEditor from '../components/CodeEditor';

const DEFAULT_MISSION = {
    id: 1,
    title: 'TWO SUM',
    caseFile: 'CASE FILE 01',
    description:
        'You are given an array of integers nums and an integer target. Return indices of the two numbers such that they add up to target.',
    difficulty: 'EASY',

    examples: [
        {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]',
            explanation:
                'Because nums[0] + nums[1] == 9, we return [0, 1].',
        },
        {
            input: 'nums = [3,2,4], target = 6',
            output: '[1,2]',
            explanation:
                'Because nums[1] + nums[2] == 6.',
        },
    ],

    constraints: [
        '2 <= nums.length <= 10⁴',
        '-10⁹ <= nums[i] <= 10⁹',
        '-10⁹ <= target <= 10⁹',
    ],
};

export default function MissionScreen({
    onExit,
    timer = '00:00',
}) {
    const [mission] = useState(DEFAULT_MISSION);
    const [running, setRunning] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState('');

    const runCode = async ({ language, code }) => {
        console.log('RUN REQUEST:', {
            language,
            code,
        });

        setRunning(true);
        setSubmissionMessage('');

        try {
            /*
             * COMPILER CONNECTION WILL BE ADDED NEXT.
             *
             * For now we only verify that the editor
             * is communicating correctly.
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 800)
            );

            return {
                output:
                    `Compiler ready.\n\n` +
                    `Language: ${language}\n\n` +
                    `Your code was received successfully.\n\n` +
                    `Actual execution will be connected next.`,
            };

        } finally {
            setRunning(false);
        }
    };

    const submitMission = () => {
        setSubmissionMessage(
            'SUBMISSION RECEIVED — COMPILER CONNECTION COMING NEXT'
        );
    };

    return (
        <div className="min-h-screen bg-[#05030A] text-white font-sans">

            {/* TOP BAR */}
            <header className="h-16 border-b border-purple-500/30 bg-[#08050E] flex items-center justify-between px-5">

                <div className="flex items-center gap-4">

                    <button
                        onClick={onExit}
                        className="flex items-center gap-2 text-white/50 hover:text-white transition"
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

                    {/* LEFT — QUESTION */}
                    <section className="border border-purple-500/30 bg-[#08060D] flex flex-col min-h-0">

                        {/* QUESTION HEADER */}
                        <div className="border-b border-white/10 p-5">

                            <div className="text-xs text-purple-400 tracking-[0.3em] font-bold">
                                {mission.caseFile}
                            </div>

                            <div className="flex items-center justify-between mt-2">

                                <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                                    {mission.title}
                                </h1>

                                <span className="px-3 py-1 border border-green-500/30 bg-green-950/20 text-green-400 text-xs font-bold">
                                    {mission.difficulty}
                                </span>

                            </div>

                        </div>

                        {/* QUESTION CONTENT */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">

                            <div className="text-lg text-white/75 leading-8">
                                {mission.description}
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

                                                <div className="font-mono text-sm text-white/80 space-y-2">

                                                    <div>
                                                        <span className="text-white/40">
                                                            Input:
                                                        </span>{' '}
                                                        {example.input}
                                                    </div>

                                                    <div>
                                                        <span className="text-white/40">
                                                            Output:
                                                        </span>{' '}
                                                        {example.output}
                                                    </div>

                                                </div>

                                                <div className="mt-3 text-white/50 text-sm">
                                                    {example.explanation}
                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>

                            </div>

                            {/* CONSTRAINTS */}
                            <div className="mt-8">

                                <h2 className="text-lg font-black tracking-wider mb-4">
                                    CONSTRAINTS
                                </h2>

                                <ul className="space-y-2 text-white/50 font-mono text-sm">

                                    {mission.constraints.map(
                                        (constraint, index) => (
                                            <li key={index}>
                                                • {constraint}
                                            </li>
                                        )
                                    )}

                                </ul>

                            </div>

                        </div>

                    </section>

                    {/* RIGHT — CODE */}
                    <section className="min-h-0">

                        <CodeEditor
                            onRun={runCode}
                            running={running}
                        />

                    </section>

                </div>

            </main>

            {/* SUBMISSION MESSAGE */}
            {submissionMessage && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 border border-green-500/40 bg-green-950/90 px-6 py-4 text-green-300 shadow-xl">

                    <CheckCircle2 size={20} />

                    {submissionMessage}

                </div>
            )}

        </div>
    );
}