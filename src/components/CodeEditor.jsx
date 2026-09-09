import { useEffect, useState } from 'react';
import { Play, RotateCcw, Code2, ChevronDown } from 'lucide-react';

const STARTER_CODE = {
  python: `# Write your solution here

def two_sum(nums, target):
    # Your code here
    pass


# Example
nums = [2, 7, 11, 15]
target = 9

print(two_sum(nums, target))
`,

  c: `#include <stdio.h>

int main() {

    // Write your solution here

    int nums[] = {2, 7, 11, 15};
    int target = 9;

    // Your code here


    return 0;
}
`,
};

export default function CodeEditor({
  onRun,
  running = false,
}) {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(STARTER_CODE.python);
  const [output, setOutput] = useState('');

  // Change starter code when language changes
  useEffect(() => {
    setCode(STARTER_CODE[language]);
    setOutput('');
  }, [language]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleRun = async () => {
    if (!code.trim()) {
      setOutput('PLEASE WRITE SOME CODE FIRST.');
      return;
    }

    setOutput('RUNNING...');

    try {
      if (onRun) {
        const result = await onRun({
          language,
          code,
        });

        setOutput(
          result?.output ||
          result?.message ||
          'CODE EXECUTED.'
        );
      } else {
        setOutput(
          `Compiler ready.\nLanguage: ${language === 'python'
            ? 'Python'
            : 'C'
          }`
        );
      }
    } catch (error) {
      setOutput(
        error?.message ||
        'CODE EXECUTION FAILED.'
      );
    }
  };

  const resetCode = () => {
    setCode(STARTER_CODE[language]);
    setOutput('');
  };

  return (
    <div className="h-full flex flex-col bg-[#08060D] border border-purple-500/30">

      {/* =========================
                CODE HEADER
            ========================== */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#0D0915]">

        {/* TITLE */}
        <div className="flex items-center gap-3">
          <Code2
            size={21}
            className="text-green-400"
          />

          <span className="font-black tracking-widest uppercase">
            Code
          </span>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-3">

          {/* LANGUAGE DROPDOWN */}
          <div className="relative">

            <select
              value={language}
              onChange={handleLanguageChange}
              className="
                                appearance-none
                                min-w-[130px]
                                bg-[#151020]
                                border border-purple-500/30
                                hover:border-purple-500/60
                                text-white
                                px-4 py-2
                                pr-10
                                outline-none
                                cursor-pointer
                                font-semibold
                            "
            >
              <option value="python">
                Python
              </option>

              <option value="c">
                C
              </option>
            </select>

            <ChevronDown
              size={16}
              className="
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                pointer-events-none
                                text-purple-300
                            "
            />

          </div>

          {/* RESET */}
          <button
            onClick={resetCode}
            disabled={running}
            className="
                            p-2
                            border border-white/10
                            hover:border-purple-500/60
                            hover:bg-purple-950/30
                            text-white/50
                            hover:text-white
                            transition
                            disabled:opacity-30
                        "
            title="Reset code"
          >
            <RotateCcw size={18} />
          </button>

        </div>

      </div>

      {/* =========================
                LANGUAGE INDICATOR
            ========================== */}
      <div className="px-5 py-2 border-b border-white/5 bg-black/20">

        <span className="text-xs text-white/30 uppercase tracking-widest">
          Selected Language:
        </span>

        <span className="ml-2 text-xs font-bold text-purple-300 uppercase tracking-widest">
          {language === 'python'
            ? 'Python 3'
            : 'C'}
        </span>

      </div>

      {/* =========================
                CODE EDITOR
            ========================== */}
      <div className="flex-1 relative min-h-[400px]">

        <textarea
          value={code}
          onChange={(event) =>
            setCode(event.target.value)
          }
          spellCheck={false}
          className="
                        absolute
                        inset-0
                        w-full
                        h-full
                        resize-none

                        bg-[#05040A]

                        text-green-300

                        font-mono
                        text-[14px]
                        leading-6

                        p-5

                        outline-none
                        border-none

                        selection:bg-purple-600/40
                    }
                />

            </div>

            {/* =========================
                RUN BAR
            ========================== */}
            <div className="
          border-t
          border-white/10
        bg-[#0D0915]
        p-3
        flex
        items-center
        justify-between
            ">

        <div className="text-xs text-white/30 uppercase tracking-widest">

          {language === 'python'
            ? 'PYTHON 3'
            : 'C COMPILER'}

        </div>

        <button
          onClick={handleRun}
          disabled={running}
          className="
                        flex
                        items-center
                        gap-2

                        px-7
                        py-3

                        bg-green-600
                        hover:bg-green-500

                        text-white

                        font-black
                        uppercase
                        tracking-wider

                        disabled:opacity-40

                        transition
                    "
        >
          <Play size={18} />

          {running
            ? 'RUNNING...'
            : 'RUN CODE'}

        </button>

      </div>

      {/* =========================
                TEST RESULT
            ========================== */}
      <div className="border-t border-white/10">

        <div className="
                    px-4
                    py-2
                    bg-[#0D0915]
                    text-xs
                    text-white/40
                    uppercase
                    tracking-widest
                ">
          Test Result
        </div>

        <pre className="
                    min-h-[90px]
                    max-h-[180px]
                    overflow-auto
                    p-4
                    bg-black
                    text-green-300
                    font-mono
                    text-sm
                    whitespace-pre-wrap
                ">
          {output ||
            'RUN YOUR CODE TO SEE THE RESULT.'}
        </pre>

      </div>

    </div>
  );
}