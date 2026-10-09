import { Router } from "express";
import {
    createReview,
    deleteReview,
    getReviewById,
    getReviews,
    updateReview
} from "../controllers/reviews.controller.js";
import { createComment, getCommentsByReviewId } from "../controllers/comments.controller.js";

const router = Router();

router.get("/reviews", getReviews);
router.get("/reviews/:reviewId/comments", getCommentsByReviewId);
router.post("/reviews/:reviewId/comments", createComment);
router.get("/reviews/:id", getReviewById);
router.post("/reviews", createReview);
router.put("/reviews/:id", updateReview);
router.delete("/reviews/:id", deleteReview);

export default router;
