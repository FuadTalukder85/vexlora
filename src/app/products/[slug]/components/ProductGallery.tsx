"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X, Sparkles, ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  title: string;
  discountBadge?: string | null;
  selectedVariantImage?: string | null;
  isOutOfStock?: boolean;
}

export function ProductGallery({
  images,
  title,
  discountBadge,
  selectedVariantImage,
  isOutOfStock,
}: ProductGalleryProps) {
  // Base gallery images uploaded for the product (filtering out invalid blob: URLs)
  const galleryImages = React.useMemo(() => {
    const list = images && images.length > 0 ? images.filter((img) => img && !img.startsWith("blob:")) : [];
    return list.length > 0 ? list : ["/images/placeholder-product.png"];
  }, [images]);

  // Valid variant image (ignoring blob: temporary URLs)
  const validVariantImage = React.useMemo(() => {
    if (selectedVariantImage && typeof selectedVariantImage === "string") {
      const trimmed = selectedVariantImage.trim();
      if (trimmed && !trimmed.startsWith("blob:")) {
        return trimmed;
      }
    }
    return null;
  }, [selectedVariantImage]);

  // Combine product images with valid variant image if not already present
  const allImages = React.useMemo(() => {
    if (validVariantImage && !galleryImages.includes(validVariantImage)) {
      return [...galleryImages, validVariantImage];
    }
    return galleryImages;
  }, [galleryImages, validVariantImage]);

  const [userSelectedIdx, setUserSelectedIdx] = React.useState<number | null>(null);
  const [prevVariantImg, setPrevVariantImg] = React.useState<string | null | undefined>(validVariantImage);
  const [isZooming, setIsZooming] = React.useState(false);
  const [zoomCoords, setZoomCoords] = React.useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const [isLightboxZooming, setIsLightboxZooming] = React.useState(false);
  const [lightboxZoomCoords, setLightboxZoomCoords] = React.useState({ x: 50, y: 50 });
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scroll and listen for ESC key when lightbox is open
  React.useEffect(() => {
    if (!isLightboxOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        setUserSelectedIdx((prev) => ((prev ?? activeIndex) - 1 + allImages.length) % allImages.length);
      } else if (e.key === "ArrowRight") {
        setUserSelectedIdx((prev) => ((prev ?? activeIndex) + 1) % allImages.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, allImages.length]);

  // If variant image changed, reset user selected index during render
  if (selectedVariantImage !== prevVariantImg) {
    setPrevVariantImg(selectedVariantImage);
    setUserSelectedIdx(null);
  }

  const variantIdx = selectedVariantImage ? allImages.indexOf(selectedVariantImage) : -1;
  const activeIndex = userSelectedIdx !== null ? userSelectedIdx : (variantIdx !== -1 ? variantIdx : 0);

  const activeImage = allImages[activeIndex] || allImages[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleLightboxMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setLightboxZoomCoords({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleNext = () => {
    setUserSelectedIdx((prev) => ((prev ?? activeIndex) + 1) % allImages.length);
  };

  const handlePrev = () => {
    setUserSelectedIdx((prev) => ((prev ?? activeIndex) - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="w-full flex flex-col-reverse sm:flex-row gap-4 items-start select-none">
      {/* 1. Thumbnail List (Vertical on sm+, horizontal below) */}
      {allImages.length > 1 && (
        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[500px] py-1 px-1 no-scrollbar w-full sm:w-20 shrink-0">
          {allImages.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              onClick={() => setUserSelectedIdx(idx)}
              onMouseEnter={() => setUserSelectedIdx(idx)}
              aria-label={`View image ${idx + 1}`}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer bg-white flex items-center justify-center shrink-0 ${activeIndex === idx
                ? "border-primary shadow-sm scale-102 ring-2 ring-primary/20"
                : "border-slate-100 hover:border-slate-300 opacity-70 hover:opacity-100"
                }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-contain p-1.5 transition-transform duration-200"
              />
            </button>
          ))}
        </div>
      )}

      {/* 2. Main Large Image Display Box (Pure white background, no gray overlay) */}
      <div className="relative flex-1 w-full aspect-square bg-white border border-slate-200/80 rounded-2xl overflow-hidden group shadow-2xs">
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
          {discountBadge && (
            <span className="inline-flex items-center gap-1 bg-highlight text-white font-black text-xs px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              {discountBadge}
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-slate-800 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              Out of Stock
            </span>
          )}
        </div>

        {/* Lightbox / Fullscreen Trigger Button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-3 right-3 z-20 p-2.5 rounded-xl bg-white/95 hover:bg-white text-primary shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center gap-1 text-xs font-bold border border-slate-200/60"
          title="Fullscreen preview"
          aria-label="Fullscreen preview"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Interactive Image Container with Fluid Hover Magnifier Zoom */}
        <div
          className="relative w-full h-full flex items-center justify-center cursor-zoom-in overflow-hidden p-2 sm:p-4 bg-white"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={activeImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            className={`object-contain p-2 transition-transform duration-200 ease-out will-change-transform ${
              isZooming ? "scale-175" : "scale-100"
            }`}
            style={
              isZooming
                ? {
                    transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                  }
                : undefined
            }
          />

          {/* Hover Zoom Hint Overlay */}
          <div
            className={`absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-primary font-bold text-[11px] px-2.5 py-1 rounded-lg shadow-xs pointer-events-none transition-opacity duration-200 flex items-center gap-1.5 ${isZooming ? "opacity-0" : "opacity-75 group-hover:opacity-100"
              }`}
          >
            <ZoomIn className="w-3.5 h-3.5 text-primary" />
            <span>Hover to zoom</span>
          </div>
        </div>

        {/* Mobile / Arrow Navigation */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-primary shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-primary shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image index counter indicator */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-primary/75 backdrop-blur-md text-white font-medium text-[11px] px-2.5 py-0.5 rounded-full shadow-xs pointer-events-none z-10">
            {activeIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* 3. Fullscreen Lightbox Modal (Same bg-slate-900/30 as Modal.tsx) */}
      {isMounted &&
        isLightboxOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[99999] bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8 select-none animate-in fade-in duration-200"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Bar with Title and Close Button */}
            <div
              className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between text-primary bg-white/70 backdrop-blur-md border-b border-slate-200/50 shadow-xs z-[100000]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="min-w-0 pr-4">
                <h4 className="text-sm font-bold text-primary truncate max-w-md sm:max-w-xl">
                  {title}
                </h4>
                <p className="text-xs text-secondary font-medium">
                  Image {activeIndex + 1} of {allImages.length} • Hover image to zoom • Press ESC or click outside to close
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2.5 rounded-full bg-white hover:bg-slate-100 text-primary transition-all cursor-pointer shadow-sm hover:scale-105 shrink-0 border border-slate-200/80"
                aria-label="Close fullscreen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Fullscreen Image Container with Interactive Zoom on Hover */}
            <div
              className="relative w-full max-w-4xl h-[70vh] sm:h-[76vh] flex items-center justify-center p-6 overflow-hidden rounded-2xl cursor-zoom-in bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-2xl mt-8"
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => setIsLightboxZooming(true)}
              onMouseLeave={() => setIsLightboxZooming(false)}
              onMouseMove={handleLightboxMouseMove}
            >
              <Image
                src={activeImage}
                alt={title}
                fill
                sizes="100vw"
                className={`object-contain p-4 transition-transform duration-200 ease-out will-change-transform ${
                  isLightboxZooming ? "scale-160" : "scale-100"
                }`}
                style={
                  isLightboxZooming
                    ? {
                        transformOrigin: `${lightboxZoomCoords.x}% ${lightboxZoomCoords.y}%`,
                      }
                    : undefined
                }
                priority
              />

              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white text-primary transition-all hover:scale-110 cursor-pointer shadow-md border border-slate-200 z-[100000]"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white text-primary transition-all hover:scale-110 cursor-pointer shadow-md border border-slate-200 z-[100000]"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Thumbnail Strip inside Lightbox */}
            {allImages.length > 1 && (
              <div
                className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2.5 p-2 overflow-x-auto z-[100000]"
                onClick={(e) => e.stopPropagation()}
              >
                {allImages.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setUserSelectedIdx(idx)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-white shadow-sm ${
                      activeIndex === idx
                        ? "border-primary scale-110 shadow-md ring-2 ring-primary/20"
                        : "border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="60px"
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
