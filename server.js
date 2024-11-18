const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
      res.status(200).send({ message: 'Login successful' });
  } else {
      res.status(404).send({ error: 'No user found.' });
  }
});

// Example of a profit endpoint in your backend
app.get('/api/profit', (req, res) => {
  const profitData = [
    { date: '2024-01-01', amount: 500 },
    { date: '2024-02-01', amount: 800 },
  ];

  const totalProfit = profitData.reduce((sum, item) => sum + item.amount, 0);

  res.json({ total: totalProfit, data: profitData });
});

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });