import { useState } from "react";
import CodeEditor from "./CodeEditor";

const QUESTIONS = [
    {
        id: 1,
        title: "THE SUSPICIOUS ACTIVITY WINDOW",
        difficulty: "MEDIUM",
        points: 30,
        time: "8 minutes",

        description:
            "A PARADOX security server records activity levels during a suspicious incident. Investigators only want to examine records whose activity falls inside a specified security window. Values outside this window are considered normal for this investigation.",

        problem:
            "Given N activity values and two limits L and R, calculate the sum of all values greater than or equal to L and less than or equal to R.",

        input: `7
12 45 23 67 34 18 50
20 50`,

        output: "Activity Sum: 170",

        python: `n = int(input())
arr = list(map(int, input().split()))
L, R = map(int, input().split())

# Write your solution here
`,

        c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int arr[100];

    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    int L, R;
    scanf("%d %d", &L, &R);

    // Write your solution here

    return 0;
}
`,
    },

    {
        id: 2,
        title: "THE REPEATED SIGNAL",
        difficulty: "MEDIUM",
        points: 30,
        time: "10 minutes",

        description:
            "A surveillance system receives signal codes from several checkpoints. If the same signal code appears repeatedly, it may indicate that the same source contacted the system more than once.",

        problem:
            "Given N integers, count how many distinct values occur more than once.",

        input: `8
12 5 12 7 5 9 5 3`,

        output: "Repeated Signal Types: 2",

        python: `n = int(input())
arr = list(map(int, input().split()))

# Write your solution here
`,

        c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int arr[100];

    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    // Write your solution here

    return 0;
}
`,
    },

    {
        id: 3,
        title: "EVIDENCE SORTING",
        difficulty: "MEDIUM",
        points: 30,
        time: "10 minutes",

        description:
            "Evidence IDs arrive at the PARADOX control room in an unpredictable order. Before investigators compare records, the system must arrange the IDs from the smallest to the largest value.",

        problem:
            "Given N integer evidence IDs, sort them in ascending order and print the sorted sequence.",

        input: `6
42 15 8 31 19 27`,

        output: "8 15 19 27 31 42",

        python: `n = int(input())
arr = list(map(int, input().split()))

# Write your solution here
`,

        c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int arr[100];

    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    // Write your solution here

    return 0;
}
`,
    },

    {
        id: 4,
        title: "SECURE ZONE ANALYSIS",
        difficulty: "MEDIUM",
        points: 30,
        time: "10 minutes",

        description:
            "A facility is divided into several security zones. Each zone reports the number of suspicious events detected there. The control room wants to identify the zone with the highest number of events.",

        problem:
            "Given N event counts, find the maximum event count and its 1-based position in the list.",

        input: `5
14 29 11 43 25`,

        output: `Highest Events: 43
Zone Position: 4`,

        python: `n = int(input())
arr = list(map(int, input().split()))

