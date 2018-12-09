'use strict';

function gelbooru(sender_psid, params) {
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

module.exports = {
    'gelbooru': gelbooru
};