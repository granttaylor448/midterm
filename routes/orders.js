const express = require('express');
const router = express.Router();
//const {newOrder} = require('../db/database')


module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM orders`;
    console.log(query);
    db.query(query)
      .then(data => {
        const orders = data.rows;
        res.json({
          orders
        });
      })
      .catch(err => {
        res
          .status(500)
          .json({
            error: err.message
          });
      });
  });

  const newOrder = function (user) {
    return db.query(`INSERT INTO orders (user_id) VALUES ($1)
    RETURNING *;`, [user])
      .then(res => console.log('REPLY ', res.rows[0].id))
      .catch(err => console.error(err));
  }
  exports.newOrder = newOrder;

  const fillOrder = function (menu_id, order_id, quantity) {
    return db.query(`INSERT INTO menu_orders (menu_id, order_id, quantity) VALUES ($1, $2, $3);`, [menu_id, order_id, quantity])
      .then(res => res.rows)
      .catch(err => console.error(err));
  }

  exports.fillOrder = fillOrder;

  router.post("/", (req, res) => {

    let userID = Number(req.body.number);
    let bodyOrder = JSON.parse(req.body.userOrder)
    console.log('bodyOrder ', bodyOrder);
    //console.log("BODY ",req.body)
    let orderID = newOrder(userID);
    console.log('orderID ', orderID.then(res=))

    bodyOrder.forEach((item) =>{
      console.log("HAHA ",item[0],item[1])
       fillOrder(item[1], orderID, item[0])
     })
     //fillOrder(2,3,8);
    res.status(200).send();
  });


  return router;
};
