const express = require("express");
const cors = require('cors');
const app = express();
const port = 3000;
const produseRouter = require('./routes/produse');
const usersRouter = require('./routes/users');

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// const bp = require('body-parser')
// app.use(bp.json())
// app.use(bp.urlencoded({ extended: true }))

app.use('/produse', produseRouter);
app.use('/users', usersRouter);

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});
app.post('/book', (req, res) => {
  const book = req.body;
  // Output the book to the console for debugging
  console.log('book',req.body);
  res.status(200).send('Book is added to the database');
});

app.listen(port, () => {
  console.log(`Radiali restAPI is listening at http://localhost:${port}`);
});
