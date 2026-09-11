/*
 * PARADOX — ROUND 2
 * 10 Role-Specific Mission Pairs
 *
 * FLOW:
 * MISSION 1  → QUESTIONS 1-5
 * ROUND TABLE → 10 MINUTES
 * MISSION 2  → QUESTIONS 6-10
 *
 * INNOCENT = standard challenge
 * IMPOSTER = slightly different / harder challenge
 *
 * IMPORTANT:
 * testCases contain the expected OUTPUT.
 * The compiler/evaluator should execute the user's code
 * against every test case and compare the output.
 */

// =============================================================
// INNOCENT CHALLENGES
// =============================================================

export const INNOCENT_CHALLENGES = [

    // =========================================================
    // QUESTION 1
    // =========================================================
    {
        id: 1,
        caseFile: "CASE FILE 01",
        title: "THE EVIDENCE ARCHIVE",
        difficulty: "MEDIUM",
        points: 30,

        description:
            "The evidence archive stores identification numbers in an unsorted order. Before investigators continue, the system must arrange the records so that the oldest and smallest identifiers can be reviewed first.",

        problem:
            "Sort all evidence IDs in non-decreasing order and print the resulting sequence.",

        examples: [
            {
                input: "6\n42 15 8 31 19 27",
                output: "8 15 19 27 31 42",
            },
        ],

        testCases: [
            {
                input: "6\n42 15 8 31 19 27",
                expected: "8 15 19 27 31 42",
            },
            {
                input: "5\n5 4 3 2 1",
                expected: "1 2 3 4 5",
            },
            {
                input: "6\n10 10 3 7 2 7",
                expected: "2 3 7 7 10 10",
            },
            {
                input: "4\n-5 2 -10 0",
                expected: "-10 -5 0 2",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))

# Write your solution here

print(*values)
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int a[n];

    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }

    // Write your solution here

    for (int i = 0; i < n; i++) {
        printf("%d", a[i]);

        if (i < n - 1)
            printf(" ");
    }

    return 0;
}
`,
        },
    },

    // =========================================================
    // QUESTION 2
    // =========================================================
    {
        id: 2,
        caseFile: "CASE FILE 02",
        title: "THE REPEATED SIGNAL",
        difficulty: "MEDIUM",
        points: 30,

        description:
            "A surveillance network receives signal codes from several checkpoints. A repeated code may indicate that the same source has contacted the system multiple times.",

        problem:
            "Count how many distinct values appear at least twice in the signal log.",

        examples: [
            {
                input: "8\n12 5 12 7 5 9 5 3",
                output: "2",
            },
        ],

        testCases: [
            {
                input: "8\n12 5 12 7 5 9 5 3",
                expected: "2",
            },
            {
                input: "6\n1 2 3 4 5 6",
                expected: "0",
            },
            {
                input: "7\n1 1 2 2 3 3 4",
                expected: "3",
            },
            {
                input: "5\n9 9 9 9 9",
                expected: "1",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))

counts = {}

for value in values:
    # Write your solution here
    pass

repeated = 0

# Write your solution here

print(repeated)
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int a[n];

    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }

    int repeated = 0;

    // Write your solution here

    printf("%d", repeated);

    return 0;
}
`,
        },
    },

    // =========================================================
    // QUESTION 3
    // =========================================================
    {
        id: 3,
        caseFile: "CASE FILE 03",
        title: "SECURITY THRESHOLD",
        difficulty: "MEDIUM",
        points: 30,

        description:
            "The security server classifies activity as suspicious when it is greater than a given threshold. Investigators want a quick summary of how many records crossed that limit.",

        problem:
            "Count the number of activity values strictly greater than T.",

        examples: [
            {
                input: "7\n12 45 23 67 34 18 50\n40",
                output: "3",
            },
        ],

        testCases: [
            {
                input: "7\n12 45 23 67 34 18 50\n40",
                expected: "3",
            },
            {
                input: "5\n10 20 30 40 50\n25",
                expected: "3",
            },
            {
                input: "6\n5 8 12 15 20 25\n20",
                expected: "1",
            },
            {
                input: "4\n1 2 3 4\n10",
                expected: "0",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))
T = int(input())

count = 0

for value in values:
    # Write your solution here
    pass

print(count)
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int a[n];

    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }

    int T;
    scanf("%d", &T);

    int count = 0;

    // Write your solution here

    printf("%d", count);

    return 0;
}
`,
        },
    },

    // =========================================================
    // QUESTION 4
    // =========================================================
    {
        id: 4,
        caseFile: "CASE FILE 04",
        title: "MISSING EVIDENCE ID",
        difficulty: "MEDIUM",
        points: 30,

        description:
            "A synchronization problem caused one evidence ID from the range 1 to N to disappear. Exactly one ID is missing, and the remaining IDs are distinct.",

        problem:
            "Find and print the missing evidence ID.",

        examples: [
            {
                input: "7\n1 2 3 5 6 7",
                output: "4",
            },
        ],

        testCases: [
            {
                input: "7\n1 2 3 5 6 7",
                expected: "4",
            },
            {
                input: "5\n1 2 3 4",
                expected: "5",
            },
            {
                input: "6\n2 3 4 5 6",
                expected: "1",
            },
            {
                input: "10\n1 2 3 4 5 6 8 9 10",
                expected: "7",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))

expected = n * (n + 1) // 2
actual = sum(values)

# Write your solution here

print(expected - actual)
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int expected = n * (n + 1) / 2;
    int actual = 0;

    int value;

    for (int i = 0; i < n - 1; i++) {
        scanf("%d", &value);
        actual += value;
    }

    printf("%d", expected - actual);

    return 0;
}
`,
        },
    },

    // =========================================================
    // QUESTION 5
    // =========================================================
    {
        id: 5,
        caseFile: "CASE FILE 05",
        title: "ALERT STREAK",
        difficulty: "MEDIUM",
        points: 30,

        description:
            "A monitoring device records one value per minute: 1 means an alert was active and 0 means no alert was detected. Investigators want to know the longest uninterrupted alert period.",

        problem:
            "Find the maximum number of consecutive 1s.",

        examples: [
            {
                input: "10\n1 1 0 1 1 1 0 1 0 1",
                output: "3",
            },
        ],

        testCases: [
            {
                input: "10\n1 1 0 1 1 1 0 1 0 1",
                expected: "3",
            },
            {
                input: "5\n1 1 1 1 1",
                expected: "5",
            },
            {
                input: "6\n0 0 0 0 0 0",
                expected: "0",
            },
            {
                input: "8\n1 0 1 1 0 1 1 1",
                expected: "3",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))

current = 0
maximum = 0

for value in values:
    # Write your solution here
    pass

print(maximum)
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int current = 0;
    int maximum = 0;

    for (int i = 0; i < n; i++) {
        int value;
        scanf("%d", &value);

        // Write your solution here
    }

    printf("%d", maximum);

    return 0;
}
`,
        },
    },

    // =========================================================
    // QUESTION 6
    // MISSION 2 START
    // =========================================================
    {
        id: 6,
        caseFile: "CASE FILE 06",
        title: "EVIDENCE FREQUENCY",
        difficulty: "MEDIUM",
        points: 30,

        description:
            "Some evidence codes appear repeatedly in the database. The most frequent code is considered the strongest repeated signal. If multiple codes have the same frequency, the smallest code is selected.",

        problem:
            "Print the value with the highest frequency. In case of a tie, print the smallest value.",

        examples: [
            {
                input: "8\n4 7 4 2 7 4 9 7",
                output: "4",
            },
        ],

        testCases: [
            {
                input: "8\n4 7 4 2 7 4 9 7",
                expected: "4",
            },
            {
                input: "6\n1 2 2 3 3 4",
                expected: "2",
            },
            {
                input: "5\n9 9 9 2 2",
                expected: "9",
            },
            {
                input: "7\n5 4 3 2 1 5 4",
                expected: "4",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))

counts = {}

for value in values:
    # Write your solution here
    pass

best_value = values[0]

# Write your solution here

print(best_value)
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int a[n];

    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }

    int bestValue = a[0];

    // Write your solution here

    printf("%d", bestValue);

    return 0;
}
`,
        },
    },

    // =========================================================
    // QUESTION 7
    // =========================================================
    {
        id: 7,
        caseFile: "CASE FILE 07",
        title: "TEAM SCORE REPORT",
        difficulty: "MEDIUM",
        points: 30,

        description:
            "After a challenge, the control room receives scores from participating teams. The administrator needs the highest score and the position of the team that achieved it.",

        problem:
            "Print the maximum score and its 1-based position.",

        examples: [
            {
                input: "5\n45 70 62 88 51",
                output: "88 4",
            },
        ],

        testCases: [
            {
                input: "5\n45 70 62 88 51",
                expected: "88 4",
            },
            {
                input: "4\n10 20 30 40",
                expected: "40 4",
            },
            {
                input: "6\n99 10 50 99 20 30",
                expected: "99 1",
            },
            {
                input: "5\n-10 -5 -2 -8 -20",
                expected: "-2 3",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))

max_value = values[0]
position = 1

# Write your solution here

print(max_value, position)
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int value;
    int maxValue;

    scanf("%d", &maxValue);

    int position = 1;

    for (int i = 2; i <= n; i++) {
        scanf("%d", &value);

        // Write your solution here
    }

    printf("%d %d", maxValue, position);

    return 0;
}
`,
        },
    },

    // =========================================================
    // QUESTION 8
    // =========================================================
    {
        id: 8,
        caseFile: "CASE FILE 08",
        title: "PASSWORD AUDIT",
        difficulty: "MEDIUM",
        points: 30,

        description:
            "A security terminal performs a basic password-length audit. For this challenge, a password is considered acceptable when it contains at least 8 characters.",

        problem:
            "Given N passwords, count how many are at least 8 characters long.",

        examples: [
            {
                input: "5\nadmin123\nparadox2026\nhello\nsecurity\ncode",
                output: "3",
            },
        ],

        testCases: [
            {
                input: "5\nadmin123\nparadox2026\nhello\nsecurity\ncode",
                expected: "3",
            },
            {
                input: "4\npassword\n12345678\nhello\nabcdefgh",
                expected: "3",
            },
            {
                input: "3\nabc\nabcd\nabcdefg",
                expected: "0",
            },
            {
                input: "4\n12345678\n123456789\nabcdefghij\nxyz",
                expected: "3",
            },
        ],

        starterCode: {
            python: `n = int(input())

