import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import { Infinity as InfinityIcon, AlertTriangle, Lock, Unlock, FileText, ChevronRight, Activity, Shield, Users } from 'lucide-react';

// Reusable Components
export const HUDPanel = ({ children, className = '', isDanger = false }) => (
  <motion.div
    className={`relative bg-transparent border-[3px] p-4 overflow-hidden group transition-colors ${isDanger
      ? 'border-red-500/80 shadow-[inset_0_0_20px_rgba(239,68,68,0.3),_0_0_20px_rgba(239,68,68,0.3)]'
      : 'border-[#7C3AED]/80 shadow-[inset_0_0_20px_rgba(124,58,237,0.3),_0_0_20px_rgba(124,58,237,0.3)]'
      } ${className}`}
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="relative z-10">{children}</div>
  </motion.div>
);

export const GlowButton = ({ children, onClick, isDanger = false, className = '' }) => (
  <motion.button
    onClick={onClick}
    className={`relative px-8 py-4 font-bold tracking-[0.2em] uppercase transition-all overflow-hidden ${isDanger
      ? 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/50 hover:bg-[#EF4444]/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'
      : 'text-[#C084FC] bg-[#7C3AED]/10 border border-[#7C3AED]/50 hover:bg-[#7C3AED]/20 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]'
      } ${className}`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className={`absolute left-0 top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[${isDanger ? '#EF4444' : '#A855F7'}] to-transparent opacity-50`} />
    <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
  </motion.button>
);

export const StatusIndicator = ({ status, pulse = false }) => {
  const color = status === 'ONLINE' || status === 'ACTIVE' || status === 'SECURE' ? 'bg-[#22C55E]'
    : status === 'WARNING' ? 'bg-[#EF4444]'
      : 'bg-[#A7A0B8]';
  return (
    <div className="flex items-center gap-2 text-xs tracking-wider text-[#A7A0B8] uppercase">
      <div className={`w-2 h-2 rounded-full ${color} ${pulse ? 'animate-pulse shadow-[0_0_8px_currentColor]' : ''}`} />
      <span>{status}</span>
    </div>
  );
};

// Sections
export const DashboardNavbar = ({ teamName, onExit }) => (
  <header className="flex flex-col sm:flex-row items-center justify-between py-4 px-6 bg-[#05030A]/90 border-b border-[#7C3AED]/30 shrink-0 gap-4">
    <div className="flex items-center gap-4 text-[#F8F7FF]">
      <InfinityIcon className="w-8 h-8 text-[#8B5CF6]" />
      <div className="flex flex-col">
        <span className="text-xl font-black tracking-widest uppercase text-[#F8F7FF] drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">PARADOX</span>
        <span className="text-[10px] tracking-[0.3em] text-[#C084FC]">TRAITORS VS INNOCENTS</span>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row items-center gap-6">
      <StatusIndicator status="ONLINE" pulse />
      <span className="font-mono text-[#F8F7FF] uppercase tracking-wider">{teamName}</span>
      <button onClick={onExit} className="text-[10px] tracking-widest text-[#A7A0B8] hover:text-[#EF4444] uppercase transition-colors">
        [ EXIT ]
      </button>
    </div>
  </header>
);

export const TeamIdentity = ({ teamName, isImposter }) => (
  <HUDPanel isDanger={isImposter} className="flex flex-col h-full">
    <div className="flex justify-between items-start mb-4">
      <Shield className={`w-6 h-6 ${isImposter ? 'text-[#EF4444]' : 'text-[#8B5CF6]'}`} />
      <StatusIndicator status="ACTIVE" pulse />
    </div>
    <div className="flex-1 flex flex-col justify-center">
      <h2 className="text-3xl font-black text-[#F8F7FF] uppercase tracking-widest mb-1">{teamName}</h2>
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#A7A0B8] tracking-widest">ROLE:</span>
        <span className={`text-sm font-bold tracking-widest uppercase ${isImposter ? 'text-[#EF4444] drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'text-[#C084FC] drop-shadow-[0_0_5px_rgba(192,132,252,0.8)]'}`}>
          {isImposter ? 'IMPOSTER' : 'INNOCENT'}
        </span>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between">
      <StatusIndicator status="SECURE" />
    </div>
  </HUDPanel>
);

export const MissionHUD = ({
  timer = "30:00",
  timeInSeconds = 1800,
  score = "0",
}) => {
  const isWarning = timeInSeconds <= 180 && timeInSeconds > 30;
  const isCritical = timeInSeconds <= 30;

  const timerColorClass = isCritical
    ? 'text-[#EF4444] drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse'
    : isWarning
      ? 'text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]'
      : 'text-[#7C3AED] drop-shadow-[0_0_10px_rgba(124,58,246,0.5)]';

  return (
    <HUDPanel className="flex flex-col sm:flex-row justify-between items-center gap-6">

      {/* CURRENT MISSION */}
      <div className="flex flex-col">
        <span className="text-xs text-[#A7A0B8] tracking-widest uppercase mb-1">
          Current Mission
        </span>

        <span className="text-xl font-bold text-[#F8F7FF] tracking-widest uppercase">
          SYSTEM BREACH
        </span>
      </div>

      {/* TIMER */}
      <div className="flex flex-col items-center">

        <span className="text-[10px] text-[#A7A0B8] tracking-widest uppercase mb-1">
          Time Remaining
        </span>

        <span
          className={`text-4xl font-mono font-black transition-colors duration-500 ${timerColorClass}`}
        >
          {timer}
        </span>

      </div>

      {/* SCORE */}
      <div className="flex flex-col items-end">

        <span className="text-[10px] text-[#A7A0B8] tracking-widest uppercase mb-1">
          Score
        </span>

        <span className="text-2xl font-mono font-bold text-[#C084FC]">
          {score}
        </span>

        <div className="mt-2">
          <StatusIndicator status="ACTIVE" pulse />
        </div>

      </div>

    </HUDPanel>
  );
};
export const MainMissionPanel = ({
  onEnterMission,
  phase = "MISSION_1",
}) => {

  const mission1 =
    phase === "MISSION_1";

  const mission2 =
    phase === "MISSION_2";

  const disabled =
    !mission1 && !mission2;


  const missionLabel =
    mission1
      ? "MISSION 1 • QUESTIONS 1-5"
      : mission2
        ? "MISSION 2 • QUESTIONS 6-10"
        : "MISSION COMPLETE";


  return (

    <HUDPanel className="flex flex-col h-full bg-[#160A27]/80">


      <div className="flex justify-between items-center mb-6">

        <div className="flex flex-col">

          <span className="text-xs text-[#A7A0B8] tracking-widest uppercase mb-1">

            CASE FILE

          </span>

          <h2 className="text-3xl font-black text-[#F8F7FF] uppercase tracking-widest">

            {mission1
              ? "SYSTEM BREACH"
              : mission2
                ? "SYSTEM BREACH — PHASE 2"
                : "MISSION COMPLETE"
            }

          </h2>

        </div>


        <div className="flex items-center gap-2 text-[#EF4444] bg-[#EF4444]/10 px-3 py-1 rounded border border-[#EF4444]/30">

          <AlertTriangle className="w-4 h-4" />

          <span className="text-[10px] font-bold tracking-widest uppercase">

            {mission1
              ? "PHASE 1"
              : mission2
                ? "PHASE 2"
                : "COMPLETE"
            }

          </span>

        </div>

      </div>


      <div className="flex-1 text-[#A7A0B8] text-sm leading-relaxed border-l-2 border-[#7C3AED]/50 pl-4 mb-8">

        {mission1 && (
          <>
            "Investigate the available information and solve
            the first five case files before the mission timer expires."
          </>
        )}

        {mission2 && (
          <>
            "The discussion phase is complete.
            Continue the investigation with case files six through ten."
          </>
        )}

        {disabled && (
          <>
            "All mission phases have been completed."
          </>
        )}

      </div>


      <div className="grid grid-cols-3 gap-4 mb-8 border-t border-b border-[#7C3AED]/20 py-4">


        <div className="flex flex-col">

          <span className="text-[10px] text-[#A7A0B8] tracking-widest uppercase mb-1">

            Mission Type

          </span>

          <span className="text-xs font-bold text-[#C084FC] uppercase tracking-wider">

            TECHNICAL INVESTIGATION

          </span>

        </div>


        <div className="flex flex-col">

          <span className="text-[10px] text-[#A7A0B8] tracking-widest uppercase mb-1">

            Questions

          </span>

          <span className="text-xs font-bold text-[#C084FC] uppercase tracking-wider">

            {mission1
              ? "01 — 05"
              : mission2
                ? "06 — 10"
                : "01 — 10"
            }

          </span>

        </div>


        <div className="flex flex-col">

          <span className="text-[10px] text-[#A7A0B8] tracking-widest uppercase mb-1">

            Status

          </span>

          <span className={`text-xs font-bold uppercase tracking-wider ${disabled
            ? "text-[#22C55E]"
            : "text-[#C084FC]"
            }`}>

            {mission1
              ? "READY"
              : mission2
                ? "READY"
                : "COMPLETE"
            }

          </span>

        </div>

      </div>


      <GlowButton
        onClick={
          disabled
            ? undefined
            : onEnterMission
        }
        className={`w-full text-lg ${disabled
          ? "opacity-50 cursor-not-allowed"
          : ""
          }`}
      >

        {mission1
          ? "[ ENTER MISSION 1 ]"
          : mission2
            ? "[ ENTER MISSION 2 ]"
            : "[ MISSION COMPLETE ]"
        }

        {!disabled && (
          <ChevronRight className="w-5 h-5" />
        )}

      </GlowButton>

    </HUDPanel>

  );
};
export const EvidencePanel = () => {
  const [showEvidence, setShowEvidence] = useState(false);

  return (
    <HUDPanel className="flex flex-col h-full bg-[#160A27]/80">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <FileText className="text-[#8B5CF6] w-5 h-5" />
        <h3 className="text-lg font-bold text-[#F8F7FF] tracking-widest uppercase">EVIDENCE LOG</h3>
      </div>

      {!showEvidence ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
          <div className="text-xs font-mono text-[#A7A0B8] tracking-[0.3em] mb-4">[ + + + ]</div>
          <span className="text-sm font-bold text-[#A7A0B8] tracking-widest uppercase mb-2">NO EVIDENCE COLLECTED</span>
          <span className="text-xs text-[#A7A0B8]/60 mb-6 italic">"Complete missions to unlock evidence."</span>
          <button
            onClick={() => setShowEvidence(true)}
            className="text-[10px] uppercase tracking-widest border border-[#8B5CF6]/30 px-4 py-2 hover:bg-[#8B5CF6]/10 text-[#C084FC] transition-colors"
          >
            [ VIEW EVIDENCE ]
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-[#21103A] p-3 border-l-2 border-[#8B5CF6]">
            <span className="text-[10px] text-[#A7A0B8] uppercase block mb-1">EVIDENCE #01</span>
            <span className="text-sm font-bold text-[#F8F7FF] uppercase">SERVER LOG</span>
          </div>
          <div className="bg-[#21103A] p-3 border-l-2 border-[#8B5CF6]">
            <span className="text-[10px] text-[#A7A0B8] uppercase block mb-1">EVIDENCE #02</span>
            <span className="text-sm font-bold text-[#F8F7FF] uppercase">ACCESS RECORD</span>
          </div>
          <div className="bg-[#21103A] p-3 border-l-2 border-[#EF4444]">
            <span className="text-[10px] text-[#A7A0B8] uppercase block mb-1">EVIDENCE #03</span>
            <span className="text-sm font-bold text-[#EF4444] uppercase">UNKNOWN SIGNAL</span>
          </div>
        </div>
      )}
    </HUDPanel>
  );
};

export const RoundTablePanel = ({
  open = false,
  timeLeft = 600,
}) => (
  <HUDPanel className="flex flex-col h-full bg-[#160A27]/80 justify-between">

    <div>
      <div className="flex items-center gap-3 mb-2">

        <Users className="text-[#A7A0B8] w-5 h-5" />

        <h3 className="text-lg font-bold text-[#A7A0B8] tracking-widest uppercase">
          ROUND TABLE
        </h3>

      </div>

      <p className="text-xs italic text-[#A7A0B8]/60 mb-6">
        "Someone among you is lying."
      </p>
    </div>

    <div className="flex flex-col items-center justify-center p-6 bg-black/40 border border-white/5 rounded text-center">

      {open ? (
        <>
          <Unlock className="w-8 h-8 text-[#22C55E]/70 mb-3" />

          <span className="text-xs font-bold tracking-widest uppercase mb-1 text-[#22C55E]">
            OPEN
          </span>

          <span className="text-[10px] text-[#A7A0B8]/60 uppercase tracking-widest">
            Discussion phase active.
          </span>

          {/* ROUND TABLE TIMER */}
          <div className="text-3xl font-mono font-black text-green-400 mt-4">
            {Math.floor(timeLeft / 60)
              .toString()
              .padStart(2, '0')}
            :
            {(timeLeft % 60)
              .toString()
              .padStart(2, '0')}
          </div>
        </>
      ) : (
        <>
          <Lock className="w-8 h-8 text-[#A7A0B8]/40 mb-3" />

          <span className="text-xs font-bold tracking-widest uppercase mb-1 text-[#EF4444]">
            LOCKED
          </span>

          <span className="text-[10px] text-[#A7A0B8]/60 uppercase tracking-widest">
            Discussion phase unavailable.
          </span>
        </>
      )}

    </div>

    <button
      className={`mt-4 w-full py-3 border text-xs font-bold tracking-[0.2em] uppercase ${open
        ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]'
        : 'bg-black/50 border-white/10 text-[#A7A0B8]/50 cursor-default'
        }`}
    >
      {open
        ? '[ DISCUSSION OPEN ]'
        : '[ LOCKED ]'
      }
    </button>

  </HUDPanel>
);

export const CrewStatus = ({ currentTeam }) => {
  const teams = Array.from({ length: 10 }, (_, i) => `TEAM ${(i + 1).toString().padStart(2, '0')}`);

  return (
    <HUDPanel className="bg-[#160A27]/80 h-full flex flex-col">
      <h3 className="text-xs font-bold text-[#C084FC] tracking-widest uppercase mb-4 border-b border-[#7C3AED]/30 pb-2">CREW STATUS</h3>
      <div className="grid grid-cols-2 gap-2 overflow-y-auto custom-scrollbar pr-2 flex-1">
        {teams.map(team => {
          const isMe = team === currentTeam;
          return (
            <div key={team} className={`p-2 border flex items-center justify-between ${isMe ? 'border-[#8B5CF6] bg-[#8B5CF6]/10' : 'border-white/5 bg-black/40'}`}>
              <div className="flex flex-col">
                <span className={`text-[10px] font-bold tracking-widest uppercase ${isMe ? 'text-[#F8F7FF]' : 'text-[#A7A0B8]'}`}>
                  {team}
                </span>
                {isMe && <span className="text-[9px] text-[#8B5CF6] tracking-widest">◎ YOU</span>}
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            </div>
          );
        })}
      </div>
    </HUDPanel>
  );
};

export const MissionProgress = () => {
  const missions = [1, 2, 3, 4, 5];
  const current = 1;

  return (
    <HUDPanel className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex flex-col shrink-0">
          <span className="text-xs font-bold text-[#C084FC] tracking-widest uppercase mb-1">MISSION PROGRESS</span>
          <div className="flex gap-4 text-[10px] text-[#A7A0B8]">
            <span>CURRENT: MISSION 0{current}</span>
            <span>COMPLETED: {current - 1} / 5</span>
          </div>
        </div>

        <div className="flex-1 w-full flex items-center justify-between max-w-lg">
          {missions.map((m, i) => (
            <div key={m} className="flex items-center flex-1 last:flex-none">
              <div className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${m === current ? 'border-[#8B5CF6] text-[#F8F7FF] shadow-[0_0_10px_rgba(139,92,246,0.5)]' : m < current ? 'border-[#22C55E] text-[#22C55E]' : 'border-[#A7A0B8]/30 text-[#A7A0B8]/30'}`}>
                <span className="text-[10px] font-mono">{m.toString().padStart(2, '0')}</span>
                {m === current && <div className="absolute inset-0 bg-[#8B5CF6]/20 rounded-full animate-ping" />}
              </div>
              {i < missions.length - 1 && (
                <div className={`flex-1 h-[2px] mx-2 ${m < current ? 'bg-[#22C55E]' : 'bg-[#A7A0B8]/20'}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </HUDPanel>
  );
};

export const BottomSystemBar = () => (
  <footer className="flex flex-wrap items-center justify-between py-2 px-6 bg-[#05030A] border-t border-white/5 text-[9px] font-mono text-[#A7A0B8] tracking-widest uppercase">
    <span>PARADOX SYSTEM v1.0</span>
    <div className="flex gap-6">
      <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> SERVER: ONLINE</div>
      <span>SECURITY: ACTIVE</span>
      <span>CONNECTION: SECURE</span>
    </div>
  </footer>
);
