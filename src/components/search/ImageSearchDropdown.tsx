"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Upload,
  X,
  Loader2,
  AlertCircle,
  Clock,
  Trash2,
  Sparkles,
  Scan,
} from "lucide-react";
import { searchByImageFile, searchByImageUrl } from "@/lib/api/imageSearch";
import { useImageSearchStore } from "@/stores/imageSearch.store";

interface ImageSearchDropdownProps {
  buttonClassName?: string;
  variant?: "desktop" | "mobile";
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/avif"];

export function ImageSearchDropdown({
  buttonClassName = "",
  variant = "desktop",
}: ImageSearchDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [uploadPercent, setUploadPercent] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    setActiveSearch,
  } = useImageSearchStore();

  // Close dropdown on outside click
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Paste from clipboard (Ctrl+V) listener
  React.useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            processImageFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isOpen]);

  // Process image file and search
  const processImageFile = async (file: File) => {
    setErrorMessage(null);

    // Validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage("Unsupported file type. Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    // Generate local data URL preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      setIsProcessing(true);
      setUploadPercent(15);

      try {
        const response = await searchByImageFile(file, {
          onUploadProgress: (p) => {
            const pct = Math.round((p.progress || 0) * 85);
            setUploadPercent(pct);
          },
        });

        setUploadPercent(100);

        if (response.success && response.data) {
          addRecentSearch(dataUrl, response.data.totalFound);
          setActiveSearch(dataUrl, response.data.results);

          setIsOpen(false);
          setIsProcessing(false);
          setPreviewUrl(null);
          router.push("/search/image-results");
        } else {
          setErrorMessage(response.message || "No products found for this image.");
          setIsProcessing(false);
        }
      } catch (err: any) {
        console.error("Image search error:", err);
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to process image search. Please try again.";
        setErrorMessage(msg);
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Re-run search from recent search thumbnail
  const handleSelectRecent = async (recentPreview: string) => {
    setErrorMessage(null);
    setPreviewUrl(recentPreview);
    setIsProcessing(true);
    setUploadPercent(30);

    try {
      const response = await searchByImageUrl(recentPreview);
      setUploadPercent(100);

      if (response.success && response.data) {
        addRecentSearch(recentPreview, response.data.totalFound);
        setActiveSearch(recentPreview, response.data.results);
        setIsOpen(false);
        setIsProcessing(false);
        setPreviewUrl(null);
        router.push("/search/image-results");
      } else {
        setErrorMessage(response.message || "Failed to search using this image.");
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error("Recent image search error:", err);
      setErrorMessage("Could not re-search this image. Please upload a new image.");
      setIsProcessing(false);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="inline-flex items-center">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="Upload image to search"
      />

      {/* Trigger Button (Left side of search bar: Camera icon + "Image Search") */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          setErrorMessage(null);
        }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer select-none ${
          isOpen
            ? "bg-primary text-white shadow-xs"
            : "text-primary hover:bg-muted/80"
        } ${buttonClassName}`}
        aria-label="Image Search"
        aria-expanded={isOpen}
      >
        <Camera className="w-4 h-4 text-current shrink-0" />
        <span className="hidden sm:inline whitespace-nowrap text-xs font-medium">
          Image Search
        </span>
      </button>

      {/* ALIBABA-STYLE DROPDOWN PANEL */}
      {isOpen && (
        <>
          {/* Mobile Backdrop */}
          <div
            className="fixed inset-0 bg-primary/40 backdrop-blur-xs z-50 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            ref={dropdownRef}
            className={`
              z-50 bg-white border border-border rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6
              transition-all duration-200 ease-out origin-top
              animate-in fade-in zoom-in-95 slide-in-from-top-2
              ${
                variant === "mobile"
                  ? "fixed bottom-0 left-0 right-0 rounded-b-none rounded-t-3xl border-b-0 max-h-[85vh] overflow-y-auto"
                  : "fixed md:absolute md:top-full md:left-0 md:right-0 md:w-full md:mt-2.5 md:bottom-auto bottom-0 left-0 right-0 rounded-b-none md:rounded-b-3xl"
              }
            `}
          >
            {/* Mobile Sheet Handle */}
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-3 md:hidden" />

            {/* Header: "Find product inspiration with Image Search" + Close X */}
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-sm sm:text-[15px] font-bold text-primary tracking-tight">
                Find product inspiration with Image Search
              </h3>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg text-secondary hover:text-primary hover:bg-muted flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close image search dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ERROR ALERT */}
            {errorMessage && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <div className="flex-1 font-medium">{errorMessage}</div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-red-500 hover:text-red-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* DROPZONE / PREVIEW AREA */}
            <div className="mt-1">
              {isProcessing && previewUrl ? (
                /* Processing State with Preview & Spinner */
                <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-border bg-muted/40 flex flex-col items-center justify-center p-4">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md mb-2.5 border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Query Image Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/50 backdrop-blur-xs flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  </div>

                  <p className="text-xs font-bold text-primary">Analyzing Visual Features...</p>
                  <p className="text-[11px] text-secondary mt-0.5">Searching catalog matching vector embeddings</p>

                  {/* Progress Bar */}
                  <div className="w-48 bg-muted rounded-full h-1.5 mt-2.5 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-300 rounded-full"
                      style={{ width: `${Math.max(15, uploadPercent)}%` }}
                    />
                  </div>
                </div>
              ) : (
                /* Interactive Alibaba-Style Dropzone */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    w-full h-52 rounded-2xl border border-dashed transition-all duration-200
                    flex flex-col items-center justify-center text-center p-5 select-none
                    ${
                      isDragging
                        ? "border-primary bg-primary/5 scale-[0.99]"
                        : "border-border/90 bg-muted/20 hover:border-primary/60"
                    }
                  `}
                >
                  {/* Big Upload Tray Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-muted/60 text-primary flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6 stroke-[1.8]" />
                  </div>

                  {/* Paste instruction with Ctrl V badges */}
                  <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                    <span>Paste an image you copied with</span>
                    <kbd className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-white border border-border rounded shadow-xs text-primary">
                      Ctrl
                    </kbd>
                    <kbd className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-white border border-border rounded shadow-xs text-primary">
                      V
                    </kbd>
                  </div>

                  {/* Subtext */}
                  <p className="text-xs text-secondary mt-1">
                    Drag and drop an image here or upload a file
                  </p>

                  {/* Prominent Upload Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3.5 px-7 py-2 rounded-full bg-primary hover:opacity-90 active:scale-95 text-white text-xs font-bold shadow-sm transition-all duration-150 cursor-pointer"
                  >
                    Upload
                  </button>
                </div>
              )}
            </div>

            {/* BOTTOM BANNER: "Vexlora Lens" / Visual Search Card */}
            <div className="mt-4 p-3 rounded-xl bg-[#fff8f5] border border-[#ffedd5] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#ffedd5] text-primary flex items-center justify-center shrink-0">
                  <Scan className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <span>Vexlora Lens</span>
                  </div>
                  <p className="text-[11px] text-secondary leading-tight mt-0.5">
                    Screenshot an image to search for similar items with lower prices and verified vendors
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-bold text-primary hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                Upload Photo
              </button>
            </div>

            {/* RECENT SEARCHES STRIP */}
            {recentSearches.length > 0 && !isProcessing && (
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    <span>Recent visual searches</span>
                  </div>

                  <button
                    type="button"
                    onClick={clearRecentSearches}
                    className="text-[10px] font-semibold text-secondary hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {recentSearches.map((item) => (
                    <div
                      key={item.id}
                      className="group relative shrink-0 w-14 h-14 rounded-xl border border-border overflow-hidden bg-muted cursor-pointer hover:border-primary hover:shadow-sm transition-all"
                      onClick={() => handleSelectRecent(item.preview)}
                      title="Search with this image again"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.preview}
                        alt="Recent search preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />

                      {/* Remove single recent badge */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(item.id);
                        }}
                        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-primary/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all cursor-pointer"
                        title="Remove from history"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ImageSearchDropdown;
