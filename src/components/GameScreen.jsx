import { useEffect, useState } from 'react';

const INNOCENT_QUESTIONS = [
    {
        question: "QUESTION 1 FOR INNOCENTS",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 0
    },
    {
        question: "QUESTION 2 FOR INNOCENTS",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 1
    },
    {
        question: "QUESTION 3 FOR INNOCENTS",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 2
    },
    {
        question: "QUESTION 4 FOR INNOCENTS",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 0
    },
    {
        question: "QUESTION 5 FOR INNOCENTS",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 3
    },
    {
        question: "QUESTION 6 FOR INNOCENTS",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 1
    },
    {
        question: "QUESTION 7 FOR INNOCENTS",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 2
    },
    {
        question: "QUESTION 8 FOR INNOCENTS",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 3
    },
    {
        question: "QUESTION 9 FOR INNOCENTS",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 0
    },
    {
        question: "QUESTION 10 FOR INNOCENTS",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 1
    }
];

const IMPOSTER_QUESTIONS = [
    {
        question: "QUESTION 1 FOR IMPOSTER",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 0
    },
    {
        question: "QUESTION 2 FOR IMPOSTER",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 1
    },
    {
        question: "QUESTION 3 FOR IMPOSTER",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 2
    },
    {
        question: "QUESTION 4 FOR IMPOSTER",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 0
    },
    {
        question: "QUESTION 5 FOR IMPOSTER",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 3
    },
    {
        question: "QUESTION 6 FOR IMPOSTER",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 1
    },
    {
        question: "QUESTION 7 FOR IMPOSTER",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 2
    },
    {
        question: "QUESTION 8 FOR IMPOSTER",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 3
    },
    {
        question: "QUESTION 9 FOR IMPOSTER",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 0
    },
    {
        question: "QUESTION 10 FOR IMPOSTER",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 1
    }
];

export default function GameScreen({ team, onComplete }) {
    const isImposter = team.role === 'IMPOSTER';

    const questions = isImposter
        ? IMPOSTER_QUESTIONS
        : INNOCENT_QUESTIONS;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(
        Array(questions.length).fill(null)
    );

    // 40 minutes
    const [timeLeft, setTimeLeft] = useState(40 * 60);

    const [finished, setFinished] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (finished) return;

        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, finished]);

    const formatTime = seconds => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${String(minutes).padStart(2, '0')}:${String(
            secs
        ).padStart(2, '0')}`;
    };

    const selectAnswer = index => {
        const updated = [...answers];
        updated[currentQuestion] = index;
        setAnswers(updated);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        let total = 0;

        questions.forEach((question, index) => {
            if (answers[index] === question.answer) {
                total++;
            }
        });

        setScore(total);
        setFinished(true);
    };

    if (finished) {
        return (
            <div className="fixed inset-0 bg-black text-white flex items-center justify-center p-6">
                <div className="w-full max-w-3xl text-center">

                    <h1 className="text-5xl font-black tracking-widest mb-8">
                        ROUND COMPLETE
                    </h1>

                    <div className="border border-white/20 rounded-2xl p-10 bg-white/5">

                        <p className="text-gray-400 text-xl mb-3">
                            TEAM
                        </p>

                        <p className="text-3xl font-bold mb-8">
                            {team.team_number}
                        </p>

                        <p className="text-gray-400 text-xl mb-3">
                            SCORE
                        </p>

                        <p className="text-7xl font-black mb-8">
                            {score} / {questions.length}
                        </p>

                        <button
                            onClick={() => onComplete(score)}
                            className="px-10 py-4 bg-white text-black rounded-xl font-bold text-lg"
                        >
                            CONTINUE
                        </button>

                    </div>
                </div>
            </div>
        );
    }

    const question = questions[currentQuestion];

    return (
        <div className="fixed inset-0 bg-black text-white overflow-auto">

            {/* HEADER */}
            <div className="sticky top-0 z-50 bg-black/95 border-b border-white/10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div>
                        <p className="text-xs text-gray-500 tracking-widest">
                            TEAM
                        </p>

                        <p className="font-bold">
                            {team.team_number}
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-gray-500 tracking-widest">
                            QUESTION
                        </p>

                        <p className="font-bold">
                            {currentQuestion + 1} / {questions.length}
                        </p>
                    </div>

                    <div
                        className={`text-2xl font-black font-mono ${timeLeft <= 60
                                ? 'text-red-500'
                                : 'text-white'
                            }`}
                    >
                        {formatTime(timeLeft)}
                    </div>

                </div>
            </div>

            {/* PROGRESS */}
            <div className="w-full h-1 bg-white/10">
                <div
                    className="h-full bg-white transition-all"
                    style={{
                        width: `${((currentQuestion + 1) / questions.length) * 100
                            }%`
                    }}
                />
            </div>

            {/* QUESTION */}
            <main className="max-w-4xl mx-auto px-6 py-12">

                <div className="mb-10">

                    <p className="text-sm text-gray-500 tracking-[0.3em] uppercase mb-4">
                        Mission Question {currentQuestion + 1}
                    </p>

                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                        {question.question}
                    </h1>

                </div>

                {/* OPTIONS */}
                <div className="space-y-4">

                    {question.options.map((option, index) => {

                        const selected =
                            answers[currentQuestion] === index;

                        return (
                            <button
                                key={index}
                                onClick={() => selectAnswer(index)}
                                className={`w-full text-left p-5 rounded-xl border transition-all ${selected
                                        ? 'border-white bg-white text-black'
                                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                                    }`}
                            >

                                <div className="flex items-center gap-4">

                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${selected
                                                ? 'bg-black text-white'
                                                : 'bg-white/10'
                                            }`}
                                    >
                                        {String.fromCharCode(65 + index)}
                                    </div>

                                    <span className="text-lg">
                                        {option}
                                    </span>

                                </div>

                            </button>
                        );
                    })}

                </div>

                {/* NAVIGATION */}
                <div className="flex justify-between mt-10">

                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="px-6 py-3 rounded-lg border border-white/20 disabled:opacity-30"
                    >
                        ← Previous
                    </button>

                    {currentQuestion < questions.length - 1 ? (
                        <button
                            onClick={handleNext}
                            disabled={answers[currentQuestion] === null}
                            className="px-8 py-3 rounded-lg bg-white text-black font-bold disabled:opacity-30"
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={answers[currentQuestion] === null}
                            className="px-8 py-3 rounded-lg bg-green-500 text-black font-bold disabled:opacity-30"
                        >
                            SUBMIT
                        </button>
                    )}

                </div>

            </main>

        </div>
    );
}