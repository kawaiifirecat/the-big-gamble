import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface WinScreenProps {
  onRestart: () => void;
}

const WinScreen = ({ onRestart }: WinScreenProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        <motion.div
          className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500/20 rounded-full mb-8"
          animate={{ 
            boxShadow: [
              "0 0 20px 10px rgba(16, 185, 129, 0.2)",
              "0 0 40px 20px rgba(16, 185, 129, 0.4)",
              "0 0 20px 10px rgba(16, 185, 129, 0.2)",
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-12 h-12 text-emerald-400" />
        </motion.div>

        <motion.h1
          className="text-5xl font-bold text-white mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Incroyable.
        </motion.h1>

        <motion.p
          className="text-2xl text-emerald-400 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          La roue t'a épargné.
        </motion.p>

        <motion.p
          className="text-zinc-500 text-lg mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          1% de chance. Tu fais partie des élus.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <Button
            onClick={onRestart}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-6 text-lg"
          >
            Tenter à nouveau sa chance
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WinScreen;