count = 0

for i in range(n):
    password = input().strip()

    # Write your solution here
    pass

print(count)
`,

            c: `#include <stdio.h>
#include <string.h>

int main() {
    int n;
    scanf("%d", &n);

    char password[100];
    int count = 0;

    for (int i = 0; i < n; i++) {
        scanf("%s", password);

        // Write your solution here
    }

    printf("%d", count);

    return 0;
}
`,
        },
    },

    // =========================================================
    // QUESTION 9
    // =========================================================
    {
        id: 9,
        caseFile: "CASE FILE 09",
        title: "BALANCED EVIDENCE",
        difficulty: "MEDIUM",
        points: 30,

        description:
            "Two investigation units want to divide a collection of evidence weights into two groups with equal total weight. The order of evidence does not matter.",

        problem:
            "Determine whether the values can be partitioned into two subsets with equal sums. Print YES or NO.",

        examples: [
            {
                input: "6\n1 5 11 5 2 6",
                output: "YES",
            },
        ],

        testCases: [
            {
                input: "6\n1 5 11 5 2 6",
                expected: "YES",
            },
            {
                input: "4\n1 2 3 5",
                expected: "NO",
            },
            {
                input: "4\n1 1 1 1",
                expected: "YES",
            },
            {
                input: "5\n2 4 6 8 10",
                expected: "YES",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))

total = sum(values)

if total % 2 != 0:
    print("NO")
else:
    target = total // 2

    # Write your solution here

    print("NO")
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int a[n];
    int total = 0;

    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
        total += a[i];
    }

    if (total % 2 != 0) {
        printf("NO");
        return 0;
    }

    int target = total / 2;

    // Write your solution here

    printf("NO");

    return 0;
}
`,
        },
    },

    // =========================================================
    // QUESTION 10
    // =========================================================
    {
        id: 10,
        caseFile: "CASE FILE 10",
        title: "THE LONGEST EVIDENCE CHAIN",
        difficulty: "HARD",
        points: 40,

        description:
            "Evidence records arrive as numbers. Investigators believe a valid chain can be formed by selecting records in their original order such that every selected value is strictly greater than the previous selected value.",

        problem:
            "Find the length of the longest strictly increasing subsequence.",

        examples: [
            {
                input: "8\n10 22 9 33 21 50 41 60",
                output: "5",
            },
        ],

        testCases: [
            {
                input: "8\n10 22 9 33 21 50 41 60",
                expected: "5",
            },
            {
                input: "5\n1 2 3 4 5",
                expected: "5",
            },
            {
                input: "5\n5 4 3 2 1",
                expected: "1",
            },
            {
                input: "7\n3 10 2 1 20 4 6",
                expected: "3",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))

dp = [1] * n

# Write your solution here

print(max(dp))
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int a[n];
    int dp[n];

    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
        dp[i] = 1;
    }

    // Write your solution here

    int answer = dp[0];

    for (int i = 1; i < n; i++) {
        if (dp[i] > answer)
            answer = dp[i];
    }

    printf("%d", answer);

    return 0;
}
`,
        },
    },
];


// =============================================================
// IMPOSTER / TRAITOR CHALLENGES
// =============================================================

export const IMPOSTER_CHALLENGES = [

    // =========================================================
    // QUESTION 1
    // =========================================================
    {
        id: 1,
        caseFile: "CASE FILE 01",
        title: "THE EVIDENCE ARCHIVE",
        difficulty: "MEDIUM",
        points: 35,

        description:
            "The evidence archive stores identification numbers in an unsorted order. Before investigators continue, the system must arrange the records so that the smallest identifiers can be reviewed first.",

        problem:
            "Sort the evidence IDs in non-decreasing order and also print the second largest value.",

        examples: [
            {
                input: "6\n42 15 8 31 19 27",
                output: "8 15 19 27 31 42\n31",
            },
        ],

        testCases: [
            {
                input: "6\n42 15 8 31 19 27",
                expected: "8 15 19 27 31 42\n31",
            },
            {
                input: "5\n5 4 3 2 1",
                expected: "1 2 3 4 5\n4",
            },
            {
                input: "6\n10 10 3 7 2 7",
                expected: "2 3 7 7 10 10\n10",
            },
            {
                input: "4\n-5 2 -10 0",
                expected: "-10 -5 0 2\n0",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))

# Write your solution here

print(*values)
# Print the second largest value
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int a[n];

    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }

    // Write your solution here

    for (int i = 0; i < n; i++) {
        printf("%d", a[i]);

        if (i < n - 1)
            printf(" ");
    }

    printf("\\n");

    // Print the second largest value

    return 0;
}
`,
        },
    },

    // =========================================================
    // QUESTION 2
    // =========================================================
    {
        id: 2,
        caseFile: "CASE FILE 02",
        title: "THE REPEATED SIGNAL",
        difficulty: "MEDIUM",
        points: 35,

        description:
            "A surveillance network receives signal codes from several checkpoints. A repeated code may indicate that the same source has contacted the system multiple times.",

        problem:
            "Find the value that occurs most frequently. If frequencies tie, choose the smallest value. Print the value followed by its frequency.",

        examples: [
            {
                input: "8\n12 5 12 7 5 9 5 3",
                output: "5 3",
            },
        ],

        testCases: [
            {
                input: "8\n12 5 12 7 5 9 5 3",
                expected: "5 3",
            },
            {
                input: "6\n1 2 3 4 5 6",
                expected: "1 1",
            },
            {
                input: "7\n1 1 2 2 3 3 4",
                expected: "1 2",
            },
            {
                input: "5\n9 9 9 9 9",
                expected: "9 5",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))

counts = {}

for value in values:
    # Write your solution here
    pass

best_value = values[0]
best_frequency = 0

# Write your solution here

print(best_value, best_frequency)
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int a[n];

    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }

    int bestValue = a[0];
    int bestFrequency = 0;

    // Write your solution here

    printf("%d %d", bestValue, bestFrequency);

    return 0;
}
`,
        },
    },

    // =========================================================
    // QUESTION 3
    // =========================================================
    {
        id: 3,
        caseFile: "CASE FILE 03",
        title: "SECURITY THRESHOLD",
        difficulty: "MEDIUM",
        points: 35,

        description:
            "The security server classifies activity as suspicious when it is greater than a given threshold.",

        problem:
            "Count values strictly greater than T and also print their total sum.",

        examples: [
            {
                input: "7\n12 45 23 67 34 18 50\n40",
                output: "3 162",
            },
        ],

        testCases: [
            {
                input: "7\n12 45 23 67 34 18 50\n40",
                expected: "3 162",
            },
            {
                input: "5\n10 20 30 40 50\n25",
                expected: "3 120",
            },
            {
                input: "6\n5 8 12 15 20 25\n20",
                expected: "1 25",
            },
            {
                input: "4\n1 2 3 4\n10",
                expected: "0 0",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))
T = int(input())

count = 0
total = 0

for value in values:
    # Write your solution here
    pass

print(count, total)
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int a[n];

    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }

    int T;
    scanf("%d", &T);

    int count = 0;
    int total = 0;

    // Write your solution here

    printf("%d %d", count, total);

    return 0;
}
`,
        },
    },

    // =========================================================
    // QUESTION 4
    // =========================================================
    {
        id: 4,
        caseFile: "CASE FILE 04",
        title: "MISSING EVIDENCE ID",
        difficulty: "MEDIUM",
        points: 35,

        description:
            "A synchronization problem caused one evidence ID from the range 1 to N to disappear. Exactly one ID is missing.",

        problem:
            "Find the missing value and print its position in the complete 1-to-N sequence.",

        examples: [
            {
                input: "7\n1 2 3 5 6 7",
                output: "4 4",
            },
        ],

        testCases: [
            {
                input: "7\n1 2 3 5 6 7",
                expected: "4 4",
            },
            {
                input: "5\n1 2 3 4",
                expected: "5 5",
            },
            {
                input: "6\n2 3 4 5 6",
                expected: "1 1",
            },
            {
                input: "10\n1 2 3 4 5 6 8 9 10",
                expected: "7 7",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))

expected = n * (n + 1) // 2
actual = sum(values)

missing = expected - actual

# Write your solution here

print(missing, missing)
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int expected = n * (n + 1) / 2;
    int actual = 0;

    int value;

    for (int i = 0; i < n - 1; i++) {
        scanf("%d", &value);
        actual += value;
    }

    int missing = expected - actual;

    // Write your solution here

    printf("%d %d", missing, missing);

    return 0;
}
`,
        },
    },

    // =========================================================
    // QUESTION 5
    // =========================================================
    {
        id: 5,
        caseFile: "CASE FILE 05",
        title: "ALERT STREAK",
        difficulty: "MEDIUM",
        points: 35,

        description:
            "A monitoring device records one value per minute: 1 means an alert was active and 0 means no alert was detected.",

        problem:
            "Find the longest consecutive streak of 1s and print its starting position (1-based).",

        examples: [
            {
                input: "10\n1 1 0 1 1 1 0 1 0 1",
                output: "3 4",
            },
        ],

        testCases: [
            {
                input: "10\n1 1 0 1 1 1 0 1 0 1",
                expected: "3 4",
            },
            {
                input: "5\n1 1 1 1 1",
                expected: "5 1",
            },
            {
                input: "6\n0 0 0 0 0 0",
                expected: "0 0",
            },
            {
                input: "8\n1 0 1 1 0 1 1 1",
                expected: "3 6",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))

current = 0
maximum = 0
start = 0
best_start = 0

for i, value in enumerate(values):
    # Write your solution here
    pass

print(maximum, best_start)
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int current = 0;
    int maximum = 0;
    int start = 0;
    int bestStart = 0;

    for (int i = 0; i < n; i++) {
        int value;
        scanf("%d", &value);

        // Write your solution here
    }

    printf("%d %d", maximum, bestStart);

    return 0;
}
`,
        },
    },

    // =========================================================
    // QUESTION 6
    // MISSION 2 START
    // =========================================================
    {
        id: 6,
        caseFile: "CASE FILE 06",
        title: "EVIDENCE FREQUENCY",
        difficulty: "MEDIUM",
        points: 35,

        description:
            "Some evidence codes appear repeatedly in the database. The most frequent code is considered the strongest repeated signal.",

        problem:
            "Print the most frequent value and its frequency. If there is a tie, choose the smallest value.",

        examples: [
            {
                input: "8\n4 7 4 2 7 4 9 7",
                output: "4 3",
            },
        ],

        testCases: [
            {
                input: "8\n4 7 4 2 7 4 9 7",
                expected: "4 3",
            },
            {
                input: "6\n1 2 2 3 3 4",
                expected: "2 2",
            },
            {
                input: "5\n9 9 9 2 2",
                expected: "9 3",
            },
            {
                input: "7\n5 4 3 2 1 5 4",
                expected: "4 2",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))

counts = {}

for value in values:
    # Write your solution here
    pass

best_value = values[0]
best_frequency = 0

# Write your solution here

print(best_value, best_frequency)
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int a[n];

    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }

    int bestValue = a[0];
    int bestFrequency = 0;

    // Write your solution here

    printf("%d %d", bestValue, bestFrequency);

    return 0;
}
`,
        },
    },

    // =========================================================
    // QUESTION 7
    // =========================================================
    {
        id: 7,
        caseFile: "CASE FILE 07",
        title: "TEAM SCORE REPORT",
        difficulty: "MEDIUM",
        points: 35,

        description:
            "After a challenge, the control room receives scores from participating teams. The administrator needs the highest score and the position of the team that achieved it.",

        problem:
            "Find the highest score and the 1-based position of the highest-scoring team. If scores tie, choose the smaller position.",

        examples: [
            {
                input: "5\n45 70 62 88 51",
                output: "88 4",
            },
        ],

        testCases: [
            {
                input: "5\n45 70 62 88 51",
                expected: "88 4",
            },
            {
                input: "4\n10 20 30 40",
                expected: "40 4",
            },
            {
                input: "6\n99 10 50 99 20 30",
                expected: "99 1",
            },
            {
                input: "5\n-10 -5 -2 -8 -20",
                expected: "-2 3",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))

max_value = values[0]
position = 1

# Write your solution here

print(max_value, position)
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int value;
    int maxValue;

    scanf("%d", &maxValue);

    int position = 1;

    for (int i = 2; i <= n; i++) {
        scanf("%d", &value);

        // Write your solution here
    }

    printf("%d %d", maxValue, position);

    return 0;
}
`,
        },
    },

    // =========================================================
    // QUESTION 8
    // =========================================================
    {
        id: 8,
        caseFile: "CASE FILE 08",
        title: "PASSWORD AUDIT",
        difficulty: "MEDIUM",
        points: 35,

        description:
            "A security terminal performs a basic password-length audit. A password is considered acceptable when it contains at least 8 characters.",

        problem:
            "Count passwords with at least 8 characters and print the longest password length.",

        examples: [
            {
                input: "5\nadmin123\nparadox2026\nhello\nsecurity\ncode",
                output: "3 10",
            },
        ],

        testCases: [
            {
                input: "5\nadmin123\nparadox2026\nhello\nsecurity\ncode",
                expected: "3 10",
            },
            {
                input: "4\npassword\n12345678\nhello\nabcdefgh",
                expected: "3 8",
            },
            {
                input: "3\nabc\nabcd\nabcdefg",
                expected: "0 7",
            },
            {
                input: "4\n12345678\n123456789\nabcdefghij\nxyz",
                expected: "3 10",
            },
        ],

        starterCode: {
            python: `n = int(input())

count = 0
longest = 0

for i in range(n):
    password = input().strip()

    # Write your solution here
    pass

print(count, longest)
`,

            c: `#include <stdio.h>
#include <string.h>

int main() {
    int n;
    scanf("%d", &n);

    char password[100];
    int count = 0;
    int longest = 0;

    for (int i = 0; i < n; i++) {
        scanf("%s", password);

        // Write your solution here
    }

    printf("%d %d", count, longest);

    return 0;
}
`,
        },
    },

    // =========================================================
    // QUESTION 9
    // =========================================================
    {
        id: 9,
        caseFile: "CASE FILE 09",
        title: "BALANCED EVIDENCE",
        difficulty: "MEDIUM",
        points: 35,

        description:
            "Two investigation units want to divide a collection of evidence weights into two groups with equal total weight.",

        problem:
            "Determine whether an equal-sum partition exists and print YES or NO. If YES, also print the common sum.",

        examples: [
            {
                input: "6\n1 5 11 5 2 6",
                output: "YES 15",
            },
        ],

        testCases: [
            {
                input: "6\n1 5 11 5 2 6",
                expected: "YES 15",
            },
            {
                input: "4\n1 2 3 5",
                expected: "NO",
            },
            {
                input: "4\n1 1 1 1",
                expected: "YES 2",
            },
            {
                input: "5\n2 4 6 8 10",
                expected: "YES 15",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))

total = sum(values)

if total % 2 != 0:
    print("NO")
else:
    target = total // 2

    # Write your solution here

    print("NO")
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int a[n];
    int total = 0;

    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
        total += a[i];
    }

    if (total % 2 != 0) {
        printf("NO");
        return 0;
    }

    int target = total / 2;

    // Write your solution here

    printf("NO");

    return 0;
}
`,
        },
    },

    // =========================================================
    // QUESTION 10
    // =========================================================
    {
        id: 10,
        caseFile: "CASE FILE 10",
        title: "THE LONGEST EVIDENCE CHAIN",
        difficulty: "HARD",
        points: 40,

        description:
            "Evidence records arrive as numbers. Investigators believe a valid chain can be formed by selecting records in their original order such that every selected value is strictly greater than the previous selected value.",

        problem:
            "Find the length of the longest strictly increasing subsequence.",

        examples: [
            {
                input: "8\n10 22 9 33 21 50 41 60",
                output: "5",
            },
        ],

        testCases: [
            {
                input: "8\n10 22 9 33 21 50 41 60",
                expected: "5",
            },
            {
                input: "5\n1 2 3 4 5",
                expected: "5",
            },
            {
                input: "5\n5 4 3 2 1",
                expected: "1",
            },
            {
                input: "7\n3 10 2 1 20 4 6",
                expected: "3",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))

dp = [1] * n

# Write your solution here

print(max(dp))
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int a[n];
    int dp[n];

    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
        dp[i] = 1;
    }

    // Write your solution here

    int answer = dp[0];

    for (int i = 1; i < n; i++) {
        if (dp[i] > answer)
            answer = dp[i];
    }

    printf("%d", answer);

    return 0;
}
`,
        },
    },
];


// =============================================================
// HELPER EXPORTS
// =============================================================

export const MISSION_1_QUESTIONS = (role) => {
    const challenges =
        role === "IMPOSTER"
            ? IMPOSTER_CHALLENGES
            : INNOCENT_CHALLENGES;

    return challenges.filter(
        (challenge) => challenge.id >= 1 && challenge.id <= 5
    );
};

export const MISSION_2_QUESTIONS = (role) => {
    const challenges =
        role === "IMPOSTER"
            ? IMPOSTER_CHALLENGES
            : INNOCENT_CHALLENGES;

    return challenges.filter(
        (challenge) => challenge.id >= 6 && challenge.id <= 10
    );
};

export const getChallengeById = (role, id) => {
    const challenges =
        role === "IMPOSTER"
            ? IMPOSTER_CHALLENGES
            : INNOCENT_CHALLENGES;

    return challenges.find(
        (challenge) => challenge.id === Number(id)
    );
};