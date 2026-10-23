import { User } from "../models/User.js";

const normalizeProfilePayload = body => {
    const { country, ...profile } = body;
    if (profile.location === undefined && country !== undefined) {
        profile.location = country;
    }
    return profile;
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const newUser = await User.create(normalizeProfilePayload(req.body));
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        await user.update(normalizeProfilePayload(req.body));
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        await user.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
