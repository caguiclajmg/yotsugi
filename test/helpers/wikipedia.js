"use strict";

const chai = require("chai"),
    expect = chai.expect,
    { Wikipedia } = require("../../app/helpers/wikipedia");

describe("Wikipedia", () => {
    const wikipedia = new Wikipedia();

    it("query", () => {
        return wikipedia.query("Wikipedia").then((results) => {
            expect(results).to.have.property("query");
            expect(results.query).to.have.property("search");
            expect(results.query.search).to.be.an("array");
        });
    }).timeout(0);
});
