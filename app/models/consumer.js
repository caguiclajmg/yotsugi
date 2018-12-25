"use strict";

module.exports = exports = (sequelize, DataTypes) => {
    const Consumer = sequelize.define("Consumer", {
        id: {
            type: DataTypes.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        psid: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: true
        },
        nickname: {
            type: DataTypes.STRING(64),
            allowNull: true
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: "consumer"
    });

    return Consumer;
};
