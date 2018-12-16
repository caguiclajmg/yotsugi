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

const handleMessage = async (sender_psid, message) => {
    const response = await textRequest(agent, message, {
        sessionId: sender_psid
    });
    console.log(response);
};

module.exports = {
    handleMessage
};