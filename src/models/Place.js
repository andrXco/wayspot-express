import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Place = sequelize.define(
    "places",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: true
        },
        price: {
            type: DataTypes.STRING,
            allowNull: true
        },
        altitude: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reviewCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        timestamps: false
    }
);
