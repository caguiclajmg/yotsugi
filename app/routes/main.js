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
            handleMessage(sender_psid, webhook_event.message);
        } else if(webhook_event.postback) {
            handlePostback(sender_psid, webhook_event.postback);
        } else {
            res.sendStatus(501);
        }
    });

    res.status(200).send("EVENT_RECEIVED");
});

function handleMessage(sender_psid, received_message) {
    let message = received_message.text;

    if(!message || !message.startsWith(config.COMMAND_PREFIX)) {
        messenger.sendText(sender_psid, "イェーイ、ピースピース！\n\nPlease check the page for the list of available commands.");
        messenger.sendTemplate(sender_psid, [
            {
                title: "Yotsugi",
                image_url: "https://s3-us-west-2.amazonaws.com/yotsugi.caguicla.me/logo.png",
                subtitle: "A multi-purpose chatbot",
                default_action: {
                    type: "web_url",
                    url: "https://www.facebook.com/YotsugiBot/",
                    webview_height_ratio: "tall"
                }
            }
        ]);
        return;
    }

    message = message.slice(config.COMMAND_PREFIX.length);

    let [command, ...params] = message.split(" ");
    command = command.toLowerCase();
    params = params.join(" ");

    if(commands.hasOwnProperty(command)) {
        commands[command](sender_psid, params);
    } else {
        messenger.sendText(sender_psid, `Unrecognized command ${command}!`);
    }
}

function handlePostback(sender_psid, received_postback) {
}

module.exports = router;