const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const importLogsRoutes = require('./routes/import-logs');

app.use('/api/import-logs', importLogsRoutes);

app.get('/', (req, res) => {
  res.send('Job Importer Backend Running!');
});

module.exports = app;
