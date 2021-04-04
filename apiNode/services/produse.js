const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function verifyToken(request) {
  const bearerHeader = request.headers['authorization'];
  let page = 1;
  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    const offset = helper.getOffset(page, config.listPerPage);
    const queryString =  `SELECT *
    FROM users WHERE user_token = '` + bearerToken + `' LIMIT 1`;
    const rows = await db.query(
      queryString, 
      [offset, config.listPerPage]
    );
    const data = helper.emptyOrRows(rows); 
    const validationResult =  data.length > 0 ? true : false;
    //console.log('Token ' + bearerToken + ' is: ', validationResult);
    return validationResult;

  } else {
    // Forbidden
    return false;
  }


}
async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT produs_id, nume, model, dimensiuni, description, created_at, updated_at
    FROM produse LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function create(produs){
    const result = await db.query(
      `INSERT INTO produse 
      (nume, model, dimensiuni, description) 
      VALUES 
      (?, ?, ?, ?)`, 
      [
        produs.nume, produs.model, produs.dimensiuni, produs.description
      ]
    );
  
    let message = 'Error in creating product item';
  
    if (result.affectedRows) {
      message = 'Product created successfully';
    }
  
    return {message};
  }

  async function update(id, produse){
    const result = await db.query(
      `UPDATE produse
      SET nume=?, model=?, dimensiuni=?, 
      description=? 
      WHERE produs_id=?`, 
      [
        produse.nume, produse.model, produse.dimensiuni, produse.description, id
      ]
    );
  
    let message = 'Error in updating produse table';
  
    if (result.affectedRows) {
      message = 'Product updated successfully';
    }
  
    return {message};
  }

  async function remove(id){
    const result = await db.query(
      `DELETE FROM produse WHERE id=?`, 
      [id]
    );
  
    let message = 'Error in deleting produse';
  
    if (result.affectedRows) {
      message = 'Product deleted successfully';
    }
  
    return {message};
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove,
  verifyToken
}