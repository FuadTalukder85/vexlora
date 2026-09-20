"use client";

import * as React from "react";
import { Star, X, Loader2, Sparkles, ImagePlus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useCreateReview } from "@/hooks/useProductDetails";
import { CanReviewResult } from "@/types/product";

interface WriteReviewModalProps {
  productId: string;
  productTitle: string;
  isOpen: boolean;
  onClose: () => void;
  canReviewData?: CanReviewResult | null;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor - Not as expected",
  2: "Fair - Needs improvement",
  3: "Good - Meets expectations",
  4: "Very Good - Highly recommend",
  5: "Excellent - Truly outstanding!",
};

export function WriteReviewModal({
  productId,
  productTitle,
  isOpen,
  onClose,
  canReviewData,
}: WriteReviewModalProps) {
  const [rating, setRating] = React.useState<number>(5);
  const [hoverRating, setHoverRating] = React.useState<number>(0);
  const [comment, setComment] = React.useState<string>("");
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [images, setImages] = React.useState<string[]>([]);

  const { mutateAsync: submitReview, isPending } = useCreateReview();

  if (!isOpen) return null;

  const handleAddImage = () => {
    if (!imageUrl.trim()) return;
    if (images.length >= 4) {
      toast.error("Maximum 4 images allowed per review.");
      return;
    }
    setImages((prev) => [...prev, imageUrl.trim()]);
    setImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      toast.error("Please select a star rating from 1 to 5.");
      return;
    }

    try {
      await submitReview({
        productId,
        rating,
        comment: comment.trim() || undefined,
        images: images.length > 0 ? images : undefined,
        subOrderId: canReviewData?.eligibleSubOrderId,
      });

      toast.success("Thank you! Your review has been submitted.");
      onClose();
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to submit review. Please try again.";
      toast.error(message);
    }
  };

  const activeStarRating = hoverRating || rating;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-primary">Write a Customer Review</h3>
            <p className="text-xs text-secondary truncate max-w-xs">{productTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {canReviewData?.isVerifiedPurchase && (
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50/80 p-3 rounded-xl text-xs font-semibold border border-emerald-200">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Verified Purchase badge will be displayed alongside your review.</span>
            </div>
          )}

          {/* Star Rating Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-primary block">Overall Rating *</label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-200 hover:scale-115 transition-transform cursor-pointer"
                    aria-label={`${star} Stars`}
                  >
                    <Star
                      className={`w-7 h-7 ${
                        activeStarRating >= star
                          ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                          : "text-slate-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-600 ml-2">
                {RATING_LABELS[activeStarRating]}
              </span>
            </div>
          </div>

          {/* Review Text Area */}
          <div className="space-y-2">
            <label htmlFor="review-comment" className="text-xs font-bold text-primary block">
              Your Review (Optional)
            </label>
            <textarea
              id="review-comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike? What should other shoppers know before purchasing?"
              className="w-full text-xs text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-hidden resize-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Image attachments */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-primary block">
              Add Photo URL (Optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-hidden placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-slate-100 hover:bg-slate-200 text-primary text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <ImagePlus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 group bg-slate-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Review photo ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-0.5 right-0.5 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      aria-label="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Submit Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
