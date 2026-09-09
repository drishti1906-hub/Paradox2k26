const QUESTIONS = [
    {
        id: 1,
        title: 'THE SUSPICIOUS ACTIVITY WINDOW',
        caseFile: 'CASE FILE 01',
        difficulty: 'MEDIUM',
        points: 30,
        timeLimit: 8,

        description:
            'Given N activity values and two limits L and R, calculate the sum of all values greater than or equal to L and less than or equal to R.',

        scenario:
            'A PARADOX security server records activity levels during a suspicious incident. Investigators only want to examine records whose activity falls inside a specified security window. Values outside this window are considered normal for this investigation.',

        examples: [
            {
                input: '7\\n12 45 23 67 34 18 50\\n20 50',
                output: 'Activity Sum: 170',
                explanation:
                    'The values between 20 and 50 inclusive are 45, 23, 34 and 50. Their sum is 152.',
            },
        ],

        starterCode: {
            python: `n = int(input())
arr = list(map(int, input().split()))
L, R = map(int, input().split())

# Write your solution here
`,
            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int arr[n];

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
    },

    {
        id: 2,
        title: 'THE REPEATED SIGNAL',
        caseFile: 'CASE FILE 02',
        difficulty: 'MEDIUM',
        points: 30,
        timeLimit: 10,

        description:
            'Given N integers, count how many distinct values occur more than once.',

        scenario:
            'A surveillance system receives signal codes from several checkpoints. If the same signal code appears repeatedly, it may indicate that the same source contacted the system more than once.',

        examples: [
            {
                input: '8\\n12 5 12 7 5 9 5 3',
                output: 'Repeated Signal Types: 2',
                explanation:
                    'The values 12 and 5 occur more than once.',
            },
        ],

        starterCode: {
            python: `n = int(input())
arr = list(map(int, input().split()))

# Write your solution here
`,
            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int arr[n];

    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    // Write your solution here

    return 0;
}
`,
        },
    },

    {
        id: 3,
        title: 'EVIDENCE SORTING',
        caseFile: 'CASE FILE 03',
        difficulty: 'MEDIUM',
        points: 30,
        timeLimit: 10,

        description:
            'Given N integer evidence IDs, sort them in ascending order and print the sorted sequence.',

        scenario:
            'Evidence IDs arrive at the PARADOX control room in an unpredictable order. Before investigators compare records, the system must arrange the IDs from the smallest to the largest value.',

        examples: [
            {
                input: '6\\n42 15 8 31 19 27',
                output: '8 15 19 27 31 42',
                explanation:
                    'The evidence IDs are arranged from smallest to largest.',
            },
        ],

        starterCode: {
            python: `n = int(input())
arr = list(map(int, input().split()))

# Write your solution here
`,
            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int arr[n];

    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    // Write your solution here

    return 0;
}
`,
        },
    },

    {
        id: 4,
        title: 'SECURE ZONE ANALYSIS',
        caseFile: 'CASE FILE 04',
        difficulty: 'MEDIUM',
        points: 30,
        timeLimit: 10,

        description:
            'Given N event counts, find the maximum event count and its 1-based position in the list.',

        scenario:
            'A facility is divided into several security zones. Each zone reports the number of suspicious events detected there. The control room wants to identify the zone with the highest number of events.',

        examples: [
            {
                input: '5\\n14 29 11 43 25',
                output: 'Highest Events: 43\\nZone Position: 4',
                explanation:
                    '43 is the highest event count and it appears at position 4.',
            },
        ],

        starterCode: {
            python: `n = int(input())
arr = list(map(int, input().split()))

# Write your solution here
`,
            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int arr[n];

    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    // Write your solution here

    return 0;
}
`,
        },
    },

    {
        id: 5,
        title: 'THE MISSING RECORD',
        caseFile: 'CASE FILE 05',
        difficulty: 'MEDIUM',
        points: 30,
        timeLimit: 10,

        description:
            'Given N-1 distinct integers from 1 to N, find the missing number.',

        scenario:
            'A PARADOX archive stores evidence IDs from 1 through N. Because of a synchronization failure, exactly one ID is missing. Investigators need the program to recover the missing ID automatically.',

        examples: [
            {
                input: '7\\n1 2 3 5 6 7',
                output: 'Missing ID: 4',
                explanation:
                    'The numbers from 1 through 7 should contain 4, but it is missing.',
            },
        ],

        starterCode: {
            python: `n = int(input())
arr = list(map(int, input().split()))

# Write your solution here
`,
            c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);

    int arr[n - 1];

    for (int i = 0; i < n - 1; i++) {
        scanf("%d", &arr[i]);
    }

    // Write your solution here

    return 0;
}
`,
        },
    },
];

export default QUESTIONS;