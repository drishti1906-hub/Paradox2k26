import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000); // Wait 4 seconds then transition
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
    >
      {/* Animated Background Layer */}
      <motion.div 
        className="absolute inset-0"
        style={{ backgroundImage: 'url(/splash-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        initial={{ scale: 1.1, rotate: 2 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 8, ease: "easeOut" }}
      />
      
      {/* Logo Layer */}
      <motion.div 
        className="flex flex-col items-center justify-center relative z-10"
        initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
        animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <img 
          src="/infinity-logo.png" 
          alt="Infinity 2K26" 
          className="w-48 md:w-[20rem] h-auto object-contain"
        />
        <h1 
          className="text-white text-2xl md:text-4xl font-sans font-bold uppercase mt-4 tracking-widest"
        >
          Presents
        </h1>
      </motion.div>
    </motion.div>
  );
}
