"use strict";

const chai = require("chai"),
    expect = chai.expect,
    { Wikipedia } = require("../../app/helpers/wikipedia");

describe("Wikipedia", () => {
    const wikipedia = new Wikipedia();

    it("query", () => {
        return wikipedia.query("Wikipedia").then((results) => {
            expect(results).to.to.have.property("query");
        });
    }).timeout(0);
});
