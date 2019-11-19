
const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM menu_orders
    JOIN orders ON orders.id = order_id
    JOIN menu ON menu.id=menu_id
    JOIN users ON users.id = user_id
    WHERE users.email = $1
    ;`;
    let param = [req.session.userCookie]
    console.log(query, param);
    db.query(query, param)
      .then(data => {
        const menu_orders = data.rows;
        res.json({ menu_orders });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
