"use strict";

const fs = require("fs"),
    crypto = require("crypto"),
    path = require("path"),
    Sequelize = require("sequelize"),
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialectOptions: {
            ssl: true
        },
        operatorsAliases: false,
        logging: false
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

    if(!row) return null;

    const parts = row.api_key.split(":"),
        iv = Buffer.from(parts.shift(), "hex"),
        key = Buffer.from(parts.join(":"), "hex"),
        decipher = crypto.createDecipheriv("aes-256-ctr", Buffer.from(process.env.APP_SECRET, "utf8"), iv);

    let dec = decipher.update(key);
    dec = Buffer.concat([dec, decipher.final()]);

    return dec.toString();
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

    const iv = crypto.randomBytes(16),
        cipher = crypto.createCipheriv("aes-256-ctr", Buffer.from(process.env.APP_SECRET, "utf8"), iv);

    let enc = cipher.update(key);
    enc = `${iv.toString("hex")}:${Buffer.concat([enc, cipher.final()]).toString("hex")}`;

    await db.WaniKani.upsert({
        consumer: sender_psid,
        api_key: enc
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