# Write your solution here
`,

        c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int arr[100];

    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    // Write your solution here

    return 0;
}
`,
    },

    {
        id: 5,
        title: "THE MISSING RECORD",
        difficulty: "MEDIUM",
        points: 30,
        time: "10 minutes",

        description:
            "A PARADOX archive stores evidence IDs from 1 through N. Because of a synchronization failure, exactly one ID is missing. Investigators need the program to recover the missing ID automatically.",

        problem:
            "Given N-1 distinct integers from 1 to N, find the missing number.",

        input: `7
1 2 3 5 6 7`,

        output: "Missing ID: 4",

        python: `n = int(input())
arr = list(map(int, input().split()))

# Write your solution here
`,

        c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int arr[100];

    for (int i = 0; i < n - 1; i++) {
        scanf("%d", &arr[i]);
    }

    // Write your solution here

    return 0;
}
`,
    },
];

export default function ChallengePage() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [completed, setCompleted] = useState(false);

    const question = QUESTIONS[currentQuestion];

    const handleRun = async ({ language, code }) => {
        console.log("Running:", language);
        console.log(code);

        // TEMPORARY:
        // This will later be connected to the real C/Python compiler.
        setCompleted(true);

        return {
            output: "TEST CASES PASSED\n\nAll test cases passed successfully.",
        };
    };

    const nextQuestion = () => {
        if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setCompleted(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#05040A] text-white flex flex-col">

            {/* TOP BAR */}
            <div className="h-16 border-b border-purple-500/30 bg-[#090611] flex items-center justify-between px-6">

                <div>
                    <div className="text-xs tracking-[0.3em] text-purple-400 font-bold">
                        PARADOX PROTOCOL
                    </div>

                    <div className="font-black tracking-widest">
                        ROUND 2 — PROGRAMMING
                    </div>
                </div>

                <div className="flex items-center gap-4">

                    <div className="text-xs text-white/40">
                        CASE {String(question.id).padStart(2, "0")} / 05
                    </div>

                    <div className="border border-purple-500/40 px-4 py-2 text-purple-300 font-bold">
                        {question.points} POINTS
                    </div>

                </div>
            </div>

            {/* MAIN */}
            <div className="flex flex-1 min-h-0">

                {/* QUESTION PANEL */}
                <div className="w-1/2 border-r border-purple-500/30 overflow-y-auto">

                    <div className="p-8">

                        <div className="flex justify-between items-start mb-8">

                            <div>

                                <div className="text-purple-400 text-xs tracking-[0.3em] font-bold mb-3">
                                    CASE FILE {String(question.id).padStart(2, "0")}
                                </div>

                                <h1 className="text-4xl font-black tracking-wide">
                                    {question.title}
                                </h1>

                            </div>

                            <div className="border border-yellow-500/40 text-yellow-400 px-4 py-2 text-sm font-bold">
                                {question.difficulty}
                            </div>

                        </div>

                        {/* DESCRIPTION */}
                        <div className="border-t border-white/10 pt-6">

                            <h2 className="text-xs tracking-[0.25em] text-purple-400 font-bold mb-4">
                                SCENARIO
                            </h2>

                            <p className="text-white/70 leading-7 text-lg">
                                {question.description}
                            </p>

                        </div>

                        {/* PROBLEM */}
                        <div className="mt-8">

                            <h2 className="text-xs tracking-[0.25em] text-purple-400 font-bold mb-4">
                                PROBLEM STATEMENT
                            </h2>

                            <p className="text-white/80 leading-7">
                                {question.problem}
                            </p>

                        </div>

                        {/* SAMPLE INPUT */}
                        <div className="mt-8">

                            <h2 className="text-xs tracking-[0.25em] text-purple-400 font-bold mb-3">
                                SAMPLE INPUT
                            </h2>

                            <pre className="bg-black border border-white/10 p-5 text-green-300 font-mono whitespace-pre-wrap">
                                {question.input}
                            </pre>

                        </div>

                        {/* EXPECTED OUTPUT */}
                        <div className="mt-6">

                            <h2 className="text-xs tracking-[0.25em] text-purple-400 font-bold mb-3">
                                EXPECTED OUTPUT
                            </h2>

                            <pre className="bg-black border border-white/10 p-5 text-green-300 font-mono whitespace-pre-wrap">
                                {question.output}
                            </pre>

                        </div>

                    </div>

                </div>

                {/* COMPILER */}
                <div className="w-1/2 min-h-0">

                    <CodeEditor
                        key={question.id}
                        onRun={handleRun}
                    />

                    {/* NEXT BUTTON */}
                    {completed && (
                        <div className="border-t border-green-500/30 bg-[#080d09] p-4 flex justify-end">

                            {currentQuestion < QUESTIONS.length - 1 ? (
                                <button
                                    onClick={nextQuestion}
                                    className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-black tracking-widest uppercase transition"
                                >
                                    NEXT QUESTION →
                                </button>
                            ) : (
                                <div className="px-8 py-3 border border-green-500/40 text-green-400 font-black tracking-widest">
                                    ALL 5 QUESTIONS COMPLETED
                                </div>
                            )}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}