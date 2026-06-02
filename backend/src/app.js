

const express = require('express');


const authRouter = require('./routes/auth.routes');
const app = express();



app.get('/' ,authRouter)


module.exports = app;