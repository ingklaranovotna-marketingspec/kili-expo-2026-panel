import { motion } from "framer-motion";
import { schedule } from "../data/suppliers";

// Timeline spans 9:00 – 13:00 = 240 minutes
const START_MIN = 9 * 60;
const END_MIN = 13 * 60;
const TOTAL = END_MIN - START_MIN;

function toMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
}
function pct(min: number) {
  return ((min - START_MIN) / TOTAL) * 100;
}

// Hour ticks: 9, 10, 11, 12, 13
const TICKS = [9, 10, 11, 12, 13];

// Colour palette for blocks
const BLOCK_COLORS = [
  { bg: "#e8f4e8", border: "#4caf50", text: "#1b5e20" },
  { bg: "#e3f0fb", border: "#1976d2", text: "#0d47a1" },
  { bg: "#fff3e0", border: "#f57c00", text: "#e65100" },
];

export default function Schedule() {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const isToday = now.getMonth() === 4 && now.getDate() === 26; // 26. 5.
  const nowPct = isToday ? Math.max(0, Math.min(100, pct(nowMin))) : null;

  // Separate blocks (have timeEnd) from milestones (single time + highlight)
  const blocks = schedule.filter((s) => s.timeEnd);
  const milestones = schedule.filter((s) => !s.timeEnd);

  // Compute per-block heights and cumulative top positions
  const blockHeights = blocks.map(item => item.items ? 92 : item.detail ? 78 : 62);
  const blockTops = blockHeights.map((_, i) =>
    blockHeights.slice(0, i).reduce((s, h) => s + h + 8, 0)
  );
  const trackHeight = blockHeights.reduce((s, h) => s + h + 8, 0) - 8;

  return (
    <div className="schedule-view">
      <div className="schedule-header">
        <h2 className="schedule-title">Program dne</h2>
        <span className="schedule-date">26. 5. 2026 · Kili Šlapanice</span>
      </div>

      <div className="timeline-wrap">
        {/* ── Ruler ────────────────────────────────── */}
        <div className="timeline-ruler">
          {TICKS.map((h) => (
            <div key={h} className="timeline-tick" style={{ left: `${pct(h * 60)}%` }}>
              <span>{h}:00</span>
            </div>
          ))}
        </div>

        {/* ── Track ────────────────────────────────── */}
        <div className="timeline-track" style={{ height: `${trackHeight}px` }}>
          {/* Hour grid lines */}
          {TICKS.map((h) => (
            <div key={h} className="timeline-grid-line" style={{ left: `${pct(h * 60)}%` }} />
          ))}

          {/* Blocks */}
          {blocks.map((item, i) => {
            const x = pct(toMin(item.time));
            const w = pct(toMin(item.timeEnd!)) - x;
            const c = BLOCK_COLORS[i % BLOCK_COLORS.length];
            return (
              <motion.div
                key={i}
                className="timeline-block"
                style={{
                  left: `${x}%`,
                  width: `${w}%`,
                  background: c.bg,
                  borderColor: c.border,
                  top: `${blockTops[i]}px`,
                  height: `${blockHeights[i]}px`,
                }}
                initial={{ opacity: 0, scaleX: 0.6 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: i * 0.1, duration: 0.35, ease: "easeOut" }}
              >
                <div className="timeline-block-label" style={{ color: c.text }}>
                  {item.event}
                </div>
                <div className="timeline-block-time" style={{ color: c.border }}>
                  {item.time} – {item.timeEnd}
                </div>
                {item.detail && (
                  <div className="timeline-block-detail">{item.detail}</div>
                )}
                {item.items && item.items.length > 0 && (
                  <ul className="timeline-block-items">
                    {item.items.map((it, j) => <li key={j}>{it}</li>)}
                  </ul>
                )}
              </motion.div>
            );
          })}

          {/* Current time indicator */}
          {nowPct !== null && (
            <div className="timeline-now" style={{ left: `${nowPct}%` }}>
              <div className="timeline-now-line" />
              <div className="timeline-now-dot" />
            </div>
          )}
        </div>

        {/* ── Milestones ───────────────────────────── */}
        <div className="timeline-milestones">
          {milestones.map((item, i) => {
            const x = pct(toMin(item.time));
            return (
              <motion.div
                key={i}
                className="timeline-milestone"
                style={{ left: `${x}%` }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="timeline-milestone-dot" />
                <div className="timeline-milestone-time">{item.time}</div>
                <div className="timeline-milestone-label">{item.event}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
