import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Comment = sequelize.define("comments", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    reviewId: { type: DataTypes.INTEGER, allowNull: false }
}, {
    timestamps: true,
    updatedAt: false
});
