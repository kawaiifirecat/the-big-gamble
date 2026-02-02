import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Skull, Zap, AlertCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WarningDialogProps {
  warningIndex: number;
  totalWarnings: number;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const icons = [AlertTriangle, Skull, Zap, AlertCircle, Eye];

const WarningDialog = ({ warningIndex, totalWarnings, message, onConfirm, onCancel }: WarningDialogProps) => {
  const IconComponent = icons[warningIndex % icons.length];
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-zinc-900 border border-red-500/30 rounded-2xl p-8 max-w-md mx-4 shadow-2xl shadow-red-500/20"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, -10, 10, 0]
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-4 bg-red-500/20 rounded-full">
              <IconComponent className="w-12 h-12 text-red-500" />
            </div>
          </motion.div>

          <div className="text-center mb-6">
            <p className="text-zinc-500 text-sm mb-2">
              Avertissement {warningIndex + 1} / {totalWarnings}
            </p>
            <motion.p
              className="text-white text-xl font-semibold leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.p>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              onClick={onCancel}
            >
              Abandonner
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={onConfirm}
            >
              {warningIndex < totalWarnings - 1 ? "Continuer" : "LANCER LA ROUE"}
            </Button>
          </div>

          <motion.div
            className="mt-4 h-1 bg-zinc-800 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 to-red-600"
              initial={{ width: 0 }}
              animate={{ width: `${((warningIndex + 1) / totalWarnings) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WarningDialog;
