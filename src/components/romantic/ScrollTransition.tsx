import { motion } from "framer-motion";

const ScrollTransition = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.6,
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
        className="flex flex-col items-center text-center"
      >
        <p className="text-sm tracking-wide text-white/40">
          A little bit more...
        </p>

        <motion.div
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mt-6 text-xl text-pink-200/60"
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ScrollTransition;