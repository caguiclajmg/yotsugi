"use strict";

const express = require("express"),
    crypto = require("crypto"),
    bodyParser = require("body-parser"),
    commands = require("../commands"),
    conversation = require("../conversation"),
    router = express.Router();

router.get("/", (req, res) => {
    res.redirect(301, "https://m.me/YotsugiBot");
});

router.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"],
        token = req.query["hub.verify_token"],
        challenge = req.query["hub.challenge"];

    if(!mode || mode !== "subscribe") {
        res.sendStatus(500);
        return;
    }

    if(!token || token !== process.env.APP_VERIFY_TOKEN) {
        res.sendStatus(403);
        return;
    }

    res.status(200).send(challenge);
});

router.post("/webhook", bodyParser.json({
    verify: verifySignature
}), (req, res) => {
    const context = req.app.get("context"),
        body = req.body;

    if(body.object !== "page") {
        res.sendStatus(404);
        return;
    }

    body.entry.forEach((entry) => {
        const webhook_event = entry.messaging[0],
            psid = webhook_event.sender.id;

        if(webhook_event.message) {
            handleMessage(context, psid, webhook_event.message).catch((err) => console.log(err));
        } else if(webhook_event.postback) {
            handlePostback(psid, webhook_event.postback);
        } else {
            res.sendStatus(501);
        }
    });

    res.status(200).send("EVENT_RECEIVED");
});

function calculateSignature(secret, buf) {
    var hmac = crypto.createHmac("sha1", secret);
    hmac.update(buf);
    return `sha1=${hmac.digest("hex")}`;
}

function verifySignature(req, res, buf) {
    const context = req.app.get("context"),
        expected = req.header("x-hub-signature"),
        calculated = calculateSignature(process.env.APP_SECRET, buf);

    if(calculated !== expected) throw new Error("Unable to validate request!");
}

async function handleMessage(context, psid, received_message) {
    const text = received_message.quick_reply ? received_message.quick_reply.payload : received_message.text;

    if(!text) return;

    if(text.startsWith(process.env.COMMAND_PREFIX)) {
        let [command, ...params] = text.slice(process.env.COMMAND_PREFIX.length).split(" ");
        command = command.toLowerCase();
        params = params.join(" ");

        if(commands.hasOwnProperty(command)) {
            await commands[command](context, psid, params);
        } else {
            await context.send.sendText(psid, `Unrecognized command ${command}, type !help for a list of commands.`);
        }
    } else {
        await conversation.handleMessage(context, psid, text);
    }
}

function handlePostback(psid, received_postback) {
}

module.exports = exports = router;
