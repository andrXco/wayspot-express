import { Op } from "sequelize";
import { Review } from "../models/Review.js";
import { ReviewLike } from "../models/ReviewLike.js";
import { UserFollow } from "../models/UserFollow.js";
import { User } from "../models/User.js";
import { Place } from "../models/Place.js";

const reviewUserInclude = {
    model: User,
    as: "user",
    attributes: ["id", "name", "username", "avatarUrl"]
};

const parseCurrentUserId = (req, res) => {
    if (req.query.userId === undefined) return null;
    const userId = Number(req.query.userId);
    if (!Number.isInteger(userId) || userId < 1) {
        res.status(400).json({ error: "userId debe ser un entero positivo" });
        return undefined;
    }
    return userId;
};

const withLikeSummaries = async (reviews, currentUserId) => {
    const rows = reviews.map(review => review.toJSON());
    if (rows.length === 0) return rows;

    const likes = await ReviewLike.findAll({
        where: { reviewId: { [Op.in]: rows.map(review => review.id) } },
        attributes: ["reviewId", "userId"]
    });
    const summaries = new Map();
    for (const like of likes) {
        const summary = summaries.get(like.reviewId) ?? { likesCount: 0, liked: false };
        summary.likesCount += 1;
        if (currentUserId !== null && like.userId === currentUserId) summary.liked = true;
        summaries.set(like.reviewId, summary);
    }

    return rows.map(review => ({
        ...review,
        likesCount: summaries.get(review.id)?.likesCount ?? 0,
        liked: summaries.get(review.id)?.liked ?? false
    }));
};

export const getReviews = async (req, res) => {
    try {
        const currentUserId = parseCurrentUserId(req, res);
        if (currentUserId === undefined) return;

        const reviews = await Review.findAll({
            include: [reviewUserInclude],
            order: [["id", "DESC"]]
        });
        return res.json(await withLikeSummaries(reviews, currentUserId));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getReviewById = async (req, res) => {
    try {
        const currentUserId = parseCurrentUserId(req, res);
        if (currentUserId === undefined) return;

        const review = await Review.findByPk(req.params.id, {
            include: [reviewUserInclude]
        });

        if (!review) {
            return res.status(404).json({ error: "Reseña no encontrada" });
        }

        const [enrichedReview] = await withLikeSummaries([review], currentUserId);
        return res.json(enrichedReview);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getReviewsByPlaceId = async (req, res) => {
    try {
        const currentUserId = parseCurrentUserId(req, res);
        if (currentUserId === undefined) return;

        const place = /^\d+$/.test(req.params.placeId)
            ? await Place.findByPk(req.params.placeId)
            : await Place.findOne({ where: { slug: req.params.placeId } });

        if (!place) {
            return res.status(404).json({ error: "Lugar no encontrado" });
        }

        const reviews = await Review.findAll({
            where: { placeId: place.id },
            include: [reviewUserInclude],
            order: [["id", "DESC"]]
        });

        return res.json(await withLikeSummaries(reviews, currentUserId));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getReviewsByUserId = async (req, res) => {
    try {
        const currentUserId = parseCurrentUserId(req, res);
        if (currentUserId === undefined) return;

        const user = await User.findByPk(req.params.userId);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const reviews = await Review.findAll({
            where: { userId: req.params.userId },
            include: [reviewUserInclude],
            order: [["id", "DESC"]]
        });

        return res.json(await withLikeSummaries(reviews, currentUserId));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getFollowingFeed = async (req, res) => {
    try {
        const currentUserId = Number(req.params.userId);
        if (!Number.isInteger(currentUserId) || currentUserId < 1) {
            return res.status(400).json({ error: "El ID debe ser un entero positivo" });
        }

        const user = await User.findByPk(currentUserId);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const follows = await UserFollow.findAll({
            where: { followerId: currentUserId },
            attributes: ["followedId"]
        });
        const followedUserIds = follows.map(follow => follow.followedId);
        if (followedUserIds.length === 0) return res.json([]);

        const reviews = await Review.findAll({
            where: { userId: { [Op.in]: followedUserIds } },
            include: [reviewUserInclude],
            order: [["id", "DESC"]]
        });
        return res.json(await withLikeSummaries(reviews, currentUserId));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const createReview = async (req, res) => {
    try {
        const user = await User.findByPk(req.body.userId);
        const place = await Place.findByPk(req.body.placeId);

        if (!user || !place) {
            return res.status(404).json({ error: "Usuario o lugar no encontrado" });
        }

        const newReview = await Review.create(req.body);
        const reviewWithUser = await Review.findByPk(newReview.id, { include: [reviewUserInclude] });
        const [enrichedReview] = await withLikeSummaries([reviewWithUser], null);
        return res.status(201).json(enrichedReview);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateReview = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({ error: "Reseña no encontrada" });
        }

        const user = await User.findByPk(req.body.userId ?? review.userId);
        const place = await Place.findByPk(req.body.placeId ?? review.placeId);

        if (!user || !place) {
            return res.status(404).json({ error: "Usuario o lugar no encontrado" });
        }

        await review.update(req.body);
        const reviewWithUser = await Review.findByPk(review.id, { include: [reviewUserInclude] });
        const [enrichedReview] = await withLikeSummaries([reviewWithUser], null);
        return res.json(enrichedReview);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({ error: "Reseña no encontrada" });
        }

        await review.destroy();
        return res.status(200).json({ message: "Reseña eliminada" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
