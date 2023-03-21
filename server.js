const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');
const path = require('path');
// const dbSetup = require('./db/schema.sql');
const category = require('./models/category');
const Product = require('./models/Product');
const ProductTag = require('./models/ProductTag');
const Tag = require('./models/Tag');

const app = express();
const PORT = process.env.PORT || 3003;

// Sets up the Express app to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// Force true to drop/recreate table(s) on every sync
sequelize.sync({ force: false}).then(() => {
  app.listen(PORT, () => console.log(`Now listening http://localhost:${PORT}`));
});

