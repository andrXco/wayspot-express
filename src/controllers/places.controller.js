import { Place } from "../models/Place.js";

export const getPlaces = async (req, res) => {
    try {
        const places = await Place.findAll();
        return res.json(places);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getPlaceById = async (req, res) => {
    try {
        const place = /^\d+$/.test(req.params.id)
            ? await Place.findByPk(req.params.id)
            : await Place.findOne({ where: { slug: req.params.id } });

        if (!place) {
            return res.status(404).json({ error: "Lugar no encontrado" });
        }

        return res.json(place);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const createPlace = async (req, res) => {
    try {
        const newPlace = await Place.create(req.body);
        return res.status(201).json(newPlace);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updatePlace = async (req, res) => {
    try {
        const place = await Place.findByPk(req.params.id);

        if (!place) {
            return res.status(404).json({ error: "Lugar no encontrado" });
        }

        await place.update(req.body);
        return res.json(place);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deletePlace = async (req, res) => {
    try {
        const place = await Place.findByPk(req.params.id);

        if (!place) {
            return res.status(404).json({ error: "Lugar no encontrado" });
        }

        await place.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
