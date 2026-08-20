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

  return (
    <main className="relative min-h-screen overflow-hidden">
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
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
};

export default RomanticBirthday;