import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function MissionBriefScreen({
  teamName,
  role,
  onComplete
}) {
  const actualRole = role || 'INNOCENT';
  const isImposter = actualRole === 'IMPOSTER';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/splash-bg.jpg)' }}
      />

      {/* Inset Glowing Border Frame */}
      <div className={`absolute inset-2 sm:inset-4 border-[3px] z-10 pointer-events-none transition-colors ${isImposter
          ? 'border-red-500/80 shadow-[inset_0_0_20px_rgba(239,68,68,0.3),_0_0_20px_rgba(239,68,68,0.3)]'
          : 'border-green-500/80 shadow-[inset_0_0_20px_rgba(34,197,94,0.3),_0_0_20px_rgba(34,197,94,0.3)]'
        }`} />

      {/* Close Button */}
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20 text-white/80 hover:text-white hover:scale-110 transition-all p-2 bg-black/40 hover:bg-black/60 rounded"
      >
        <X size={32} strokeWidth={2.5} />
      </button>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full p-6 sm:p-12 flex flex-col justify-end sm:justify-center">

        {/* Dark Text Box on the left */}
        <motion.div
          className={`w-full sm:w-[45%] max-w-2xl bg-black/80 p-6 sm:p-8 border-l-[6px] shadow-2xl ${isImposter ? 'border-red-600' : 'border-green-500'
            }`}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 20 }}
        >
          {/* Role Badge with Transparent Glassmorphism */}
          <div className={`mb-6 p-4 border rounded-xl flex items-center gap-4 backdrop-blur-md transition-colors ${isImposter
              ? 'bg-red-950/40 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
              : 'bg-green-950/40 border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
            }`}>
            <span className={`font-bold uppercase tracking-widest text-sm ${isImposter ? 'text-red-200' : 'text-green-200'}`}>Role</span>
            <div className={`h-4 w-[2px] ${isImposter ? 'bg-red-500/50' : 'bg-green-500/50'}`}></div>
            <span className={`font-black uppercase tracking-[0.2em] text-xl drop-shadow-[0_0_10px_currentColor] ${isImposter ? 'text-red-500' : 'text-green-400'}`}>
              {role}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2 shadow-black drop-shadow-md">Overview</h2>
            <p className="text-white/90 italic text-sm sm:text-base leading-relaxed drop-shadow">
              Think like a developer. Observe like a detective. Deceive like an Imposter.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4 shadow-black drop-shadow-md">Rules</h2>
            <ul className="space-y-4 text-white/90 text-sm sm:text-base drop-shadow">
              <li className="flex items-start gap-3">
                <span className={`flex-shrink-0 text-white font-bold w-6 h-6 flex items-center justify-center rounded ${isImposter ? 'bg-red-600' : 'bg-green-600'}`}>1</span>
                <span>1 hidden Imposter among 10 teams — role assigned randomly & secretly</span>
              </li>
              <li className="flex items-start gap-3">
                <span className={`flex-shrink-0 text-white font-bold w-6 h-6 flex items-center justify-center rounded ${isImposter ? 'bg-red-600' : 'bg-green-600'}`}>2</span>
                <span>9 Innocent roles competing to get the highest score</span>
              </li>
              <li className="flex items-start gap-3">
                <span className={`flex-shrink-0 text-white font-bold w-6 h-6 flex items-center justify-center rounded ${isImposter ? 'bg-red-600' : 'bg-green-600'}`}>3</span>
                <span>Imposter completes secret sabotage missions to lower the public progress meter</span>
              </li>
              <li className="flex items-start gap-3">
                <span className={`flex-shrink-0 text-white font-bold w-6 h-6 flex items-center justify-center rounded ${isImposter ? 'bg-red-600' : 'bg-green-600'}`}>4</span>
                <span>Every team casts exactly one secret vote at the Round Table — no self-voting</span>
              </li>
              <li className="flex items-start gap-3">
                <span className={`flex-shrink-0 text-white font-bold w-6 h-6 flex items-center justify-center rounded ${isImposter ? 'bg-red-600' : 'bg-green-600'}`}>5</span>
                <span>Each team records its own score; the live score is visible to that team and the Admin Control</span>
              </li>
            </ul>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
