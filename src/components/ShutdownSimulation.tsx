import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ShutdownSimulationProps {
  onComplete: () => void;
}

const ShutdownSimulation = ({ onComplete }: ShutdownSimulationProps) => {
  const [phase, setPhase] = useState<"shutdown" | "black" | "reveal">("shutdown");

  useEffect(() => {
    // Hide cursor
    document.body.style.cursor = "none";
    
    // Request fullscreen
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
      } catch (e) {
        console.log("Fullscreen not available");
      }
    };
    enterFullscreen();

    // Disable keyboard
    const handleKeydown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener("keydown", handleKeydown, true);

    // Phase transitions
    const shutdownTimer = setTimeout(() => {
      setPhase("black");
    }, 2000);

    // Random black screen duration (10-45 seconds)
    const blackDuration = 10000 + Math.random() * 35000;
    const revealTimer = setTimeout(() => {
      setPhase("reveal");
      document.body.style.cursor = "auto";
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setTimeout(onComplete, 3000);
    }, 2000 + blackDuration);

    return () => {
      clearTimeout(shutdownTimer);
      clearTimeout(revealTimer);
      document.body.style.cursor = "auto";
      window.removeEventListener("keydown", handleKeydown, true);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {phase === "shutdown" && (
        <motion.div
          className="text-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <motion.div
            className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-white/60 text-sm">Arrêt en cours...</p>
        </motion.div>
      )}

      {phase === "black" && (
        <div className="absolute inset-0 bg-black" />
      )}

      {phase === "reveal" && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-6xl mb-6"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            💀
          </motion.div>
          <h2 className="text-white text-3xl font-bold mb-4">Ton PC s'est éteint.</h2>
          <p className="text-zinc-400 text-lg">Enfin... c'est ce que tu as cru.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ShutdownSimulation;
