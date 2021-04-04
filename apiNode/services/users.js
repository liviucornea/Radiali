const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getUser(loginInfo){
  let page = 1;
  const offset = helper.getOffset(page, config.listPerPage);
  const queryString =  `SELECT user_id, firstName, lastName, role
  FROM users WHERE password = '` + loginInfo.password + `' AND role ='` + 
  loginInfo.role + `' LIMIT 1`;
  console.log('Get user SQL:', queryString);
  const rows = await db.query(
    queryString, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}




module.exports = {
  getUser
}