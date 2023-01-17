const { db } = require('../index');
const express = require('express');
const router = express.Router();

router.post('/login', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM member WHERE email = ? AND password = ?", [username,password], (err, result) => {
      if(err) {
        res.send({err: err})
      }
      if(result) {
        res.send(result);
      } else {
        res.send({ message: "Wrong username/password combination!"})
      }
    }
  )
});
