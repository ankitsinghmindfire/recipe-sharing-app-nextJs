const mongoose = require('mongoose');

const connectionStr =
  'mongodb+srv://' +
  process.env.DB_USER +
  ':' +
  process.env.DB_PASS +
  '@recipes.5vcfr.mongodb.net/recipes?retryWrites=true&w=majority&appName=recipes';

export const connectDB = () => {
  mongoose
    .connect(connectionStr)
    .then(() => {
      console.log('Connected to the database');
    })
    .catch((error) => {
      console.error('Error connecting to the database:', error);
    });
};
