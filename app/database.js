"use strict";

const config = require("../config"),
      pgp = require("pg-promise")(),
      db = pgp(config.DATABASE_URL);

const query = (query, params) => {
    return db.query(query, params);
};

module.exports = {
    query
};