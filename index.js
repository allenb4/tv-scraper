require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { saveShowAndCast } = require('./src/services/scraper');
const apiRouter = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');

    return saveShowAndCast();
  })
  .then(() => {
    console.log('Data scraped and saved successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log('Error:', err);
  });

// Use API routes
app.use('/api', apiRouter);
