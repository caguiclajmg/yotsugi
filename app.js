'use strict';

const VERIFY_TOKEN = process.env.VERIFY_TOKEN,
      APP_SECRET = process.env.APP_SECRET,
      PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN,
      COMMAND_PREFIX = process.env.COMMAND_PREFIX;

if(!VERIFY_TOKEN || !APP_SECRET || !PAGE_ACCESS_TOKEN || !COMMAND_PREFIX) {
    console.error('Missing configuration variables!');
    return;
}

const express = require('express'),
      bodyParser = require('body-parser'),
      request = require('request-promise');

const app = express()
app.use(bodyParser.json())

app.get('/webhook', (req, res) => {
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if(!mode || mode !== 'subscribe') {
        res.sendStatus(500);
        return;
    }

    if(!token || token !== VERIFY_TOKEN) {
        res.sendStatus(403);
        return;
    }

    console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);
});

app.post('/webhook', (req, res) => {
    let body = req.body;

    if(body.object !== 'page') {
        res.sendStatus(404);
        return;
    }

    body.entry.forEach((entry) => {
        let webhook_event = entry.messaging[0];
        let sender_psid = webhook_event.sender.id;

        if(webhook_event.message) {
            handleMessage(sender_psid, webhook_event.message);
        } else if(webhook_event.postback) {
            handlePostback(sender_psid, webhook_event.postback);
        } else {
            res.sendStatus(501);
        }
    });

    res.status(200).send('EVENT_RECEIVED');
});

app.listen(process.env.PORT || 5000, () => console.log('Starting server...'));

function handleMessage(sender_psid, received_message) {
    let message = received_message.text;

    if(!message || !message.startsWith(COMMAND_PREFIX)) {
        let response = { 'text': 'こんにちは！' };
        callSendAPI(sender_psid, response);
        return;
    }

    message = message.slice(COMMAND_PREFIX.length);

    let [command, ...params] = message.split(' ');
    params = params.join(' ');

    switch(command) {
        case 'gelbooru':
            commandGelbooru(sender_psid, params);
            break;

        case 'weather':
            commandWeather(sender_psid, params);
            break;

        default:
            let response = { 'text': `Command: ${command}\nParameters: ${params}` };
            callSendAPI(sender_psid, response);
    }
}

function handlePostback(sender_psid, received_postback) {
}

function callSendAPI(sender_psid, response) {
    let request_body = {
        'recipient': {
            'id': sender_psid
        },
        'message': response
    };

    request({
        'uri': 'https://graph.facebook.com/v2.6/me/messages',
        'qs': { 'access_token': PAGE_ACCESS_TOKEN },
        'method': 'POST',
        'json': request_body
    }, (err, res, body) => {
        if(!err) {
            console.log('Message sent!');
        } else {
            console.error(`An error occured! ${err}`);
        }
    });
}

function commandWeather(sender_psid, params) {
    request({
        'uri': `http://api.openweathermap.org/data/2.5/weather?zip=${params}&appid=${process.env.OPENWEATHERMAP_KEY}`,
        'method': 'GET',
    }, (err, res, body) => {
        if(!err) {
            var weather = JSON.parse(body);
            var text = `${weather.name} Weather:\n` +
                       `Type: ${weather.weather.main} (${weather.weather.description})\n` +
                       `Avg. Temperature: ${weather.main.temp}`;
            callSendAPI(sender_psid, {
                'text': text
            });
        } else {
            console.error(`An error occured! ${err}`);
        }
    });
}

function commandGelbooru(sender_psid, params) {
    request({
        'uri': `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&tags=${encodeURIComponent(params)}&api_key=${process.env.GELBOORU_KEY}&user_id=${process.env.GELBOORU_ID}`,
        'method': 'GET',
    }, (err, res, body) => {
        if(!err) {
            var entries = JSON.parse(body);

            var idx = Math.floor(Math.random() * Math.floor(entries.length));
            var url = entries[idx].file_url;

            callSendAPI(sender_psid, {
                'attachment': {
                    'type': 'image',
                    'payload': {
                        'url': url,
                        'is_reusable': true
                    }
                }
            });
        } else {
            console.error(`An error occured! ${err}`);
        }
    });
}
