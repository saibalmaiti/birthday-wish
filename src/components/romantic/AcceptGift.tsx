import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";

const MESSAGES = [
  "Would you like to accept it?",
  "Hey... where do you think you're going? 😏",
  "Nice try. That wasn't really an option.",
  "Okay, just press Yes already 🙄❤️",
  "You know you want to ❤️",
];

const NO_BUTTON_WIDTH = 72;
const NO_BUTTON_HEIGHT = 48;

const BUTTON_GAP = 28;
const VIEWPORT_PADDING = 24;
const ESCAPE_DISTANCE = 75;
const ESCAPE_COOLDOWN = 500;

type Position = {
  x: number;
  y: number;
};

type AcceptGiftProps = {
  onAccept: () => void;
};

const AcceptGift = ({ onAccept }: AcceptGiftProps) => {
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  // Prevent multiple escape events from firing at once
  const isEscapingRef = useRef(false);

  const [attempts, setAttempts] = useState(0);

  const [noPosition, setNoPosition] = useState<Position>({
    x: 0,
    y: 0,
  });

  const [isPositionReady, setIsPositionReady] = useState(false);

  /*
   * Initial position:
   * No starts beside Yes.
   *
   * The invisible placeholder in the JSX keeps
   * Yes + No centered as one complete group.
   */
  const setInitialPosition = useCallback(() => {
    const yesButton = yesButtonRef.current;

    if (!yesButton) return;

    const yesRect = yesButton.getBoundingClientRect();

    setNoPosition({
      x: yesRect.right + BUTTON_GAP,
      y: yesRect.top + yesRect.height / 2 - NO_BUTTON_HEIGHT / 2,
    });

    setIsPositionReady(true);
  }, []);

  useLayoutEffect(() => {
    const animationFrame = requestAnimationFrame(setInitialPosition);

    window.addEventListener("resize", setInitialPosition);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", setInitialPosition);
    };
  }, [setInitialPosition]);

  /*
   * Move No to a random safe location.
   */
  const moveNoButton = useCallback(() => {
    // Prevent multiple triggers while the button is escaping
    if (isEscapingRef.current) return;

    isEscapingRef.current = true;

    const yesButton = yesButtonRef.current;

    if (!yesButton) {
      isEscapingRef.current = false;
      return;
    }

    const yesRect = yesButton.getBoundingClientRect();

    let newX = noPosition.x;
    let newY = noPosition.y;

    for (let i = 0; i < 100; i++) {
      const candidateX =
        VIEWPORT_PADDING +
        Math.random() *
          (window.innerWidth -
            NO_BUTTON_WIDTH -
            VIEWPORT_PADDING * 2);

      const candidateY =
        VIEWPORT_PADDING +
        Math.random() *
          (window.innerHeight -
            NO_BUTTON_HEIGHT -
            VIEWPORT_PADDING * 2);

      const candidateRight = candidateX + NO_BUTTON_WIDTH;
      const candidateBottom = candidateY + NO_BUTTON_HEIGHT;

      // Protected area around Yes
      const SAFE_GAP = 30;

      const overlapsYes =
        candidateX < yesRect.right + SAFE_GAP &&
        candidateRight > yesRect.left - SAFE_GAP &&
        candidateY < yesRect.bottom + SAFE_GAP &&
        candidateBottom > yesRect.top - SAFE_GAP;

      // Don't allow No into the upper content area
      const tooHigh = candidateY < window.innerHeight * 0.32;

      if (!overlapsYes && !tooHigh) {
        newX = candidateX;
        newY = candidateY;
        break;
      }
    }

    setNoPosition({
      x: newX,
      y: newY,
    });

    // One successful escape = one message change
    setAttempts((previous) => previous + 1);

    // Unlock after the movement begins
    window.setTimeout(() => {
      isEscapingRef.current = false;
    }, ESCAPE_COOLDOWN);
  }, [noPosition]);

  /*
   * Global mouse tracking.
   * No escapes when the cursor gets close.
   */
  useEffect(() => {
    if (!isPositionReady) return;

    const handleMouseMove = (event: MouseEvent) => {
      const noButton = noButtonRef.current;

      if (!noButton || isEscapingRef.current) return;

      const rect = noButton.getBoundingClientRect();

      // Find closest point on the button to the cursor
      const closestX = Math.max(
        rect.left,
        Math.min(event.clientX, rect.right)
      );

      const closestY = Math.max(
        rect.top,
        Math.min(event.clientY, rect.bottom)
      );

      const distance = Math.hypot(
        event.clientX - closestX,
        event.clientY - closestY
      );

      if (distance < ESCAPE_DISTANCE) {
        moveNoButton();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isPositionReady, moveNoButton]);

  const handleAccept = () => {
    onAccept();
  };

  const messageIndex = Math.min(
    attempts,
    MESSAGES.length - 1
  );

  return (
    <div className="mt-12 w-full">
      {/* Dynamic message */}
      <motion.p
        key={messageIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8 text-lg text-white/80"
      >
        {MESSAGES[messageIndex]}
      </motion.p>

      {/* Centered Yes + No group */}
      <div className="flex items-center justify-center gap-7">
        {/* YES */}
        <motion.button
          ref={yesButtonRef}
          type="button"
          onClick={handleAccept}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="relative z-10 h-12 w-[178px] rounded-full bg-pink-200 text-sm font-medium text-[#2a1022] shadow-lg shadow-pink-400/20 hover:shadow-pink-300/40"
        >
          Yes, of course ❤️
        </motion.button>

        {/* Invisible placeholder for initial No position */}
        <div
          className="h-12 w-[72px]"
          aria-hidden="true"
        />
      </div>

      {/* Actual NO */}
      {isPositionReady && (
        <motion.button
          ref={noButtonRef}
          type="button"
          onPointerDown={moveNoButton}
          animate={{
            left: noPosition.x,
            top: noPosition.y,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 28,
          }}
          className="fixed z-50 h-12 w-[72px] rounded-full border border-white/15 bg-white/5 text-sm text-white/70 backdrop-blur-sm"
        >
          No
        </motion.button>
      )}
    </div>
  );
};

export default AcceptGift;