import { Review } from "../models/Review.js";
import { User } from "../models/User.js";
import { Place } from "../models/Place.js";

export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll();
        return res.json(reviews);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getReviewById = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({ error: "Reseña no encontrada" });
        }

        return res.json(review);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getReviewsByPlaceId = async (req, res) => {
    try {
        const place = /^\d+$/.test(req.params.placeId)
            ? await Place.findByPk(req.params.placeId)
            : await Place.findOne({ where: { slug: req.params.placeId } });

        if (!place) {
            return res.status(404).json({ error: "Lugar no encontrado" });
        }

        const reviews = await Review.findAll({
            where: { placeId: place.id },
            include: [{ model: User, as: "user", attributes: ["id", "name", "username", "avatarUrl"] }]
        });

        return res.json(reviews);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getReviewsByUserId = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const reviews = await Review.findAll({
            where: { userId: req.params.userId }
        });

        return res.json(reviews);
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
        return res.status(201).json(newReview);
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
        return res.json(review);
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
