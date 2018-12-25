const apiai = require("apiai"),
    config = require("../config");

let agent = null;

if(config.DIALOGFLOW_TOKEN) agent = apiai(config.DIALOGFLOW_TOKEN);

const textRequest = async (agent, query, options) => {
    return new Promise((resolve, reject) => {
        const request = agent.textRequest(query, options);
        request.on("response", (res) => resolve(res));
        request.on("error", (res) => reject(res));
        request.end();
    });
};

const handleMessage = async (context, psid, message) => {
    if(agent) {
        const response = await textRequest(agent, message, {
            sessionId: psid
        });

        await context.send.sendText(psid, response.result.fulfillment.speech);
    } else {
        await context.send.sendText(psid, "...");
    }
};

module.exports = exports = {
    handleMessage
};
