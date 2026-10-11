import { Comment } from "../models/Comment.js";
import { Review } from "../models/Review.js";
import { User } from "../models/User.js";

export const getCommentsByReviewId = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ error: "Reseña no encontrada" });
        }

        const comments = await Comment.findAll({
            where: { reviewId: review.id },
            include: [{
                model: User,
                as: "user",
                attributes: ["id", "name", "username", "avatarUrl"]
            }]
        });
        return res.json(comments);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const createComment = async (req, res) => {
    try {
        const content = typeof req.body.content === "string" ? req.body.content.trim() : "";
        if (!content) {
            return res.status(400).json({ error: "El comentario no puede estar vacío" });
        }
        const userId = Number(req.body.userId);
        if (!Number.isInteger(userId) || userId < 1) {
            return res.status(400).json({ error: "userId debe ser un entero positivo" });
        }

        const review = await Review.findByPk(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ error: "Reseña no encontrada" });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const created = await Comment.create({ content, reviewId: review.id, userId: user.id });
        const comment = await Comment.findByPk(created.id, {
            include: [{
                model: User,
                as: "user",
                attributes: ["id", "name", "username", "avatarUrl"]
            }]
        });
        return res.status(201).json(comment);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
