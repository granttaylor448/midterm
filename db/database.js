// // database.js file
// const properties = require(‘./json/properties.json’);
// const users = require(‘./json/users.json’);
// const { Pool } = require(‘pg’);
// const pool = new Pool({
//  user: 'labber',
//  password: 'labber',
//  host: 'localhost',
//  database: 'midterm'
// });

const getAllMenu = function (menu) {
  return pool.query(`SELECT * FROM menu;
 `, [menu])
    .then(res => res.rows);
  // return getAllProperties(null, 2);
}
exports.getAllMenu = getAllMenu;

const getUserByEmail = function (email, db) {
  return db.query(`SELECT * FROM users
  WHERE users.email = $1;`, [email])
    .then(res => res.rows)
    .catch(err => console.error(err));
  // return getAllProperties(null, 2);
}
exports.getUserByEmail = getUserByEmail;



const getLastOrder = function () {
  return db.query(`SELECT id FROM orders ORDER BY id desc LIMIT 1 ;
 `).then(res => res.rows);
}
exports.getLastOrder = getLastOrder;


// const newOrder = function (user) {
//   return db.query(`INSERT INTO orders (user_id) VALUES ($1);`, [user])
//     .then(res => res.rows)
//     .catch(err => console.error(err));
// }
// exports.newOrder = newOrder;


//  // apiroutes file
//  module.exports = function(router, database) {
//   router.get('api/menu', (req, res) => {
//     database.getAllMenu(req.query, 20)
//     .then(properties => res.send({properties}))
//     .catch(e => {
//       console.error(e);
//       res.send(e)
//     });
//   });
// }
