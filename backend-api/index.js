const express = require('express');
const cors = require('cors');
const router = require('./router')

const app = express();
const port = 3000
 
app.use(cors({origin: true}));
app.use('/', router);

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);