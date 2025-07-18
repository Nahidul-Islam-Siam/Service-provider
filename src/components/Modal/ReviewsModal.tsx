"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { useCreateReviewMutation } from "@/redux/features/commonApi/reviewApi/reviewApi";
import { toast } from "sonner";

interface ReviewModalProps {
  visible: boolean;
  onCancel: () => void;
  shipmentID: string;
  userID: string | undefined;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  visible,
  onCancel,
  shipmentID,
  userID,
}) => {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async () => {
    if (!comment.trim() || rating === 0) {
      toast.warning("Please provide both a rating and comment.");
      return;
    }

    if (!shipmentID || !userID) {
      toast.error("Missing shipment or user ID.");
      return;
    }

    const reviewData = {
      shipmentID,
      userID,
      rating,
      title: title || "Excellent Service!",
      comment,
    };

    try {
      await createReview(reviewData).unwrap();
      toast.success("Review submitted successfully!");
      handleClose();
    } catch (error) {
      console.error("Review submission failed:", error);
      toast.error("Failed to submit review.");
    }
  };

  const handleClose = () => {
    onCancel();
    setTitle("");
    setComment("");
    setRating(0);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Submit Your Review
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Review Title (optional):
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:border-orange-400"
              placeholder="e.g., Excellent Service!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Rate your experience:
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => setRating(i)}
                  type="button"
                  className="text-yellow-500 hover:scale-110 transition"
                >
                  <Star
                    size={28}
                    strokeWidth={1.5}
                    fill={rating >= i ? "#F59E0B" : "none"}
                    className={
                      rating >= i ? "text-yellow-500" : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Write your review:
            </label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring focus:border-orange-400"
              placeholder="Write your review here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="text-right">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md font-semibold shadow transition-all disabled:opacity-60"
            >
              {isLoading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
