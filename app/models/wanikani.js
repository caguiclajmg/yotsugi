"use strict";

module.exports = exports = (sequelize, DataTypes) => {
    const WaniKani = sequelize.define("WaniKani", {
        consumer: {
            type: DataTypes.STRING(64),
            primaryKey: true,
        },
        api_key: {
            type: DataTypes.STRING(36),
            allowNull: true,
            unique: true
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: "wanikani"
    });

    return WaniKani;
};
