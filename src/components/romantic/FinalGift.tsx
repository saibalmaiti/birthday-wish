import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { GiftConfig } from "../../types/birthday";

type FinalGiftProps = {
  gift: GiftConfig;
};

const FinalGift = ({ gift }: FinalGiftProps) => {
  const [revealed, setRevealed] = useState(false);
  const [pinVisible, setPinVisible] = useState(false);
  const [copiedField, setCopiedField] = useState<
    "CARD_NUMBER" | "PIN" | null
  >(null);

  const copyToClipboard = async (
    value: string,
    field: "CARD_NUMBER" | "PIN"
  ) => {
    try {
      await navigator.clipboard.writeText(value);

      setCopiedField(field);

      window.setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy gift card details:", error);
    }
  };

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-5 py-20 sm:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-300/10 blur-[140px]" />

      {/* Decorative flowers */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [-4, 3, -4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-[5%] top-[18%] text-4xl opacity-30 sm:left-[12%] sm:text-6xl"
      >
        🌸
      </motion.div>

      <motion.div
        animate={{
          y: [0, 12, 0],
          rotate: [3, -3, 3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute right-[5%] top-[28%] text-4xl opacity-30 sm:right-[12%] sm:text-6xl"
      >
        🌷
      </motion.div>

      <motion.div
        animate={{
          y: [0, -8, 0],
          rotate: [-2, 4, -2],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute bottom-[15%] left-[8%] text-3xl opacity-25 sm:left-[15%] sm:text-5xl"
      >
        🌼
      </motion.div>

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
              key="myntra-gift-revealed"
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
              {/* Main flower reveal */}
              <motion.div
                initial={{
                  scale: 0.5,
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.1,
                  duration: 0.7,
                  ease: "easeOut",
                }}
                className="mb-6 text-6xl"
              >
                💐
              </motion.div>

              {/* Myntra badge */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.2,
                  duration: 0.5,
                }}
                className="mx-auto inline-flex items-center gap-2 rounded-full border border-pink-200/20 bg-pink-200/[0.08] px-4 py-2"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-pink-400 via-orange-300 to-yellow-300 text-xs font-bold text-[#2a1022]">
                  m
                </span>

                <span className="text-xs font-medium tracking-[0.15em] text-pink-100">
                  MYNTRA
                </span>
              </motion.div>

              <p className="mt-5 text-xs uppercase tracking-[0.3em] text-pink-200/60">
                A little something for you
              </p>

              <h2 className="mt-4 text-3xl font-light text-white sm:text-4xl">
                Pick something
                <br />
                <span className="italic text-pink-200">
                  you really like.
                </span>
              </h2>

              {/* Actual Myntra gift card */}
              <motion.div
                initial={{
                  opacity: 0,
                  rotate: -4,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  rotate: 0,
                  y: 0,
                }}
                transition={{
                  delay: 0.3,
                  duration: 0.7,
                  ease: "easeOut",
                }}
                className="relative mt-8 overflow-hidden rounded-3xl border border-white/15 bg-white/[0.04] p-3 shadow-2xl shadow-black/20 backdrop-blur-md"
              >
                <div className="pointer-events-none absolute -left-5 -top-5 text-4xl opacity-50">
                  🌸
                </div>

                <div className="pointer-events-none absolute -bottom-4 -right-4 text-5xl opacity-40">
                  🌷
                </div>

                <img
                  src={gift.cardImageSrc}
                  alt="Myntra Gift Card"
                  className="relative z-10 w-full rounded-2xl object-cover"
                />
              </motion.div>

              {/* Gift details */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.45,
                  duration: 0.6,
                }}
                className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-5 text-left backdrop-blur-md sm:p-6"
              >
                {/* Card number */}
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Gift card number
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          gift.giftCardNumber,
                          "CARD_NUMBER"
                        )
                      }
                      className="rounded-full border border-pink-200/15 px-3 py-1.5 text-xs text-pink-100/80 transition hover:bg-pink-200/10"
                    >
                      {copiedField === "CARD_NUMBER"
                        ? "Copied ✓"
                        : "Copy"}
                    </button>
                  </div>

                  <p className="mt-3 break-all rounded-xl border border-pink-200/10 bg-black/10 px-4 py-3 font-mono text-sm tracking-wider text-pink-100">
                    {gift.giftCardNumber}
                  </p>
                </div>

                <div className="my-5 h-px bg-white/10" />

                {/* PIN */}
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      PIN
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setPinVisible(
                            (previous) => !previous
                          )
                        }
                        className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60 transition hover:bg-white/5"
                      >
                        {pinVisible
                          ? "Hide"
                          : "Reveal"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            gift.pin,
                            "PIN"
                          )
                        }
                        className="rounded-full border border-pink-200/15 px-3 py-1.5 text-xs text-pink-100/80 transition hover:bg-pink-200/10"
                      >
                        {copiedField === "PIN"
                          ? "Copied ✓"
                          : "Copy"}
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 rounded-xl border border-pink-200/10 bg-black/10 px-4 py-3 font-mono text-sm tracking-[0.3em] text-pink-100">
                    {pinVisible
                      ? gift.pin
                      : "••••"}
                  </p>
                </div>
              </motion.div>

              {/* Add to account button */}
              {gift.addToAccountUrl && (
                <motion.a
                  href={gift.addToAccountUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.6,
                    duration: 0.5,
                  }}
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-pink-200 px-6 py-4 text-sm font-medium text-[#2a1022] shadow-lg shadow-pink-400/20"
                >
                  Add to My Myntra Account
                  <span>↗</span>
                </motion.a>
              )}

              {/* Shop button */}
              <motion.a
                href="https://www.myntra.com"
                target="_blank"
                rel="noopener noreferrer"
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: gift.addToAccountUrl
                    ? 0.68
                    : 0.6,
                  duration: 0.5,
                }}
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-4 text-sm text-white/75 transition hover:bg-white/[0.08]"
              >
                Shop on Myntra
                <span>↗</span>
              </motion.a>

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
                  duration: 0.7,
                }}
                className="mx-auto mt-8 max-w-sm text-sm leading-7 text-white/55"
              >
                {gift.revealMessage}
              </motion.p>

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: 1,
                  duration: 0.5,
                }}
                className="mt-5 text-3xl"
              >
                🌸 💝 🌷
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </section>
  );
};

export default FinalGift;