import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const ReviewLike = sequelize.define(
    "review_likes",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reviewId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: true,
        updatedAt: false,
        indexes: [{ unique: true, fields: ["userId", "reviewId"] }]
    }
);
