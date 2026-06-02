require('dotenv').config();
const app = require('./src/app');
const connectdb = require('./src/db/db');

connectdb().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, function () {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.log("Failed to start server due to DB connection error.");
});