export const CHALLENGES = [
    {
        id: 1,
        caseFile: "CASE FILE 01",
        title: "THE SUSPICIOUS ACTIVITY WINDOW",
        difficulty: "MEDIUM",
        points: 30,

        description:
            "A PARADOX security server records activity levels during a suspicious incident. Investigators only want to examine records whose activity falls inside a specified security window.",

        problem:
            "Given N activity values and two limits L and R, calculate the sum of all values greater than or equal to L and less than or equal to R.",

        examples: [
            {
                input: "7\n12 45 23 67 34 18 50\n20 50",
                output: "Activity Sum: 152",
            },
        ],

        testCases: [
            {
                input: "7\n12 45 23 67 34 18 50\n20 50",
                expected: "Activity Sum: 152",
            },
            {
                input: "5\n10 20 30 40 50\n15 35",
                expected: "Activity Sum: 50",
            },
            {
                input: "6\n5 8 12 15 20 25\n10 20",
                expected: "Activity Sum: 47",
            },
            {
                input: "4\n1 2 3 4\n1 4",
                expected: "Activity Sum: 10",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))
L, R = map(int, input().split())

total = 0

for value in values:
    # Write your solution here
    pass

print("Activity Sum:", total)
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int values[n];

    for (int i = 0; i < n; i++) {
        scanf("%d", &values[i]);
    }

    int L, R;
    scanf("%d %d", &L, &R);

    int total = 0;

    // Write your solution here

    printf("Activity Sum: %d", total);

    return 0;
}
`,
        },
    },

    {
        id: 2,
        caseFile: "CASE FILE 02",
        title: "THE REPEATED SIGNAL",
        difficulty: "MEDIUM",
        points: 30,

        description:
            "A surveillance system receives signal codes from several checkpoints. If the same signal code appears repeatedly, it may indicate that the same source contacted the system more than once.",

        problem:
            "Given N integers, count how many distinct values occur more than once.",

        examples: [
            {
                input: "8\n12 5 12 7 5 9 5 3",
                output: "Repeated Signal Types: 2",
            },
        ],

        testCases: [
            {
                input: "8\n12 5 12 7 5 9 5 3",
                expected: "Repeated Signal Types: 2",
            },
            {
                input: "6\n1 2 3 4 5 6",
                expected: "Repeated Signal Types: 0",
            },
            {
                input: "7\n1 1 2 2 3 3 4",
                expected: "Repeated Signal Types: 3",
            },
            {
                input: "5\n9 9 9 9 9",
                expected: "Repeated Signal Types: 1",
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

print("Repeated Signal Types:", repeated)
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

    printf("Repeated Signal Types: %d", repeated);

    return 0;
}
`,
        },
    },

    {
        id: 3,
        caseFile: "CASE FILE 03",
        title: "EVIDENCE SORTING",
        difficulty: "MEDIUM",
        points: 30,

        description:
            "Evidence IDs arrive at the PARADOX control room in an unpredictable order. The system must arrange the IDs from the smallest to the largest value.",

        problem:
            "Given N integer evidence IDs, sort them in ascending order and print the sorted sequence.",

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
        printf("%d ", a[i]);
    }

    return 0;
}
`,
        },
    },

    {
        id: 4,
        caseFile: "CASE FILE 04",
        title: "SECURE ZONE ANALYSIS",
        difficulty: "MEDIUM",
        points: 30,

        description:
            "A facility is divided into several security zones. Each zone reports the number of suspicious events detected there.",

        problem:
            "Given N event counts, find the maximum event count and its 1-based position in the list.",

        examples: [
            {
                input: "5\n14 29 11 43 25",
                output: "Highest Events: 43\nZone Position: 4",
            },
        ],

        testCases: [
            {
                input: "5\n14 29 11 43 25",
                expected: "Highest Events: 43\nZone Position: 4",
            },
            {
                input: "4\n10 20 30 40",
                expected: "Highest Events: 40\nZone Position: 4",
            },
            {
                input: "6\n99 10 50 99 20 30",
                expected: "Highest Events: 99\nZone Position: 1",
            },
            {
                input: "5\n-10 -5 -2 -8 -20",
                expected: "Highest Events: -2\nZone Position: 3",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))

max_value = values[0]
position = 1

# Write your solution here

print("Highest Events:", max_value)
print("Zone Position:", position)
`,

            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int value;
    int maxValue;
    int position;

    scanf("%d", &maxValue);
    position = 1;

    for (int i = 2; i <= n; i++) {
        scanf("%d", &value);

        // Write your solution here
    }

    printf("Highest Events: %d\\n", maxValue);
    printf("Zone Position: %d", position);

    return 0;
}
`,
        },
    },

    {
        id: 5,
        caseFile: "CASE FILE 05",
        title: "THE MISSING RECORD",
        difficulty: "MEDIUM",
        points: 30,

        description:
            "A PARADOX archive stores evidence IDs from 1 through N. Because of a synchronization failure, exactly one ID is missing.",

        problem:
            "Given N-1 distinct integers from 1 to N, find the missing number.",

        examples: [
            {
                input: "7\n1 2 3 5 6 7",
                output: "Missing ID: 4",
            },
        ],

        testCases: [
            {
                input: "7\n1 2 3 5 6 7",
                expected: "Missing ID: 4",
            },
            {
                input: "5\n1 2 3 4",
                expected: "Missing ID: 5",
            },
            {
                input: "6\n2 3 4 5 6",
                expected: "Missing ID: 1",
            },
            {
                input: "10\n1 2 3 4 5 6 8 9 10",
                expected: "Missing ID: 7",
            },
        ],

        starterCode: {
            python: `n = int(input())
values = list(map(int, input().split()))

expected = n * (n + 1) // 2
actual = sum(values)

# Write your solution here

print("Missing ID:", expected - actual)
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

    printf("Missing ID: %d", expected - actual);

    return 0;
}
`,
        },
    },
];