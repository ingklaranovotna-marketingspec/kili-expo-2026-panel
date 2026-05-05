import { useState } from "react";
import type { Supplier } from "../data/suppliers";

interface Props {
  suppliers: Supplier[];
  onSelect: (supplier: Supplier) => void;
}

interface SpecialArea {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

// Souřadnice rotovány 90° CCW z PDF mapy, viewBox "0 0 825 415"
// new_x = old_y−15,  new_y = 510−old_x−old_w,  new_w = old_h,  new_h = old_w
const SPECIAL_AREAS: SpecialArea[] = [
  // Motorky – ohraničeno průchodními uličkami (y=130–234), nezasahuje do uliček
  { id: "motorky",   label: "Motorky",             icon: "🏍️", x: 435, y: 130, w:  80, h: 104, color: "#7C3AED" },
  { id: "podium",    label: "Pódium",              icon: "🎤", x: 572, y: 156, w:  40, h:  78, color: "#7C3AED" },
  { id: "rcauta",    label: "RC auta",             icon: "🏎️", x: 572, y: 234, w:  40, h:  40, color: "#D97706" },
  { id: "catering1", label: "Catering",            icon: "🍽️", x: 669, y: 342, w:  53, h:  57, color: "#D97706" },
  { id: "catering2", label: "Catering & posezení", icon: "🍽️", x: 735, y: 251, w:  65, h: 148, color: "#D97706" },
];

export default function FloorMap({ suppliers, onSelect }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const validSuppliers = suppliers.filter((s) => s.mapWidth > 0 && s.mapHeight > 0);

  return (
    <div className="floor-map-svg-wrap">
      <svg
        viewBox="0 0 825 415"
        xmlns="http://www.w3.org/2000/svg"
        className="floor-map-svg"
      >
        <defs>
          <filter id="booth-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="hatch-event" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#7C3AED22" strokeWidth="3" />
          </pattern>
          <pattern id="hatch-catering" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#D9770625" strokeWidth="3" />
          </pattern>
          <marker id="vstup-arrow" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#c77800" />
          </marker>
        </defs>

        {/* ── Pozadí budovy ─────────────────────────────────────────────── */}
        <rect x="7" y="11" width="804" height="395"
          fill="#ffffff" stroke="#c0c0c0" strokeWidth="1.5" rx="4" />

        {/* Jemná mřížka uliček */}
        {/* Horizontální oddělovače řad */}
        <line x1="9"   y1="78"  x2="434" y2="78"  stroke="#d0d0d0" strokeWidth="0.8" strokeDasharray="4 3" />
        <line x1="9"   y1="129" x2="434" y2="129" stroke="#d0d0d0" strokeWidth="0.8" strokeDasharray="4 3" />
        <line x1="9"   y1="182" x2="434" y2="182" stroke="#d0d0d0" strokeWidth="0.8" strokeDasharray="4 3" />
        <line x1="9"   y1="237" x2="434" y2="237" stroke="#d0d0d0" strokeWidth="0.8" strokeDasharray="4 3" />
        <line x1="9"   y1="307" x2="434" y2="307" stroke="#c8c8c8" strokeWidth="1"   strokeDasharray="4 3" />

        {/* Vertikální oddělovač – za hlavní halou */}
        <line x1="434" y1="11" x2="434" y2="406" stroke="#b8b8b8" strokeWidth="1.2" strokeDasharray="6 3" />

        {/* Oddělovač pravé sekce od středu */}
        <line x1="608" y1="11" x2="608" y2="406" stroke="#c0c0c0" strokeWidth="0.8" strokeDasharray="4 3" />

        {/* ── Popisky sekcí ─────────────────────────────────────────────── */}
        <text x="215" y="9" textAnchor="middle" fill="#999" fontSize="6" fontFamily="system-ui,sans-serif" letterSpacing="1">
          HLAVNÍ HALA
        </text>
        <text x="520" y="9" textAnchor="middle" fill="#999" fontSize="6" fontFamily="system-ui,sans-serif" letterSpacing="1">
          AKČNÍ ZÓNA
        </text>
        <text x="716" y="9" textAnchor="middle" fill="#999" fontSize="6" fontFamily="system-ui,sans-serif" letterSpacing="1">
          EXPOZICE
        </text>

        {/* Popisky řad */}
        <text x="5" y="52"  textAnchor="end" fill="#aaa" fontSize="5.5" fontFamily="system-ui,sans-serif" transform="rotate(-90,5,52)">ŘAD A</text>
        <text x="5" y="155" textAnchor="end" fill="#aaa" fontSize="5.5" fontFamily="system-ui,sans-serif" transform="rotate(-90,5,155)">ŘAD B</text>
        <text x="5" y="208" textAnchor="end" fill="#aaa" fontSize="5.5" fontFamily="system-ui,sans-serif" transform="rotate(-90,5,208)">ŘAD C</text>
        <text x="5" y="350" textAnchor="end" fill="#aaa" fontSize="5.5" fontFamily="system-ui,sans-serif" transform="rotate(-90,5,350)">ŘAD D</text>

        {/* ── Průchod VSTUP – mezi Blumem (y=311) a Kronospan řadou (y=234) ── */}
        {/* Zvýraznění průchodu */}
        <rect x="7" y="234" width="50" height="77"
          fill="#c7780010" stroke="#c7780040" strokeWidth="1" strokeDasharray="3 3" rx="2" />
        {/* Šipka a popis */}
        <text x="32" y="272" textAnchor="middle" fill="#c77800" fontSize="7"
          fontFamily="system-ui,sans-serif" fontWeight="700" letterSpacing="0.5">
          VSTUP
        </text>
        <text x="32" y="283" textAnchor="middle" fill="#c77800" fontSize="9">→</text>

        {/* ── Speciální plochy ──────────────────────────────────────────── */}
        {SPECIAL_AREAS.map((area) => (
          <g key={area.id}>
            <rect
              x={area.x} y={area.y} width={area.w} height={area.h}
              fill={area.id.startsWith("catering") ? "url(#hatch-catering)" : "url(#hatch-event)"}
              stroke={`${area.color}60`}
              strokeWidth="1"
              strokeDasharray="4 3"
              rx="3"
            />
            <text
              x={area.x + area.w / 2}
              y={area.y + area.h / 2 - (area.h > 60 ? 9 : 4)}
              textAnchor="middle" fontSize={area.h > 60 ? "14" : "11"} fontFamily="system-ui"
            >
              {area.icon}
            </text>
            <text
              x={area.x + area.w / 2}
              y={area.y + area.h / 2 + (area.h > 60 ? 11 : 9)}
              textAnchor="middle" fill={area.color} fontSize="6"
              fontFamily="system-ui,sans-serif" fontWeight="600"
            >
              {area.label}
            </text>
          </g>
        ))}

        {/* ── Stánky dodavatelů ─────────────────────────────────────────── */}
        {validSuppliers.map((s) => {
          const hovered = hoveredId === s.id;
          const pad = 3;
          const logoW = s.mapWidth - pad * 2;
          const logoH = s.mapHeight - pad * 2 - 10;

          return (
            <g
              key={s.id}
              onClick={() => onSelect(s)}
              onMouseEnter={() => setHoveredId(s.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ cursor: "pointer" }}
              filter={hovered ? "url(#booth-glow)" : undefined}
            >
              {/* Booth pozadí */}
              <rect
                x={s.mapX} y={s.mapY}
                width={s.mapWidth} height={s.mapHeight}
                fill={hovered ? `${s.color}22` : `${s.color}0e`}
                stroke={hovered ? s.color : `${s.color}88`}
                strokeWidth={hovered ? 2 : 1.2}
                rx="3"
                style={{ transition: "fill 0.15s, stroke 0.15s, stroke-width 0.15s" }}
              />

              {/* Logo */}
              {s.logo ? (
                <image
                  href={import.meta.env.BASE_URL + s.logo.replace(/^\//, '')}
                  x={s.mapX + pad}
                  y={s.mapY + pad}
                  width={logoW}
                  height={logoH}
                  preserveAspectRatio="xMidYMid meet"
                />
              ) : (
                <rect
                  x={s.mapX + pad} y={s.mapY + pad}
                  width={logoW} height={logoH}
                  fill={`${s.color}25`} rx="2"
                />
              )}

              {/* Jmenovka */}
              <text
                x={s.mapX + s.mapWidth / 2}
                y={s.mapY + s.mapHeight - 3}
                textAnchor="middle"
                fill={hovered ? s.color : "#444"}
                fontSize={s.mapWidth < 55 ? 5.5 : 6}
                fontFamily="system-ui,sans-serif"
                fontWeight={hovered ? "700" : "500"}
                style={{ transition: "fill 0.15s" }}
              >
                {s.shortName}
              </text>

              {/* Tooltip */}
              {hovered && (() => {
                const ttW = 165;
                const ttH = 52;
                // Show below only when the booth bottom is in the upper quarter
                // (no adjacent row below) AND fits within SVG height
                const bottom = s.mapY + s.mapHeight;
                const isRightSection = s.mapX >= 600;

                let ty: number;
                if (isRightSection && s.mapY < 50 && s.mapHeight > 100) {
                  // BLANCO: tall booth, no room outside SVG → show inside booth near top
                  ty = s.mapY + 8;
                } else if (isRightSection) {
                  // Egger, Kooplast: plenty of space below (empty until y=415)
                  ty = bottom + 3;
                } else {
                  // Main hall: Row A (bottom < 120) and Row C (mapY 180-260) → below, others → above
                  const hasRoomBelow =
                    (bottom < 120) ||
                    (s.mapY >= 180 && s.mapY < 260 && bottom + ttH + 4 < 307);
                  ty = hasRoomBelow ? bottom + 3 : s.mapY - ttH - 3;
                }
                const tx = Math.min(Math.max(s.mapX - 8, 8), 825 - ttW - 8);
                return (
                  <g style={{ pointerEvents: "none" }}>
                    <rect x={tx} y={ty} width={ttW} height={ttH}
                      fill="white" stroke={s.color} strokeWidth="1.5" rx="4"
                      style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.18))" }}
                    />
                    <text x={tx + 8} y={ty + 15} fill={s.color}
                      fontSize="8.5" fontFamily="system-ui,sans-serif" fontWeight="700">
                      {s.shortName}
                    </text>
                    <text x={tx + 8} y={ty + 28} fill="#555"
                      fontSize="7" fontFamily="system-ui,sans-serif">
                      {s.location}
                    </text>
                    <text x={tx + 8} y={ty + 42} fill="#999"
                      fontSize="6.5" fontFamily="system-ui,sans-serif">
                      Klikni pro detail →
                    </text>
                  </g>
                );
              })()}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
