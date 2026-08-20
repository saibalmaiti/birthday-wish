import { motion } from "framer-motion";

import type { BirthdayConfig } from "../../types/birthday";

type PreciousThingProps = {
  name: string;
  preciousThing: BirthdayConfig["preciousThing"];
  hasGift: boolean;
  onFinalGift: () => void;
};

const PreciousThing = ({
  name,
  preciousThing,
  hasGift,
  onFinalGift,
}: PreciousThingProps) => {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-5 py-20 sm:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-300/8 blur-[140px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-12 md:grid md:grid-cols-2 md:gap-16">
        {/* Text section */}
        <motion.div
          initial={{
            opacity: 0,
            x: -30,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
          className="order-2 max-w-md text-center md:order-1 md:text-left"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-pink-200/60">
            {preciousThing.label}
          </p>

          <h2 className="mt-5 text-3xl font-light leading-tight text-white sm:text-5xl">
            The most precious thing
            <br />
            about you is your{" "}
            <span className="italic text-pink-200">
              {preciousThing.thing}.
            </span>
          </h2>

          <p className="mt-7 text-sm leading-7 text-white/55 sm:text-base">
            {preciousThing.compliment}
          </p>

          <motion.p
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.8,
              duration: 0.8,
            }}
            className="mt-8 text-sm text-pink-200/70"
          >
            So {name}, take good care of it.
          </motion.p>

          {/* Final gift trigger */}
          {hasGift && (<motion.button
            type="button"
            onClick={onFinalGift}
            initial={{
              opacity: 0,
              y: 15,
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
              delay: 1.1,
              duration: 0.7,
            }}
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="mt-8 rounded-full border border-pink-200/20 bg-pink-200/10 px-7 py-3.5 text-sm text-pink-100 shadow-lg shadow-pink-400/5 backdrop-blur-sm transition hover:bg-pink-200/20"
          >
            One last thing 🎁
          </motion.button>
          )}
        </motion.div>

        {/* Photo section */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
          className="order-1 flex w-full justify-center md:order-2"
        >
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute -inset-6 rounded-[2rem] bg-pink-300/10 blur-2xl" />

            {/* Photo frame */}
            <motion.div
              animate={{
                y: [0, -5, 0],
                rotate: [-1, 1, -1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-[260px] rotate-[-1deg] bg-[#fdfbf7] p-3 pb-16 shadow-2xl shadow-black/40 sm:w-[320px]"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-neutral-200">
                <img
                  src={preciousThing.imageSrc}
                  alt={`${name}'s ${preciousThing.thing}`}
                  className="h-full w-full object-cover"
                />
              </div>

              <p className="mt-5 text-center font-serif text-lg text-neutral-600">
                that {preciousThing.thing} :)
              </p>
            </motion.div>

            {/* Decorative heart */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-3 -left-4 text-2xl"
            >
              ♡
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PreciousThing;