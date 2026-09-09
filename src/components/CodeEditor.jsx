import {
  Play,
  RotateCcw,
  Code2,
  ChevronDown,
} from "lucide-react";

export default function CodeEditor({
  language,
  setLanguage,
  code,
  setCode,
  onRun,
  running,
  output,
}) {
  const resetCode = () => {
    /*
     * MissionScreen controls the actual starter code.
     * Dispatching a simple event lets MissionScreen
     * reload it cleanly.
     */
    window.dispatchEvent(
      new CustomEvent("reset-code")
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#08060D] border border-purple-500/30">

      {/* HEADER */}

      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#0D0915]">

        <div className="flex items-center gap-3">

          <Code2
            size={21}
            className="text-green-400"
          />

          <span className="font-black tracking-widest uppercase">
            CODE
          </span>

        </div>

        <div className="flex items-center gap-3">

          <div className="relative">

            <select
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value)
              }
              className="appearance-none min-w-[150px] bg-[#151020] border border-purple-500/30 text-white px-4 py-2 pr-10 outline-none cursor-pointer font-semibold"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-purple-300"
            />

          </div>

          <button
            onClick={resetCode}
            disabled={running}
            className="p-2 border border-white/10 hover:border-purple-500/60 text-white/50 hover:text-white"
          >
            <RotateCcw size={18} />
          </button>

        </div>

      </div>

      {/* LANGUAGE */}

      <div className="px-5 py-2 border-b border-white/5 bg-black/20">

        <span className="text-xs text-white/30 uppercase tracking-widest">
          Selected Language:
        </span>

        <span className="ml-2 text-xs font-bold text-purple-300 uppercase tracking-widest">
          {language === "python"
            ? "PYTHON 3"
            : "C"}
        </span>

      </div>

      {/* EDITOR */}

      <div className="flex-1 min-h-0">

        <textarea
          value={code}
          onChange={(event) =>
            setCode(event.target.value)
          }
          spellCheck={false}
          disabled={running}
          className="w-full h-full resize-none bg-[#05040A] text-green-300 font-mono text-[14px] leading-6 p-5 outline-none border-none"
        />

      </div>

      {/* RUN BAR */}

      <div className="border-t border-white/10 bg-[#0D0915] p-3 flex items-center justify-between">

        <div className="text-xs text-white/30 uppercase tracking-widest">

          {language === "python"
            ? "PYTHON 3"
            : "C COMPILER"}

        </div>

        <button
          onClick={onRun}
          disabled={running}
          className="flex items-center gap-2 px-7 py-3 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-wider disabled:opacity-40"
        >

          <Play size={18} />

          {running
            ? "RUNNING..."
            : "RUN CODE"}

        </button>

      </div>

      {/* TEST RESULT */}

      <div className="border-t border-white/10">

        <div className="px-4 py-2 bg-[#0D0915] text-xs text-white/40 uppercase tracking-widest">
          Test Result
        </div>

        <div className="min-h-[100px] max-h-[320px] overflow-auto p-4 bg-black font-mono text-sm">

          {!output && (
            <span className="text-white/30">
              RUN YOUR CODE TO SEE THE RESULT.
            </span>
          )}

          {output?.success && (
            <div className="text-green-400 font-bold">
              ✓ ALL TEST CASES PASSED
            </div>
          )}

          {output && !output.success && (
            <div className="text-red-400">

              <div className="font-bold mb-4">
                ✕ TEST CASE FAILED
              </div>

              {output.results?.map((test) => (
                <div
                  key={test.testCase}
                  className="mb-4 border border-white/10 p-3"
                >

                  <div className="flex justify-between mb-2">
                    <span>
                      TEST CASE {test.testCase}
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

                  <div className="text-white/40 text-xs">
                    EXPECTED
                  </div>

                  <pre className="text-green-300 whitespace-pre-wrap mt-1">
                    {test.expected}
                  </pre>

                  <div className="text-white/40 text-xs mt-3">
                    YOUR OUTPUT
                  </div>

                  <pre className="text-yellow-300 whitespace-pre-wrap mt-1">
                    {test.actual || "(no output)"}
                  </pre>

                  {test.error && (
                    <>
                      <div className="text-white/40 text-xs mt-3">
                        COMPILER ERROR
                      </div>

                      <pre className="text-red-300 whitespace-pre-wrap mt-1">
                        {test.error}
                      </pre>
                    </>
                  )}

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}