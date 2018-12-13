"use strict";

const pgp = require("pg-promise")(),
      config = require("../config");

if(!config.DATABASE_URL) {
}

// FIXME:
const db = pgp(config.DATABASE_URL);

const query = async (query, params) => {
    return await db.query(query, params);
};

const getNickname = async(sender_psid) => {
    return await db.one("SELECT nickname FROM consumer WHERE psid = ${psid}", { psid: sender_psid }, consumer => consumer.nickname);
};

const setNickname = async(sender_psid, nickname) => {
    if(!nickname || !/\S/.match(nickname)) {
        return await db.oneOrNone("DELETE FROM consumer WHERE psid = ${psid}", { psid: sender_psid });
    }

    return await db.one("INSERT INTO consumer (psid, nickname) VALUES (${psid}, ${nickname}) ON CONFLICT (psid) DO UPDATE SET nickname = ${nickname};", {
        psid: sender_psid,
        nickname: nickname
    });
};

module.exports = {
    query,
    getNickname,
    setNickname
};