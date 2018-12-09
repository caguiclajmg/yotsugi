'use strict';

const rp = require('request-promise');

function gelbooru(params) {
    var response;

    rp(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&tags=${encodeURIComponent(params)}&api_key=${process.env.GELBOORU_KEY}&user_id=${process.env.GELBOORU_ID}`)
        .then((res) => {
            const entries = JSON.parse(body),
                  index = Math.floor(Math.random() * Math.floor(entries.length)),
                  url = entries[index].file_url;

            response = {
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
            response = { 'text': `Unable to fetch results from Gelbooru!` };
        });

    console.log(response);
    return response;
}

module.exports = {
    'gelbooru': gelbooru
};