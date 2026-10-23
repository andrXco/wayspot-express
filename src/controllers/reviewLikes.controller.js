import { Review } from "../models/Review.js";
import { ReviewLike } from "../models/ReviewLike.js";
import { User } from "../models/User.js";

const parsePositiveId = value => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
};

const getReview = async (id, res) => {
    const parsedId = parsePositiveId(id);
    if (!parsedId) {
        res.status(400).json({ error: "El ID debe ser un entero positivo" });
        return null;
    }
    const review = await Review.findByPk(parsedId);
    if (!review) {
        res.status(404).json({ error: "Reseña no encontrada" });
        return null;
    }
    return review;
};

const getLikeSummary = async (reviewId, userId = null) => {
    const [likesCount, like] = await Promise.all([
        ReviewLike.count({ where: { reviewId } }),
        userId
            ? ReviewLike.findOne({ where: { reviewId, userId } })
            : Promise.resolve(null)
    ]);
    return { reviewId, likesCount, liked: Boolean(like) };
};

export const getReviewLikeSummary = async (req, res) => {
    try {
        const review = await getReview(req.params.reviewId, res);
        if (!review) return;

        const rawUserId = req.query.userId;
        const userId = rawUserId === undefined ? null : parsePositiveId(rawUserId);
        if (rawUserId !== undefined && !userId) {
            return res.status(400).json({ error: "userId debe ser un entero positivo" });
        }
        if (userId && !await User.findByPk(userId)) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        return res.json(await getLikeSummary(review.id, userId));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const likeReview = async (req, res) => {
    try {
        const review = await getReview(req.params.reviewId, res);
        if (!review) return;

        const userId = parsePositiveId(req.body.userId);
        if (!userId) {
            return res.status(400).json({ error: "userId debe ser un entero positivo" });
        }
        if (!await User.findByPk(userId)) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        await ReviewLike.findOrCreate({ where: { reviewId: review.id, userId } });
        return res.json(await getLikeSummary(review.id, userId));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const unlikeReview = async (req, res) => {
    try {
        const review = await getReview(req.params.reviewId, res);
        if (!review) return;

        const userId = parsePositiveId(req.body.userId);
        if (!userId) {
            return res.status(400).json({ error: "userId debe ser un entero positivo" });
        }
        if (!await User.findByPk(userId)) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        await ReviewLike.destroy({ where: { reviewId: review.id, userId } });
        return res.json(await getLikeSummary(review.id, userId));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
