const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT id FROM orders
    ORDER BY id desc
    LIMIT 1`;
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

  const getUserID = function(email) {
    return db.query(`SELECT id FROM users
    WHERE users.email = $1;`, [email]);
  };

  const newOrder = function(userCookie) {
    return db.query(`INSERT INTO orders (user_id) VALUES ($1)
    RETURNING *;`, [userCookie]);
  };
  exports.newOrder = newOrder;

  const fillOrder = function(menu_id, order_id, quantity) {
    return db.query(`INSERT INTO menu_orders (menu_id, order_id, quantity) VALUES ($1, $2, $3);`, [menu_id, order_id, quantity])
      .then(res => res.rows)
      .catch(err => console.error(err));
  };
  exports.fillOrder = fillOrder;

  router.post("/", (req, res) => {

    // let userID = Number(req.body.number);
    let bodyOrder = JSON.parse(req.body.userOrder);

    getUserID(req.session.userCookie)
      .then(user => {

        newOrder(user.rows[0].id)
          .then(result => {
            bodyOrder.forEach((item) => {
              fillOrder(item[1], result.rows[0].id, item[0]);
            });
            res.status(200).send();
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  });
  return router;
};
