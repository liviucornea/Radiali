const mysql = require('mysql2/promise');
const config = require('../config');
const pool = mysql.createPool(config.dbPool);

async function query(sql, params) {
  const [results, ] = await pool.execute(sql, params);
  return results;
}

/*
async function query(sql, params) {
  const connection = await mysql.createConnection(config.db);
  const [results, ] = await connection.execute(sql, params);
  // to be sure that we don't waste resourses ...
  connection.destroy();
  return results;
}
*/

module.exports = {
  query
}