"use strict";

const pgp = require("pg-promise")(),
      config = require("../config");

if(!config.DATABASE_URL) {
}

// FIXME:
const db = pgp(config.DATABASE_URL);

const query = (query, params) => {
    return db.query(query, params);
};

module.exports = {
    query
};