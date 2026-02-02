import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Zap, Sparkles, Skull, RotateCcw } from "lucide-react";
import Wheel from "@/components/Wheel";
import WarningDialog from "@/components/WarningDialog";
import ShutdownSimulation from "@/components/ShutdownSimulation";
import ReinstallSimulation from "@/components/ReinstallSimulation";
import WinScreen from "@/components/WinScreen";
import FinalReveal from "@/components/FinalReveal";

const warningMessages = [
  "Ce n'est pas un jeu.",
  "La roue ne plaisante pas.",
  "Vous êtes responsable de votre curiosité.",
  "Statistiquement, vous devriez partir.",
  "Dernière chance de faire demi-tour.",
  "Nous déclinons toute responsabilité.",
  "Êtes-vous vraiment sûr de vous ?",
  "Votre destin est entre vos mains.",
  "89% des gens regrettent.",
  "La chance n'existe pas ici.",
  "Ce qui va suivre est irréversible.",
  "Vous avez été averti. Encore.",
  "La roue se souvient de tout.",
  "Dernière confirmation (les précédentes comptaient aussi).",
  "Prêt à assumer les conséquences ?",
];

// Fisher-Yates shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

type GamePhase = "menu" | "wheel" | "warnings" | "spinning" | "shutdown" | "reinstall" | "win" | "reveal";

const Index = () => {
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [warningIndex, setWarningIndex] = useState(0);
  const [shuffledWarnings, setShuffledWarnings] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultType, setResultType] = useState<"shutdown" | "reinstall" | null>(null);

  const startGame = () => {
    const randomCount = 10 + Math.floor(Math.random() * 6); // 10-15 warnings
    const warnings = shuffleArray(warningMessages).slice(0, randomCount);
    setShuffledWarnings(warnings);
    setWarningIndex(0);
    setPhase("warnings");
  };

  const handleWarningConfirm = () => {
    if (warningIndex < shuffledWarnings.length - 1) {
      setWarningIndex(prev => prev + 1);
    } else {
      setPhase("wheel");
    }
  };

  const handleWarningCancel = () => {
    setPhase("menu");
    setWarningIndex(0);
  };

  const handleResult = useCallback((result: "win" | "shutdown" | "reinstall") => {
    if (result === "win") {
      setPhase("win");
    } else {
      setResultType(result);
      setPhase(result);
    }
  }, []);

  const handleSimulationComplete = () => {
    setPhase("reveal");
  };

  const restartGame = () => {
    setPhase("menu");
    setWarningIndex(0);
    setIsSpinning(false);
    setResultType(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Menu Phase */}
      <AnimatePresence>
        {phase === "menu" && (
          <motion.div
            className="min-h-screen flex flex-col items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <motion.div
              className="text-center mb-12"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                LA ROUE DU 1%
              </h1>
              <p className="text-zinc-500 text-lg">
                Tu n'as presque aucune chance. Mais presque.
              </p>
            </motion.div>

            {/* Probabilities */}
            <motion.div
              className="grid gap-4 mb-12 max-w-md w-full"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-4 bg-zinc-900/50 border border-emerald-500/20 rounded-xl p-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-emerald-400 font-bold">1% — GAGNER</p>
                  <p className="text-zinc-500 text-sm">Rien ne se passe. Tu as de la chance.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-zinc-900/50 border border-red-500/20 rounded-xl p-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-red-400 font-bold">89% — EXTINCTION DU PC</p>
                  <p className="text-zinc-500 text-sm">Simulation d'une extinction totale du système.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-zinc-900/50 border border-purple-500/20 rounded-xl p-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-purple-400 font-bold">10% — RÉINSTALLATION DU PC</p>
                  <p className="text-zinc-500 text-sm">Simulation d'une réinstallation complète (aucune donnée affectée).</p>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={startGame}
                size="lg"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-12 py-8 text-xl font-bold rounded-2xl shadow-xl shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300"
              >
                <AlertTriangle className="w-6 h-6 mr-3" />
                J'ai compris les risques
              </Button>
            </motion.div>

            {/* Footer warning */}
            <motion.p
              className="text-zinc-600 text-sm mt-8 text-center max-w-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              En continuant, vous acceptez de subir les conséquences de vos actes.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warning Dialogs */}
      <AnimatePresence>
        {phase === "warnings" && shuffledWarnings.length > 0 && (
          <WarningDialog
            key={warningIndex}
            warningIndex={warningIndex}
            totalWarnings={shuffledWarnings.length}
            message={shuffledWarnings[warningIndex]}
            onConfirm={handleWarningConfirm}
            onCancel={handleWarningCancel}
          />
        )}
      </AnimatePresence>

      {/* Wheel Phase */}
      <AnimatePresence>
        {phase === "wheel" && (
          <motion.div
            className="min-h-screen flex flex-col items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.h2
              className="text-3xl font-bold mb-12 text-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <span className="text-zinc-400">Le moment est venu.</span>
            </motion.h2>

            <Wheel
              onResult={handleResult}
              isSpinning={isSpinning}
              setIsSpinning={setIsSpinning}
            />

            {!isSpinning && (
              <motion.button
                className="mt-12 text-zinc-600 hover:text-zinc-400 transition-colors text-sm"
                onClick={() => setPhase("menu")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                ← Retour (lâche)
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shutdown Simulation */}
      {phase === "shutdown" && (
        <ShutdownSimulation onComplete={handleSimulationComplete} />
      )}

      {/* Reinstall Simulation */}
      {phase === "reinstall" && (
        <ReinstallSimulation onComplete={handleSimulationComplete} />
      )}

      {/* Win Screen */}
      {phase === "win" && (
        <WinScreen onRestart={restartGame} />
      )}

      {/* Final Reveal */}
      {phase === "reveal" && resultType && (
        <FinalReveal type={resultType} onRestart={restartGame} />
      )}
    </div>
  );
};

export default Index;
