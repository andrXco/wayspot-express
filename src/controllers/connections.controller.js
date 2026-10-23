import { User } from "../models/User.js";
import { UserFollow } from "../models/UserFollow.js";

const parsePositiveId = value => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
};

const getUser = async (id, res) => {
    const parsedId = parsePositiveId(id);
    if (!parsedId) {
        res.status(400).json({ error: "El ID debe ser un entero positivo" });
        return null;
    }

    const user = await User.findByPk(parsedId);
    if (!user) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return null;
    }
    return user;
};

export const getFollowers = async (req, res) => {
    try {
        const user = await getUser(req.params.userId, res);
        if (!user) return;

        const relations = await UserFollow.findAll({
            where: { followedId: user.id },
            include: [{
                model: User,
                as: "follower",
                attributes: ["id", "name", "username", "email", "bio", "location", "avatarUrl"]
            }],
            order: [["createdAt", "DESC"], ["id", "DESC"]]
        });
        return res.json(relations.map(relation => relation.follower));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getFollowing = async (req, res) => {
    try {
        const user = await getUser(req.params.userId, res);
        if (!user) return;

        const relations = await UserFollow.findAll({
            where: { followerId: user.id },
            include: [{
                model: User,
                as: "followedUser",
                attributes: ["id", "name", "username", "email", "bio", "location", "avatarUrl"]
            }],
            order: [["createdAt", "DESC"], ["id", "DESC"]]
        });
        return res.json(relations.map(relation => relation.followedUser));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getFollowingIds = async (req, res) => {
    try {
        const user = await getUser(req.params.userId, res);
        if (!user) return;

        const relations = await UserFollow.findAll({
            where: { followerId: user.id },
            attributes: ["followedId"],
            order: [["createdAt", "DESC"], ["id", "DESC"]]
        });
        return res.json(relations.map(relation => relation.followedId));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getConnectionCount = async (req, res, connectionType) => {
    try {
        const user = await getUser(req.params.userId, res);
        if (!user) return;

        const isFollowers = connectionType === "followers";
        const count = await UserFollow.count({
            where: isFollowers ? { followedId: user.id } : { followerId: user.id }
        });
        return res.json({ count });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getFollowersCount = (req, res) => getConnectionCount(req, res, "followers");
export const getFollowingCount = (req, res) => getConnectionCount(req, res, "following");

export const getFollowState = async (req, res) => {
    try {
        const follower = await getUser(req.params.userId, res);
        if (!follower) return;
        const followed = await getUser(req.params.targetId, res);
        if (!followed) return;

        const relation = await UserFollow.findOne({
            where: { followerId: follower.id, followedId: followed.id }
        });
        return res.json({ following: Boolean(relation) });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const followUser = async (req, res) => {
    try {
        const follower = await getUser(req.params.userId, res);
        if (!follower) return;
        const followed = await getUser(req.params.targetId, res);
        if (!followed) return;

        if (follower.id === followed.id) {
            return res.status(400).json({ error: "No puedes seguirte a ti mismo" });
        }

        const [relation, created] = await UserFollow.findOrCreate({
            where: { followerId: follower.id, followedId: followed.id }
        });
        return res.status(created ? 201 : 200).json({
            following: true,
            followerId: relation.followerId,
            followedId: relation.followedId
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const unfollowUser = async (req, res) => {
    try {
        const follower = await getUser(req.params.userId, res);
        if (!follower) return;
        const followed = await getUser(req.params.targetId, res);
        if (!followed) return;

        await UserFollow.destroy({
            where: { followerId: follower.id, followedId: followed.id }
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
