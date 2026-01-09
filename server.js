require('dotenv').config(); // MUST be first

const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Inventory Management API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
