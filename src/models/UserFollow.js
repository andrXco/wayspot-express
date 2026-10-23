import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const UserFollow = sequelize.define(
    "user_follows",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        followerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        followedId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: true,
        updatedAt: false,
        indexes: [{ unique: true, fields: ["followerId", "followedId"] }]
    }
);
