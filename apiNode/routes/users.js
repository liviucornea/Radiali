/// end points for login and user administration

const express = require('express');
const router = express.Router();
const users = require('../services/users');

/* POST get user information */
router.post('/', async function(req, res, next) {
    try {
        console.log('Data to request the user is:' , req.body);
      res.json(await users.getUser(req.body));
    } catch (err) {
      console.error(`Error while getting user record`, err.message);
      next(err);
    }
  });


module.exports = router;