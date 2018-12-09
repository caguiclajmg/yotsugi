'use strict';

const VERIFY_TOKEN = process.env.VERIFY_TOKEN,
      APP_SECRET = process.env.APP_SECRET,
      PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

if(!VERIFY_TOKEN || !APP_SECRET || !PAGE_ACCESS_TOKEN) {
    console.error('Missing configuration variables!');
    return;
}

const express = require('express'),
      bodyParser = require('body-parser');

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
        console.log(webhook_event);
    });

    res.status(200).send('EVENT_RECEIVED');
});

app.listen(process.env.PORT || 5000, () => console.log('Starting server...'));