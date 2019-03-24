"use strict";

const chai = require("chai"),
    expect = chai.expect,
    { Gelbooru } = require("../../app/helpers/gelbooru");

describe("Gelbooru", () => {
    const gelbooru = new Gelbooru(process.env.GELBOORU_KEY, process.env.GELBOORU_USERID);

    it("posts_list", () => {
        return gelbooru.posts_list({
            json: 1,
            limit: 4,
        }).then((images) => {
            expect(images).to.have.lengthOf(4);

            images.forEach((image) => {
                expect(image).to.have.property("file_url");
            });
        });
    }).timeout(0);

    it("posts_deleted", () => {
    }).timeout(0);

    it("comments_list", () => {
    }).timeout(0);
});
