const express = require('express');
const cors = require('cors');
const path = require('path');

const submitRoutes = require('./routes/submitRoutes.js');
const fileRoutes = require('./routes/fileRoutes.js');
const dbRoutes = require('./routes/dbRoutes.js');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'data')));

// Routes
app.use('/api', submitRoutes);
app.use('/api', fileRoutes);
app.use('/api', dbRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
