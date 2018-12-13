"use strict";

const config = require("../config"),
      pgp = require("pg-promise");

const query = (query, params) => {
    const db = pgp(config.DATABASE_URL);

    return db.any(query, params);
};

module.exports = {
    query
};