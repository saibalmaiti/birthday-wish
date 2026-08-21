import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { BirthdayConfig } from "../types/birthday";

import AcceptGift from "../components/romantic/AcceptGift";
import BirthdayReveal from "../components/romantic/BirthdayReveal";
import MemoryGallery from "../components/romantic/MemoryGallery";
import ScrollTransition from "../components/romantic/ScrollTransition";
import PreciousThing from "../components/romantic/PreciousThing";
import FinalGift from "../components/romantic/FinalGift";

type RomanticPhase = "accept" | "reveal" | "memories";

type RomanticBirthdayProps = {
  config: BirthdayConfig;
};

const RomanticBirthday = ({ config }: RomanticBirthdayProps) => {
  const [phase, setPhase] = useState<RomanticPhase>("accept");
  const [showFinalGift, setShowFinalGift] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

  const finalGiftRef = useRef<HTMLDivElement>(null);

  const handleShowFinalGift = () => {
    setShowFinalGift(true);

    window.setTimeout(() => {
      finalGiftRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleRestart = () => {
    // Reset parent-controlled state
    setPhase("accept");
    setShowFinalGift(false);

    // Force the experience and its child components
    // to mount again with fresh internal states
    setRestartKey((prev) => prev + 1);

    // Return to the top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const shouldShowRestart = !config.gift || showFinalGift;

  return (
    <main
      key={restartKey}
      className="relative min-h-screen overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {/* Page 1: Gift acceptance */}
        {phase === "accept" && (
          <motion.section
            key="accept"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 0.98,
              y: -10,
            }}
            transition={{
              duration: 0.7,
              ease: "easeInOut",
            }}
            className="relative flex min-h-screen items-center justify-center px-6"
          >
            {/* Background glow */}
            <div className="absolute h-[450px] w-[450px] rounded-full bg-pink-400/10 blur-[120px]" />

            <section className="relative z-10 flex max-w-xl flex-col items-center text-center">
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-pink-200/60">
                {config.intro.eyebrow}
              </p>

              <h1 className="text-4xl font-light tracking-tight sm:text-6xl">
                {config.intro.titlePrefix},{" "}
                <span className="italic text-pink-200">
                  {config.recipientName}...
                </span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-white/60 sm:text-lg">
                {config.intro.subtitle}
              </p>

              <AcceptGift onAccept={() => setPhase("reveal")} />
            </section>
          </motion.section>
        )}

        {/* Page 2: Birthday reveal */}
        {phase === "reveal" && (
          <motion.section
            key="reveal"
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 1.02,
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
          >
            <BirthdayReveal
              birthday={config.birthday}
              recipientName={config.recipientName}
              onComplete={() => setPhase("memories")}
            />
          </motion.section>
        )}

        {/* Page 3 onwards */}
        {phase === "memories" && (
          <motion.section
            key="memories"
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
          >
            {/* Photo memories */}
            <MemoryGallery gallery={config.gallery} />

            {/* Controlled transition */}
            <ScrollTransition />

            {/* Precious thing */}
            <PreciousThing
              name={config.recipientName}
              preciousThing={config.preciousThing}
              hasGift={Boolean(config.gift)}
              onFinalGift={handleShowFinalGift}
            />

            {/* Final gift */}
            {showFinalGift && config.gift && (
              <motion.div
                ref={finalGiftRef}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
              >
                <FinalGift gift={config.gift} />
              </motion.div>
            )}

            {/* Restart experience
                - No gift: shown after PreciousThing
                - Gift available: shown only after FinalGift
            */}
            {shouldShowRestart && (
              <section className="flex min-h-[45vh] flex-col items-center justify-center px-6 py-16 text-center">
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.4,
                  }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                >
                  <p className="text-sm text-white/40">
                    And that's everything I wanted to show you...
                  </p>

                  <motion.button
                    type="button"
                    onClick={handleRestart}
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="mt-5 inline-flex items-center gap-3 rounded-full border border-pink-200/20 bg-pink-200 px-7 py-4 text-sm font-medium text-[#2a1022] shadow-lg shadow-pink-400/20"
                  >
                    <span>Let's do it all again</span>

                    <motion.span
                      animate={{
                        rotate: [0, -180, -360],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      ↻
                    </motion.span>
                  </motion.button>
                </motion.div>
              </section>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
};

export default RomanticBirthday;