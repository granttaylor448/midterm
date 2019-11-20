const express = require('express');
const router = express.Router();
var twilio = require('twilio');

module.exports = (client, db) => {
  router.post("/", (req, res) => {
    // console.log('reqRRRRRRRRRRRRRRRRRRRRRRRR ', req.body.response.phone)
    client.messages
      .create({
        body: `You received a new order`,
        from: '+13064001290',
        //to: `+${req.body.response.phone}`
        to: '+14037000357'
      })
      .then(message => console.log('MESSAGE SENT...', message.sid))
  });

  router.post('/sms-response', (req, res) => {

    exports.handler = function (context, event, callback) {
      const MY_NUMBER = '18249940224';

      let twiml = new Twilio.twiml.MessagingResponse();
      if (event.From === MY_NUMBER) {
        const separatorPosition = event.Body.indexOf(':');
        if (separatorPosition < 1) {
          twiml.message('You need to specify a recipient number and a ":" before the message.');
        } else {
          const recipientNumber = event.Body.substr(0, separatorPosition).trim();
          const messageBody = event.Body.substr(separatorPosition + 1).trim();
          twiml.message({
            to: recipientNumber
          }, messageBody);
        }
      } else {
        twiml.message({
          to: MY_NUMBER
        }, `${event.From}: ${event.Body}`);
      }
      callback(null, twiml);
    };
  })
  return router;
};
