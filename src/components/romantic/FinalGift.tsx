import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { GiftConfig } from "../../types/birthday";

type FinalGiftProps = {
  gift: GiftConfig;
};

const FinalGift = ({ gift }: FinalGiftProps) => {
  const [revealed, setRevealed] = useState(false);

  const isOrder = gift.type === "ORDER";

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-5 py-20 sm:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-300/10 blur-[140px]" />

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.9,
          ease: "easeOut",
        }}
        className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center text-center"
      >
        {!revealed ? (
          <>
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-7xl"
            >
              🎁
            </motion.div>

            <p className="mt-8 text-xs uppercase tracking-[0.3em] text-pink-200/60">
              One last thing
            </p>

            <h2 className="mt-4 text-3xl font-light text-white sm:text-4xl">
              There is still
              <br />
              <span className="italic text-pink-200">
                something waiting.
              </span>
            </h2>

            <p className="mt-6 text-sm leading-7 text-white/55 sm:text-base">
              {gift.message}
            </p>

            <motion.button
              type="button"
              onClick={() => setRevealed(true)}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="mt-10 rounded-full bg-pink-200 px-8 py-4 text-sm font-medium text-[#2a1022] shadow-lg shadow-pink-400/20"
            >
              Open your gift 🎁
            </motion.button>
          </>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="gift-revealed"
              initial={{
                opacity: 0,
                scale: 0.85,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className="w-full"
            >
              {/* Bouquet decoration */}
              <motion.div
                initial={{
                  scale: 0.7,
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.15,
                  duration: 0.7,
                  ease: "easeOut",
                }}
                className="mb-7 text-7xl"
              >
                💐
              </motion.div>

              {isOrder ? (
                <>
                  <p className="text-xs uppercase tracking-[0.3em] text-pink-200/60">
                    A little something is on its way
                  </p>

                  <h2 className="mt-4 text-3xl font-light text-white sm:text-4xl">
                    Your surprise
                    <br />
                    <span className="italic text-pink-200">
                      is coming.
                    </span>
                  </h2>

                  <div className="mt-9 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-left backdrop-blur-md">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-200/10 text-xl">
                        🚚
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                          Expected delivery
                        </p>

                        <p className="mt-2 text-lg text-pink-100">
                          {gift.expectedDeliveryDate}
                        </p>
                      </div>
                    </div>

                    <div className="my-5 h-px bg-white/10" />

                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                        Order reference
                      </p>

                      <p className="mt-2 font-mono text-sm text-white/65">
                        {gift.orderId}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-[0.3em] text-pink-200/60">
                    Something just for you
                  </p>

                  <h2 className="mt-4 text-3xl font-light text-white sm:text-4xl">
                    Your gift
                    <br />
                    <span className="italic text-pink-200">
                      is ready.
                    </span>
                  </h2>

                  <div className="mt-9 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
                    {gift.giftCardCode && (
                      <>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                          Gift code
                        </p>

                        <p className="mt-3 break-all rounded-xl border border-pink-200/10 bg-black/10 px-4 py-3 font-mono text-base tracking-wider text-pink-100">
                          {gift.giftCardCode}
                        </p>
                      </>
                    )}

                    {gift.giftCardUrl && (
                      <a
                        href={gift.giftCardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex rounded-full bg-pink-200 px-6 py-3 text-sm font-medium text-[#2a1022] transition hover:scale-105"
                      >
                        Open your gift ✨
                      </a>
                    )}

                    {!gift.giftCardCode && !gift.giftCardUrl && (
                      <p className="text-sm text-white/50">
                        Your gift details will be here soon.
                      </p>
                    )}
                  </div>
                </>
              )}

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
                  delay: 0.7,
                  duration: 0.7,
                }}
                className="mx-auto mt-8 max-w-sm text-sm leading-7 text-white/55"
              >
                {gift.revealMessage}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </section>
  );
};

export default FinalGift;