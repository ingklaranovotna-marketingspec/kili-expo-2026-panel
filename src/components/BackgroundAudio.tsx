import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function BackgroundAudio() {
  const audioRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  // Try autoplay on first user interaction with the page
  useEffect(() => {
    const tryPlay = () => {
      const el = audioRef.current;
      if (!el || playing) return;
      el.volume = 0.25;
      el.play().then(() => setPlaying(true)).catch(() => {});
    };

    document.addEventListener("click", tryPlay, { once: true });
    document.addEventListener("keydown", tryPlay, { once: true });

    // Also try immediately (works in some browsers)
    const el = audioRef.current;
    if (el) {
      el.volume = 0.25;
      el.play().then(() => setPlaying(true)).catch(() => {});
    }

    return () => {
      document.removeEventListener("click", tryPlay);
      document.removeEventListener("keydown", tryPlay);
    };
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.volume = 0.25;
      el.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      {/* Hidden video – only audio used */}
      <video
        ref={audioRef}
        src="/expo-pozvanky.mp4"
        loop
        playsInline
        onCanPlay={() => setReady(true)}
        style={{ display: "none" }}
      />

      {/* Floating toggle button */}
      {ready && (
        <motion.button
          className="audio-btn"
          onClick={toggle}
          title={playing ? "Ztlumit hudbu" : "Přehrát hudbu"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </motion.button>
      )}
    </>
  );
}
