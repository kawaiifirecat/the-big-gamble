import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface WheelProps {
  onResult: (result: "win" | "shutdown" | "reinstall") => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

const Wheel = ({ onResult, isSpinning, setIsSpinning }: WheelProps) => {
  const [rotation, setRotation] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playDramaticSound = (frequency: number, duration: number, type: OscillatorType = "sine") => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  const playTickSound = () => {
    playDramaticSound(800 + Math.random() * 400, 0.05, "square");
  };

  const playSlowTickSound = () => {
    playDramaticSound(400 + Math.random() * 200, 0.1, "triangle");
  };

  const playFinalSound = (isWin: boolean) => {
    if (isWin) {
      playDramaticSound(523, 0.5, "sine");
      setTimeout(() => playDramaticSound(659, 0.5, "sine"), 200);
      setTimeout(() => playDramaticSound(784, 0.8, "sine"), 400);
    } else {
      playDramaticSound(200, 1.5, "sawtooth");
    }
  };

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Determine result based on percentages
    const random = Math.random() * 100;
    let result: "win" | "shutdown" | "reinstall";
    let targetSection: number;

    if (random < 1) {
      result = "win";
      targetSection = 0; // Green section (1%)
    } else if (random < 11) {
      result = "reinstall";
      targetSection = 1; // Purple section (10%)
    } else {
      result = "shutdown";
      targetSection = 2; // Red section (89%)
    }

    // Calculate rotation (multiple full spins + target section)
    const spins = 8 + Math.floor(Math.random() * 4);
    const sectionAngle = 360 / 3;
    const targetAngle = targetSection * sectionAngle + sectionAngle / 2;
    const finalRotation = spins * 360 + (360 - targetAngle);
    
    setRotation(prev => prev + finalRotation);

    // Play tick sounds during spin
    let tickCount = 0;
    const maxTicks = 60;
    const tickInterval = setInterval(() => {
      tickCount++;
      if (tickCount < maxTicks * 0.7) {
        playTickSound();
      } else {
        playSlowTickSound();
      }
      if (tickCount >= maxTicks) {
        clearInterval(tickInterval);
      }
    }, 100);

    // Announce result after spin
    setTimeout(() => {
      clearInterval(tickInterval);
      playFinalSound(result === "win");
      setTimeout(() => {
        onResult(result);
        setIsSpinning(false);
      }, 1000);
    }, 8000);
  };

  const segments = [
    { color: "from-emerald-500 to-emerald-600", label: "1%", sublabel: "GAGNER" },
    { color: "from-purple-600 to-purple-700", label: "10%", sublabel: "RÉINSTALL" },
    { color: "from-red-600 to-red-700", label: "89%", sublabel: "EXTINCTION" },
  ];

  return (
    <div className="relative flex flex-col items-center">
      {/* Pointer */}
      <div className="absolute -top-2 z-20 transform">
        <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
      </div>

      {/* Glow effect */}
      <motion.div
        className="absolute w-[340px] h-[340px] rounded-full"
        animate={{
          boxShadow: isSpinning
            ? [
                "0 0 60px 20px rgba(239, 68, 68, 0.6)",
                "0 0 80px 30px rgba(168, 85, 247, 0.6)",
                "0 0 60px 20px rgba(16, 185, 129, 0.6)",
                "0 0 80px 30px rgba(239, 68, 68, 0.6)",
              ]
            : "0 0 40px 10px rgba(255, 255, 255, 0.2)",
        }}
        transition={{
          duration: 0.5,
          repeat: isSpinning ? Infinity : 0,
          ease: "linear",
        }}
      />

      {/* Wheel */}
      <motion.div
        className="relative w-[320px] h-[320px] rounded-full overflow-hidden border-8 border-white/20 shadow-2xl cursor-pointer"
        style={{ transformOrigin: "center center" }}
        animate={{ rotate: rotation }}
        transition={{
          duration: 8,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        onClick={spinWheel}
        whileHover={!isSpinning ? { scale: 1.02 } : {}}
        whileTap={!isSpinning ? { scale: 0.98 } : {}}
      >
        {segments.map((segment, index) => (
          <div
            key={index}
            className={`absolute w-full h-full bg-gradient-to-r ${segment.color}`}
            style={{
              clipPath: `polygon(50% 50%, 50% 0%, ${index === 0 ? '100% 0%, 100% 50%' : index === 1 ? '100% 50%, 100% 100%, 50% 100%' : '50% 100%, 0% 100%, 0% 0%'})`,
              transform: `rotate(${index * 120}deg)`,
            }}
          >
            <div
              className="absolute text-white font-bold text-center"
              style={{
                top: "25%",
                left: "60%",
                transform: `rotate(${60}deg)`,
              }}
            >
              <div className="text-2xl drop-shadow-lg">{segment.label}</div>
              <div className="text-xs opacity-80">{segment.sublabel}</div>
            </div>
          </div>
        ))}

        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-full border-4 border-white/30 flex items-center justify-center shadow-xl">
          <span className="text-white font-bold text-xs">SPIN</span>
        </div>
      </motion.div>

      {/* Click to spin text */}
      {!isSpinning && (
        <motion.p
          className="mt-8 text-zinc-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Cliquez sur la roue pour la lancer
        </motion.p>
      )}

      {isSpinning && (
        <motion.p
          className="mt-8 text-red-400 text-lg font-semibold"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          La roue tourne...
        </motion.p>
      )}
    </div>
  );
};

export default Wheel;
