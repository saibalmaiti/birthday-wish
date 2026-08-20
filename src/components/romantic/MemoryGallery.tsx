import { motion } from "framer-motion";

import type { BirthdayConfig } from "../../types/birthday";

type MemoryGalleryProps = {
  gallery: BirthdayConfig["gallery"];
};

const MemoryGallery = ({ gallery }: MemoryGalleryProps) => {
  const { heading, highlightedText, description, photos } = gallery;

  return (
    <section className="relative min-h-screen w-full overflow-hidden px-5 py-20 sm:px-8">
      {/* Heading */}
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        className="mx-auto mb-16 max-w-md text-center"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-pink-200/60">
          A small collection
        </p>

        <h2 className="mt-4 text-3xl font-light text-white sm:text-4xl">
          {heading}
          <br />
          <span className="italic text-pink-200">
            {highlightedText}
          </span>
        </h2>

        <p className="mt-5 text-sm leading-6 text-white/50">
          {description}
        </p>
      </motion.div>

      {/* Photo gallery */}
      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 sm:gap-20">
        {Array.from({
          length: Math.ceil(photos.length / 2),
        }).map((_, rowIndex) => {
          const rowPhotos = photos.slice(
            rowIndex * 2,
            rowIndex * 2 + 2
          );

          return (
            <div
              key={rowIndex}
              className="relative"
            >
              {/* Hanging string */}
              <div className="absolute left-0 right-0 top-0 h-px bg-white/15" />

              {/* Photos */}
              <div className="grid grid-cols-1 gap-14 pt-5 sm:grid-cols-2 sm:gap-24">
                {rowPhotos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{
                      opacity: 0,
                      y: 60,
                      rotate: photo.rotation,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      rotate: photo.rotation,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.15,
                      ease: "easeOut",
                    }}
                    className="flex justify-center"
                  >
                    {/* Hanging point + photo */}
                    <div className="relative pt-8">
                      {/* String from main line */}
                      <div className="absolute left-1/2 top-0 h-8 w-px -translate-x-1/2 bg-white/20" />

                      {/* Clip */}
                      <div className="absolute left-1/2 top-6 z-10 h-3 w-7 -translate-x-1/2 rounded-sm bg-pink-200/70 shadow-sm" />

                      {/* Instax card */}
                      <motion.article
                        animate={{
                          rotate: [
                            photo.rotation,
                            photo.rotation + 1,
                            photo.rotation - 1,
                            photo.rotation,
                          ],
                        }}
                        transition={{
                          duration: 5 + index,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-[240px] bg-[#fdfbf7] p-3 pb-14 shadow-2xl shadow-black/30 sm:w-[270px]"
                      >
                        <div className="aspect-square w-full overflow-hidden bg-neutral-200">
                          <img
                            src={photo.src}
                            alt={photo.caption || "Birthday gallery"}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {photo.caption && (
                          <p className="mt-4 text-center font-serif text-sm text-neutral-600">
                            {photo.caption}
                          </p>
                        )}
                      </motion.article>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom text */}
      <motion.div
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
          duration: 1,
        }}
        className="mt-20 pb-10 text-center text-sm text-white/35"
      >
        <p>There is something more, scroll down a little</p>

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

export default MemoryGallery;