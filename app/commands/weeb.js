"use strict";

const rp = require("request-promise"),
    { Konachan } = require("../helpers/konachan"),
    { Jikan } = require("../helpers/jikan");

const ratewaifu = async (context, sender_psid, params) => {
    if(!params) {
        await context.send.sendText(sender_psid, "Type in the name of your waifu.\n\nExample: !ratewaifu Kurumizawa Satanichia McDowell");
        return;
    }

    const preset = [
        {
            name: "Kurumizawa Satanichia McDowell",
            rating: "Ah, I see you're a デビル of culture as well. No bulli. 11/10",
            image: "https://simg3.gelbooru.com//images/90/b3/90b32cca75242bfcfa5d0d109d9480a8.gif"
        },
        {
            name: "Ononoki Yotsugi",
            rating: "Yay~ Peace, Peace! 11/10",
            image: "https://simg3.gelbooru.com//images/04/ea/04eab4e28d24fe39ea79018fd29d6009.gif"
        },
        {
            name: "Yamada Tae",
            rating: "The Legendary Yamada Tae! 11/10",
            image: "https://s3-us-west-2.amazonaws.com/yotsugi.caguicla.me/yamada_tae.gif"
        },
        {
            name: "PewDiePie",
            rating: "Don't forget to subscribe. 11/10",
            image: "https://s3-us-west-2.amazonaws.com/yotsugi.caguicla.me/kjellberg_felix.gif"
        }
    ];

    for(let i = 0; i < preset.length; ++i) {
        const waifu = preset[i];

        if(params.toUpperCase().includes(waifu.name.toUpperCase())) {
            await context.send.sendTypingIndicator(sender_psid, true);
            await context.send.sendText(sender_psid, waifu.rating);
            await context.send.sendAttachmentFromURL(sender_psid, "image", waifu.image);
            await context.send.sendTypingIndicator(sender_psid, false);
            return;
        }
    }

    if(/T.*Series/i.test(params)) {
        await context.send.sendText(sender_psid, `${params} is garbage, go subscribe to PewDiePie for original content.`);
        return;
    }

    let score = Math.floor(Math.random() * 11),
        rating;

    if(score <= 2) {
        rating = `${params} is trash and you have shit taste. ${score}/10`;
    } else if(score >= 3 && score <= 4) {
        rating = `Normie taste, but ok. I'd give ${params} a ${score}/10.`;
    } else if(score >= 5 && score <= 6) {
        rating = `I'd say ${params} is a decent ${score}/10 waifu.`;
    } else if(score >= 7 && score <= 8) {
        rating = `${params} is a qt, ${score}/10 waifu.`;
    } else if(score >= 9 && score <= 10) {
        rating = `Of course, ${params} is best girl. ${score}/10`;
    } else {
        rating = `I'd rate ${params} a ${score}/10`;
    }

    await context.send.sendText(sender_psid, rating);
};

const safebooru = async (context, sender_psid, params) => {
    try {
        await context.send.sendTypingIndicator(sender_psid, true);

        const results = await rp.get({
            uri: "https://safebooru.org/index.php",
            json: true,
            qs: {
                page: "dapi",
                s: "post",
                q: "index",
                json: 1,
                limit: 200,
                tags: `${params} rating:safe`
            }
        });

        if(!results) throw new Error();

        const index = Math.floor(Math.random() * Math.floor(results.length)),
            result = results[index],
            url = `https://safebooru.org//images/${result.directory}/${result.image}`;

        await context.send.sendAttachmentFromURL(sender_psid, "image", url);
    } catch(err) {
        await context.send.sendText(sender_psid, "No images with specified tags found.");
    } finally {
        await context.send.sendTypingIndicator(sender_psid, false);
    }
};

const konachan = async (context, psid, params) => {
    try {
        await context.send.sendTypingIndicator(psid, true);

        const konachan = new Konachan(),
            posts = await konachan.posts_list({
                limit: 100,
                tags: `${params} rating:safe`
            });

        if(!posts || posts.length === 0) {
            await context.send.sendText(psid, "No images with specified tags found.");
            return;
        }

        const index = Math.floor(Math.random() * Math.floor(posts.length)),
            url = posts[index].file_url;

        await context.send.sendAttachmentFromURL(psid, "image", url);
    } catch(err) {
        await context.send.sendText(psid, "No images with specified tags found.");
    } finally {
        await context.send.sendTypingIndicator(psid, false);
    }
};

const anime = async (context, psid, params) => {
    try {
        await context.send.sendTypingIndicator(psid, true);

        params = params.split(" ");
        if(!params[0]) throw "";

        if(/season/i.test(params[0])) {
            if(/summer|spring|fall|winter/i.test(params[1])) {
                if(/\d{4}/i.test(params[2])) {
                    const jikan = new Jikan();
                    const response = await jikan.season(params[2], params[1]);

                    if(!response || !response.anime) {
                        await context.send.sendText(psid, "No results found for specified season!");
                        return;
                    }

                    const anime = response.anime;
                    let message = "";

                    for(var i = 0; i < anime.length; ++i) {
                        message += `${i + 1}. ${anime[i].title}\n`;
                    }

                    await context.send.sendText(psid, message);
                }
            } else if(/current/i.test(params[1])) {
                await context.send.sendText(psid, "Unrecognized command, visit the page for a list of supported commands.");
            }
        } else if(/search/i.test(params[0])) {
            await context.send.sendText(psid, "Search function is currently not available.");

            return;
        }

        await context.send.sendText(psid, "Unrecognized command, visit the page for a list of supported commands.");
    } catch(err) {
        console.log(err);
        await context.send.sendText(psid, "Unable to perform command, please try again later.");
    } finally {
        await context.send.sendTypingIndicator(psid, false);
    }
};

module.exports = exports = {
    ratewaifu,
    safebooru,
    konachan,
    anime,
};
