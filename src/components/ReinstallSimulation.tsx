import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ReinstallSimulationProps {
  onComplete: () => void;
}

const ReinstallSimulation = ({ onComplete }: ReinstallSimulationProps) => {
  const [phase, setPhase] = useState<"loading" | "install" | "config" | "reveal">("loading");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const installSteps = [
    "Préparation des fichiers d'installation...",
    "Copie des fichiers système...",
    "Installation des composants Windows...",
    "Installation des mises à jour...",
    "Configuration des paramètres...",
    "Installation des pilotes...",
    "Finalisation de l'installation...",
  ];

  useEffect(() => {
    // Hide cursor and go fullscreen
    document.body.style.cursor = "none";
    
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

    // Initial loading phase
    const loadingTimer = setTimeout(() => {
      setPhase("install");
    }, 3000);

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = Math.random() * 2 + 0.5;
        return Math.min(prev + increment, 100);
      });
    }, 500);

    // Step changes
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= installSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 4000);

    // Complete after ~30 seconds
    const completeTimer = setTimeout(() => {
      setPhase("reveal");
      document.body.style.cursor = "auto";
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setTimeout(onComplete, 4000);
    }, 30000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(completeTimer);
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      document.body.style.cursor = "auto";
      window.removeEventListener("keydown", handleKeydown, true);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#0078D4] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {phase === "loading" && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="flex gap-2 justify-center mb-8"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-white rounded-full"
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </motion.div>
          <p className="text-white text-xl">Préparation en cours...</p>
        </motion.div>
      )}

      {phase === "install" && (
        <motion.div
          className="text-center w-full max-w-2xl px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="flex gap-2 justify-center mb-12"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 bg-white rounded-full"
                animate={{
                  y: [0, -12, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </motion.div>

          <h1 className="text-white text-3xl font-light mb-4">
            Installation de Windows
          </h1>
          
          <p className="text-white/80 text-lg mb-8">
            {installSteps[currentStep]}
          </p>

          <div className="mb-4">
            <div className="text-white text-5xl font-light mb-2">
              {Math.floor(progress)}%
            </div>
          </div>

          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <p className="text-white/60 text-sm mt-8">
            Votre PC va redémarrer plusieurs fois. Cela peut prendre un moment.
          </p>
          <p className="text-white/40 text-xs mt-2">
            Ne mettez pas votre PC hors tension
          </p>
        </motion.div>
      )}

      {phase === "reveal" && (
        <motion.div
          className="text-center bg-black fixed inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <motion.div
              className="text-6xl mb-6"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              🎭
            </motion.div>
            <h2 className="text-white text-3xl font-bold mb-4">
              Réinstallation terminée !
            </h2>
            <p className="text-zinc-400 text-lg mb-2">
              Enfin... pas vraiment.
            </p>
            <p className="text-zinc-500 text-sm">
              Tes fichiers sont toujours là. Respire.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ReinstallSimulation;
