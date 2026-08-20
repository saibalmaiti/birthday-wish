import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { BirthdayConfig } from "../../types/birthday";

type RevealPhase =
  | "arrival"
  | "gift"
  | "opening"
  | "celebration";

type BirthdayRevealProps = {
  birthday: BirthdayConfig["birthday"];
  recipientName: string;
  onComplete: () => void;
};

type Balloon = {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  color: string;
};

const BALLOON_COLORS = [
  "#f9a8d4",
  "#fda4af",
  "#e9d5ff",
  "#fecdd3",
  "#fbcfe8",
  "#fde68a",
];

const createBalloons = (): Balloon[] => {
  return Array.from({ length: 18 }, (_, index) => ({
    id: index,
    left: `${5 + Math.random() * 90}%`,
    size: 35 + Math.random() * 35,
    duration: 6 + Math.random() * 3,
    delay: Math.random() * 2,
    drift: -80 + Math.random() * 160,
    color:
      BALLOON_COLORS[
        Math.floor(Math.random() * BALLOON_COLORS.length)
      ],
  }));
};

const BirthdayReveal = ({
  birthday,
  recipientName,
  onComplete,
}: BirthdayRevealProps) => {
  const [phase, setPhase] =
    useState<RevealPhase>("arrival");

  const [balloons, setBalloons] =
    useState<Balloon[]>([]);

  useEffect(() => {
    let timer: number | undefined;

    switch (phase) {
      case "arrival":
        timer = window.setTimeout(() => {
          setPhase("gift");
        }, 3000);
        break;

      case "gift":
        timer = window.setTimeout(() => {
          setPhase("opening");
        }, 3500);
        break;

      case "opening":
        timer = window.setTimeout(() => {
          setBalloons(createBalloons());
          setPhase("celebration");
        }, 2200);
        break;

      case "celebration":
        timer = window.setTimeout(() => {
          onComplete();
        }, 8000);
        break;

      default:
        break;
    }

    return () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, [phase, onComplete]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6">
      {/* Balloons */}
      {phase === "celebration" && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {balloons.map((balloon) => (
            <motion.div
              key={balloon.id}
              initial={{
                y: "110vh",
                x: 0,
                opacity: 0,
              }}
              animate={{
                y: "-120vh",
                x: balloon.drift,
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: balloon.duration,
                delay: balloon.delay,
                ease: "easeOut",
              }}
              className="absolute bottom-0"
              style={{
                left: balloon.left,
                width: balloon.size,
                height: balloon.size * 1.25,
              }}
            >
              <div
                className="relative h-full w-full rounded-[50%]"
                style={{
                  background: balloon.color,
                }}
              >
                <div className="absolute left-[20%] top-[15%] h-[25%] w-[20%] rounded-full bg-white/40 blur-[1px]" />

                <div
                  className="absolute left-1/2 top-full -translate-x-1/2"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: `${
                      balloon.size * 0.12
                    }px solid transparent`,
                    borderRight: `${
                      balloon.size * 0.12
                    }px solid transparent`,
                    borderTop: `${
                      balloon.size * 0.16
                    }px solid ${balloon.color}`,
                  }}
                />

                <div
                  className="absolute left-1/2 top-[calc(100%+4px)] w-px -translate-x-1/2 bg-white/30"
                  style={{
                    height: balloon.size * 1.2,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Phase 1 */}
        {phase === "arrival" && (
          <motion.div
            key="arrival"
            initial={{
              opacity: 0,
              y: 30,
              filter: "blur(8px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              y: -20,
              filter: "blur(6px)",
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
            className="text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.12, 1],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mb-7 text-5xl"
            >
              ❤️
            </motion.div>

            <h2 className="text-3xl font-light text-pink-100">
              I knew you'd say yes.
            </h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.8,
                duration: 0.8,
              }}
              className="mt-4 text-white/50"
            >
              Now... let me give you something.
            </motion.p>
          </motion.div>
        )}

        {/* Phase 2 */}
        {phase === "gift" && (
          <motion.div
            key="gift"
            initial={{
              opacity: 0,
              scale: 0.7,
              y: 70,
              filter: "blur(8px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              scale: 1.05,
              y: -15,
              filter: "blur(5px)",
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
            className="text-center"
          >
            <motion.div
              animate={{
                rotate: [0, -4, 4, -3, 3, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 0.8,
              }}
              className="text-8xl"
            >
              🎁
            </motion.div>

            <motion.p
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.8,
                duration: 0.8,
              }}
              className="mt-8 text-lg text-white/60"
            >
              Wait... there's something for you.
            </motion.p>
          </motion.div>
        )}

        {/* Phase 3 */}
        {phase === "opening" && (
          <motion.div
            key="opening"
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 1.3,
              filter: "blur(8px)",
            }}
            transition={{
              duration: 0.9,
              ease: "easeInOut",
            }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{
                scale: [1, 1.08, 1.2, 1.45],
                rotate: [0, -2, 2, -1, 0],
              }}
              transition={{
                duration: 1.8,
                ease: "easeInOut",
              }}
              className="text-9xl"
            >
              🎁
            </motion.div>

            <motion.p
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.5,
                duration: 0.7,
              }}
              className="mt-8 text-lg text-pink-100"
            >
              Okay... here we go.
            </motion.p>
          </motion.div>
        )}

        {/* Phase 4 */}
        {phase === "celebration" && (
          <motion.div
            key="celebration"
            initial={{
              opacity: 0,
              scale: 0.92,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 1.1,
              ease: "easeOut",
            }}
            className="relative z-10 text-center"
          >
            <motion.p
              initial={{
                opacity: 0,
                letterSpacing: "0.5em",
              }}
              animate={{
                opacity: 1,
                letterSpacing: "0.15em",
              }}
              transition={{
                duration: 1,
                ease: "easeOut",
              }}
              className="text-sm font-medium text-pink-200"
            >
              {birthday.happyText}
            </motion.p>

            <motion.h1
              initial={{
                opacity: 0,
                y: 35,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                delay: 0.5,
                duration: 1,
                ease: "easeOut",
              }}
              className="mt-3 text-5xl font-light tracking-wide text-white md:text-7xl"
            >
              {birthday.title}
            </motion.h1>

            <motion.h2
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1.1,
                duration: 0.8,
              }}
              className="mt-5 text-2xl font-light text-pink-200 md:text-3xl"
            >
              {recipientName} ❤️
            </motion.h2>

            <motion.p
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1.8,
                duration: 0.9,
              }}
              className="mx-auto mt-8 max-w-lg text-sm leading-7 text-white/60 md:text-base"
            >
              {birthday.message}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BirthdayReveal;