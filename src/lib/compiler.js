const JUDGE0_URL = "https://ce.judge0.com";

const LANGUAGE_IDS = {
    python: 71,
    c: 50,
};

const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export async function runCode({
    language,
    code,
    testCases,
}) {
    const languageId = LANGUAGE_IDS[language];

    if (!languageId) {
        throw new Error(`Unsupported language: ${language}`);
    }

    if (!code || !code.trim()) {
        throw new Error("Please write some code first.");
    }

    const results = [];

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];

        try {
            // Submit code
            const response = await fetch(
                `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        language_id: languageId,
                        source_code: code,
                        stdin: testCase.input,
                        cpu_time_limit: 5,
                        wall_time_limit: 10,
                    }),
                }
            );

            if (!response.ok) {
                const text = await response.text();

                throw new Error(
                    `Compiler service error: ${response.status} ${text}`
                );
            }

            const submission = await response.json();

            if (!submission.token) {
                throw new Error("Compiler did not return a submission token.");
            }

            // Wait for result
            let result = null;

            for (let attempt = 0; attempt < 30; attempt++) {
                await sleep(500);

                const resultResponse = await fetch(
                    `${JUDGE0_URL}/submissions/${submission.token}?base64_encoded=false`
                );

                if (!resultResponse.ok) {
                    throw new Error(
                        "Unable to retrieve compiler result."
                    );
                }

                result = await resultResponse.json();

                // 1 = In Queue
                // 2 = Processing
                if (
                    result.status?.id !== 1 &&
                    result.status?.id !== 2
                ) {
                    break;
                }
            }

            const actual = String(
                result?.stdout || ""
            ).trim();

            const expected = String(
                testCase.expected || ""
            ).trim();

            const compilerError = String(
                result?.stderr ||
                result?.compile_output ||
                result?.message ||
                ""
            ).trim();

            const passed =
                result?.status?.id === 3 &&
                normalizeOutput(actual) ===
                normalizeOutput(expected);

            results.push({
                testCase: i + 1,
                passed,
                expected,
                actual,
                error: compilerError,
                status:
                    result?.status?.description ||
                    "Unknown",
            });

        } catch (error) {
            results.push({
                testCase: i + 1,
                passed: false,
                expected: testCase.expected,
                actual: "",
                error:
                    error?.message ||
                    "Compiler execution failed.",
                status: "ERROR",
            });
        }

        // Stop immediately when a test fails.
        // This makes the competition flow cleaner.
        if (!results[results.length - 1].passed) {
            break;
        }
    }

    const passedCount = results.filter(
        (result) => result.passed
    ).length;

    return {
        success:
            passedCount === testCases.length,

        passedCount,

        total: testCases.length,

        results,
    };
}

function normalizeOutput(value) {
    return String(value)
        .replace(/\r/g, "")
        .trim()
        .split("\n")
        .map((line) =>
            line
                .trim()
                .replace(/\s+/g, " ")
        )
        .join("\n");
}