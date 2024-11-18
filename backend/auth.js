const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const SECRET_KEY = 'your_secret_key';

async function login(req, res) {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err) return res.status(500).send("Error on the server.");
    if (!user) return res.status(404).send("No user found.");

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) return res.status(401).send("Invalid password.");

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 });
    res.status(200).send({ auth: true, token });
  });
}

async function signup(req, res) {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], function (err) {
    if (err) return res.status(500).send("There was a problem registering the user.");
    res.status(201).send({ message: "User registered successfully" });
  });
}

module.exports = { login, signup };
