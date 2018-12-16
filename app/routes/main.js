"use strict";

const express = require("express"),
      commands = require("../commands"),
      config = require("../../config"),
      messenger = require("../messenger"),
      router = express.Router();

router.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"],
          token = req.query["hub.verify_token"],
          challenge = req.query["hub.challenge"];

    if(!mode || mode !== "subscribe") {
        res.sendStatus(500);
        return;
    }

    if(!token || token !== config.APP_VERIFY_TOKEN) {
        res.sendStatus(403);
        return;
    }

    res.status(200).send(challenge);
});

router.post("/webhook", (req, res) => {
    let body = req.body;

    if(body.object !== "page") {
        res.sendStatus(404);
        return;
    }

    body.entry.forEach((entry) => {
        const webhook_event = entry.messaging[0],
              sender_psid = webhook_event.sender.id;

        if(webhook_event.message) {
            handleMessage(sender_psid, webhook_event.message).catch((err) => {});
        } else if(webhook_event.postback) {
            handlePostback(sender_psid, webhook_event.postback);
        } else {
            res.sendStatus(501);
        }
    });

    res.status(200).send("EVENT_RECEIVED");
});

async function handleMessage(sender_psid, received_message) {
    let message = received_message.text;

    if(!message) return;

    if(message.startsWith(config.COMMAND_PREFIX)) {
        await handleCommand(sender_psid, message);
    } else {
        await handleConversation(sender_psid, message);
    }
}

async function handleConversation(sender_psid, message) {
    await messenger.sendText("Yay~ Peace, Peace!\n\nEnter !help for general usage help.");
}

async function handleCommand(sender_psid, message) {
    message = message.slice(config.COMMAND_PREFIX.length);

    let [command, ...params] = message.split(" ");
    command = command.toLowerCase();
    params = params.join(" ");

    if(commands.hasOwnProperty(command)) {
        commands[command](sender_psid, params);
    } else {
        await messenger.sendText(sender_psid, `Unrecognized command ${command}!`);
    }
}

function handlePostback(sender_psid, received_postback) {
}

module.exports = router;