"use strict";

const fs = require("fs"),
    path = require("path"),
    Sequelize = require("sequelize"),
    config = require("../config"),
    sequelize = new Sequelize(config.DATABASE_URL, {
        dialectOptions: {
            ssl: true
        },
        operatorsAliases: false
    }),
    basePath = path.join(__dirname, "models");

const db = {};

fs.readdirSync(basePath)
    .filter(file => {
        return (file !== path.basename(__filename)) && (path.extname(file) === ".js");
    })
    .forEach(file => {
        const model = sequelize.import(path.join(basePath, file));
        db[model.name] = model;
    });

Object.entries(db).forEach(([key, value]) => {
    if(value.associate) value.associate(db);
});

const getNickname = async(sender_psid) => {
    const row = await db.Consumer.findOne({
        where: {
            psid: sender_psid
        }
    });

    return row ? row.nickname : null;
};

const setNickname = async(sender_psid, nickname) => {
    await db.Consumer.upsert({
        psid: sender_psid,
        nickname: nickname
    }, {
        where: {
            psid: sender_psid
        }
    });
};

const getWaniKaniKey = async(sender_psid) => {
    const row = await db.WaniKani.findOne({
        where: {
            consumer: sender_psid
        }
    });

    return row ? row.api_key : null;
};

const setWaniKaniKey = async(sender_psid, key) => {
    if(!key || !/\S/.test(key)) {
        await db.WaniKani.destroy({
            where: {
                consumer: sender_psid
            }
        });
        return;
    }

    await db.WaniKani.upsert({
        consumer: sender_psid,
        api_key: key
    }, {
        where: {
            consumer: sender_psid
        }
    });
};

module.exports = exports = {
    getNickname,
    setNickname,
    getWaniKaniKey,
    setWaniKaniKey
};
