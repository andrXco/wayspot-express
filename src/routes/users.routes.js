import { Router } from "express";
import {
    createUser,
    deleteUser,
    getUserById,
    getUsers,
    updateUser
} from "../controllers/users.controller.js";
import { getFollowingFeed, getReviewsByUserId } from "../controllers/reviews.controller.js";
import {
    followUser,
    getFollowers,
    getFollowersCount,
    getFollowing,
    getFollowingCount,
    getFollowingIds,
    getFollowState,
    unfollowUser
} from "../controllers/connections.controller.js";

const router = Router();

router.get("/users", getUsers);
router.get("/users/:userId/following/reviews", getFollowingFeed);
router.get("/users/:userId/reviews", getReviewsByUserId);
router.get("/users/:userId/followers/count", getFollowersCount);
router.get("/users/:userId/followers", getFollowers);
router.get("/users/:userId/following/ids", getFollowingIds);
router.get("/users/:userId/following/count", getFollowingCount);
router.get("/users/:userId/following", getFollowing);
router.get("/users/:userId/following/:targetId", getFollowState);
router.put("/users/:userId/following/:targetId", followUser);
router.delete("/users/:userId/following/:targetId", unfollowUser);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
