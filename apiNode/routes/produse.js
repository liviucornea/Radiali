const express = require('express');
const router = express.Router();
const produse = require('../services/produse');

/* GET produse. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await produse.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});
/* POST produse - create new prduct */
router.post('/', async function(req, res, next) {
    try {
      if (await produse.verifyToken(req)){
        console.log('Product to create is:' , req.body);
        res.json(await produse.create(req.body));
      } else {
        throw Error('Invalid token for creating the product');
      }

    } catch (err) {
      console.error(`Error while creating product record`, err.message);
      next(err);
    }
  });
/* PUT product -update product*/
  router.put('/:id', async function(req, res, next) {
    try {
      if (await produse.verifyToken(req)){
      res.json(await produse.update(req.params.id, req.body));
      } else {
        throw Error('Invalid token for updating the product');
      }
    } catch (err) {
      console.error(`Error while updating produse`, err.message);
      next(err);
    }
  });

/* DELETE produse */
router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await produse.remove(req.params.id));
    } catch (err) {
      console.error(`Error while deleting programming language`, err.message);
      next(err);
    }
  });

module.exports = router;