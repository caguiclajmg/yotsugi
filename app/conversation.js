const apiai = require("apiai"),
    config = require("../config"),
    agent = apiai(config.DIALOGFLOW_TOKEN);

const textRequest = async (agent, query, options) => {
    return new Promise((resolve, reject) => {
        const request = agent.textRequest(query, options);
        request.on("response", (res) => resolve(res));
        request.on("error", (res) => reject(res));
        request.end();
    });
};

const handleMessage = async (context, psid, message) => {
    const response = await textRequest(agent, message, {
        sessionId: psid
    });

    await context.send.sendText(psid, response.result.fulfillment.speech);
};

module.exports = {
    handleMessage
};
