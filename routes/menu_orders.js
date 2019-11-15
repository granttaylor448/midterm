
const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM menu_orders`;
    console.log(query);
    db.query(query)
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
