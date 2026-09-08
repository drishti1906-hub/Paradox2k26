import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function RoleCardScreen({
  teamName,
  role,
  onComplete
}) {
  const [phase, setPhase] = useState('blackout');

  useEffect(() => {
    const blackoutTimer = setTimeout(() => {
      setPhase('fullscreen');
    }, 1500);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(blackoutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const isImposter = role === 'IMPOSTER';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.1,
        filter: 'blur(10px)',
        transition: { duration: 0.8 }
      }}
    >

      {/* CRT blackout */}
      {phase === 'blackout' && (
        <motion.div
          className="absolute z-[9999] bg-white m-auto top-0 bottom-0 left-0 right-0 shadow-[0_0_30px_white]"
          initial={{
            height: '100vh',
            width: '100vw',
            opacity: 0
          }}
          animate={{
            height: ['100vh', '4px', '4px', '0px'],
            width: ['100vw', '100vw', '0vw', '0vw'],
            opacity: [1, 1, 1, 0]
          }}
          transition={{
            duration: 0.6,
            times: [0, 0.4, 0.8, 1],
            ease: 'circOut'
          }}
        />
      )}

      {phase === 'fullscreen' && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >

          {/* Glow */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[40vh] opacity-60"
            style={{
              background: `radial-gradient(
                ellipse at bottom,
                ${isImposter ? '#EF4444' : '#22C55E'}
                0%,
                transparent 70%
              )`
            }}
          />

          <motion.h1
            className={`relative z-10 text-6xl sm:text-8xl md:text-9xl tracking-widest uppercase font-black ${isImposter
                ? 'text-[#EF4444]'
                : 'text-[#22C55E]'
              }`}
            style={{
              fontFamily: '"VCR OSD Mono", monospace',
              textShadow: isImposter
                ? '0 0 40px rgba(239,68,68,0.5)'
                : '0 0 40px rgba(34,197,94,0.5)'
            }}
            initial={{
              scale: 0.8,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1
            }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 20
            }}
          >
            {isImposter ? 'Impostor' : 'Innocent'}
          </motion.h1>

        </motion.div>
      )}

    </motion.div>
  );
}