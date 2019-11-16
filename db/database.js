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

const getAllMenu = function(menu) {
 return pool.query(`SELECT * FROM menu;
 `, [menu])
   .then(res => res.rows);
   // return getAllProperties(null, 2);
 }
 exports.getAllMenu = getAllMenu;

 // apiroutes file
 module.exports = function(router, database) {
  router.get('api/menu', (req, res) => {
    database.getAllMenu(req.query, 20)
    .then(properties => res.send({properties}))
    .catch(e => {
      console.error(e);
      res.send(e)
    });
  });
}
