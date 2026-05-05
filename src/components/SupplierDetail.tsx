import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Package, Sparkles, Image } from "lucide-react";
import type { Supplier } from "../data/suppliers";

interface Props {
  supplier: Supplier | null;
  onClose: () => void;
}

export default function SupplierDetail({ supplier, onClose }: Props) {
  return createPortal(
    <AnimatePresence>
      {supplier && (
        <motion.div
          className="detail-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="detail-panel"
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 30 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button – always visible top-right */}
            <button className="detail-close" onClick={onClose}>
              <X size={26} />
            </button>

            <div className="detail-layout">
              {/* Left column */}
              <div className="detail-left" style={{ borderColor: supplier.color }}>
                <div className="detail-logo-box" style={{ borderColor: supplier.color }}>
                  <img
                    src={import.meta.env.BASE_URL + supplier.logo.replace(/^\//, '')}
                    alt={supplier.name}
                    className="detail-logo-img"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = "none";
                      (el.nextElementSibling as HTMLElement).style.display = "flex";
                    }}
                  />
                  <div className="detail-logo-fallback" style={{ background: supplier.color }}>
                    {supplier.shortName}
                  </div>
                </div>

                <div className="detail-location-badge" style={{ background: `${supplier.color}22`, borderColor: supplier.color }}>
                  <MapPin size={16} />
                  <span>{supplier.location}</span>
                </div>

                <div className="detail-meta-list">
                  <div className="detail-meta-row">
                    <Package size={15} />
                    <div>
                      <div className="meta-label">Prostor</div>
                      <div className="meta-value">{supplier.space}</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right column */}
              <div className="detail-right">
                <h2 className="detail-name">{supplier.name}</h2>
                <p className="detail-description">{supplier.description}</p>

                <div className="detail-novelties">
                  <div className="novelties-heading">
                    <Sparkles size={20} style={{ color: supplier.color }} />
                    <span>Novinky na EXPO 2026</span>
                  </div>
                  <div className="novelties-grid">
                    {supplier.novelties.map((item, i) => (
                      <motion.div
                        key={i}
                        className="novelty-card"
                        style={{ borderLeftColor: supplier.color }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                      >
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {supplier.productImages && supplier.productImages.length > 0 && (
                  <div className="detail-images">
                    <div className="novelties-heading">
                      <Image size={20} style={{ color: supplier.color }} />
                      <span>Fotogalerie</span>
                    </div>
                    <div className="product-images-grid">
                      {supplier.productImages.map((src, i) => (
                        <motion.img
                          key={i}
                          src={src}
                          alt={`${supplier.shortName} – produkt ${i + 1}`}
                          className="product-image"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
