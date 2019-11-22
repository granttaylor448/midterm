const express = require('express');
const router = express.Router();
var Twilio = require('twilio');


module.exports = (client, db) => {
  router.post("/", (req, res) => {
    let query = `SELECT orders.id, menu_orders.menu_id, menu_orders.quantity  FROM menu_orders JOIN orders ON order_id = orders.id
    WHERE orders.id = (SELECT orders.id FROM orders ORDER BY orders.id DESC LIMIT 1);`
    db.query(query)
      .then(data => {
        let replArr = [];
        orderid = data.rows[0].id
        let string = `NEW order. Order id ${orderid} is ready to be processed. The customer would like:`;

        for (let item in data.rows) {
          let menuId = data.rows[item].menu_id;
          let quantity = data.rows[item].quantity;
          replArr.push(`\n Menu ID :${menuId}, Quantity: ${quantity}.`);
        }
        let menuQuantity = replArr.join(',');
        let finalStr = string.concat(menuQuantity);

        client.messages
          .create({
            body: `You received the following order: ${finalStr}. Please respond only with the number of minutes till the order is ready`,
            from: '+13064001290',
            //to: `+${req.body.response.phone}`
            to: '+14037000357'
          })
          .then(message => console.log('MESSAGE SENT...', message.sid)) 
      })
  });


  console.log('REPLY STARTS....')
  // router.get('/', (req, res) => {

  router.post('/sms-response', (req, res) => {

    let query = `SELECT phone, orders.id FROM users JOIN orders on users.id = user_id ORDER BY orders.id DESC LIMIT 1;`
    db.query(query)
      .then(data => {
        const userPhone = data.rows[0].phone;
        //console.log('DATAA ', data.rows[0].phone);

        var twiml = new Twilio.twiml.MessagingResponse();
        let reply = req.body.Body;
        //console.log('TYYYYYPE ',typeof reply)



          let params = [reply, data.rows[0].id];
          let insertReplyQuery = `UPDATE menu_orders SET order_status  = $1 WHERE menu_orders.order_id = $2;`;
          db.query(insertReplyQuery, params);

          twiml.message({
            to: `+${userPhone}`
          }, `Your order will be ready in ${reply} minutes`);
        res.writeHead(200, {
          'Content-Type': 'text/xml'
        });
        res.end(twiml.toString());
      })
  })
  // }
  // )
  return router;
};


// (async () => {
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: [{
//       name: 'T-shirt',
//       description: 'Comfortable cotton t-shirt',
//       // images: ['https://example.com/t-shirt.png'],
//       amount: 500,
//       currency: 'cad',
//       quantity: 1,
//     }],
//     payment_intent_data: {
//       capture_method: 'manual',
//     },
//     success_url: '/{CHECKOUT_SESSION_ID}',
//     cancel_url: '/',
//   });
//   stripe.redirectToCheckout({
//     // Make the id field from the Checkout Session creation API response
//     // available to this file, so you can provide it as parameter here
//     // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
//     sessionId: '{{CHECKOUT_SESSION_ID}}'
//   }).then(function (result) {
//     // If `redirectToCheckout` fails due to a browser or network
//     // error, display the localized error message to your customer
//     // using `result.error.message`.
//   });
// })();
//to: `+${req.body.response.phon
