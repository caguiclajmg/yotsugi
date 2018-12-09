'use strict';

const rp = require('request-promise');

function gelbooru(params) {
    let response;

    rp(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&tags=${encodeURIComponent(params)}&api_key=${process.env.GELBOORU_KEY}&user_id=${process.env.GELBOORU_ID}`)
        .then((res) => {
            var entries = JSON.parse(body);

            var idx = Math.floor(Math.random() * Math.floor(entries.length));
            var url = entries[idx].file_url;

            return {
                'attachment': {
                    'type': 'image',
                    'payload': {
                        'url': url,
                        'is_reusable': true
                    }
                }
            };
        })
        .catch((err) => {
            response = { 'text': `Unable to fetch results from Gelbooru` };
        });

    return response;
}

module.exports = {
    'gelbooru': gelbooru
};