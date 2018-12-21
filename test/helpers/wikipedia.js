"use strict";

const chai = require("chai"),
    expect = chai.expect,
    { Wikipedia } = require("../../app/helpers/wikipedia");

describe("Wikipedia", () => {
    const wikipedia = new Wikipedia();

    it("query", () => {
        return wikipedia.query("Wikipedia").then((results) => {
            expect(results).to.have.property("query");

            const query = results.query;
            expect(query).to.have.property("search");

            const search = query.search;
            expect(search).to.be.an("array");

            search.forEach((item) => {
                expect(item).to.have.property("title");
            });
        });
    }).timeout(0);
});
