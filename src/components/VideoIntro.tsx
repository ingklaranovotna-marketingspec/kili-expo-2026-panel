import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

export default function VideoIntro() {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // useEffect se spustí po render – video element už existuje v DOM
  useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [open]);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    videoRef.current?.pause();
    setOpen(false);
  }

  return (
    <>
      <motion.button
        className="video-trigger"
        onClick={handleOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        <Play size={18} fill="currentColor" />
        <span>Pozvánka na EXPO</span>
      </motion.button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="video-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            >
              <motion.div
                className="video-wrapper"
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.88, opacity: 0 }}
                transition={{ type: "spring", damping: 22, stiffness: 280 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="video-close-btn" onClick={handleClose}>
                  <X size={20} />
                </button>
                <video
                  ref={videoRef}
                  src={import.meta.env.BASE_URL + "expo_pozyvanka.mp4"}
                  controls
                  className="video-player"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
