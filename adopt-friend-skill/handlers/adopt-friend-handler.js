"use strict";
const alexaHandler = require("../dist/intent-handler");

module.exports.handle_intents = (event, context, callback) => {


    try {
        alexaHandler.handleAlexaIntents(event, context, callback);
    } catch (err) {
        console.log(err);
        return callback(null, {message: "Failed"});
    }

};