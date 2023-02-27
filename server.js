const express = require('express');
const sequelize = require('./config/connection');
const path = require('path');
const PORT = 3001;
const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Force true to drop/recreate table(s) on every sync
sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => console.log(`Now listening http://localhost:${PORT}`));
});

