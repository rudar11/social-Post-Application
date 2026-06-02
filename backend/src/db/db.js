const mongoose = require('mongoose');

async function connectdb() {
   try {
     await mongoose.connect(process.env.MONGO_URI);
     console.log("Database is connected successfully");
   } catch (error) {
    console.log("Database Connection Error:", error);
    process.exit(1);
   }
}

module.exports = connectdb;