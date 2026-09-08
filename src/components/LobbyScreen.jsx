import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LobbyScreen({ onEnter }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Stretched Cover Background with Engine Shake Animation */}
      <motion.div 
        className="absolute inset-0 w-full h-full overflow-hidden origin-center"
        style={{ scale: 1.02 }}
        animate={{
          x: [0, -2, 2, -1, 1, -2, 2, 0],
          y: [0, 2, -2, 1, -1, 2, -2, 0],
          rotate: [0, -0.1, 0.1, -0.05, 0.05, 0]
        }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <img 
          src="/lobby-bg.png" 
          alt="Lobby" 
          className="w-full h-full object-fill"
        />
        {/* Invisible clickable area exactly over the START button in the center-bottom */}
        <button 
          onClick={onEnter}
          className="absolute w-[20%] h-[15%] bottom-[12%] left-1/2 transform -translate-x-1/2 cursor-pointer focus:outline-none"
          aria-label="Start Game"
          title="Click START to Enter"
        />
      </motion.div>
    </motion.div>
  );
}
