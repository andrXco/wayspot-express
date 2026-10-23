import { User } from "./User.js";
import { Place } from "./Place.js";
import { Review } from "./Review.js";
import { Comment } from "./Comment.js";
import { UserFollow } from "./UserFollow.js";
import { ReviewLike } from "./ReviewLike.js";

export function setupRelations() {

    User.hasMany(Review, {
        foreignKey: "userId",
        as: "reviews",
        onDelete: "CASCADE",
        hooks: true
    });

    Review.belongsTo(User, {
        foreignKey: "userId",
        as: "user"
    });

    Place.hasMany(Review, {
        foreignKey: "placeId",
        as: "reviews",
        onDelete: "CASCADE",
        hooks: true
    });

    Review.belongsTo(Place, {
        foreignKey: "placeId",
        as: "place"
    });

    User.hasMany(Comment, { foreignKey: "userId", as: "comments", onDelete: "CASCADE" });
    Comment.belongsTo(User, { foreignKey: "userId", as: "user" });
    Review.hasMany(Comment, { foreignKey: "reviewId", as: "comments", onDelete: "CASCADE" });
    Comment.belongsTo(Review, { foreignKey: "reviewId", as: "review" });

    User.hasMany(UserFollow, {
        foreignKey: "followerId",
        as: "followingRelations",
        onDelete: "CASCADE",
        hooks: true
    });
    UserFollow.belongsTo(User, {
        foreignKey: "followerId",
        as: "follower",
        onDelete: "CASCADE"
    });

    User.hasMany(UserFollow, {
        foreignKey: "followedId",
        as: "followerRelations",
        onDelete: "CASCADE",
        hooks: true
    });
    UserFollow.belongsTo(User, {
        foreignKey: "followedId",
        as: "followedUser",
        onDelete: "CASCADE"
    });

    User.hasMany(ReviewLike, {
        foreignKey: "userId",
        as: "reviewLikes",
        onDelete: "CASCADE",
        hooks: true
    });
    ReviewLike.belongsTo(User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE"
    });

    Review.hasMany(ReviewLike, {
        foreignKey: "reviewId",
        as: "likes",
        onDelete: "CASCADE",
        hooks: true
    });
    ReviewLike.belongsTo(Review, {
        foreignKey: "reviewId",
        as: "review",
        onDelete: "CASCADE"
    });
}
