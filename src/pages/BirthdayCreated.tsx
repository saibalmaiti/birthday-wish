import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const BirthdayCreated = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);

  const shareUrl = slug
    ? `${window.location.origin}/b/${slug}`
    : "";

  const handleCopy = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Could not copy link:", error);
    }
  };

  const handleShare = async () => {
    if (!shareUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "A little birthday surprise 🎁",
          text: "I have something special for you :)",
          url: shareUrl,
        });
      } catch (error) {
        // User cancelling the share dialog is not an actual error
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("Could not share link:", error);
      }
    } else {
      await handleCopy();
    }
  };

  const handleDemo = () => {
    if (!slug) return;

    navigate(`/b/${slug}`);
  };

  const handleEdit = () => {
    if (!slug) return;

    navigate(`/edit/${slug}`);
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-5 py-12 sm:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-pink-400/10 blur-[140px]" />

      <motion.section
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-10"
      >
        {/* Success */}
        <div className="text-center">
          <motion.div
            initial={{
              scale: 0,
              rotate: -30,
            }}
            animate={{
              scale: 1,
              rotate: 0,
            }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 180,
              damping: 14,
            }}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-pink-200/30 bg-pink-200/10 text-2xl"
          >
            ✓
          </motion.div>

          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-pink-200/60">
            It's ready
          </p>

          <h1 className="mt-3 text-3xl font-light text-white sm:text-4xl">
            Your birthday surprise
            <br />
            <span className="italic text-pink-200">
              is ready to share.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-white/50">
            The link is ready. You can preview everything,
            make changes if needed, and then share it when
            the time feels right.
          </p>
        </div>

        {/* Share link */}
        <div className="mt-10">
          <p className="mb-3 text-sm text-white/60">
            Your shareable link
          </p>

          <div className="flex overflow-hidden rounded-xl border border-white/10 bg-black/20">
            <input
              value={shareUrl}
              readOnly
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white/60 outline-none"
            />

            <button
              type="button"
              onClick={handleCopy}
              className="border-l border-white/10 px-4 text-sm text-pink-200 transition hover:bg-white/5"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Main actions */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-xl bg-pink-200 px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-pink-100"
          >
            Share surprise
          </button>

          <button
            type="button"
            onClick={handleDemo}
            className="rounded-xl border border-pink-200/20 bg-pink-200/5 px-5 py-3 text-sm text-pink-100 transition hover:bg-pink-200/10"
          >
            Open demo →
          </button>
        </div>

        {/* Edit section */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-white/75">
                Want to change something?
              </p>

              <p className="mt-1 text-xs text-white/35">
                You can still edit the messages, photos, or gift.
              </p>
            </div>

            <button
              type="button"
              onClick={handleEdit}
              className="shrink-0 rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/70 transition hover:border-pink-200/30 hover:text-pink-100"
            >
              Edit surprise
            </button>
          </div>
        </div>

        {/* Final confirmation */}
        <motion.button
          type="button"
          onClick={handleDemo}
          whileHover={{
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.98,
          }}
          className="mt-8 w-full rounded-full border border-pink-200/20 bg-pink-200/10 px-6 py-4 text-sm text-pink-100 transition hover:bg-pink-200/20"
        >
          Looks good, I'm done ♡
        </motion.button>
      </motion.section>
    </main>
  );
};

export default BirthdayCreated;