import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface FinalRevealProps {
  type: "shutdown" | "reinstall";
  onRestart: () => void;
}

const FinalReveal = ({ type, onRestart }: FinalRevealProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="text-center max-w-lg mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", damping: 20 }}
      >
        <motion.div
          className="text-6xl mb-8"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💀
        </motion.div>

        <motion.h1
          className="text-3xl font-bold text-white mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Tout était simulé.
        </motion.h1>

        <motion.div
          className="space-y-2 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-zinc-400 text-lg">
            Tu avais été prévenu.
          </p>
          <p className="text-zinc-500 text-base">
            {type === "shutdown" 
              ? "Ton PC n'a jamais été éteint."
              : "Aucun fichier n'a été touché."
            }
          </p>
        </motion.div>

        <motion.p
          className="text-zinc-600 text-sm mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          Merci d'avoir joué.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <Button
            onClick={onRestart}
            variant="outline"
            className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white px-8 py-6 text-lg"
          >
            Retourner au menu
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FinalReveal;
